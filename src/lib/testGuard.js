/**
 * CIVILIS — état partagé du mode test concentré
 * ----------------------------------------------------------------------------
 * Petit magasin sans dépendance : le composant Test publie ici son état
 * (phase, question courante, progression), et la coquille de l'application
 * (App.jsx) s'y abonne pour :
 *   - remplacer l'en-tête de navigation par un en-tête discret pendant le test ;
 *   - masquer le pied de page et ses liens ;
 *   - armer la confirmation de sortie (TestLeaveGuard).
 *
 * L'état est volontairement minimal et ne contient aucune donnée personnelle.
 */

let state = {
  active: false,   /* true pendant les phases « questions » et « recapitulatif » */
  phase: 'profile',
  label: '',       /* ex. « Question 4 / 62 », « Récapitulatif » */
  progress: 0,     /* 0–100 */
};

const listeners = new Set();

export function setTestGuard(patch) {
  let changed = false;
  for (const k of Object.keys(patch)) {
    if (state[k] !== patch[k]) { changed = true; break; }
  }
  if (!changed) return;
  state = { ...state, ...patch };
  for (const l of listeners) l(state);
}

export function getTestGuard() {
  return state;
}

export function subscribeTestGuard(listener) {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

/* ---------------------------------------------------------------------------
   Réinitialisation complète d'une session de test ABANDONNÉE (« Quitter le
   test »). Efface tout ce qui permettrait de reprendre le parcours —
   réponses, position exacte, profil facultatif (tranche d'âge et sexe),
   choix du mode enfant — afin que le prochain départ revienne à l'écran
   « Avant de commencer », profil vierge, progression à zéro.
   La protection de sortie est désarmée AVANT la navigation demandée.
   Les préférences générales du site (introduction acceptée) ne sont jamais
   touchées, et une session TERMINÉE (résultats validés) n'est pas effacée.
   --------------------------------------------------------------------------- */

const SESSION_KEYS = [
  'civilis.answers',        /* réponses données (mêmes clés que Test.jsx)  */
  'civilis.test-position',  /* question courante + phase                   */
  'civilis.profile',        /* tranche d'âge et sexe, profil facultatif    */
  'civilis.kids-mode',      /* mode enfant (5–12 ans) ou classique         */
];

export function resetTestSession() {
  for (const key of SESSION_KEYS) {
    try { localStorage.removeItem(key); } catch { /* stockage indisponible */ }
  }
  /* désarmer la protection de sortie avant toute navigation */
  setTestGuard({ active: false, phase: 'profile', label: '', progress: 0 });
}