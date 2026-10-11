/**
 * CIVILIS — chapitres du test et plan de reprise
 * ----------------------------------------------------------------------------
 * Source de vérité : la banque de questions elle-même. Un chapitre est une
 * suite CONTIGUË de questions partageant le même `theme` — les questions sont
 * ordonnées par thème, aucun identifiant de chapitre n'est codé en dur, et le
 * parcours enfant (sous-liste ordonnée comme la banque) produit ses propres
 * frontières, recalculées automatiquement.
 *
 * `resumePlan` centralise la reprise du test (phase + question) : elle préserve
 * exactement la sémantique historique (complet → récapitulatif, réponses en
 * cours → reprise à la position enregistrée, vierge → profil) et sait
 * restaurer un écran de transition de chapitre — uniquement si la position
 * enregistrée est une vraie frontière dont la dernière question a bien été
 * répondue (jamais d'écran fantôme).
 */

/** Suite contiguë de même thème : [{ theme, start }] dans l'ordre du parcours. */
export function getChapters(list) {
  const chapters = [];
  for (let i = 0; i < list.length; i++) {
    if (i === 0 || list[i - 1].theme !== list[i].theme) {
      chapters.push({ theme: list[i].theme, start: i });
    }
  }
  return chapters;
}

/** Vrai si la question i termine un chapitre ET qu'il en existe un suivant. */
export function isChapterBoundary(list, i) {
  return (
    Number.isInteger(i) && i >= 0 && i < list.length - 1 &&
    list[i].theme !== list[i + 1].theme
  );
}

/** Index du chapitre (0-based) contenant la question i. */
export function chapterIndexAt(chapters, i) {
  let current = 0;
  for (let k = 0; k < chapters.length; k++) {
    if (chapters[k].start <= i) current = k;
    else break;
  }
  return current;
}

/**
 * Plan de reprise du test.
 * @param {Array}  activeList  liste ordonnée des questions (classique ou enfant)
 * @param {Object} answers     réponses enregistrées { questionId: valeur }
 * @param {boolean} kidsMode   mode courant (la position est propre à chaque mode)
 * @param {Object|null} position position sauvegardée { kids, index, phase }
 * @returns {{ phase: string, index: number }}
 */
export function resumePlan(activeList, answers, kidsMode, position) {
  const allAnswered = activeList.every((q) => answers[q.id] != null);
  if (allAnswered) return { phase: 'recap', index: 0 };

  const answeredCount = activeList.filter((q) => answers[q.id] != null).length;
  const firstUnanswered = activeList.findIndex((q) => answers[q.id] == null);

  if (
    position && position.kids === kidsMode &&
    Number.isInteger(position.index) &&
    position.index >= 0 && position.index < activeList.length
  ) {
    if (position.phase === 'questions') {
      return { phase: 'questions', index: position.index };
    }
    if (
      position.phase === 'chapter-transition' &&
      isChapterBoundary(activeList, position.index) &&
      answers[activeList[position.index].id] != null
    ) {
      return { phase: 'chapter-transition', index: position.index };
    }
  }

  if (answeredCount > 0) return { phase: 'questions', index: firstUnanswered };
  return { phase: 'profile', index: 0 };
}