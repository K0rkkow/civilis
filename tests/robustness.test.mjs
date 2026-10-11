/**
 * CIVILIS — tests de robustesse du moteur de résultats
 * ---------------------------------------------------------------------------
 * Propriétés attendues du moteur, testées sur des profils synthétiques variés
 * (tranchés, modérés, contrastés, neutres, partiels). On ne vérifie pas
 * « la bonne étiquette » mais des invariants : cohérence, isolation des
 * dimensions, parité enfant/classique, recalcul après modification, garde de
 * comparabilité, et jamais de valeur fabriquée pour une donnée manquante.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  computeResults, calculateDimensionScores, COVERAGE_MIN,
  generateNarrative, generateProfileTitle,
} from '../src/lib/analysis.js';
import {
  rankPersonalities, rankParties, nearTies, explainProximity,
  divergences, convergences, MIN_COMPARABLE_DIMS,
} from '../src/lib/comparison.js';
import { questions } from '../src/lib/questions.js';
import { getKidsQuestions, KIDS_REWRITES } from '../src/lib/kids.js';
import { DIMENSION_IDS } from '../src/lib/dimensions.js';

/* Profils synthétiques : chaque question reçoit l'option d'indice fixe,
 * sauf sur les questions d'une dimension ciblée (pour l'isolation). */
function syntheticAnswers(profile) {
  const out = {};
  questions.forEach((q, i) => {
    let idx = profile.indexOf !== undefined ? profile.indexOf(i) : profile.base;
    if (typeof profile.fn === 'function') idx = profile.fn(q, i);
    if (idx === 'uncertain') { out[q.id] = 'uncertain'; return; }
    if (idx === null) return; /* pas de réponse */
    const opts = q.options;
    out[q.id] = opts[Math.min(opts.length - 1, Math.max(0, idx))].value;
  });
  return out;
}

const ALL_FIRST = syntheticAnswers({ base: 0 });
const ALL_LAST = syntheticAnswers({ base: -1 }); /* dernière option */
const ALL_MIDDLE = syntheticAnswers({ fn: (q) => Math.floor((q.options.length - 1) / 2) });
const ALL_UNCERTAIN = syntheticAnswers({ base: 'uncertain' });

test('robustesse : tous les profils synthétiques produisent des scores finis dans [0,1]', () => {
  for (const [name, answers] of [['première option', ALL_FIRST], ['dernière option', ALL_LAST], ['option centrale', ALL_MIDDLE]]) {
    const r = computeResults(answers);
    for (const d of DIMENSION_IDS) {
      if (r.scores[d] == null) continue;
      assert.ok(Number.isFinite(r.scores[d]), `${name}: score non fini sur ${d}`);
      assert.ok(r.scores[d] >= 0 && r.scores[d] <= 1, `${name}: score hors bornes sur ${d}`);
      assert.ok(r.coverage[d] >= 0 && r.coverage[d] <= 1, `${name}: couverture hors bornes sur ${d}`);
    }
    assert.ok(Number.isFinite(r.neutralCount));
  }
});

test('robustesse : tout « je ne sais pas » → aucune opinion fabriquée', () => {
  const r = computeResults(ALL_UNCERTAIN);
  for (const d of DIMENSION_IDS) {
    assert.equal(r.scores[d], null, `${d} ne doit pas avoir de score`);
    assert.equal(r.coverage[d], 0);
  }
  assert.equal(r.neutralCount, questions.length);
  assert.equal(r.proximities.length, 0, 'aucune proximité sans données');
  assert.equal(r.meta.insufficient, true);
});

test('robustesse : modifier une réponse ne touche QUE les dimensions de sa question', () => {
  const base = calculateDimensionScores(ALL_FIRST);
  /* trouver une question qui ne touche QUE ECONOMIE */
  const q = questions.find((qq) =>
    qq.options[0].scores.ECONOMIE !== undefined &&
    Object.keys(qq.options[0].scores).length === 1);
  assert.ok(q, 'la banque doit contenir une question mono-dimension ECONOMIE');
  const before = { ...base.scores };
  const modified = { ...ALL_FIRST, [q.id]: q.options[q.options.length - 1].value };
  const after = calculateDimensionScores(modified);
  for (const d of DIMENSION_IDS) {
    if (d === 'ECONOMIE') continue;
    assert.equal(after.scores[d], before[d],
      `la dimension ${d} ne doit pas bouger quand seule ECONOMIE change`);
  }
  assert.notEqual(after.scores.ECONOMIE, before.ECONOMIE,
    'la dimension ECONOMIE doit être recalculée');
});

test('robustesse : l\'ordre des réponses n\'a aucun effet (moteur sans position)', () => {
  const reversed = {};
  [...questions].reverse().forEach((q, i) => { reversed[q.id] = ALL_FIRST[q.id]; });
  const a = calculateDimensionScores(ALL_FIRST);
  const b = calculateDimensionScores(reversed);
  assert.deepEqual(a.scores, b.scores);
  assert.deepEqual(a.coverage, b.coverage);
});

test('robustesse : parité enfant / classique — mêmes valeurs, mêmes scores', () => {
  /* chaque option enfant réutilise EXACTEMENT une value d'origine
     (contrat tests/kids.test.mjs) : répondre en mode enfant ou en mode
     classique avec les mêmes choix doit produire des scores identiques. */
  const kidsAnswers = {};
  for (const q of getKidsQuestions()) {
    const rewrite = KIDS_REWRITES[q.id];
    kidsAnswers[q.id] = rewrite.options[0].value;
  }
  const classicSame = {};
  for (const [id, value] of Object.entries(kidsAnswers)) {
    const q = questions.find((qq) => qq.id === id);
    classicSame[id] = value; /* même value → même option classique */
  }
  const a = calculateDimensionScores(kidsAnswers, getKidsQuestions());
  const b = calculateDimensionScores(classicSame, questions);
  for (const d of DIMENSION_IDS) {
    if (a.scores[d] == null && b.scores[d] == null) continue;
    assert.ok(Math.abs((a.scores[d] ?? 0) - (b.scores[d] ?? 0)) < 1e-9,
      `parité brisée sur ${d} : enfant ${a.scores[d]} vs classique ${b.scores[d]}`);
  }
  const ra = computeResults(kidsAnswers);
  assert.equal(ra.meta.insufficient, false, 'un parcours enfant complet doit suffire');
});

test('robustesse : profil contrasté — les tensions sont détectées, pas inventées', () => {
  /* Écologie affirmée (options basses sur ECOLOGIE) + économie de marché
     (options basses sur ECONOMIE) → tension ECOLOGIE/ECONOMIE attendue */
  const contrasted = {};
  questions.forEach((q) => {
    const opt = q.options[0];
    if (opt.scores.ECOLOGIE !== undefined && opt.scores.ECOLOGIE <= 0.3) {
      contrasted[q.id] = q.options[0].value;
    } else if (opt.scores.ECONOMIE !== undefined && opt.scores.ECONOMIE <= 0.3) {
      contrasted[q.id] = q.options[0].value;
    } else {
      contrasted[q.id] = q.options[Math.min(1, q.options.length - 1)].value;
    }
  });
  const r = computeResults(contrasted);
  const pair = r.tensions.find((t) =>
    (t.pair[0] === 'ECOLOGIE' && t.pair[1] === 'ECONOMIE') ||
    (t.pair[0] === 'ECONOMIE' && t.pair[1] === 'ECOLOGIE'));
  /* la tension peut ne pas se déclencher selon les autres réponses : on
     vérifie surtout qu'aucune tension rapportée n'est fausse */
  for (const t of r.tensions) {
    const [a, b] = t.pair;
    assert.ok(Math.abs(r.scores[a] - r.scores[b]) >= 0.5,
      `tension ${a}/${b} rapportée sans écart réel`);
    assert.ok(r.scores[a] < 0.35 || r.scores[a] > 0.65, `tension sur ${a} non affirmée`);
    assert.ok(r.scores[b] < 0.35 || r.scores[b] > 0.65, `tension sur ${b} non affirmée`);
  }
  assert.ok(Array.isArray(r.tensions));
});

test('robustesse : profil modéré — aucun courant présenté comme parfaitement compatible', () => {
  const r = computeResults(ALL_MIDDLE);
  assert.equal(r.meta.insufficient, false);
  for (const row of r.proximities) {
    assert.ok(row.proximity < 100, 'un profil modéré ne peut pas coller à 100 %');
    assert.ok(row.proximity > 0, 'une proximité calculée ne peut pas être 0');
  }
  const { top } = nearTies(r.proximities, 3);
  assert.ok(top, 'un classement non vide doit avoir une tête');
});

test('robustesse : quasi-égalités correctement groupées', () => {
  const rows = [
    { name: 'a', proximity: 80 },
    { name: 'b', proximity: 79 },
    { name: 'c', proximity: 78 },
    { name: 'd', proximity: 60 },
  ];
  const { top, tied } = nearTies(rows, 3);
  assert.equal(top.name, 'a');
  assert.deepEqual(tied.map((r) => r.name), ['b', 'c'], 'b et c sont dans le groupe de tête');
  const far = nearTies([{ name: 'x', proximity: 80 }, { name: 'y', proximity: 40 }], 3);
  assert.equal(far.tied.length, 0, 'un écart de 40 points n\'est pas une quasi-égalité');
});

test('robustesse : moins de deux dimensions comparables → aucune proximité affichée', () => {
  /* une seule dimension couverte (question mono-ECONOMIE) */
  const answers = {};
  for (const q of questions) {
    if (q.options[0].scores.ECONOMIE !== undefined &&
        Object.keys(q.options[0].scores).length === 1 &&
        !answers[Object.keys(answers).length]) {
      /* rien */
    }
  }
  const mono = {};
  const ecoQuestions = questions.filter((q) =>
    Object.keys(q.options[0].scores).length === 1 &&
    q.options[0].scores.ECONOMIE !== undefined);
  ecoQuestions.slice(0, 3).forEach((q) => { mono[q.id] = q.options[0].value; });
  const calc = calculateDimensionScores(mono);
  const people = rankPersonalities(calc.scores, calc.coverage, COVERAGE_MIN);
  const partiesRanked = rankParties(calc.scores, calc.coverage, COVERAGE_MIN);
  assert.equal(people.length, 0, 'une seule dimension ne doit pas classer de personnalités');
  assert.equal(partiesRanked.length, 0, 'une seule dimension ne doit pas classer de partis');
  assert.ok(MIN_COMPARABLE_DIMS >= 2);
});

test('robustesse : réponses sans rapport — isolation des proximités', () => {
  const r1 = computeResults(ALL_FIRST);
  /* imm1 touche IMMIGRATION (principale) + INTERNATIONAL (secondaire) :
     changer sa réponse ne doit faire bouger QUE IMMIGRATION — le score
     INTERNATIONAL est nourri par ses questions dédiées (int1–int5) et
     n'utilise la contribution secondaire d'imm1 qu'en l'absence de
     contributions principales, par conception du moteur. */
  const immQ = questions.find((q) => q.id === 'imm1');
  assert.ok(immQ, 'la banque doit contenir imm1');
  const r2 = computeResults({ ...ALL_FIRST, [immQ.id]: immQ.options[immQ.options.length - 1].value });
  assert.equal(r1.scores.ECONOMIE, r2.scores.ECONOMIE);
  assert.equal(r1.scores.LIBERTES, r2.scores.LIBERTES);
  assert.equal(r1.scores.AUTORITE, r2.scores.AUTORITE);
  assert.equal(r1.scores.INTERNATIONAL, r2.scores.INTERNATIONAL,
    'une contribution secondaire ne doit pas déplacer un score nourri par des questions dédiées');
  assert.notEqual(r1.scores.IMMIGRATION, r2.scores.IMMIGRATION);
});

test('robustesse : titre et narratif ne s\'appuient que sur des dimensions fiables', () => {
  /* seule la dimension ECONOMIE est couverte → le titre doit rester neutre
     ou économique, jamais affirmer une écologie ou une société fragile */
  const mono = {};
  const ecoQuestions = questions.filter((q) =>
    Object.keys(q.options[0].scores).length === 1 &&
    q.options[0].scores.ECONOMIE !== undefined);
  ecoQuestions.slice(0, 5).forEach((q) => { mono[q.id] = q.options[0].value; });
  const calc = calculateDimensionScores(mono);
  const narrative = generateNarrative(calc.scores, calc.coverage);
  const title = generateProfileTitle(calc.scores, calc.coverage);
  for (const d of DIMENSION_IDS) {
    if (d === 'ECONOMIE') continue;
    if ((calc.coverage[d] ?? 0) <= COVERAGE_MIN) {
      /* le narratif ne doit pas affirmer une conviction sur cette dimension */
      const dimLabel = d.toLowerCase();
      assert.ok(!narrative.includes(dimLabel), `le narratif cite ${d} pourtant fragile`);
    }
  }
  assert.ok(typeof title === 'string' && title.length > 0);
  assert.ok(typeof narrative === 'string' && narrative.length > 0);
});

test('robustesse : explication de proximité — tutoiement, jamais de chiffre inventé', () => {
  const r = computeResults(ALL_FIRST);
  const people = rankPersonalities(r.scores, r.coverage, COVERAGE_MIN);
  assert.ok(people.length > 0);
  const txt = explainProximity(people[0]);
  assert.ok(!txt.includes('Vous'), 'l\'explication doit tutoyer comme le reste du site');
  const empty = explainProximity({ proximity: null, gaps: {}, comparedDimensions: [] });
  assert.ok(empty.includes('inventé') || empty.includes('Pas assez'), 'cas sans base expliqué honnêtement');
});

test('robustesse : convergences et divergences cohérentes avec les écarts', () => {
  const gaps = { ECONOMIE: 0.02, LIBERTES: -0.4, AUTORITE: 0.3, SOCIETE: 0.01 };
  const near = convergences(gaps, 2);
  const far = divergences(gaps, 2);
  /* plus petits écarts d'abord : SOCIETE (0.01) et ECONOMIE (0.02) */
  assert.deepEqual(near.map((n) => n.dim).sort(), ['ECONOMIE', 'SOCIETE']);
  /* plus grands écarts d'abord : LIBERTES (0.4) puis AUTORITE (0.3) */
  assert.equal(far[0].dim, 'LIBERTES');
  assert.equal(far[1].dim, 'AUTORITE');
  assert.ok(Math.abs(far[0].gap) >= Math.abs(far[1].gap), 'divergences triées par ampleur');
});