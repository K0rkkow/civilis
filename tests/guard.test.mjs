/**
 * CIVILIS — tests du magasin d'état du mode test concentré (testGuard.js)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { setTestGuard, getTestGuard, subscribeTestGuard, resetTestSession } from '../src/lib/testGuard.js';

test('garde de test : état initial inactif, hors des questions', () => {
  const s = getTestGuard();
  assert.equal(s.active, false);
  assert.equal(s.phase, 'profile');
});

test('garde de test : publication notifie les abonnés', () => {
  let seen = null;
  const off = subscribeTestGuard((s) => { seen = s; });
  setTestGuard({ active: true, phase: 'questions', label: 'Question 4 / 62', progress: 5 });
  assert.equal(getTestGuard().active, true);
  assert.equal(getTestGuard().label, 'Question 4 / 62');
  assert.equal(seen.progress, 5);
  off();
  setTestGuard({ active: false, phase: 'profile', label: '', progress: 0 });
  assert.equal(getTestGuard().active, false);
});

test('garde de test : aucune notification si rien ne change', () => {
  let calls = 0;
  const off = subscribeTestGuard(() => { calls += 1; });
  const before = calls;
  const current = getTestGuard();
  setTestGuard({ active: current.active });   /* identique : silence */
  assert.equal(calls, before);
  setTestGuard({ active: !current.active });   /* différent : notifié */
  assert.ok(calls > before);
  setTestGuard({ active: !current.active });  /* retour à l'état initial */
  off();
});

test('garde de test : désabonnement effectif', () => {
  let calls = 0;
  const off = subscribeTestGuard(() => { calls += 1; });
  off();
  const before = calls;
  setTestGuard({ label: 'autre' });
  assert.equal(calls, before);
  setTestGuard({ label: '' });
});

test('abandon : « Quitter le test » efface toute la session de test', () => {
  const removed = [];
  globalThis.localStorage = {
    removeItem: (k) => { removed.push(k); },
    getItem: () => null,
    setItem: () => {},
  };
  setTestGuard({ active: true, phase: 'questions', label: 'Question 4 / 62', progress: 5 });
  resetTestSession();
  assert.deepEqual(
    [...removed].sort(),
    ['civilis.answers', 'civilis.kids-mode', 'civilis.profile', 'civilis.test-position'].sort(),
    'exactement les 4 clés de session, ni plus ni moins'
  );
  assert.equal(removed.includes('civilis.intro.entered'), false,
    'la préférence de site (introduction acceptée) n\'est jamais effacée');
  assert.equal(getTestGuard().active, false, 'la protection de sortie est désarmée');
  assert.equal(getTestGuard().phase, 'profile');
  assert.equal(getTestGuard().label, '');
  assert.equal(getTestGuard().progress, 0);
  delete globalThis.localStorage;
});

test('abandon : localStorage indisponible ne fait pas planter la réinitialisation', () => {
  const orig = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new Error('stockage bloqué (navigation privée)'); },
  });
  setTestGuard({ active: true, phase: 'recap', label: 'Récapitulatif', progress: 100 });
  let threw = null;
  try { resetTestSession(); } catch (e) { threw = e; }
  assert.equal(threw, null, 'resetTestSession ne lève jamais d\'exception');
  assert.equal(getTestGuard().active, false, 'la garde est malgré tout désarmée');
  delete globalThis.localStorage;
  globalThis.localStorage = orig;
});