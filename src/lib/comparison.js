/**
 * CIVILIS — Comparaisons (module pur, sans React ni DOM)
 * ---------------------------------------------------------------------------
 * Alimente la page de résultats : classement des personnalités, classement des
 * partis, convergences, divergences, couverture, statistiques synthétiques.
 *
 * RÈGLES (elles sont la raison d'être de ce fichier) :
 * 1. On ne compare que sur les dimensions où l'utilisateur a une position
 *    documentée ET où la référence (personnalité / parti) en a une.
 * 2. Aucune valeur manquante n'est remplacée par 0 ni par 50 : une dimension
 *    inconnue est absente du graphique et le dit.
 * 3. Une proximité est une PROXIMITÉ ESTIMÉE entre deux jeux de positions :
 *    elle ne signifie ni adhésion, ni vote, ni soutien.
 * 4. Tout est déterministe et vérifiable : mêmes entrées → mêmes sorties.
 * 5. Un classement n'est établi que sur un minimum de MIN_COMPARABLE_DIMS
 *    dimensions comparables : une « proximité » calculée sur une seule
 *    dimension ne dit rien d'un profil et ne doit pas s'afficher.
 */

import { dimensions, DIMENSION_IDS } from './dimensions.js';
import { personalities, personalityProximity } from './politicians.js';
import { parties } from './parties.js';

export const MIN_COMPARABLE_DIMS = 2;

/** Dimensions réellement utilisables pour comparer (couverture + position connue). */
function comparableDimensions(scores, coverage, coverageMin, reference) {
  return DIMENSION_IDS.filter((dim) => {
    if (scores[dim] == null) return false;
    if ((coverage[dim] ?? 0) < coverageMin) return false;
    return !reference || reference[dim] != null;
  });
}

/**
 * Proximité avec un objet de référence (personnalité, parti, courant).
 * @returns {{proximity:number|null, distance:number|null, dims:string[], gaps:Object}}
 */
export function proximityToReference(scores, coverage, reference, coverageMin) {
  const dims = comparableDimensions(scores, coverage, coverageMin, reference);
  const gaps = {};
  let sum2 = 0;
  for (const dim of dims) {
    const gap = scores[dim] - reference[dim];
    gaps[dim] = gap;
    sum2 += gap * gap;
  }
  if (dims.length < MIN_COMPARABLE_DIMS) {
    return { proximity: null, distance: null, dims, gaps };
  }
  const distance = Math.sqrt(sum2 / dims.length);
  return {
    proximity: Math.max(0, Math.round((1 - distance) * 100)),
    distance,
    dims,
    gaps,
  };
}

/** Classement des personnalités. Les proximités nulles (moins de
 *  MIN_COMPARABLE_DIMS dimensions comparables) sont écartées : on n'affiche
 *  pas un pourcentage sans base de profil. */
export function rankPersonalities(scores, coverage, coverageMin) {
  return personalities
    .map((person) => {
      const { proximity, dims, gaps } = personalityProximity(scores, coverage, person, coverageMin);
      /* garde cohérente avec proximityToReference : une seule dimension
         comparable ne décrit pas un profil (personalityProximity, dans
         politicians.js, n'impose pas ce minimum lui-même) */
      const usable = dims.length >= MIN_COMPARABLE_DIMS ? proximity : null;
      return { person, proximity: usable, comparedDimensions: dims, gaps };
    })
    .filter((row) => row.proximity != null)
    .sort((a, b) => b.proximity - a.proximity);
}

/** Classement des partis (identique, données de programmes publiés). */
export function rankParties(scores, coverage, coverageMin) {
  return parties
    .map((party) => {
      const { proximity, dims, gaps } = proximityToReference(scores, coverage, party.position, coverageMin);
      return { party, proximity, comparedDimensions: dims, gaps };
    })
    .filter((row) => row.proximity != null)
    .sort((a, b) => b.proximity - a.proximity);
}

/**
 * Quasi-égalités d'un classement : les entrées situées à `maxGap` points ou
 * moins de la tête ne peuvent pas être départagées honnêtement — on les
 * présente comme un groupe plutôt que comme un ordre artificiellement précis.
 * @returns {Array} rangée de tête + tableau des ex æquo de la tête
 */
export function nearTies(rows, maxGap = 3) {
  const sorted = [...rows].sort((a, b) => b.proximity - a.proximity);
  if (sorted.length === 0) return { top: null, tied: [] };
  const top = sorted[0];
  const tied = sorted.filter((r) => r !== top && top.proximity - r.proximity <= maxGap);
  return { top, tied };
}

/** Les écarts les plus marquants, dans un sens comme dans l'autre. */
export function divergences(gaps, limit = 5) {
  return Object.entries(gaps)
    .map(([dim, gap]) => ({ dim, gap: Math.abs(gap), signed: gap }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, limit);
}

/** Les dimensions où l'utilisateur est le plus proche de la référence. */
export function convergences(gaps, limit = 4) {
  return Object.entries(gaps)
    .map(([dim, gap]) => ({ dim, gap: Math.abs(gap), signed: gap }))
    .sort((a, b) => a.gap - b.gap)
    .slice(0, limit);
}

/**
 * Explication textuelle d'une proximité : elle est calculée à partir des
 * écarts réels, jamais écrite « après coup » pour justifier un pourcentage.
 * Tutoiement cohérent avec le reste du site ; la nature de la comparaison
 * (positions publiées documentées) est rappelée sans jargon.
 */
export function explainProximity(row, limit = 3) {
  if (!row || row.proximity == null) {
    return 'Pas assez de dimensions comparables pour estimer une proximité : aucun chiffre n\'a été inventé pour combler.';
  }
  const near = convergences(row.gaps, limit);
  const far = divergences(row.gaps, limit);
  const name = (d) => dimensions[d].label;
  const parts = [];
  if (near.length) {
    parts.push(`Tes réponses sont proches de ses positions publiées sur ${near.map((n) => name(n.dim)).join(', ')}.`);
  }
  if (far.length) {
    parts.push(
      `Tu t'en écartes surtout sur ${far.slice(0, 2).map((n) => name(n.dim)).join(' et ')}`
      + `${far.length > 2 ? `, puis ${name(far[2].dim)}` : ''}.`
    );
  }
  parts.push(`Comparaison établie sur ${row.comparedDimensions.length} dimension${row.comparedDimensions.length > 1 ? 's' : ''} documentée${row.comparedDimensions.length > 1 ? 's' : ''}.`);
  return parts.join(' ');
}

/**
 * Couverture du profil : quelles dimensions sont solides, lesquelles manquent.
 * @returns {{overall:number, solid:string[], thin:string[], missing:string[]}}
 */
export function coverageReport(scores, coverage, coverageMin) {
  const solid = [];
  const thin = [];
  const missing = [];
  for (const dim of DIMENSION_IDS) {
    const cov = coverage[dim] ?? 0;
    if (scores[dim] == null || cov === 0) missing.push(dim);
    else if (cov >= coverageMin) solid.push(dim);
    else thin.push(dim);
  }
  const overall = DIMENSION_IDS.reduce((a, d) => a + Math.min(1, coverage[d] ?? 0), 0) / DIMENSION_IDS.length;
  return { overall, solid, thin, missing };
}

/** Statistiques synthétiques, toutes calculées à partir des données réelles. */
export function profileStats(result, coverageMin) {
  const answered = result.meta.answeredCount;
  const total = result.meta.totalQuestions;
  const cov = coverageReport(result.scores, result.coverage, coverageMin);
  const solidCount = cov.solid.length;
  return {
    answered,
    total,
    answeredRatio: total ? answered / total : 0,
    overallCoverage: cov.overall,
    solidDimensions: cov.solid,
    thinDimensions: cov.thin,
    missingDimensions: cov.missing,
    solidCount,
    reliable: solidCount >= 4,
    uncertain: result.neutralCount,
  };
}

/**
 * Arbitrages : écarts entre deux dimensions comparables du même profil.
 * On ne parle d'arbitrage que si les DEUX positions sont documentées et
 * affirmées : deux réponses portant sur des sujets différents ne sont jamais
 * opposées automatiquement.
 */
export function arbitrages(scores, coverage, coverageMin) {
  const ok = (dim) => scores[dim] != null && (coverage[dim] ?? 0) >= coverageMin
    && (scores[dim] < 0.35 || scores[dim] > 0.65);
  const pairs = [
    { dims: ['ECONOMIE', 'ECOLOGIE'], label: 'Transition écologique et coût économique' },
    { dims: ['AUTORITE', 'LIBERTES'], label: 'Sécurité et libertés individuelles' },
    { dims: ['ECONOMIE', 'LIBERTES'], label: 'Redistribution et liberté individuelle' },
    { dims: ['INSTITUTIONS', 'AUTORITE'], label: 'Contre-pouvoirs et autorité de l’exécutif' },
  ];
  return pairs
    .filter((p) => ok(p.dims[0]) && ok(p.dims[1]))
    .map((p) => ({
      label: p.label,
      dims: p.dims,
      gap: Math.abs(scores[p.dims[0]] - scores[p.dims[1]]),
      values: p.dims.map((d) => ({ dim: d, value: scores[d] })),
    }))
    .sort((a, b) => b.gap - a.gap);
}
