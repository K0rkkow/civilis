/**
 * CIVILIS — Partis politiques français (module séparé, facultatif)
 * ----------------------------------------------------------------------------
 * MODULE DISTINCT : il n'intervient PAS dans le calcul des courants.
 * Les positions sont des reconstructions à partir des programmes officiels
 * récents (présidentielles 2022, législatives 2024). Ce sont des
 * simplifications nécessaires : un parti n'est pas homogène.
 *
 * POUR LA MISE À JOUR : chaque entrée cite le programme utilisé. Les positions
 * restent des choix éditoriaux assumés et vérifiables en lisant les programmes.
 * RCCDP = date de dernière relecture de la donnée.
 */
const LAST_UPDATE = '2024-07 (programmes législatives 2024)';

export const parties = [
  {
    id: 'lfi',
    name: 'La France insoumise',
    shortName: 'LFI',
    family: 'Gauche radicale',
    color: '#9B5541',
    program: 'L’Avenir en commun (2022) · contrat NFP (2024)',
    lastUpdate: LAST_UPDATE,
    description: 'Partage des richesses, planification écologique, VIe République parlementaire et rupture avec les traités européens actuels.',
    position: {
      ECONOMIE: 0.9, LIBERTES: 0.65, AUTORITE: 0.25, SOCIETE: 0.7,
      IMMIGRATION: 0.2, ECOLOGIE: 0.65, INSTITUTIONS: 0.2,
      INTERNATIONAL: 0.75, JUSTICE: 0.9, TRAVAIL: 0.9,
    },
  },
  {
    id: 'eelv',
    name: 'Les Écologistes',
    shortName: 'EÉLV',
    family: 'Écologie politique',
    color: '#5F7346',
    program: 'Programme des européennes 2024 · accords NFP 2024',
    lastUpdate: LAST_UPDATE,
    description: 'Planification écologique, sobriété, justice climatique et antispécisme ; position progressiste sur les questions de société.',
    position: {
      ECONOMIE: 0.75, LIBERTES: 0.7, AUTORITE: 0.2, SOCIETE: 0.8,
      IMMIGRATION: 0.2, ECOLOGIE: 0.95, INSTITUTIONS: 0.3,
      INTERNATIONAL: 0.2, JUSTICE: 0.8, TRAVAIL: 0.75,
    },
  },
  {
    id: 'ps',
    name: 'Parti socialiste',
    shortName: 'PS',
    family: 'Social-démocratie',
    color: '#B18A43',
    program: 'L’Europe au cœur (européennes 2024) · NFP 2024',
    lastUpdate: LAST_UPDATE,
    description: 'Redistribution modérée, services publics sauvegardés, ancrage européen résolu et volontarisme climatico-industriel.',
    position: {
      ECONOMIE: 0.7, LIBERTES: 0.65, AUTORITE: 0.35, SOCIETE: 0.7,
      IMMIGRATION: 0.3, ECOLOGIE: 0.65, INSTITUTIONS: 0.4,
      INTERNATIONAL: 0.15, JUSTICE: 0.75, TRAVAIL: 0.8,
    },
  },
  {
    id: 'pcf',
    name: 'Parti communiste français',
    shortName: 'PCF',
    family: 'Communisme démocratique',
    color: '#8C3B34',
    program: 'Programme législatives 2024 (VCIM)',
    lastUpdate: LAST_UPDATE,
    description: 'Intervention publique forte, salaires et retraites défendus, nucléaire assumé, position souverainiste sur l’industrie.',
    position: {
      ECONOMIE: 0.95, LIBERTES: 0.55, AUTORITE: 0.3, SOCIETE: 0.6,
      IMMIGRATION: 0.35, ECOLOGIE: 0.45, INSTITUTIONS: 0.35,
      INTERNATIONAL: 0.6, JUSTICE: 0.9, TRAVAIL: 0.95,
    },
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    shortName: 'RE',
    family: 'Centre libéral pro-européen',
    color: '#3E5C76',
    program: 'Besoin d’Europe (européennes 2024) · bilan présidentiel 2022',
    lastUpdate: LAST_UPDATE,
    description: 'Offre de travail, réforme des retraites à 64 ans, nucléaire relancé, Europe intégrée et ordre régalien renforcé.',
    position: {
      ECONOMIE: 0.35, LIBERTES: 0.55, AUTORITE: 0.6, SOCIETE: 0.5,
      IMMIGRATION: 0.55, ECOLOGIE: 0.5, INSTITUTIONS: 0.7,
      INTERNATIONAL: 0.15, JUSTICE: 0.5, TRAVAIL: 0.35,
    },
  },
  {
    id: 'modem',
    name: 'MoDem',
    shortName: 'MoDem',
    family: 'Centre humaniste',
    color: '#9C7B4F',
    program: 'Projet démocrate (européennes 2024)',
    lastUpdate: LAST_UPDATE,
    description: 'Proportionnelle, décentralisation, école primaire prioritaire et libéralisme économique tempéré.',
    position: {
      ECONOMIE: 0.45, LIBERTES: 0.6, AUTORITE: 0.45, SOCIETE: 0.55,
      IMMIGRATION: 0.45, ECOLOGIE: 0.55, INSTITUTIONS: 0.35,
      INTERNATIONAL: 0.15, JUSTICE: 0.55, TRAVAIL: 0.55,
    },
  },
  {
    id: 'lr',
    name: 'Les Républicains',
    shortName: 'LR',
    family: 'Droite conservatrice et libérale',
    color: '#2F4360',
    program: 'Le Sursaut républicain (européennes 2024) · projet présidentiel 2022',
    lastUpdate: LAST_UPDATE,
    description: 'Baisse massive des impôts, autorité régalienne, immigration restreinte, Ve République préservée.',
    position: {
      ECONOMIE: 0.2, LIBERTES: 0.45, AUTORITE: 0.85, SOCIETE: 0.25,
      IMMIGRATION: 0.8, ECOLOGIE: 0.35, INSTITUTIONS: 0.7,
      INTERNATIONAL: 0.45, JUSTICE: 0.35, TRAVAIL: 0.25,
    },
  },
  {
    id: 'rn',
    name: 'Rassemblement national',
    shortName: 'RN',
    family: 'National-souverainiste',
    color: '#5C4A45',
    program: 'Programme de Jordan Bardella (législatives 2024)',
    lastUpdate: LAST_UPDATE,
    description: 'Priorité nationale, fermeture maîtrisée de l’immigration, baisse de la TVA, Europe des nations et autorité repolie.',
    position: {
      ECONOMIE: 0.55, LIBERTES: 0.4, AUTORITE: 0.9, SOCIETE: 0.15,
      IMMIGRATION: 0.95, ECOLOGIE: 0.3, INSTITUTIONS: 0.65,
      INTERNATIONAL: 0.9, JUSTICE: 0.55, TRAVAIL: 0.5,
    },
  },
];

export const getPartyById = (id) => parties.find((p) => p.id === id) || null;
