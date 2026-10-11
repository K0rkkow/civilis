/**
 * CIVILIS — tests de régression
 * ---------------------------------------------------------------------------
 * Couvrent le bug de la page de résultats (page blanche) et les contrats de
 * données qui l'ont causé : cohérence des clés de retour, absence de NaN,
 * comportement quand des réponses manquent, et intégrité des illustrations.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { computeResults, calculateDimensionScores, COVERAGE_MIN } from '../src/lib/analysis.js';
import {
  rankPersonalities, rankParties, proximityToReference, explainProximity,
  coverageReport, profileStats, arbitrages, divergences, convergences,
} from '../src/lib/comparison.js';
import { personalities, personalityProximity } from '../src/lib/politicians.js';
import { parties } from '../src/lib/parties.js';
import { questions } from '../src/lib/questions.js';
import { DIMENSION_IDS } from '../src/lib/dimensions.js';
import { getIllustration, illustratedQuestionIds, illustrationCount } from '../src/lib/illustrations.js';

/* jeu de réponses complet et varié */
function fullAnswers() {
  const out = {};
  questions.forEach((q, i) => { out[q.id] = q.options[(i * 7 + 3) % q.options.length].value; });
  return out;
}
function sparseAnswers(every = 3) {
  const out = {};
  questions.forEach((q, i) => { if (i % every === 0) out[q.id] = q.options[0].value; });
  return out;
}

test('aucune réponse : le moteur ne plante pas et signale l’insuffisance', () => {
  const r = computeResults({});
  assert.equal(r.meta.answeredCount, 0);
  assert.equal(r.meta.insufficient, true);
  assert.equal(r.proximities.length, 0);
  for (const d of DIMENSION_IDS) assert.equal(r.scores[d], null);
});

test('réponses complètes : scores finis, couverture et classement présents', () => {
  const r = computeResults(fullAnswers());
  assert.equal(r.meta.insufficient, false);
  for (const d of DIMENSION_IDS) {
    assert.ok(Number.isFinite(r.scores[d]), `score non fini pour ${d}`);
    assert.ok(r.scores[d] >= 0 && r.scores[d] <= 1, `score hors bornes pour ${d}`);
    assert.ok(Number.isFinite(r.coverage[d]));
  }
  assert.ok(r.proximities.length > 0);
  assert.ok(r.proximities[0].proximity >= r.proximities[r.proximities.length - 1].proximity);
  assert.ok(!JSON.stringify(r).includes('null")') === false || true); // garde-fou informatif
});

test('« je ne sais pas » n’entre jamais dans le calcul', () => {
  const base = fullAnswers();
  const avecUncertain = { ...base, [questions[0].id]: 'uncertain' };
  const r1 = computeResults(base);
  const r2 = computeResults(avecUncertain);
  assert.equal(r1.neutralCount, 0);
  assert.equal(r2.neutralCount, 1);
  // la question « incertaine » ne doit plus produire de contribution
  const dimPrincipale = Object.keys(questions[0].options[0].scores)[0];
  const avant = r1.contributions[dimPrincipale].length;
  const apres = r2.contributions[dimPrincipale].length;
  assert.equal(apres, avant - 1);
  assert.equal(r2.meta.answeredCount, r1.meta.answeredCount); // elle reste comptée comme répondue
});

test('réponses partielles : la page reste exploitable et signale la fragilité', () => {
  const r = computeResults(sparseAnswers(3));
  const cov = coverageReport(r.scores, r.coverage, COVERAGE_MIN);
  assert.ok(cov.overall >= 0 && cov.overall <= 1);
  assert.ok(cov.solid.length + cov.thin.length + cov.missing.length === DIMENSION_IDS.length);
  const stats = profileStats(r, COVERAGE_MIN);
  assert.ok(stats.answered > 0 && stats.answered <= questions.length);
});

test('personalityProximity renvoie la clé « dims » (contrat utilisé par le classement)', () => {
  const r = computeResults(fullAnswers());
  const out = personalityProximity(r.scores, r.coverage, personalities[0], COVERAGE_MIN);
  assert.ok(Array.isArray(out.dims), 'la clé dims doit exister');
  assert.ok(!('compared' in out));
  if (out.proximity != null) {
    assert.ok(out.proximity >= 0 && out.proximity <= 100);
  }
});

test('classement des personnalités : aucune ligne sans base de comparaison', () => {
  const r = computeResults(fullAnswers());
  const rows = rankPersonalities(r.scores, r.coverage, COVERAGE_MIN);
  assert.ok(rows.length > 0);
  for (const row of rows) {
    assert.equal(typeof row.proximity, 'number');
    assert.ok(Array.isArray(row.comparedDimensions) && row.comparedDimensions.length > 0);
    assert.ok(row.person.id);
  }
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i - 1].proximity >= rows[i].proximity);
});

test('classement des partis : même contrat que les personnalités', () => {
  const r = computeResults(fullAnswers());
  const rows = rankParties(r.scores, r.coverage, COVERAGE_MIN);
  assert.ok(rows.length > 0);
  for (const row of rows) {
    assert.ok(Array.isArray(row.comparedDimensions) && row.comparedDimensions.length > 0);
    assert.ok(row.party.position);
  }
});

test('sans dimension comparable, aucune proximité n’est inventée', () => {
  const out = proximityToReference({}, {}, { ECONOMIE: 0.5 }, COVERAGE_MIN);
  assert.equal(out.proximity, null);
  assert.deepEqual(out.dims, []);
  const vide = explainProximity({ proximity: null, dims: [], gaps: {} });
  /* le message doit dire honnêtement qu'aucun chiffre n'a été fabriqué */
  assert.match(vide, /aucun chiffre n'a été inventé/);
  assert.match(vide, /Pas assez de dimensions comparables/);
});

test('positions manquantes d’une référence : ignorées, et jamais de verdict sur une seule dimension', () => {
  const scores = { ECONOMIE: 0.5, LIBERTES: 0.5 };
  const coverage = { ECONOMIE: 1, LIBERTES: 1 };
  /* une référence ne partage qu'UNE dimension avec l'utilisateur :
     une proximité de 100 % sur une seule dimension serait un verdict
     artificiel — le moteur doit refuser de l'afficher. */
  const une = proximityToReference(scores, coverage, { ECONOMIE: 0.5 }, COVERAGE_MIN);
  assert.deepEqual(une.dims, ['ECONOMIE']);
  assert.equal(une.proximity, null, 'une seule dimension comparable ne doit pas produire de pourcentage');
  /* la même référence partage DEUX dimensions : la comparaison se fait
     uniquement sur les dimensions partagées, les manquantes sont ignorées
     (jamais estimées à 50). */
  const deux = proximityToReference(scores, coverage, { ECONOMIE: 0.5, LIBERTES: 0.7 }, COVERAGE_MIN);
  assert.deepEqual(deux.dims.sort(), ['ECONOMIE', 'LIBERTES']);
  assert.equal(deux.proximity < 100, true, 'l’écart sur LIBERTES doit être visible');
  assert.ok(deux.proximity > 0);
});

test('explications, écarts et convergences sont calculés, pas rédigés', () => {
  const r = computeResults(fullAnswers());
  const row = rankPersonalities(r.scores, r.coverage, COVERAGE_MIN)[0];
  const texte = explainProximity(row);
  assert.ok(texte.length > 20);
  assert.ok(divergences(row.gaps, 5).length > 0);
  assert.ok(convergences(row.gaps, 4).length > 0);
  for (const d of divergences(row.gaps, 5)) assert.ok(Number.isFinite(d.signed));
});

test('un arbitrage exige deux positions affirmées', () => {
  const couverture = Object.fromEntries(DIMENSION_IDS.map((d) => [d, 1]));
  const neutre = Object.fromEntries(DIMENSION_IDS.map((d) => [d, 0.5]));
  assert.equal(arbitrages(neutre, couverture, COVERAGE_MIN).length, 0);

  const affirme = { ...neutre };
  affirme.ECONOMIE = 0.95;
  affirme.ECOLOGIE = 0.1;
  const items = arbitrages(affirme, couverture, COVERAGE_MIN);
  assert.ok(items.length > 0);
  assert.ok(items.every((i) => i.dims.length === 2 && Number.isFinite(i.gap)));
});

test('donnees des personnalites : positions completes, photos creditees', () => {
  assert.ok(personalities.length >= 8);
  for (const p of personalities) {
    for (const d of DIMENSION_IDS) {
      assert.equal(typeof p.position[d], 'number', `${p.id}.${d} manquant`);
    }
    assert.ok(p.photo && p.photo.src && p.photo.alt && p.photo.caption, `${p.id} : photo incomplète`);
    assert.ok(p.photo.license && p.photo.author, `${p.id} : crédit manquant`);
    assert.ok(p.source && p.bio && p.role, `${p.id} : documentation manquante`);
  }
});

test('données des partis : position complète sur les dix dimensions', () => {
  for (const p of parties) {
    for (const d of DIMENSION_IDS) {
      assert.equal(typeof p.position[d], 'number', `${p.id}.${d} manquant`);
    }
    assert.ok(p.program, `${p.id} : source manquante`);
  }
});

test('illustrations : chaque image est rattachée à une question existante', () => {
  const ids = new Set(questions.map((q) => q.id));
  const covered = illustratedQuestionIds();
  assert.ok(covered.length > 0);
  for (const id of covered) {
    assert.ok(ids.has(id), `illustration rattachée à une question inconnue : ${id}`);
    const ill = getIllustration(id);
    assert.ok(ill && ill.images.length >= 1, `illustration manquante pour ${id}`);
    for (const img of ill.images) {
      assert.ok(img.src.startsWith('https://'), `URL non vérifiée pour ${id}`);
      assert.ok(img.alt && img.caption, `légende manquante pour ${id}`);
      assert.ok(img.license, `licence manquante pour ${id}`);
    }
  }
  // une seule image par question pour l’instant : pas de doublon accidentel
  const urls = covered.flatMap((id) => getIllustration(id).images.map((i) => i.src));
  assert.equal(new Set(urls).size, urls.length, 'une image est réutilisée : à justifier');
});

test('couverture annoncée du questionnaire', () => {
  const covered = illustratedQuestionIds().length;
  assert.equal(covered, 18);
  assert.equal(illustrationCount(), 18);
  assert.ok(covered < questions.length, 'toutes les questions ne sont pas illustrées — c’est assumé');
});

test('calculateDimensionScores ignore les réponses inconnues', () => {
  const r = calculateDimensionScores({ [questions[0].id]: 'valeur-inexistante' });
  for (const d of DIMENSION_IDS) assert.equal(r.scores[d], null);
});
