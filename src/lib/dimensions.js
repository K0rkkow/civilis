/**
 * CIVILIS — Dimensions idéologiques
 * ----------------------------------------------------------------------------
 * 10 dimensions politiques analysées séparément. Chaque score est normalisé
 * sur [0, 1] : 0 = pôle « pole0 », 1 = pôle « pole100 ».
 * Aucune donnée de profil (âge, sexe) n'entre dans le calcul.
 */

export const dimensions = {
  ECONOMIE: {
    id: 'ECONOMIE',
    label: 'Économie',
    pole0: 'Marché et initiative privée',
    pole100: 'Intervention et redistribution publiques',
    description:
      "Rôle de l'État dans l'économie : laisser jouer le marché ou intervenir pour redistribuer la richesse.",
  },
  LIBERTES: {
    id: 'LIBERTES',
    label: 'Libertés individuelles',
    pole0: 'Encadrement des choix au nom du collectif',
    pole100: 'Autonomie et vie privée prioritaires',
    description:
      "Autonomie personnelle, vie privée et liberté d'expression face à l'encadrement des choix de vie.",
  },
  AUTORITE: {
    id: 'AUTORITE',
    label: 'Autorité et sécurité',
    pole0: 'Prévention et libertés civiles',
    pole100: 'Ordre, sanction et pouvoirs renforcés',
    description:
      "Ordre public, sanction et pouvoirs de l'État face à la prévention et aux garanties individuelles.",
  },
  SOCIETE: {
    id: 'SOCIETE',
    label: 'Société et normes',
    pole0: 'Traditions et continuité',
    pole100: 'Évolution des normes, pluralisme',
    description:
      "Traditions, évolution des normes sociales et place du pluralisme dans la société.",
  },
  IMMIGRATION: {
    id: 'IMMIGRATION',
    label: 'Immigration et intégration',
    pole0: 'Accueil large, intégration facilitée',
    pole100: 'Contrôle strict des flux et des conditions',
    description:
      "Contrôle des frontières, conditions d'accueil, d'intégration et d'accès à la citoyenneté.",
  },
  ECOLOGIE: {
    id: 'ECOLOGIE',
    label: 'Écologie',
    pole0: 'Arbitrage économique, transition modérée',
    pole100: 'Transition ambitieuse, contraintes acceptées',
    description:
      "Ambition de la transition écologique : réglementation, énergie, arbitrages économiques acceptés.",
  },
  INSTITUTIONS: {
    id: 'INSTITUTIONS',
    label: 'Institutions et démocratie',
    pole0: 'Participation citoyenne, contre-pouvoirs',
    pole100: 'Exécutif fort et stabilité',
    description:
      'Démocratie représentative ou participative, contre-pouvoirs, concentration ou partage du pouvoir.',
  },
  INTERNATIONAL: {
    id: 'INTERNATIONAL',
    label: 'Nation et monde',
    pole0: 'Coopération et institutions internationales',
    pole100: 'Souveraineté nationale prioritaire',
    description:
      'Souveraineté nationale, alliances, coopération et institutions internationales.',
  },
  JUSTICE: {
    id: 'JUSTICE',
    label: 'Justice et égalité',
    pole0: 'Égalité des chances, mérite',
    pole100: 'Égalité des résultats, redistribution',
    description:
      'Égalité des chances ou des résultats, place du mérite et de la redistribution.',
  },
  TRAVAIL: {
    id: 'TRAVAIL',
    label: 'Travail et services publics',
    pole0: 'Flexibilité, prestations recentrées',
    pole100: 'Droit du travail protecteur, services publics développés',
    description:
      "Droit du travail, santé, éducation et rôle des services collectifs.",
  },
};

export const DIMENSION_IDS = Object.keys(dimensions);
