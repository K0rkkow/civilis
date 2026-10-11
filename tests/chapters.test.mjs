/**
 * CIVILIS — tests des chapitres du test et du plan de reprise
 * ---------------------------------------------------------------------------
 * Les chapitres sont DÉRIVÉS des thèmes réels de la banque (et de la liste
 * enfant) : contiguïté, frontières exactes, jamais de chapitre fantôme après
 * la dernière question, et reprise fidèle (y compris sur un écran de
 * transition) sans jamais inventer d'écran ni perdre une position enregistrée.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { questions } from '../src/lib/questions.js';
import { getKidsQuestions } from '../src/lib/kids.js';
import {
  getChapters, isChapterBoundary, chapterIndexAt, resumePlan,
} from '../src/lib/chapters.js';

/* jeu de réponses utilitaire : les k premières questions du parcours */
function answerFirst(list, k) {
  const out = {};
  list.slice(0, k).forEach((q) => { out[q.id] = q.options[0].value; });
  return out;
}

test('chapitres classiques : 12 chapitres contigus dérivés des thèmes', () => {
  const ch = getChapters(questions);
  assert.equal(ch.length, 12, '12 thèmes réels dans la banque');
  assert.equal(ch[0].theme, 'Économie et fiscalité');
  assert.equal(ch[0].start, 0);
  assert.equal(ch[11].theme, 'École et éducation');
  /* contiguïté stricte : un chapitre démarre juste après le précédent,
     et sa première question porte bien son thème */
  for (let i = 1; i < ch.length; i++) {
    assert.ok(ch[i].start > ch[i - 1].start);
    assert.equal(questions[ch[i].start].theme, ch[i].theme);
    assert.notEqual(questions[ch[i].start - 1].theme, ch[i].theme);
  }
});

test('frontières : chaque changement de thème, et jamais après la dernière question', () => {
  for (let i = 0; i < questions.length - 1; i++) {
    assert.equal(
      isChapterBoundary(questions, i),
      questions[i].theme !== questions[i + 1].theme,
      `index ${i}`
    );
  }
  /* la dernière question termine le test → récapitulatif, pas de transition */
  assert.equal(isChapterBoundary(questions, questions.length - 1), false);
  assert.equal(isChapterBoundary(questions, -1), false);
  assert.equal(isChapterBoundary(questions, questions.length), false);
});

test('chapitre courant : index cohérent à chaque frontière réelle', () => {
  const ch = getChapters(questions);
  assert.equal(chapterIndexAt(ch, 0), 0);
  assert.equal(chapterIndexAt(ch, 5), 0);   /* dernière question d'Économie */
  assert.equal(chapterIndexAt(ch, 6), 1);  /* première question de Travail */
  assert.equal(chapterIndexAt(ch, 61), 11); /* dernière question (École) */
});

test('parcours enfant : frontières recalculées sur la liste réelle', () => {
  const kq = getKidsQuestions();
  const ch = getChapters(kq);
  assert.equal(ch.length, 12, 'le parcours enfant traverse aussi 12 chapitres');
  assert.equal(isChapterBoundary(kq, 3), true);   /* fin d'Économie (4 questions enfant) */
  assert.equal(isChapterBoundary(kq, 4), false);
  assert.equal(isChapterBoundary(kq, 38), false); /* dernière question enfant → récapitulatif */
});

test('reprise : position « questions » restaurée à l\'identique', () => {
  const answers = answerFirst(questions, 20);
  const plan = resumePlan(questions, answers, false, { kids: false, index: 17, phase: 'questions' });
  assert.deepEqual(plan, { phase: 'questions', index: 17 });
});

test('reprise : transition restaurée seulement sur une vraie frontière répondue', () => {
  const answers = answerFirst(questions, 6);
  const pos = { kids: false, index: 5, phase: 'chapter-transition' };
  /* frontière réelle (fin d'Économie) et dernière question répondue → écran restauré */
  assert.deepEqual(resumePlan(questions, answers, false, pos), { phase: 'chapter-transition', index: 5 });

  /* frontière NON répondue → pas d'écran fantôme, reprise normale */
  const partial = { ...answers };
  delete partial[questions[5].id];
  assert.equal(resumePlan(questions, partial, false, pos).phase, 'questions');

  /* index qui n'est pas une frontière → reprise normale */
  const posFake = { kids: false, index: 3, phase: 'chapter-transition' };
  assert.equal(resumePlan(questions, answers, false, posFake).phase, 'questions');

  /* mode incompatible → position ignorée */
  assert.equal(resumePlan(questions, answers, true, pos).phase, 'questions');
});

test('reprise : sémantique d\'origine préservée (complet / vierge / en cours)', () => {
  const full = {};
  questions.forEach((q) => { full[q.id] = q.options[0].value; });
  assert.deepEqual(resumePlan(questions, full, false, null), { phase: 'recap', index: 0 });
  assert.deepEqual(resumePlan(questions, {}, false, null), { phase: 'profile', index: 0 });
  /* réponses sans position → première question sans réponse */
  const answers = answerFirst(questions, 9);
  assert.deepEqual(resumePlan(questions, answers, false, null), { phase: 'questions', index: 9 });
});