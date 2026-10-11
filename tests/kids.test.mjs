/**
 * CIVILIS — tests du mode enfant (5–12 ans)
 * ---------------------------------------------------------------------------
 * Vérifient les contrats du parcours pédagogique :
 * - chaque question enfant existe dans la banque classique ;
 * - chaque option enfant réutilise EXACTEMENT une `value` d'origine
 *   (le moteur de calcul fonctionne donc sans aucun changement) ;
 * - les reformulations sont complètes et non vides ;
 * - les 10 dimensions restent couvertes par les questions retenues ;
 * - les questions sautées ne reçoivent jamais de réponse ;
 * - le moteur produit des résultats exploitables à partir de réponses enfant ;
 * - les grandes idées présentées aux enfants sont les courants réels.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { computeResults, COVERAGE_MIN } from '../src/lib/analysis.js';
import { questions } from '../src/lib/questions.js';
import { DIMENSION_IDS } from '../src/lib/dimensions.js';
import { currents } from '../src/lib/currents.js';
import {
  KIDS_QUESTION_IDS, KIDS_REWRITES, KIDS_CURRENTS,
  getKidsQuestions, getKidsRewrite, getKidsOptionText,
} from '../src/lib/kids.js';

/* ---------------------------------------------------------------- contrats */

test('mode enfant : chaque question retenue existe dans la banque classique', () => {
  assert.ok(KIDS_QUESTION_IDS.length >= 30, `parcours trop court : ${KIDS_QUESTION_IDS.length}`);
  for (const id of KIDS_QUESTION_IDS) {
    const q = questions.find((x) => x.id === id);
    assert.ok(q, `question inconnue dans la banque : ${id}`);
  }
});

test('mode enfant : les identifiants sont uniques et ordonnés comme la banque', () => {
  assert.equal(new Set(KIDS_QUESTION_IDS).size, KIDS_QUESTION_IDS.length, 'doublon dans KIDS_QUESTION_IDS');
  const positions = KIDS_QUESTION_IDS
    .map((id) => questions.findIndex((q) => q.id === id));
  for (let i = 1; i < positions.length; i++) {
    assert.ok(positions[i] > positions[i - 1], 'ordre incompatible avec la banque');
  }
});

test('mode enfant : chaque option réutilise une value d\'origine (moteur intact)', () => {
  for (const id of KIDS_QUESTION_IDS) {
    const original = questions.find((q) => q.id === id);
    const rewrite = KIDS_REWRITES[id];
    assert.ok(rewrite, `pas de reformulation pour ${id}`);
    const originalValues = original.options.map((o) => o.value);
    for (const opt of rewrite.options) {
      assert.ok(
        originalValues.includes(opt.value),
        `${id} : value inconnue « ${opt.value} » (attendu parmi : ${originalValues.join(', ')})`
      );
    }
  }
});

test('mode enfant : reformulations complètes, non vides, dans le bon ordre', () => {
  for (const id of KIDS_QUESTION_IDS) {
    const original = questions.find((q) => q.id === id);
    const rewrite = KIDS_REWRITES[id];
    assert.equal(typeof rewrite.statement, 'string');
    assert.ok(rewrite.statement.length >= 10, `${id} : énoncé trop court`);
    assert.ok(rewrite.options.length >= 2, `${id} : moins de deux options`);
    // l'ordre des options enfant suit l'ordre des options d'origine :
    // le sens de la question (du pôle le plus fort au plus faible) est préservé.
    const originalValues = original.options.map((o) => o.value);
    const kidsValues = rewrite.options.map((o) => o.value);
    assert.deepEqual(kidsValues, originalValues.filter((v) => kidsValues.includes(v)),
      `${id} : ordre des options modifié`);
    for (const opt of rewrite.options) {
      assert.equal(typeof opt.text, 'string');
      assert.ok(opt.text.length >= 3, `${id} : texte d'option vide`);
    }
    if (rewrite.explain != null) {
      assert.equal(typeof rewrite.explain, 'string');
      assert.ok(rewrite.explain.length >= 20, `${id} : explication trop courte`);
    }
  }
});

test('mode enfant : les 10 dimensions restent couvertes (≥ 2 questions chacune)', () => {
  const kidsQuestions = getKidsQuestions();
  assert.equal(kidsQuestions.length, KIDS_QUESTION_IDS.length);
  for (const dim of DIMENSION_IDS) {
    const withDim = kidsQuestions.filter((q) =>
      q.options.some((o) => o.scores && o.scores[dim] != null));
    assert.ok(withDim.length >= 2,
      `dimension ${dim} couverte par ${withDim.length} question(s) enfant seulement`);
  }
});

test('mode enfant : questions sautées = aucune réponse, jamais une opinion', () => {
  const kidsIds = new Set(KIDS_QUESTION_IDS);
  const skipped = questions.filter((q) => !kidsIds.has(q.id));
  assert.ok(skipped.length >= 10, `trop peu de questions sautées : ${skipped.length}`);
  // simule un parcours enfant : seules les questions retenues reçoivent une réponse
  const answers = {};
  getKidsQuestions().forEach((q, i) => { answers[q.id] = q.options[i % q.options.length].value; });
  for (const q of skipped) {
    assert.equal(answers[q.id], undefined, `${q.id} ne doit recevoir aucune réponse`);
  }
  const r = computeResults(answers);
  assert.equal(r.meta.answeredCount, KIDS_QUESTION_IDS.length);
  // les réponses « incertaines » restent exclues du calcul
  const withUncertain = { ...answers, [KIDS_QUESTION_IDS[0]]: 'uncertain' };
  const r2 = computeResults(withUncertain);
  assert.equal(r2.meta.answeredCount, KIDS_QUESTION_IDS.length);
  assert.equal(r2.neutralCount, 1);
});

test('mode enfant : le moteur produit des résultats exploitables sans NaN', () => {
  const answers = {};
  getKidsQuestions().forEach((q, i) => {
    answers[q.id] = i % 5 === 0 ? 'uncertain' : q.options[i % q.options.length].value;
  });
  const r = computeResults(answers);
  assert.equal(r.meta.insufficient, false, 'un parcours enfant complet doit suffire');
  assert.ok(r.proximities.length > 0, 'aucune grande idée calculée');
  for (const p of r.proximities) {
    assert.ok(Number.isFinite(p.proximity), 'proximité non finie (NaN)');
    assert.ok(p.proximity >= 0 && p.proximity <= 100, `proximité hors bornes : ${p.proximity}`);
  }
  for (const d of DIMENSION_IDS) {
    if (r.scores[d] != null) {
      assert.ok(Number.isFinite(r.scores[d]), `score non fini sur ${d}`);
      assert.ok(r.scores[d] >= 0 && r.scores[d] <= 1, `score hors bornes sur ${d}`);
    }
  }
  const solid = Object.keys(r.scores).filter((d) => (r.coverage[d] ?? 0) >= COVERAGE_MIN);
  assert.ok(solid.length >= 5, `trop peu de dimensions solides : ${solid.length}`);
});

test('mode enfant : réponses partielles → résultat exploitable ou signalement honnête', () => {
  const kidsQuestions = getKidsQuestions();
  const few = {};
  kidsQuestions.slice(0, 3).forEach((q) => { few[q.id] = q.options[0].value; });
  const r = computeResults(few);
  if (r.meta.insufficient) {
    assert.equal(r.proximities.length, 0, 'des proximités apparaissent alors que rien n\'est solide');
  } else {
    assert.ok(r.proximities.length > 0);
  }
});

test('mode enfant : helpers cohérents avec la banque', () => {
  assert.equal(getKidsRewrite('eco1').statement.length > 0, true);
  assert.equal(getKidsRewrite('question-inexistante'), null);
  const q0 = getKidsQuestions()[0];
  const text = getKidsOptionText(q0.id, KIDS_REWRITES[q0.id].options[0].value);
  assert.equal(text, KIDS_REWRITES[q0.id].options[0].text);
  assert.equal(getKidsOptionText(q0.id, 'valeur-inexistante'), null);
});

test('mode enfant : les grandes idées sont les courants réels, sans invention', () => {
  const realKeys = currents.map((c) => c.key);
  for (const [key, k] of Object.entries(KIDS_CURRENTS)) {
    assert.ok(realKeys.includes(key), `courant inventé dans les résultats enfant : ${key}`);
    assert.equal(typeof k.title, 'string');
    assert.ok(k.title.length >= 3, `titre trop court : ${key}`);
    assert.equal(typeof k.simple, 'string');
    assert.ok(k.simple.length >= 20, `description trop courte : ${key}`);
    assert.equal(typeof k.example, 'string');
    assert.ok(k.example.length >= 15, `exemple trop court : ${key}`);
  }
  // chaque courant réel a bien une version enfant (la page peut les afficher tous)
  for (const key of realKeys) {
    assert.ok(KIDS_CURRENTS[key], `courant réel sans description enfant : ${key}`);
  }
});
