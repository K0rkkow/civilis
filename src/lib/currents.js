/**
 * CIVILIS — Courants politiques (modèles de référence)
 * ----------------------------------------------------------------------------
 * Chaque courant est un modèle de référence indépendant des partis, avec une
 * position sur les 10 dimensions (échelle [0,1] vers le pôle 100 de chaque
 * dimension, cf. dimensions.js). Ces positions sont des reconstructions
 * idéales-typiques documentées : elles décrivent le corps doctrinal dominant
 * du courant, pas l'opinion moyenne de ses électeurs.
 *
 * Chaque courant déclare :
 * - key, name, family         : identification
 * - summary                   : résumé accessible
 * - traits                    : les ideas partagées (pour la page résultats)
 * - divergences               : points où le courant se distingue des autres
 * - limits                    : limites de l'interprétation (transparence)
 * - position                  : position sur les 10 dimensions
 * Refs doctrinales : le fascisme n'est pas inclus (hors liste demandée).
 */

export const currents = [
  {
    key: 'social-democratie',
    name: 'Social-démocratie',
    family: 'Gauche réformiste',
    summary:
      'Concilier justice sociale et économie de marché par la redistribution, les services publics et le dialogue social.',
    traits: [
      'Redistribution par l’impôt progressif',
      'Services publics et protection sociale forts',
      'Régulation du marché, pas abolition',
      'Ancrage dans les institutions et le syndicalisme',
    ],
    divergences: [
      'Moins anticapitaliste que le socialisme démocratique',
      'Plus étatiste que le libéralisme politique',
    ],
    limits: [
      'Ne décrit ni l’aile écologiste ni l’aile sécuritaire de la famille',
    ],
    position: {
      ECONOMIE: 0.8, LIBERTES: 0.5, AUTORITE: 0.35, SOCIETE: 0.65,
      IMMIGRATION: 0.25, ECOLOGIE: 0.45, INSTITUTIONS: 0.4,
      INTERNATIONAL: 0.25, JUSTICE: 0.8, TRAVAIL: 0.85,
    },
  },
  {
    key: 'socialisme-democratique',
    name: 'Socialisme démocratique',
    family: 'Gauche transformatrice',
    summary:
      'Transformer profondément la propriété et le pouvoir économique par des voies démocratiques, au-delà de la régulation.',
    traits: [
      'Partage du pouvoir économique (salariés, planification démocratique)',
      'Grande nationalisation des secteurs clés',
      'Justice redistributive ambitieuse',
      'Anticapitalisme démocratique (pas révolutionnaire)',
    ],
    divergences: [
      'Plus radicalement anticapitaliste que la social-démocratie',
      'Accepte l’économie de marché sous contrôle démocratique',
    ],
    limits: [
      'La ligne entre socialisme démocratique et communisme varie selon les auteurs',
    ],
    position: {
      ECONOMIE: 0.95, LIBERTES: 0.4, AUTORITE: 0.25, SOCIETE: 0.7,
      IMMIGRATION: 0.2, ECOLOGIE: 0.35, INSTITUTIONS: 0.25,
      INTERNATIONAL: 0.3, JUSTICE: 0.95, TRAVAIL: 0.95,
    },
  },
  {
    key: 'liberalisme-economique',
    name: 'Libéralisme économique',
    family: 'Droite libérale',
    summary:
      'Marché, libre concurrence et impôts bas comme moteurs de la prospérité ; rôle de l’État limité aux fonctions régaliennes.',
    traits: [
      'Impôts faibles et dépenses publiques contenues',
      'Préférence pour la concurrence sur la réglementation',
      'Propriété privée et liberté d’entreprendre',
      'Arbitrage fiscal comme moteur principal',
    ],
    divergences: [
      'Moins attaché aux corps intermédiaires que la démocratie chrétienne',
      'Peut être socialement progressiste (libéral) ou conservateur selon ses branches',
    ],
    limits: [
      'Le libéralisme économique n’implique aucune position sociale précise',
    ],
    position: {
      ECONOMIE: 0.15, LIBERTES: 0.5, AUTORITE: 0.4, SOCIETE: 0.55,
      IMMIGRATION: 0.45, ECOLOGIE: 0.65, INSTITUTIONS: 0.55,
      INTERNATIONAL: 0.3, JUSTICE: 0.3, TRAVAIL: 0.25,
    },
  },
  {
    key: 'liberalisme-politique',
    name: 'Libéralisme politique',
    family: 'Libéral des droits',
    summary:
      'Priorité aux libertés individuelles et à l’État de droit, indépendamment du régime économique.',
    traits: [
      'Liberté d’expression et de conscience',
      'Neutralité de l’État sur les conceptions du bien',
      'État de droit, garanties judiciaires',
      'Tolérance comme principe central',
    ],
    divergences: [
      'Compatible avec un État social (Rawls) ou minimal (Nozick)',
      'Moins enclin à l’encadrement moral que le conservatisme',
    ],
    limits: [
      'Se confond partiellement avec la dimension LIBERTES du questionnaire',
    ],
    position: {
      ECONOMIE: 0.5, LIBERTES: 0.9, AUTORITE: 0.2, SOCIETE: 0.75,
      IMMIGRATION: 0.3, ECOLOGIE: 0.55, INSTITUTIONS: 0.45,
      INTERNATIONAL: 0.25, JUSTICE: 0.5, TRAVAIL: 0.5,
    },
  },
  {
    key: 'conservatisme',
    name: 'Conservatisme',
    family: 'Droite traditionnelle',
    summary:
      'Préserver les institutions, la famille et les repères collectifs éprouvés ; changer lentement et prudemment.',
    traits: [
      'Respect de la tradition et des institutions',
      'Famille et autorité éducative',
      'Prudence face aux réformes rapides',
      'Cohésion nationale comme bien commun',
    ],
    divergences: [
      'Peut accepter une économie régulée (conservatisme paternaliste)',
      'Diffère du souverainisme par le refus du conflit systémique',
    ],
    limits: [
      'Le conservatisme pèse surtout sur SOCIETE, AUTORITE et LIBERTES ; ses positions économiques varient fortement',
    ],
    position: {
      ECONOMIE: 0.45, LIBERTES: 0.25, AUTORITE: 0.7, SOCIETE: 0.15,
      IMMIGRATION: 0.7, ECOLOGIE: 0.45, INSTITUTIONS: 0.6,
      INTERNATIONAL: 0.35, JUSTICE: 0.4, TRAVAIL: 0.45,
    },
  },
  {
    key: 'democratie-chretienne',
    name: 'Démocratie chrétienne',
    family: 'Centre droit humaniste',
    summary:
      'Personnalisme, corps intermédiaires et économie sociale de marché inspirés de la doctrine sociale chrétienne.',
    traits: [
      'Économie sociale de marché (ordolibéralisme teinté)',
      'Subsidiarité : n\'intervient que si la société ne parvient pas seule',
      'Famille, association, syndicat comme piliers',
      'Pro-européanisme historique',
    ],
    divergences: [
      'Plus attachée aux corps intermédiaires que le libéralisme',
      'Plus pragmatique économiquement que le conservatisme',
    ],
    limits: [
      "S'ouvre de plus en plus au progressisme moral dans ses variantes modernes",
    ],
    position: {
      ECONOMIE: 0.4, LIBERTES: 0.45, AUTORITE: 0.5, SOCIETE: 0.35,
      IMMIGRATION: 0.5, ECOLOGIE: 0.5, INSTITUTIONS: 0.55,
      INTERNATIONAL: 0.35, JUSTICE: 0.55, TRAVAIL: 0.6,
    },
  },
  {
    key: 'ecologie-politique',
    name: 'Écologie politique',
    family: 'Verte / écosocialiste',
    summary:
      'Place la limite écologique au centre : décroissance sélective ou croissance verte selon les branches, justice climatique et sobriété.',
    traits: [
      'Urgence climatique et biodiversité prioritaires',
      'Régulation forte ou interdiction des activités fossiles',
      'Justice climatique (nord-sud, générationnelle)',
      'Scepticisme envers le productivisme',
    ],
    divergences: [
      'Le nucléaire divise la famille (écosocialiste vs pragmatique)',
      'Accepte une régulation économique forte (plus que le libéralisme)',
    ],
    limits: [
      'Les branches « croissance verte » et « décroissance » divergent nettement',
    ],
    position: {
      ECONOMIE: 0.7, LIBERTES: 0.55, AUTORITE: 0.25, SOCIETE: 0.75,
      IMMIGRATION: 0.25, ECOLOGIE: 0.95, INSTITUTIONS: 0.35,
      INTERNATIONAL: 0.2, JUSTICE: 0.75, TRAVAIL: 0.7,
    },
  },
  {
    key: 'souverainisme',
    name: 'Souverainisme',
    family: 'National',
    summary:
      'La nation comme cadre indépassable de la justice et de la démocratie : contrôle des frontières, refus de la dépossession européenne.',
    traits: [
      'Contrôle strict des frontières',
      'Priorité nationale (selon ses branches) ou préférence communautaire',
      'Critique des traités européens et du libre-échange',
      'Autorité et cohésion nationale valorisées',
    ],
    divergences: [
      'S’écarte du conservatisme par le conflit du « eux / nous » affiché',
      'Plus étatiste économiquement que le libéralisme économique (statisme de guerre courtisé par la gauche du courant)',
    ],
    limits: [
      'Ne capture ni les positions sur la laïcité, ni les valeurs morales précises',
    ],
    position: {
      ECONOMIE: 0.45, LIBERTES: 0.35, AUTORITE: 0.8, SOCIETE: 0.25,
      IMMIGRATION: 0.95, ECOLOGIE: 0.4, INSTITUTIONS: 0.6,
      INTERNATIONAL: 0.9, JUSTICE: 0.55, TRAVAIL: 0.55,
    },
  },
  {
    key: 'federalisme-europeen',
    name: 'Fédéralisme européen',
    family: 'Européaniste',
    summary:
      'Construire une souveraineté européenne intégrée là où les nations sont trop petites pour les grands défis.',
    traits: [
      'Approfondissement politique de l’UE',
      'Sociales et fiscales européennes (minimal commun)',
      'Défense et climat traités au niveau européen',
      'Parlement européen renforcé',
    ],
    divergences: [
      'S’oppose frontalement au souverainisme',
      'Plus intergouvernemental que le fédéralisme strict',
    ],
    limits: [
      'Met surtout en jeu INTERNATIONAL et INSTITUTIONS ; positions sociales variables',
    ],
    position: {
      ECONOMIE: 0.55, LIBERTES: 0.6, AUTORITE: 0.4, SOCIETE: 0.7,
      IMMIGRATION: 0.35, ECOLOGIE: 0.65, INSTITUTIONS: 0.35,
      INTERNATIONAL: 0.1, JUSTICE: 0.6, TRAVAIL: 0.6,
    },
  },
  {
    key: 'libertarianisme',
    name: 'Libertarianisme',
    family: 'Droite libertaire',
    summary:
      'Minimiser l’État : fiscalité et réglementation fortement réduites, liberté individuelle maximale, y compris sur les mœurs.',
    traits: [
      'Impôts vus comme presque toujours illégitimes',
      'Propriété privée et marché non régulé',
      'Libertés personnelles maximales (drogues, armes, mœurs)',
      'Méfiance profonde envers l’État bureaucratique',
    ],
    divergences: [
      'Plus radical sur les impôts que le libéralisme économique classique',
      'Plus permissif moralement que le conservatisme',
    ],
    limits: [
      'Plus riche en contraintes fiscales que le libéralisme économique classique',
    ],
    position: {
      ECONOMIE: 0.05, LIBERTES: 0.95, AUTORITE: 0.35, SOCIETE: 0.65,
      IMMIGRATION: 0.5, ECOLOGIE: 0.25, INSTITUTIONS: 0.7,
      INTERNATIONAL: 0.45, JUSTICE: 0.15, TRAVAIL: 0.1,
    },
  },
  {
    key: 'gaullisme',
    name: 'Gaullisme',
    family: 'Droite étatique',
    summary:
      'Indépendance nationale, État stratégique et institutions exécutives fortes ; ni libéralisme intégral, ni souverainisme fermé.',
    traits: [
      'Force de frappe et indépendance stratégique',
      'Exécutif fort, Ve République',
      'Interventionnisme public ciblé (secteurs stratégiques)',
      'Plus pro-européen que le souverainisme, moins fédéraliste que le fédéralisme européen',
    ],
    divergences: [
      'Plus étatiste économiquement que le libéralisme',
      'Plus ouvert sur l’Europe que le souverainisme',
    ],
    limits: [
      'Position sur les questions de société très variable, selon les époques',
    ],
    position: {
      ECONOMIE: 0.35, LIBERTES: 0.5, AUTORITE: 0.75, SOCIETE: 0.4,
      IMMIGRATION: 0.55, ECOLOGIE: 0.45, INSTITUTIONS: 0.85,
      INTERNATIONAL: 0.65, JUSTICE: 0.45, TRAVAIL: 0.5,
    },
  },
  {
    key: 'communisme',
    name: 'Communisme',
    family: 'Gauche anticapitaliste',
    summary:
      'Abolir la propriété capitaliste des moyens de production, par la révolution ou des réformes radicales, au nom d’une société sans classes.',
    traits: [
      'Nationalisation généralisée de l’économie',
      'Collectivisme dominant l’initiative individuelle',
      'Anti-impérialisme affiché',
      'Héritage marxiste revendiqué',
    ],
    divergences: [
      'Plus radical que le socialisme démocratique sur la propriété',
      'Accepte parfois un État d’exception (transitoire)',
    ],
    limits: [
      'Le communisme moderne est démocratique et non violent ; les régimes passés (URSS) relevaient d’une autre doctrine au nom du même mot',
    ],
    position: {
      ECONOMIE: 1.0, LIBERTES: 0.45, AUTORITE: 0.45, SOCIETE: 0.65,
      IMMIGRATION: 0.25, ECOLOGIE: 0.4, INSTITUTIONS: 0.3,
      INTERNATIONAL: 0.35, JUSTICE: 1.0, TRAVAIL: 1.0,
    },
  },
  {
    key: 'anarchisme',
    name: 'Anarchisme',
    family: 'Libertaire',
    summary:
      'Réduire la domination (État, capital, patriarcat) : auto-organisation, mutualité et refus de l’autorité coercitive.',
    traits: [
      'Refus de l’État comme institution dominatrice',
      'Auto-organisation et fédéralisme par le bas',
      'Égalité combinée à la liberté',
      'Antimilitarisme',
    ],
    divergences: [
      'S’oppose au communisme d’État ; refuse aussi le marché non régulé',
      'Ne valorise pas les institutions représentatives',
    ],
    limits: [
      'Difficile à cartographier sur les dimensions « étatistes » ; positions idiosyncratiques',
    ],
    position: {
      ECONOMIE: 0.75, LIBERTES: 0.95, AUTORITE: 0.05, SOCIETE: 0.7,
      IMMIGRATION: 0.2, ECOLOGIE: 0.7, INSTITUTIONS: 0.05,
      INTERNATIONAL: 0.25, JUSTICE: 0.75, TRAVAIL: 0.8,
    },
  },
  {
    key: 'centrisme',
    name: 'Centrisme',
    family: 'Centre pragmatique',
    summary:
      'Arbitrer au cas par cas entre marché et État, réformer sans rupture, chercher le compromis et les corps intermédiaires.',
    traits: [
      'Réformisme modéré',
      'Compromis ajusté à la situation économique',
      'Méfiance envers les idéologies radicales',
      'Européanisme pragmatique',
    ],
    divergences: [
      'Moins doctrinal que toutes les autres familles',
      'Accepte de gouverner avec des positions variées',
    ],
    limits: [
      'Centrisme n’est pas une doctrine : c’est l’absence de point fixe',
    ],
    position: {
      ECONOMIE: 0.5, LIBERTES: 0.55, AUTORITE: 0.45, SOCIETE: 0.5,
      IMMIGRATION: 0.45, ECOLOGIE: 0.55, INSTITUTIONS: 0.5,
      INTERNATIONAL: 0.35, JUSTICE: 0.55, TRAVAIL: 0.55,
    },
  },
];

export const getCurrentByKey = (key) => currents.find((c) => c.key === key) || null;
