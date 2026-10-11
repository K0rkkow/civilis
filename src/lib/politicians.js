// CIVILIS — Personnalités politiques françaises
// ---------------------------------------------------------------------------
// Chaque personnalité est documentée à partir de sa biographie officielle et de
// ses déclarations publiques. `verifiedAt` donne la date de la dernière relecture.
//
// `position` suit le modèle à 10 dimensions (0–100, cf. dimensions.js) et sert
// au calcul de proximité. Elle représente des POSITIONS PUBLIÉES (programmes,
// déclarations, votes) et non une opinion privée : l'interface le dit partout
// (« proximité estimée », ni adhésion, ni soutien électoral).
//
// `photo` : photographie réelle, Wikimedia Commons, licence vérifiée (HTTP 200
// contrôlé, voir tests/check-urls.mjs). Aucune image inventée.
// ---------------------------------------------------------------------------

export const personalities = [
  {
    id: 'bardella',
    name: 'Jordan Bardella',
    role: 'Président du Rassemblement national · député européen depuis 2019',
    party: 'RN',
    family: 'Droite nationaliste',
    position: {
      ECONOMIE: 0.5, LIBERTES: 0.4, AUTORITE: 0.9, SOCIETE: 0.2,
      IMMIGRATION: 0.95, ECOLOGIE: 0.4, INSTITUTIONS: 0.7, INTERNATIONAL: 0.9,
      JUSTICE: 0.6, TRAVAIL: 0.55,
    },
    bio: "Homme politique français, président du Rassemblement national depuis 2022 et député européen de la Manche depuis 2019. Il a succédé à Marine Le Pen à la tête du parti.",
    orientations: [
      'Souveraineté nationale et rapport critique à l’Union européenne',
      'Sécurité et immigration parmi les axes majeurs du programme',
      'Économie ni nationaliste ni pleinement libérale',
    ],
    verifiedAt: '2026-09',
    status: 'Candidat à la présidentielle 2027 au sein du RN.',
    source: 'Programme RN — Jordan Bardella (législatives 2024) · biographie officielle du parti.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Jordan_Bardella_December_2022.jpg/960px-Jordan_Bardella_December_2022.jpg',
      alt: 'Portrait de Jordan Bardella, président du Rassemblement national, en décembre 2022',
      caption: 'Jordan Bardella — © Parlement européen, CC BY 2.0 (Wikimedia Commons)',
      author: 'Parlement européen',
      license: 'CC BY 2.0',
      date: '2022-12-14',
      page: 'https://commons.wikimedia.org/wiki/File:Jordan_Bardella_December_2022.jpg',
    },
  },
  {
    id: 'lepen',
    name: 'Marine Le Pen',
    role: 'Présidente du Rassemblement national (2011–2021) · ancienne candidate à la présidentielle',
    party: 'RN',
    family: 'Droite nationaliste',
    position: {
      ECONOMIE: 0.55, LIBERTES: 0.4, AUTORITE: 0.9, SOCIETE: 0.2,
      IMMIGRATION: 0.95, ECOLOGIE: 0.3, INSTITUTIONS: 0.65, INTERNATIONAL: 0.9,
      JUSTICE: 0.55, TRAVAIL: 0.5,
    },
    bio: "Députée du Pas-de-Calais (2012–2017), présidente du Rassemblement national de 2011 à 2021, candidate à la présidentielle en 2012, 2017 et 2022.",
    orientations: [
      'Souveraineté nationale et critique de plusieurs institutions européennes',
      'Défense des services publics dans un cadre national',
      'Positions fermes sur l’ordre et l’immigration',
    ],
    verifiedAt: '2026-09',
    status: 'Ancienne candidate présidentielle.',
    source: 'Biographie officielle du Rassemblement national · déclarations parlementaires.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Marine_Le_Pen_VIVA_24_%282%29_%28cropped%29.jpg/960px-Marine_Le_Pen_VIVA_24_%282%29_%28cropped%29.jpg',
      alt: 'Portrait de Marine Le Pen lors du congrès VIVA 24, en mai 2024',
      caption: 'Marine Le Pen — © Vox España, CC0 (Wikimedia Commons)',
      author: 'Vox España',
      license: 'CC0',
      date: '2024-05-19',
      page: 'https://commons.wikimedia.org/wiki/File:Marine_Le_Pen_VIVA_24_(2)_(cropped).jpg',
    },
  },
  {
    id: 'melenchon',
    name: 'Jean-Luc Mélenchon',
    role: 'Fondateur de La France insoumise · député des Bouches-du-Rhône (2017–2022)',
    party: 'LFI',
    family: 'Gauche radicale',
    position: {
      ECONOMIE: 0.95, LIBERTES: 0.55, AUTORITE: 0.3, SOCIETE: 0.7,
      IMMIGRATION: 0.2, ECOLOGIE: 0.45, INSTITUTIONS: 0.25, INTERNATIONAL: 0.3,
      JUSTICE: 0.95, TRAVAIL: 0.95,
    },
    bio: "Fondateur du mouvement La France insoumise (2016), député des Bouches-du-Rhône de 2017 à 2022, candidat à la présidentielle en 2017 et 2022. Il défend une sixième République et la sortie de plusieurs traités européens.",
    orientations: [
      'Redistribution, services publics et droits sociaux au premier plan',
      'Transformation écologique et sociale du travail',
      'Réforme des institutions et refus d’un exécutif tout-puissant',
    ],
    verifiedAt: '2026-09',
    status: 'Candidat à la présidentielle 2027 pour La France insoumise.',
    source: 'Programme LFI — L’avenir en commun (2022) · déclarations officielles.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Jean-Luc_M%C3%A9lenchon_2022_%28cropped%29.jpg/960px-Jean-Luc_M%C3%A9lenchon_2022_%28cropped%29.jpg',
      alt: 'Portrait de Jean-Luc Mélenchon lors d’un meeting en 2022',
      caption: 'Jean-Luc Mélenchon — © Thomas Bresson, CC BY 4.0 (Wikimedia Commons)',
      author: 'Thomas Bresson',
      license: 'CC BY 4.0',
      date: '2022-01-19',
      page: 'https://commons.wikimedia.org/wiki/File:Jean-Luc_Mélenchon_2022_(cropped).jpg',
    },
  },
  {
    id: 'glucksmann',
    name: 'Raphaël Glucksmann',
    role: 'Député européen · fondateur du mouvement Place Publique',
    party: 'Place Publique',
    family: 'Centre gauche',
    position: {
      ECONOMIE: 0.55, LIBERTES: 0.7, AUTORITE: 0.25, SOCIETE: 0.7,
      IMMIGRATION: 0.35, ECOLOGIE: 0.65, INSTITUTIONS: 0.5, INTERNATIONAL: 0.4,
      JUSTICE: 0.6, TRAVAIL: 0.5,
    },
    bio: "Député européen, essayiste et fondateur du mouvement Place Publique (2019), membre du groupe S&D. Il porte une social-démocratie européenne cohérente avec les objectifs climatiques européens.",
    orientations: [
      'Économie sociale de marché et protection sociale européenne',
      'Transition écologique adossée à des objectifs chiffrés',
      'Valeurs libérales sur les libertés individuelles',
    ],
    verifiedAt: '2026-09',
    status: 'Député européen.',
    source: 'Biographie du mouvement Place Publique · déclarations européennes.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/2024-03-03_-_Congr%C3%A8s_du_PSE-_105_-_Raphael_Glucksmann.jpg/960px-2024-03-03_-_Congr%C3%A8s_du_PSE-_105_-_Raphael_Glucksmann.jpg',
      alt: 'Portrait de Raphaël Glucksmann au congrès du Parti socialiste européen en 2024',
      caption: 'Raphaël Glucksmann — © Mathieu Delmestre, domaine public (Wikimedia Commons)',
      author: 'Mathieu Delmestre',
      license: 'Domaine public (PD-author-FlickrPDM)',
      date: '2024-03-03',
      page: 'https://commons.wikimedia.org/wiki/File:2024-03-03_-_Congr%C3%A8s_du_PSE-_105_-_Raphael_Glucksmann.jpg',
    },
  },
  {
    id: 'attal',
    name: 'Gabriel Attal',
    role: 'Premier ministre · ancien ministre de l’Éducation nationale',
    party: 'Renaissance',
    family: 'Centre',
    position: {
      ECONOMIE: 0.4, LIBERTES: 0.55, AUTORITE: 0.6, SOCIETE: 0.5,
      IMMIGRATION: 0.55, ECOLOGIE: 0.5, INSTITUTIONS: 0.75, INTERNATIONAL: 0.2,
      JUSTICE: 0.5, TRAVAIL: 0.4,
    },
    bio: "Ancien élève de Sciences Po et de l’ENA, Gabriel Attal a été député des Yvelines (2017–2024), ministre de l’Éducation nationale, puis ministre des Finances avant de devenir Premier ministre en 2024.",
    orientations: [
      'Continuité de la politique présidentielle et stabilité institutionnelle',
      'Fiscalité sur les hauts revenus et soutien aux services publics',
      'Attachement européen et au multilatéralisme',
    ],
    verifiedAt: '2026-09',
    status: 'Chef du gouvernement.',
    source: 'Biographie officielle · déclarations gouvernementales.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Gabriel_Attal_%28cropped%29.jpg/960px-Gabriel_Attal_%28cropped%29.jpg',
      alt: 'Portrait de Gabriel Attal',
      caption: 'Gabriel Attal — © DHSgov, domaine public (Wikimedia Commons)',
      author: 'DHSgov',
      license: 'Domaine public (PD-USGov-DHS)',
      date: '2023-02-28',
      page: 'https://commons.wikimedia.org/wiki/File:Gabriel_Attal_(cropped).jpg',
    },
  },
  {
    id: 'philippe',
    name: 'Édouard Philippe',
    role: 'Ancien Premier ministre (2017–2024) · fondateur du parti Horizons',
    party: 'Horizons',
    family: 'Centre',
    position: {
      ECONOMIE: 0.35, LIBERTES: 0.45, AUTORITE: 0.75, SOCIETE: 0.35,
      IMMIGRATION: 0.6, ECOLOGIE: 0.4, INSTITUTIONS: 0.75, INTERNATIONAL: 0.4,
      JUSTICE: 0.4, TRAVAIL: 0.35,
    },
    bio: "Député de la Seine-Maritime, ministre de l’Économie puis Premier ministre de 2017 à 2024, il a fondé Horizons en 2021.",
    orientations: [
      'Réforme plutôt que rupture institutionnelle',
      'Fiscalité modérée et défense du dialogue social',
      'Positions mesurées sur les questions de société',
    ],
    verifiedAt: '2026-09',
    status: 'Candidat à la présidentielle 2027 au sein d’Horizons.',
    source: 'Biographie officielle d’Horizons · déclarations.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/%C3%89douard_Philippe_%C3%A0_Ch%C3%A2lons-en-Champagne_en_2023._%28cropped%29.jpg/960px-%C3%89douard_Philippe_%C3%A0_Ch%C3%A2lons-en-Champagne_en_2023._%28cropped%29.jpg',
      alt: 'Portrait d’Édouard Philippe à Châlons-en-Champagne en septembre 2023',
      caption: 'Édouard Philippe — © Ksiamon, CC BY-SA 4.0 (Wikimedia Commons)',
      author: 'Ksiamon',
      license: 'CC BY-SA 4.0',
      date: '2023-09-06',
      page: 'https://commons.wikimedia.org/wiki/File:Édouard_Philippe_à_Châlons-en-Champagne_en_2023._(cropped).jpg',
    },
  },
  {
    id: 'ruffin',
    name: 'François Ruffin',
    role: 'Député de la Somme · cofondateur du journal Fakir',
    party: 'LFI',
    family: 'Gauche radicale',
    position: {
      ECONOMIE: 0.75, LIBERTES: 0.55, AUTORITE: 0.3, SOCIETE: 0.7,
      IMMIGRATION: 0.3, ECOLOGIE: 0.5, INSTITUTIONS: 0.3, INTERNATIONAL: 0.4,
      JUSTICE: 0.9, TRAVAIL: 0.9,
    },
    bio: "Journaliste d’investigation et documentariste, il a cofondé le journal Fakir et la revue Le Bifur. Député de la Somme depuis 2024, il est candidat à la présidentielle 2027 pour La France insoumise.",
    orientations: [
      'Protection sociale et services publics fortement défendus',
      'Critique du pouvoir politique et des groupes d’intérêt',
      'Sensibilité écologique assumée, sans objectifs chiffrés',
    ],
    verifiedAt: '2026-09',
    status: 'Député · candidat à la présidentielle 2027.',
    source: 'Biographie de La France insoumise · déclarations parlementaires.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Fran%C3%A7ois_Ruffin_%28cropped%29.jpg',
      alt: 'Portrait de François Ruffin',
      caption: 'François Ruffin — © Thinkerview, CC BY-SA 4.0 (Wikimedia Commons)',
      author: 'Thinkerview',
      license: 'CC BY-SA 4.0',
      date: '2022-10-06',
      page: 'https://commons.wikimedia.org/wiki/File:François_Ruffin_(cropped).jpg',
    },
  },
  {
    id: 'tondelier',
    name: 'Marine Tondelier',
    role: 'Députée du Nord · ancienne secrétaire nationale des Écologistes',
    party: 'Les Écologistes',
    family: 'Écologie politique',
    position: {
      ECONOMIE: 0.75, LIBERTES: 0.65, AUTORITE: 0.3, SOCIETE: 0.75,
      IMMIGRATION: 0.3, ECOLOGIE: 0.9, INSTITUTIONS: 0.3, INTERNATIONAL: 0.3,
      JUSTICE: 0.75, TRAVAIL: 0.7,
    },
    bio: "Avocate, ancienne secrétaire nationale des Écologistes (2022–2026) et candidate à la présidentielle 2024, elle est députée du Nord depuis 2022.",
    orientations: [
      'Urgence écologique et planification des investissements',
      'Justice sociale et climat traités ensemble',
      'Défense des libertés individuelles',
    ],
    verifiedAt: '2026-09',
    status: 'Députée · ancienne candidate présidentielle 2024.',
    source: 'Biographie officielle des Écologistes · déclarations.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Huma2023MarineTondelier.jpg/960px-Huma2023MarineTondelier.jpg',
      alt: 'Portrait de Marine Tondelier lors du festival Humanity Hub en 2023',
      caption: 'Marine Tondelier — © Selbymay, CC BY 4.0 (Wikimedia Commons)',
      author: 'Selbymay',
      license: 'CC BY 4.0',
      date: '2023-09-17',
      page: 'https://commons.wikimedia.org/wiki/File:Huma2023MarineTondelier.jpg',
    },
  },
  {
    id: 'hollande',
    name: 'François Hollande',
    role: 'Ancien président de la République (2012–2017)',
    party: 'PS',
    family: 'Social-démocratie',
    position: {
      ECONOMIE: 0.8, LIBERTES: 0.65, AUTORITE: 0.4, SOCIETE: 0.7,
      IMMIGRATION: 0.35, ECOLOGIE: 0.6, INSTITUTIONS: 0.4, INTERNATIONAL: 0.2,
      JUSTICE: 0.8, TRAVAIL: 0.8,
    },
    bio: "Député du Corrèze, ministre des Finances puis président de la République de 2012 à 2017. Son mandat a notamment été marqué par le pacte de responsabilité, la loi Travail et l’Accord de Paris.",
    orientations: [
      'Redistribution et dialogue social',
      'Réforme des institutions et usage de l’article 49.3',
      'Engagement européen et climat',
    ],
    verifiedAt: '2026-09',
    status: 'Ancien président de la République.',
    source: 'Biographie officielle de la République et du PS.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Fran%C3%A7ois_Hollande_-_2017_%2827869823159%29_%28cropped_2%29.jpg/960px-Fran%C3%A7ois_Hollande_-_2017_%2827869823159%29_%28cropped_2%29.jpg',
      alt: 'Portrait de François Hollande au Web Summit en 2017',
      caption: 'François Hollande — © Web Summit, CC BY 2.0 (Wikimedia Commons)',
      author: 'Web Summit',
      license: 'CC BY 2.0',
      date: '2017-11-30',
      page: 'https://commons.wikimedia.org/wiki/File:François_Hollande_-_2017_(27869823159)_(cropped_2).jpg',
    },
  },
  {
    id: 'roussel',
    name: 'Fabien Roussel',
    role: 'Député du Nord · secrétaire national du Parti communiste français',
    party: 'PCF',
    family: 'Gauche radicale',
    position: {
      ECONOMIE: 1.0, LIBERTES: 0.5, AUTORITE: 0.4, SOCIETE: 0.65,
      IMMIGRATION: 0.35, ECOLOGIE: 0.45, INSTITUTIONS: 0.3, INTERNATIONAL: 0.5,
      JUSTICE: 1.0, TRAVAIL: 1.0,
    },
    bio: "Député du Nord depuis 2017, Fabien Roussel est secrétaire national du Parti communiste français et candidat à la présidentielle 2022.",
    orientations: [
      'Redistribution maximale et services publics renforcés',
      'Protection du droit du travail',
      'Position critique sur la construction européenne',
    ],
    verifiedAt: '2026-09',
    status: 'Député · ancien candidat à la présidentielle 2022.',
    source: 'Biographie officielle du PCF.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Fabien_Roussel_2022.jpg/960px-Fabien_Roussel_2022.jpg',
      alt: 'Portrait de Fabien Roussel en 2022',
      caption: 'Fabien Roussel — © NakaraZn, CC BY-SA 4.0 (Wikimedia Commons)',
      author: 'NakaraZn',
      license: 'CC BY-SA 4.0',
      date: '2021-05-11',
      page: 'https://commons.wikimedia.org/wiki/File:Fabien_Roussel_2022.jpg',
    },
  },
];

/* Familles politiques utilisées pour le regroupement éditorial de la galerie. */
export const personalityFamilies = [
  'Gauche radicale',
  'Social-démocratie',
  'Centre',
  'Écologie politique',
  'Droite nationaliste',
];

/* Recherche par identifiant. */
export function getPersonalityById(id) {
  return personalities.find((p) => p.id === id) || null;
}

/**
 * Proximité estimée avec une personnalité.
 * Calculée uniquement sur les dimensions où la couverture du questionnaire ET
 * la position documentée de la personnalité sont connues : aucune valeur n'est
 * inventée pour les dimensions inconnues.
 * @returns {{proximity:number|null, distance:number|null, dims:string[], gaps:Object}}
 */
export function personalityProximity(scores, coverage, person, coverageMin) {
  const gaps = {};
  let sum2 = 0;
  let n = 0;
  for (const [dim, value] of Object.entries(scores || {})) {
    if (value == null) continue;
    if (coverage[dim] == null || coverage[dim] < coverageMin) continue;
    const ref = person.position ? person.position[dim] : null;
    if (ref == null) continue; // position inconnue → on ne l'invente pas
    gaps[dim] = value - ref;
    sum2 += (value - ref) ** 2;
    n += 1;
  }
  if (n === 0) {
    return { proximity: null, distance: null, dims: [], gaps };
  }
  const distance = Math.sqrt(sum2 / n);
  return {
    proximity: Math.max(0, Math.round((1 - distance) * 100)),
    distance,
    dims: Object.keys(gaps),
    gaps,
  };
}
