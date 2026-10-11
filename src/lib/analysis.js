/**
 * CIVILIS — Moteur de calcul (pur, déterministe, documenté)
 * ----------------------------------------------------------------------------
 * Aucune dépendance au DOM ni à React : ce fichier est testé hors navigateur.
 *
 * PRINCIPES
 * 1. Chaque option choisie apporte, pour chaque dimension concernée, une
 *    valeur v ∈ [0,1] (0 = pôle 0, 1 = pôle 100, cf. dimensions.js).
 *    La réponse « je ne sais pas » est EXCLUE : jamais convertie en opinion.
 * 2. Score de dimension = moyenne pondérée des valeurs connues.
 *    Les dimensions sans réponse connue sont marquées coverage = 0.
 * 3. Couverture = poids des questions répondues / poids total de la dimension.
 *    En dessous de COVERAGE_MIN (0.4), la dimension est signalée fragile.
 * 4. Proximité courant = 100 − 100 · d(p, r) où d est la distance euclidienne
 *    pondérée sur les dimensions COUVERTES seulement, normalisée par la
 *    racine de la somme des poids de couverture. Ainsi une dimension sans
 *    réponse ne pénalise ni ne favorise un courant.
 * 5. Déterministe : mêmes entrées → mêmes sorties. Aucune donnée de profil
 *    (âge, sexe) n'entre dans le calcul.
 * ----------------------------------------------------------------------------
 * Le résultat expose tout ce qu'il affiche : utilisateur doit pouvoir
 * comprendre « pourquoi ce score » depuis la sortie elle-même.
 */

import { DIMENSION_IDS } from './dimensions.js';
import { currents } from './currents.js';
import { questions } from './questions.js';

export const COVERAGE_MIN = 0.4;

/** Moyenne pondérée d'une liste de {value, weight}. */
export function weightedMean(items) {
  if (!items || items.length === 0) return null;
  let sum = 0, w = 0;
  for (const { value, weight } of items) {
    sum += value * weight;
    w += weight;
  }
  return w > 0 ? sum / w : null;
}

/**
 * Calcule les scores de dimension de l'utilisateur.
 * @param {Object<string, string>} answers  { questionId: optionValue | 'uncertain' | undefined }
 * @param {Array} questionBank  banque des questions (par défaut : questions.js)
 * @returns {{scores: Object, coverage: Object, contributions: Object}}
 *   scores[dim] ∈ [0,1], coverage[dim] ∈ [0,1], contributions[dim] = liste
 *   des {questionId, dimension, value, weight} ayant nourri le score.
 */
export function calculateDimensionScores(answers, questionBank = questions) {
  // 1. Récolte des contributions par dimension
  const contributions = {};
  for (const dim of DIMENSION_IDS) contributions[dim] = [];

  const neutralCount = { count: 0 };

  for (const q of questionBank) {
    const given = answers[q.id];
    if (given === undefined || given === null || given === 'uncertain') {
      if (given === 'uncertain') neutralCount.count += 1;
      continue; // pas de réponse → pas d'opinion fabriquée
    }
    const option = q.options.find((o) => o.value === given);
    if (!option) continue; // réponse inconnue → ignorée (jamais interprétée)

    const nDims = Object.keys(option.scores).length;
    for (const [dim, value] of Object.entries(option.scores)) {
      // Une question à plusieurs dimensions répartit son poids :
      // poids de base 1, dividé parmi les dimensions touchées,
      // la dimension principale (première clé) garde une prime de 60 %.
      const mainDim = Object.keys(option.scores)[0];
      const base = 1;
      const weight = dim === mainDim
        ? base * (nDims > 1 ? 0.9 : 1)
        : base * 0.3;
      contributions[dim].push({
        questionId: q.id,
        dimension: dim,
        value,
        weight,
        isSecondary: dim !== mainDim,
      });
    }
  }

  // 2. Score + couverture
  const scores = {}, coverage = {};
  for (const dim of DIMENSION_IDS) {
    // TOUS les apports (principaux et secondaires) participent à la couverture ;
    // le score, lui, privilegie les contributions principales.
    const known = contributions[dim];
    scores[dim] = weightedMean(known.filter(c => !c.isSecondary)
      .map((c) => ({ value: c.value, weight: c.weight })))
      ?? weightedMean(known.map((c) => ({ value: c.value, weight: c.weight })));
    // Couverture : somme des poids de toutes les contributions connues,
    // saturée à 1 en cas de nombreuses réponses. (2 contributions ≈ 0,5·20 %.
    // Le seuil pratique : 4 réponses principales ≈ couverture → importante.)
    const raw = known.reduce((a, c) => a + c.weight, 0);
    coverage[dim] = raw > 0 ? Math.min(1, raw / 2.5) : 0;
  }

  return { scores, coverage, contributions, neutralCount: neutralCount.count };
}

/** Distance euclidienne pondérée, normalisée, entre une position u et r. */
export function distanceWeighted(u, r, weights) {
  let sum2 = 0, wsum = 0;
  for (const [dim, w] of Object.entries(weights)) {
    const du = u[dim];
    const dr = r[dim];
    if (du == null || dr == null) continue; // dimension non couverte → ignorée
    sum2 += w * (du - dr) * (du - dr);
    wsum += w;
  }
  if (wsum === 0) return null; // aucune dimension comparable
  return Math.sqrt(sum2 / wsum); // ∈ [0,1]
}

/**
 * Proximité avec les courants. Renvoie une liste triée :
 * [{current, proximity ∈ [0,100], distance, contribution: {DIM: écart*impact}}]
 */
export function calculateCurrentProximities(scores, coverage, refCurrents = currents) {
  const weights = {};
  for (const dim of DIMENSION_IDS) {
    weights[dim] = coverage[dim] > COVERAGE_MIN ? 1 : 0;
  }
  const comparable = Object.values(weights).some((w) => w > 0);
  if (!comparable) return []; // aucune dimension exploitable

  return refCurrents
    .map((c) => {
      const d = distanceWeighted(scores, c.position, weights);
      if (d == null) return null;
      const contribution = {};
      for (const dim of DIMENSION_IDS) {
        if (weights[dim] > 0 && scores[dim] != null) {
          const gap = scores[dim] - c.position[dim];
          contribution[dim] = { gap, weight: weights[dim] };
        }
      }
      return {
        current: c,
        distance: d,
        proximity: Math.max(0, Math.round((1 - d) * 100)),
        contribution,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.proximity - a.proximity || a.distance - b.distance);
}

/**
 * Détecte les tensions (pas des contradictions !) : dimensions dont les
 * positions sont très contrastées ≥ 0.65 d'écart d'un côté « étatique »
 * et de l'autre « libéral », etc.
 * Renvoie une liste [{pair:[A,B], gap, description}]
 */
const TENSION_PAIRS = [
  {
    dims: ['ECONOMIE', 'LIBERTES'],
    desc: 'un fort interventionnisme économique combiné à un attachement aux libertés individuelles',
  },
  {
    dims: ['AUTORITE', 'LIBERTES'],
    desc: 'une attitude ferme sur la sécurité tout en protégeant la vie privée',
  },
  {
    dims: ['INTERNATIONAL', 'ECONOMIE'],
    desc: 'des positions calibrées entre ouverture et protection selon le domaine',
  },
  {
    dims: ['SOCIETE', 'LIBERTES'],
    desc: 'des préférences en tension entre norme collective et autonomie',
  },
  {
    dims: ['ECOLOGIE', 'ECONOMIE'],
    desc: 'une ambition écologique élevée et une prudence sur les coûts économiques',
  },
];

export function detectTensions(scores, coverage) {
  const tensions = [];
  for (const { dims, desc } of TENSION_PAIRS) {
    const [a, b] = dims;
    if (scores[a] != null && scores[b] != null &&
        coverage[a] > COVERAGE_MIN * 0.7 && coverage[b] > COVERAGE_MIN * 0.7) {
      const gap = Math.abs(scores[a] - scores[b]);
      // Une tension exige que les deux positions soient affirmées (loin du
      // milieu) ET opposées entre elles.
      const affirmed = (v) => v != null && (v < 0.35 || v > 0.65);
      if (gap >= 0.5 && affirmed(scores[a]) && affirmed(scores[b])) {
        tensions.push({ pair: dims, gap, description: desc });
      }
    }
  }
  return tensions.sort((x, y) => y.gap - x.gap);
}

/** Génère un titre de portrait à partir des dimensions réelles.
 *  Ne s'appuie que sur des dimensions FIABLES (couvertes au-delà du seuil) :
 *  une dimension fragile ne doit jamais orienter le titre. */
export function generateProfileTitle(scores, coverage) {
  const has = (dim) => scores[dim] != null && (coverage[dim] ?? 0) > COVERAGE_MIN;

  const e = has('ECONOMIE') ? scores.ECONOMIE : null;
  const s = has('SOCIETE') ? scores.SOCIETE : null;
  const ec = has('ECOLOGIE') ? scores.ECOLOGIE : null;

  // Répartition plus fine du titre : 4 quadrants × intensités
  const isState = e != null && e > 0.6;
  const isMarket = e != null && e < 0.4;
  const isProgress = s != null && s < 0.4;
  const isTradition = s != null && s > 0.6;

  if (isState && isProgress) return 'Un attachement à la solidarité collective, avec une vision ouverte de la société';
  if (isState && isTradition) return 'Une confiance dans l’État protecteur, avec le respect des traditions';
  if (isMarket && isProgress) return 'Un libéralisme social : marché assumé, société ouverte';
  if (isMarket && isTradition) return 'Une vision de marché encadré par la continuité sociale';
  if (isState) return 'Une lecture redistributrice des problèmes publics';
  if (isMarket) return 'Une préférence pour l’autonomie économique et la responsabilité individuelle';
  if (ec != null && ec < 0.35) return 'Une priorité donnée à l’urgence écologique';
  return 'Un équilibre entre plusieurs visions de la société';
}

/** Texte narratif, en langage naturel, à partir des dimensions.
 *  Chaque phrase ne s'affiche que si la dimension est FIABLE (couverture
 *  au-delà du seuil) : une dimension fragile n'est jamais présentée
 *  comme une conviction. */
export function generateNarrative(scores, coverage) {
  const parts = [];
  const has = (dim) => scores[dim] != null && (coverage[dim] ?? 0) > COVERAGE_MIN;
  const push = (dim, cond, txt) => { if (has(dim) && cond) parts.push(txt); };

  push('ECONOMIE', scores.ECONOMIE > 0.65,
    'tu accordes une place centrale à l’intervention publique et à la redistribution');
  push('ECONOMIE', scores.ECONOMIE < 0.35,
    'tu privilégies le marché, l’initiative privée et des prélèvements limités');
  push('LIBERTES', scores.LIBERTES < 0.35,
    'tu places la liberté individuelle et la vie privée au premier plan');
  push('LIBERTES', scores.LIBERTES > 0.7,
    'tu acceptes un encadrement des choix de vie au nom du progrès collectif');
  push('AUTORITE', scores.AUTORITE > 0.65,
    'tu attends de l’État qu’il assure fortement l’ordre et la sanction');
  push('AUTORITE', scores.AUTORITE < 0.3,
    'tu privilégies la prévention et les garanties individuelles face à la sanction');
  push('ECOLOGIE', scores.ECOLOGIE < 0.35,
    'tu donnes la priorité à l’urgence écologique, même coûteuse');
  push('ECOLOGIE', scores.ECOLOGIE > 0.7,
    'tu gardes un œil sur les coûts économiques de la transition');
  push('SOCIETE', scores.SOCIETE < 0.35,
    'tu souhaites une évolution ouverte des normes sociales');
  push('SOCIETE', scores.SOCIETE > 0.7,
    'tu restes attaché aux repères traditionnels de la société');
  push('IMMIGRATION', scores.IMMIGRATION < 0.3,
    'tu défends un accueil large et des voies d’intégration facilitées');
  push('IMMIGRATION', scores.IMMIGRATION > 0.7,
    'tu souhaites un contrôle strict des flux migratoires');
  push('INSTITUTIONS', scores.INSTITUTIONS < 0.35,
    'tu veux renforcer la participation citoyenne et les contre-pouvoirs');
  push('INSTITUTIONS', scores.INSTITUTIONS > 0.7,
    'tu valorises un exécutif fort et la continuité institutionnelle');
  push('INTERNATIONAL', scores.INTERNATIONAL < 0.3,
    'tu fais confiance à la coopération et aux institutions internationales');
  push('INTERNATIONAL', scores.INTERNATIONAL > 0.7,
    'tu places la souveraineté nationale au-dessus des engagements internationaux');
  push('JUSTICE', scores.JUSTICE < 0.35,
    'tu vises l’égalité des résultats, pas seulement des chances');
  push('JUSTICE', scores.JUSTICE > 0.7,
    'tu comptes d’abord sur le mérite individuel et l’égalité des chances');
  push('TRAVAIL', scores.TRAVAIL < 0.3,
    'tu défends un droit du travail protecteur et des services publics développés');
  push('TRAVAIL', scores.TRAVAIL > 0.7,
    'tu penches pour plus de flexibilité et des prestations recentrées');

  let text;
  if (parts.length === 0) {
    text = 'Tes réponses s’organisent autour d’un centre de gravité modéré, sans dominance forte sur une dimension.';
  } else {
    text = 'Ce qui ressort de tes réponses : ' + parts.slice(0, 4).join(' ; ') + '.';
    if (parts.length > 4) {
      text += ' Par ailleurs, ' + parts.slice(4).join(' ; ') + '.';
    }
  }
  text += ' Ce tableau reflète tes choix dans le questionnaire, pas une vérité intérieure ou un verdict.';
  return text;
}

/** Quelques questions de réflexion, adaptées aux écarts manquants / neutres. */
export function generateReflectionQuestions(scores, coverage, answers, questionBank = questions) {
  const suggestions = [];
  // 1. dimensions peu couvertes → inviter à les approfondir
  const thin = DIMENSION_IDS
    .filter((d) => coverage[d] < COVERAGE_MIN)
    .slice(0, 2);
  for (const dim of thin) {
    const q = questionBank.find((q) =>
      q.options.some((o) => Object.keys(o.scores).some((k) => k === dim)));
    if (q) suggestions.push({
      type: 'dimension-peu-explorée',
      dimension: dim,
      question: `Tu as peu répondu sur « ${dim} ». Es-tu convaincu que ${' ta position actuelle'} est juste, ou as-tu préféré ne pas trancher ?`,
    });
  }
  // 2. réponses « incertain » → proposer d'y retourner
  const uncertainIds = Object.entries(answers)
    .filter(([, v]) => v === 'uncertain')
    .map(([id]) => id);
  for (const id of uncertainIds.slice(0, 2)) {
    const q = questionBank.find((q) => q.id === id);
    if (q) suggestions.push({ type: 'réponse-incertaine', questionId: id, question: q.statement });
  }
  // 3. questions d'arbitrage génériques selon les masses
  if (scores.ECONOMIE > 0.6 && scores.ECOLOGIE > 0.6) {
    suggestions.push({
      type: 'arbitrage',
      question: 'Comment arbitrerais-tu entre des mesures écologiques coûteuses et la protection du pouvoir d’achat des plus modestes ?',
    });
  }
  if (scores.LIBERTES > 0.6 && scores.AUTORITE > 0.6) {
    suggestions.push({
      type: 'arbitrage',
      question: 'Où placerais-tu la frontière entre la protection de la vie privée et les pouvoirs de l’État pour la sécurité ?',
    });
  }
  if (scores.INTERNATIONAL > 0.6 && scores.ECONOMIE < 0.4) {
    suggestions.push({
      type: 'arbitrage',
      question: 'Une économie protégée peut-elle rester compétitive sans accords internationaux ? Où placerais-tu la limite ?',
    });
  }
  return suggestions.slice(0, 5);
}

/**
 * Pipeline principal.
 * @returns un objet complet pour la page résultats.
 */
export function computeResults(answers) {
  const { scores, coverage, contributions, neutralCount } = calculateDimensionScores(answers);
  const proximities = calculateCurrentProximities(scores, coverage);
  const tensions = detectTensions(scores, coverage);
  const profileTitle = generateProfileTitle(scores, coverage);
  const narrative = generateNarrative(scores, coverage);
  const reflectionQuestions = generateReflectionQuestions(scores, coverage, answers);

  const answeredCount = Object.values(answers)
    .filter((v) => v !== undefined && v !== null).length;
  const totalQuestions = questions.length;

  return {
    scores,
    coverage,
    neutralCount,
    proximities,
    tensions,
    profileTitle,
    narrative,
    reflectionQuestions,
    meta: {
      answeredCount,
      totalQuestions,
      insufficient: proximities.length === 0,
      generatedAt: new Date().toISOString(),
    },
    contributions,
  };
}
