/**
 * CIVILIS — Banque de questions
 * ----------------------------------------------------------------------------
 * Chaque question déclarative :
 * - id         : identifiant stable
 * - theme      : thème éditorial affiché
 * - statement  : énoncé neutre (pas de double négation, pas de question mixte)
 * - options    : { value, text, scores } où scores = { DIM: valeur [0,1] }
 *                interprétée par rapport au POLE 100 de la dimension
 *                (1 = complètement vers pole100, 0 = pole0).
 * - uncertain  : le choix « je ne sais pas » est toujours proposé ; il n'est
 *                jamais converti en opinion (exclu du calcul).
 *
 * Règles de rédaction appliquées : pas de formulation partisane, pas de
 * double négation, une seule idée par question, place pour la nuance
 * (l'option centrale « équilibre » a toujours un score intermédiaire).
 */

export const questions = [

  /* ================= ÉCONOMIE =========================================== */
  {
    id: 'eco1',
    theme: 'Économie et fiscalité',
    title: 'Financement des services publics',
    context: 'L\'État finance des services comme les hôpitaux, les écoles et la justice grâce notamment aux impôts. Certains pensent qu\'il faudrait augmenter les moyens consacrés à ces services, même si cela implique des recettes supplémentaires. D\'autres estiment qu\'il faut surtout mieux utiliser l\'argent déjà disponible et limiter les dépenses publiques.',
    question: 'Quelle approche te semble la plus pertinente pour financer les services publics ?',
    statement: 'Quelle approche te semble la plus pertinente pour financer les services publics ?',
    options: [
      { value: 'redistribution',    text: 'Augmenter les moyens consacrés aux services publics, quitte à trouver davantage de recettes.',   scores: { ECONOMIE: 0.9, JUSTICE: 0.85 } },
      { value: 'egalite-chances',   text: "Maintenir les moyens actuels et améliorer en priorité l'efficacité des dépenses.",   scores: { ECONOMIE: 0.55, JUSTICE: 0.65 } },
      { value: 'creation-richesse', text: 'Réduire certaines dépenses publiques pour limiter les impôts et la dette.', scores: { ECONOMIE: 0.15, JUSTICE: 0.3 } },
      { value: 'mixte',             text: "Cela dépend des services concernés : je préfère examiner chaque situation séparément.",              scores: { ECONOMIE: 0.55, JUSTICE: 0.55 } },
    ],
  },
  {
    id: 'eco2',
    theme: 'Économie et fiscalité',
    title: 'Impôt sur les hauts revenus',
    context: 'La question de l\'imposition des hauts revenus revient régulièrement dans le débat politique. Certains estiment qu\'une fiscalité élevée sur les plus riches permet de réduire les inégalités et de financer les services publics. D\'autres pensent que cela décourage l\'investissement et l\'innovation, pouvant finalement nuire à l\'économie globale.',
    question: 'Quel niveau d\'imposition des hauts revenus te paraît approprié ?',
    statement: 'Quel niveau d\'imposition des hauts revenus te paraît approprié ?',
    options: [
      { value: 'tre-haut',  text: 'Très élevé (au-delà de 60 %) : contribuer fortement à la réduction des inégalités',    scores: { ECONOMIE: 0.9, JUSTICE: 0.8 } },
      { value: 'haut',      text: 'Élevé (entre 45 % et 60 %) : un juste équilibre entre justice sociale et incitation à l\'effort',      scores: { ECONOMIE: 0.65, JUSTICE: 0.6 } },
      { value: 'modere',    text: 'Modéré (entre 30 % et 45 %) : une approche mesurée qui préserve certaines incitations',     scores: { ECONOMIE: 0.45, JUSTICE: 0.45 } },
      { value: 'bas',       text: 'Faible (en dessous de 30 %) : privilégier l\'initiative individuelle et l\'investissement',     scores: { ECONOMIE: 0.2, JUSTICE: 0.2 } },
      { value: 'pas-impot', text: "Aucun impôt sur le revenu : mettre l\'accent sur d\'autres formes de fiscalité et de contribution",       scores: { ECONOMIE: 0.05, JUSTICE: 0.1 } },
    ],
  },
  {
    id: 'eco3',
    theme: 'Économie et fiscalité',
    title: 'Réponse à une crise économique',
    context: 'Lorsqu\'une économie fait face à une récession sévère, les gouvernements doivent choisir entre différentes stratégies pour relancer l\'activité. Certains privilégient un keynésianisme actif avec de fortes dépenses publiques pour stimuler la demande. D\'autres préfèrent des mesures ciblées pour aider les plus vulnérables sans relancer l\'économie entière. Une troisième approche considère qu\'il faut d\'abord assainir les finances publiques avant de relancer la croissance.',
    question: 'Face à une crise économique grave, quelle stratégie privilégierais-tu ?',
    statement: 'Face à une crise économique grave, quelle stratégie privilégierais-tu ?',
    options: [
      { value: 'relance-public', text: 'De grandes dépenses publiques pour soutenir l\'activité et l\'emploi',        scores: { ECONOMIE: 0.85 } },
      { value: 'cible',          text: 'Un soutien ciblé aux plus fragiles, sans relance massive de l\'économie',       scores: { ECONOMIE: 0.5 } },
      { value: 'rigueur',        text: 'Réduire d\'abord les déficits publics, même si cela ralentit temporairement l\'activité',       scores: { ECONOMIE: 0.15 } },
    ],
  },
  {
    id: 'eco4', theme: 'Économie et fiscalité',
    title: 'Encadrement des prix des produits essentiels',
    context: 'Face à l\'inflation ou à la hausse des prix de certains biens de première nécessité (alimentation, énergie, logement), certains proposent que l\'État intervienne pour fixer des prix maximums afin de protéger le pouvoir d\'achat. D\'autres estiment que ces contrôles créent des pénuries, détériorent la qualité et perturbent le fonctionnement normal du marché.',
    question: 'Faut-il permettre à l\'État d\'encadrer les prix des produits de première nécessité ?',
    statement: 'Faut-il permettre à l\'État d\'encadrer les prix des produits de première nécessité ?',
    options: [
      { value: 'encadrement', text: "Oui, l'État peut encadrer des prix essentiels",                 scores: { ECONOMIE: 0.85 } },
      { value: 'situationnel',text: 'Seulement en situation d\'exception, temporairement',            scores: { ECONOMIE: 0.5 } },
      { value: 'marche',      text: 'Non, le marché fixe mieux les prix que l\'État',                 scores: { ECONOMIE: 0.1 } },
    ],
  },
  {
    id: 'eco5', theme: 'Économie et fiscalité',
    title: 'Nationalisation des secteurs stratégiques',
    context: 'La question de la propriété des entreprises stratégiques (énergie, transports, télécommunications, défense) oppose deux visions : celle d\'un État actionnaire pour garantir l\'indépendance nationale et l\'équité territoriale, et celle du secteur privé présenté comme plus innovant et efficace. Certains secteurs sont considérés comme naturels monopolies ou vitaux pour la souveraineté.',
    question: 'Faut-il que l\'État prenne le contrôle de certaines entreprises stratégiques comme l\'énergie, les réseaux ou la défense ?',
    statement: 'Faut-il que l\'État prenne le contrôle de certaines entreprises stratégiques comme l\'énergie, les réseaux ou la défense ?',
    options: [
      { value: 'etatisation', text: 'Oui, plusieurs secteurs stratégiques doivent être publics',        scores: { ECONOMIE: 0.9, INSTITUTIONS: 0.6 } },
      { value: 'cibles',      text: 'Seulement quelques infrastructures essentielles',                  scores: { ECONOMIE: 0.55 } },
      { value: 'prive',       text: 'Non, l’entreprise privée est plus efficace, même pour les secteurs stratégiques',     scores: { ECONOMIE: 0.1 } },
    ],
  },
  {
    id: 'eco6', theme: 'Économie et fiscalité',
    title: 'Taxation des grands patrimoines',
    context: 'La taxation des hauts patrimoines est proposée pour réduire les inégalités de richesse et financer les services publics. Ses opposants craignent qu\'elle ne pousse les plus fortunés à l\'exil fiscal, qu\'elle décourage l\'entrepreneuriat et l\'accumulation de capital productif.',
    question: 'Faut-il augmenter l\'imposition des grands patrimoines au-delà des niveaux actuels ?',
    statement: 'Faut-il augmenter l\'imposition des grands patrimoines au-delà des niveaux actuels ?',
    options: [
      { value: 'fortement', text: 'Oui, nettement davantage',                  scores: { ECONOMIE: 0.85, JUSTICE: 0.75 } },
      { value: 'un-peu',    text: 'Un peu, sans freiner l’investissement',     scores: { ECONOMIE: 0.55 } },
      { value: 'non',       text: 'Non, l’impôt sur le patrimoine est inefficace', scores: { ECONOMIE: 0.15 } },
    ],
  },

  /* ================= TRAVAIL ============================================ */
  {
    id: 'tra1', theme: 'Travail et entreprises',
    title: 'Protection sociale en cas de licenciement',
    context: 'Le niveau de protection des salariés en cas de licenciement constitue un équilibre délicat : une protection forte apporte sécurité aux travailleurs mais peut décourager les embauches, tandis qu\'une flexibilité accrue facilite l\'adaptation des entreprises aux changements économiques au prix d\'une moindre sécurité individuelle.',
    question: 'Quel niveau de protection juridique pour les salariés en cas de licenciement ?',
    statement: 'Quel niveau de protection juridique pour les salariés en cas de licenciement ?',
    options: [
      { value: 'protection-forte',  text: 'Très protecteur : licenciement difficile et coûteux', scores: { TRAVAIL: 0.9 } },
      { value: 'protection-moyenne',text: 'Une protection moyenne, équilibrée',                   scores: { TRAVAIL: 0.55 } },
      { value: 'flexibilite',       text: 'Plus de flexibilité : licenciement plus simple',      scores: { TRAVAIL: 0.15 } },
    ],
  },
  {
    id: 'tra2', theme: 'Travail et entreprises',
    title: 'Rôle des syndicats en entreprise',
    context: 'Le rôle des syndicats dans l\'entreprise fait débat : certains préconisent un pouvoir fort de négociation et de veto pour protéger efficacement les salariés, d\'autres privilégient le dialogue classique de négociation, tandis que d\'autre encore voient leur rôle comme principalement informatif et consultatif.',
    question: 'Quel rôle les syndicats devraient-ils jouer dans l’entreprise ?',
    statement: 'Quel rôle les syndicats devraient-ils jouer dans l’entreprise ?',
    options: [
      { value: 'role-fort',  text: 'Un rôle fort, avec un droit de veto sur certaines décisions',  scores: { TRAVAIL: 0.9 } },
      { value: 'negociation',text: 'Le rôle de négociation classique',                          scores: { TRAVAIL: 0.55 } },
      { value: 'role-limite',text: "Un rôle limité à l'information",                            scores: { TRAVAIL: 0.15 } },
    ],
  },
  {
    id: 'tra3', theme: 'Travail et entreprises',
    title: 'Niveau du salaire minimum',
    context: 'Le salaire minimum vise à assurer un revenu décent aux travailleurs les moins qualifiés. Ses partisans estiment qu\'il réduit la pauvreté et les inégalités, tandis que ses opposants craignent qu\'il ne détruise des emplois, particulièrement parmi les jeunes et les moins qualifiés, et nuise à la compétitivité des entreprises.',
    question: 'Le salaire minimum doit-il être augmenté significativement, quel que soit le secteur ?',
    statement: 'Le salaire minimum doit-il être augmenté significativement, quel que soit le secteur ?',
    options: [
      { value: 'forte-hausse', text: 'Oui, une hausse forte et généralisée',  scores: { TRAVAIL: 0.9, JUSTICE: 0.7 } },
      { value: 'hausse-moderee',text: 'Une hausse modérée, ajustée par secteur', scores: { TRAVAIL: 0.55 } },
      { value: 'maintien',      text: 'Non, le laisser évoluer par la négociation', scores: { TRAVAIL: 0.2 } },
    ],
  },
  {
    id: 'tra4', theme: 'Travail et entreprises',
    title: 'Durée légale du travail hebdomadaire',
    context: 'La durée légale du travail hebdomadaire fait l\'objet de débats récurrents : une réduction (à 32h ou moins) est vue comme un progrès pour le bien-être et le partage du travail, tandis que le maintien ou l\'augmentation (à 35h ou plus) est présenté comme nécessaire pour la compétitivité et la productivité des entreprises.',
    question: 'Quelle devrait être la durée légale hebdomadaire du travail ?',
    statement: 'Quelle devrait être la durée légale hebdomadaire du travail ?',
    options: [
      { value: '32h',      text: '32 heures ou moins (réduction du temps de travail)', scores: { TRAVAIL: 0.9 } },
      { value: '35h',      text: '35 heures, comme aujourd’hui',                        scores: { TRAVAIL: 0.6 } },
      { value: '39h-plus', text: '39 heures ou plus, pour la compétitivité',            scores: { TRAVAIL: 0.2 } },
    ],
  },
  {
    id: 'tra5', theme: 'Travail et entreprises',
    title: 'Effet des prestations sociales sur l\'incitation au travail',
    context: 'Le débat sur les prestations sociales oppose deux visions : celle qui voit dans une protection généreuse un frein au travail (effet de désincitation) et celle qui considère que sécuriser les trajectoires de vie est un investissement dans le capital humain qui favorise finalement l\'activité et l\'innovation.',
    question: 'Les prestations sociales généreuses découragent-elles le travail ?',
    statement: 'Les prestations sociales généreuses découragent-elles le travail ?',
    options: [
      { value: 'jamais-prestations',   text: 'Non, protéger les gens est un investissement, pas un coût', scores: { TRAVAIL: 0.85, JUSTICE: 0.8 } },
      { value: 'parfois',  text: 'Parfois, il faut ajuster certains dispositifs',             scores: { TRAVAIL: 0.5 } },
      { value: 'souvent',  text: 'Oui, il faut réduire certaines prestations',                scores: { TRAVAIL: 0.15 } },
    ],
  },
  {
    id: 'tra6', theme: 'Travail et entreprises',
    title: 'Développement des services publics et fiscalité',
    context: 'Le développement des services publics (santé, éducation, transports) améliore l\'accès aux services essentiels et réduit les inégalités, mais nécessite des ressources financières qui passent souvent par l\'impôt. Le débat porte sur savoir si ces investissements valent le coût fiscal ou si une recentration sur les missions essentielles serait préférable.',
    question: 'Les services publics (santé, école, transports) doivent-ils être développés même si cela exige plus d’impôts ?',
    statement: 'Les services publics (santé, école, transports) doivent-ils être développés même si cela exige plus d’impôts ?',
    options: [
      { value: 'oui-fort',   text: 'Oui, nettement développés',           scores: { TRAVAIL: 0.9, ECONOMIE: 0.8 } },
      { value: 'oui-modere', text: 'Oui, mais sans augmentation d’impôts', scores: { TRAVAIL: 0.55 } },
      { value: 'non',        text: 'Non, les recentrer sur les missions essentielles', scores: { TRAVAIL: 0.1 } },
    ],
  },

  /* ================= JUSTICE / ÉGALITÉ ================================== */
  {
    id: 'jst1', theme: 'Justice et égalité',
    title: 'Égalité des résultats vs égalité des chances',
    context: 'Le débat sur l\'égalité oppose deux conceptions : l\'égalité des chances (même départ dans la vie) qui met l\'accent sur le mérite et la mobilité sociale, et l\'égalité des résultats (même arrivée) qui vise à corriger les inégalités de fait par la redistribution ou l\'action positive.',
    question: 'Une société juste doit-elle viser davantage l’égalité des résultats que la seule égalité des chances ?',
    statement: 'Une société juste doit-elle viser davantage l’égalité des résultats que la seule égalité des chances ?',
    options: [
      { value: 'resultats', text: 'Oui, l’égalité des résultats est la vraie justice',  scores: { JUSTICE: 0.9 } },
      { value: 'milieu',    text: 'Les deux, selon les domaines',                      scores: { JUSTICE: 0.55 } },
      { value: 'chances',   text: "Non, l'égalité des chances suffit, le mérite doit primer", scores: { JUSTICE: 0.1 } },
    ],
  },
  {
    id: 'jst2', theme: 'Justice et égalité',
    title: 'Taxation des successions importantes',
    context: 'La taxation des héritages vise à réduire la concentration du patrimoine et à promouvoir l\'égalité des chances. Ses opposants considèrent qu\'elle remet en cause le droit de transmettre son patrimoine et peut pénaliser la transmission des entreprises familiales.',
    question: 'Il est juste de taxer davantage les héritages très importants ?',
    statement: 'Il est juste de taxer davantage les héritages très importants ?',
    options: [
      { value: 'fortement', text: 'Oui, beaucoup davantage',              scores: { JUSTICE: 0.85, ECONOMIE: 0.75 } },
      { value: 'modere',    text: 'Un peu, sans excès',                   scores: { JUSTICE: 0.5 } },
      { value: 'non',       text: 'Non, l’héritage est une propriété légitime', scores: { JUSTICE: 0.15 } },
    ],
  },
  {
    id: 'jst3', theme: 'Justice et égalité',
    title: 'Mécanismes de correction des inégalités',
    context: 'Les mécanismes de correction comme les quotas ou les mesures de préférence visent à réparer des inégalités historiques ou systémiques. Leurs défenseurs y voient un outil nécessaire pour l\'égalité réelle, tandis que leurs opposants dénoncent une inversion de la discrimination et une atteinte au principe de mérite.',
    question: 'Les mécanismes de correction (quotas, mesures de préférence) sont-ils acceptables pour rétablir l’égalité entre groupes ?',
    statement: 'Les mécanismes de correction (quotas, mesures de préférence) sont-ils acceptables pour rétablir l’égalité entre groupes ?',
    options: [
      { value: 'favorable',  text: 'Oui, nécessaires pour corriger des inégalités structurelles', scores: { JUSTICE: 0.9 } },
      { value: 'conditionnel',text: 'Acceptables seulement dans des cas précis et temporaires',   scores: { JUSTICE: 0.55 } },
      { value: 'oppose',      text: 'Non, ils sont injustes et contre-productifs',                scores: { JUSTICE: 0.1 } },
    ],
  },
  {
    id: 'jst4', theme: 'Justice et égalité',
    title: 'Discrimination positive dans l\'éducation',
    context: 'Faut-il accorder davantage de moyens aux établissements situés dans des quartiers défavorisés pour compenser les inégalités initiales ? Cette approche vise à réduire l\'écart de performance lié à l\'origine socioéconomique, mais ses opposants préfèrent une allocation stricte au mérite, craignant une moindre efficacité des ressources.',
    question: 'À école égale dans une même ville, faut-il donner plus de moyens aux quartiers défavorisés ?',
    statement: 'À école égale dans une même ville, faut-il donner plus de moyens aux quartiers défavorisés ?',
    options: [
      { value: 'compenser-fort', text: 'Oui, beaucoup plus, jusqu’à compenser largement les écarts', scores: { JUSTICE: 0.9, TRAVAIL: 0.7 } },
      { value: 'compenser-un-peu',text: 'Oui, un peu plus, sans excès',                              scores: { JUSTICE: 0.55 } },
      { value: 'egalite',         text: 'Non, le mérite doit rester le seul critère',                scores: { JUSTICE: 0.15 } },
    ],
  },
  {
    id: 'jst5', theme: 'Justice et égalité',
    title: 'Écarts de salaires dans l\'entreprise',
    context: 'Les écarts de rémunération importants au sein d\'une même entreprise posent une question de justice : sont-ils intrinsèquement injustes, reflétant une valeur différente des individus, ou peuvent-ils être justifiés par des différences de responsabilité, de compétence ou de contribution ?',
    question: 'Les écarts de salaires très importants dans une même entreprise sont-ils injustes en soi ?',
    statement: 'Les écarts de salaires très importants dans une même entreprise sont-ils injustes en soi ?',
    options: [
      { value: 'injuste',  text: 'Oui, ils sont injustes par principe',      scores: { JUSTICE: 0.85 } },
      { value: 'nuance',   text: 'Ils peuvent être justifiés si les fonctions le méritent', scores: { JUSTICE: 0.5 } },
      { value: 'juste',    text: 'Non, ils reflètent la valeur de chacun',   scores: { JUSTICE: 0.15 } },
    ],
  },

  /* ================= SOCIÉTÉ / NORMES =================================== */
  {
    id: 'soc1', theme: 'Société et normes',
    title: 'Évolution des normes sociales',
    context: 'L\'évolution rapide des normes sociales concernant la famille, les rôles de genre ou les mœurs est perçue différemment : certains y voient un progrès vers plus d\'égalité et de libertés individuelles, tandis que d\'autres estiment qu\'elle fragilise des repères collectifs et des valeurs traditionnelles éprouvées.',
    question: 'L\'évolution rapide des normes sociales (famille, rôles, mœurs) est-elle plutôt une bonne chose ?',
    statement: 'L\'évolution rapide des normes sociales (famille, rôles, mœurs) est-elle plutôt une bonne chose ?',
    options: [
      { value: 'favorable',  text: 'Oui, elle traduit un progrès de l’égalité et des libertés', scores: { SOCIETE: 0.9, LIBERTES: 0.7 } },
      { value: 'nuance',     text: 'Bonne sur certains points, excessive sur d’autres',        scores: { SOCIETE: 0.5 } },
      { value: 'defavorable',text: 'Non, elle fragilise des repères collectifs éprouvés',       scores: { SOCIETE: 0.1 } },
    ],
  },
  {
    id: 'soc2', theme: 'Société et normes',
    title: 'Liberté éducative des familles',
    context: 'Face à l\'évolution des normes sociales, les familles doivent-elles conserver la liberté d\'éduquer leurs enfants selon leurs propres convictions, même lorsqu\'elles divergent des valeurs majoritaires ? Cela oppose liberté éducative et cohérence sociale dans un contexte de changement rapide.',
    question: 'Les familles doivent-elles pouvoir élever leurs enfants selon leurs convictions, même si des normes sociales évoluent autour d’elles ?',
    statement: 'Les familles doivent-elles pouvoir élever leurs enfants selon leurs convictions, même si des normes sociales évoluent autour d’elles ?',
    options: [
      { value: 'liberte',    text: 'Oui, la liberté éducative des familles est prioritaire',  scores: { LIBERTES: 0.85, SOCIETE: 0.7 } },
      { value: 'cadre-commun',text: 'Dans un cadre commun qui garantit l’égalité des droits',  scores: { SOCIETE: 0.5, LIBERTES: 0.5 } },
      { value: 'norme-avant',text: 'Non, la norme collective doit primer sur les convictions', scores: { SOCIETE: 0.85, LIBERTES: 0.3 } },
    ],
  },
  {
    id: 'soc3', theme: 'Société et normes',
    title: 'Modèle de soutien à la politique familiale',
    context: 'Le soutien à la politique familiale peut prendre différentes formes : un soutien égal à toutes les formes de famille, un soutien différencié selon les besoins réels (comme pour les parents isolés), ou une priorité donnée au modèle traditionnel familial.',
    question: 'Comment soutenir la politique familiale ?',
    statement: 'Comment soutenir la politique familiale ?',
    options: [
      { value: 'ouvert',   text: 'Même soutien à toutes les formes de famille',                  scores: { SOCIETE: 0.1, LIBERTES: 0.75 } },
      { value: 'besoins',  text: 'Soutien renforcé selon les besoins réels (parents isolés…)',   scores: { SOCIETE: 0.5, TRAVAIL: 0.6 } },
      { value: 'tradition',text: 'Soutien prioritaire au modèle traditionnel (un père, une mère)', scores: { SOCIETE: 0.9 } },
    ],
  },
  {
    id: 'soc4', theme: 'Société et normes',
    title: 'Adaptation aux nouvelles sensibilités sociales',
    context: 'Face à l\'apparition de nouvelles sensibilités sociales, la société doit choisir entre s\'adapter en écoutant et en évoluant avec ces changements, ou préserver la cohésion sociale en encadrant ces évolutions dans des limites acceptables.',
    question: 'La société doit-elle s’adapter aux nouvelles sensibilités plutôt que de les encadrer ?',
    statement: 'La société doit-elle s’adapter aux nouvelles sensibilités plutôt que de les encadrer ?',
    options: [
      { value: 'adaptation', text: 'Oui, elle doit les entendre et s’en nourrir',  scores: { SOCIETE: 0.85, LIBERTES: 0.7 } },
      { value: 'dialogue',  text: 'Par le dialogue, sans céder ni durcir',        scores: { SOCIETE: 0.5 } },
      { value: 'encadrer',  text: 'Non, les encadrer pour préserver la cohésion', scores: { SOCIETE: 0.15 } },
    ],
  },
  {
    id: 'soc5', theme: 'Société et normes',
    title: 'Légalisation de l\'euthanasie',
    context: 'L\'aide active à mourir (euthanasie encadrée) soulève des questions éthiques fondamentales : d\'un côté, le droit à une fin de vie digne et l\'absence de souffrance inutile ; de l\'autre, le respect de la vie jusque\'à son terme naturel et les risques d\'extensions progressives.',
    question: 'L’aide active à mourir (euthanasie encadrée) devrait-elle être légalisée ?',
    statement: 'L’aide active à mourir (euthanasie encadrée) devrait-elle être légalisée ?',
    options: [
      { value: 'legalise',   text: 'Oui, dans des conditions strictement encadrées',      scores: { LIBERTES: 0.85 } },
      { value: 'limitee',    text: 'Seulement pour des souffrances physiques incurables', scores: { LIBERTES: 0.55 } },
      { value: 'interdiction',text: 'Non, la vie doit rester protégée jusqu’au bout',     scores: { LIBERTES: 0.1, SOCIETE: 0.7 } },
    ],
  },

  /* ================= IMMIGRATION ======================================== */
  {
    id: 'imm1', theme: 'Immigration et intégration',
    title: 'Niveau de l\'immigration annuelle',
    context: 'Le nombre annuel de personnes accueillies fait l\'objet de débats : certains souhaitent limiter l\'immigration pour faciliter l\'intégration et préserver des repères culturels, tandis que d\'autres mettent en avant les besoins économiques, les obligations humanitaires ou le renouvellement démographique.',
    question: 'Le nombre de personnes accueillies chaque année sur le territoire devrait-il être plus limité ?',
    statement: 'Le nombre de personnes accueillies chaque année sur le territoire devrait-il être plus limité ?',
    options: [
      { value: 'nettement', text: 'Oui, nettement limité',                        scores: { IMMIGRATION: 0.9, INTERNATIONAL: 0.7 } },
      { value: 'un-peu',    text: 'Un peu, avec des procédures plus sélectives',  scores: { IMMIGRATION: 0.55 } },
      { value: 'non',       text: 'Non, l’accueil actuel est raisonnable ou trop faible', scores: { IMMIGRATION: 0.1 } },
    ],
  },
  {
    id: 'imm2', theme: 'Immigration et intégration',
    title: 'Accès aux services sociaux pour les immigrés',
    context: 'L\'accès aux services sociaux (santé, logement, allocations) pour les personnes immigrées oppose deux principes : la préférence nationale visant à protéger le modèle social et à encourager l\'intégration, et l\'égalité de traitement pour tous les résidents indépendamment de leur origine.',
    question: 'L’accès aux services sociaux devrait-il être réservé aux ressortissants nationaux ?',
    statement: 'L’accès aux services sociaux devrait-il être réservé aux ressortissants nationaux ?',
    options: [
      { value: 'reserve',   text: 'Oui, préférence aux nationaux',              scores: { IMMIGRATION: 0.9, JUSTICE: 0.6 } },
      { value: 'conditions',text: 'Sous conditions de contribution ou de durée', scores: { IMMIGRATION: 0.55 } },
      { value: 'egalite',   text: 'Non, l’égalité de traitement pour tous les résidents', scores: { IMMIGRATION: 0.05, JUSTICE: 0.75 } },
    ],
  },
  {
    id: 'imm3', theme: 'Immigration et intégration',
    title: 'Processus d\'obtention de la nationalité',
    context: 'Les conditions d\'accès à la nationalité opposent deux conceptions : une démarche longue et exigeante (maîtrise de la langue, adhésion aux valeurs, engagement) visant à assurer une intégration efficace, et une procédure facilitée privilégiant la durée de résidence comme principal critère.',
    question: 'Obtenir la nationalité devrait-il rester une démarche longue, exigeante et sélective ?',
    statement: 'Obtenir la nationalité devrait-il rester une démarche longue, exigeante et sélective ?',
    options: [
      { value: 'exigeante', text: 'Oui, exigeante : langue, valeurs, engagement',  scores: { IMMIGRATION: 0.85, SOCIETE: 0.6 } },
      { value: 'normale',   text: 'Une procédure normale, sans exigence renforcée', scores: { IMMIGRATION: 0.5 } },
      { value: 'facilitee', text: 'Facilitée : la durée de résidence suffit',       scores: { IMMIGRATION: 0.1 } },
    ],
  },
  {
    id: 'imm4', theme: 'Immigration et intégration',
    title: 'Approche face aux demandeurs d\'asile',
    context: 'Face aux personnes demandant une protection internationale, trois approches s\'opposent : un accueil élargi avec des procédures humaines et rapides, un équilibre entre respect des engagements internationaux et contrôle strict des flux, ou une fermeture forte même pour ceux fuyant le danger.',
    question: 'Face aux personnes demandant une protection internationale, quelle approche choisir ?',
    statement: 'Face aux personnes demandant une protection internationale, quelle approche choisir ?',
    options: [
      { value: 'accueil',   text: 'Accueillir davantage, avec des procédures rapides et humaines',  scores: { IMMIGRATION: 0.1, INTERNATIONAL: 0.2 } },
      { value: 'equilibre', text: 'Respecter les engagements tout en contrôlant strictement les flux', scores: { IMMIGRATION: 0.5 } },
      { value: 'fermete',   text: 'Limiter fortement l’accueil, même pour des personnes en danger',  scores: { IMMIGRATION: 0.9 } },
    ],
  },
  {
    id: 'imm5', theme: 'Immigration et intégration',
    title: 'Facteurs de l\'intégration des immigrés',
    context: 'L\'intégration des personnes immigrées résulte-t-elle principalement de leur volonté personnelle, ou s\'élabore-t-elle grâce à un engagement partagé où la société fournit également les moyens nécessaires ? Cette question explore l\'équilibre entre responsabilité individuelle et obligation d\'accueil.',
    question: "L'intégration des personnes immigrées dépend-elle surtout de leur volonté ?",
    statement: "L'intégration des personnes immigrées dépend-elle surtout de leur volonté ?",
    options: [
      { value: 'volonte',  text: 'Oui, l’essentiel dépend d’elles',                                   scores: { IMMIGRATION: 0.8, SOCIETE: 0.6 } },
      { value: 'partagee', text: 'Elle se construit à deux : leur engagement et les moyens de la société', scores: { IMMIGRATION: 0.5 } },
      { value: 'societe',  text: "Non, la société doit leur en donner les moyens d'abord",             scores: { IMMIGRATION: 0.15, TRAVAIL: 0.6 } },
    ],
  },

  /* ================= LIBERTÉS =========================================== */
  {
    id: 'lib1', theme: 'Libertés et vie privée',
    title: 'Liberté individuelle et limites étatiques',
    context: 'Le libéralisme classique affirme que l\'État ne devrait pas intervenir dans les choix personnels tant qu\'ils ne nuisent pas à autrui. Une autre perspective estime que l\'État doit protéger certains repères communs et valeurs partagées, même au détriment d\'une liberté absolue.',
    question: "L'État ne doit-il pas imposer de règles sur les choix de vie personnels tant qu'ils ne nuisent pas à autrui ?",
    statement: "L'État ne doit-il pas imposer de règles sur les choix de vie personnels tant qu'ils ne nuisent pas à autrui ?",
    options: [
      { value: 'd’accord',        text: "D'accord, sans exception",                        scores: { LIBERTES: 0.9 } },
      { value: 'nuance',          text: 'D’accord, avec quelques exceptions justifiées',   scores: { LIBERTES: 0.6 } },
      { value: 'pas-d’accord',    text: "Pas d'accord : l'État doit protéger des repères communs", scores: { LIBERTES: 0.15, SOCIETE: 0.7 } },
    ],
  },
  {
    id: 'lib2', theme: 'Libertés et vie privée',
    title: 'Surveillance de masse et vie privée',
    context: 'La surveillance généralisée des communications pour prévenir la criminalité grave oppose deux principes fondamentaux : l\'efficacité sécuritaire versus le droit inviolable à la vie privée. Certains estiment que la sécurité justifie des mesures exceptionnelles, tandis que d\'autres voient dans la vie privée un droit qui ne se négocie pas.',
    question: 'Massivement surveiller les communications pour prévenir des crimes graves peut-il être justifié ?',
    statement: 'Massivement surveiller les communications pour prévenir des crimes graves peut-il être justifié ?',
    options: [
      { value: 'jamais',   text: 'Non, la vie privée ne se négocie pas',                    scores: { LIBERTES: 0.95, AUTORITE: 0.1 } },
      { value: 'justice',  text: 'Seulement avec un accord de juge, au cas par cas',        scores: { LIBERTES: 0.55, AUTORITE: 0.45 } },
      { value: 'oui',      text: 'Oui, la sécurité collective passe avant la vie privée',   scores: { LIBERTES: 0.1, AUTORITE: 0.9 } },
    ],
  },
  {
    id: 'lib3', theme: 'Libertés et vie privée',
    title: 'Modération des contenus par les plateformes',
    context: 'Les plateformes numériques (réseaux sociaux, moteurs de recherche) doivent-elles modérer les contenus selon leur propre jugement éditorial, ou doit-on encadrer cette modération par des règles publiques transparentes, voire imposer des obligations légales ? Cela touche à l\'équilibre entre liberté d\'expression et prévention des contenus dangereux.',
    question: 'Les plateformes (réseaux, moteurs) doivent-elles modérer les contenus comme elles l’entendent ?',
    statement: 'Les plateformes (réseaux, moteurs) doivent-elles modérer les contenus comme elles l’entendent ?',
    options: [
      { value: 'libre',     text: 'Oui, leur liberté éditoriale est légitime',               scores: { LIBERTES: 0.8 } },
      { value: 'encadre',   text: 'Oui, mais sous contrôle public et règles transparentes',  scores: { LIBERTES: 0.5, INSTITUTIONS: 0.55 } },
      { value: 'contraint', text: "Non, l'État doit fixer des obligations fortes",           scores: { LIBERTES: 0.2, AUTORITE: 0.6 } },
    ],
  },
  {
    id: 'lib4', theme: 'Libertés et vie privée',
    title: 'Identité numérique officielle et vie privée',
    context: 'Une identité numérique officielle présentée comme un outil moderne et sécurisé pour faciliter les démarches administratives peut-elle réellement protéger la vie privée, ou devient-elle un instrument de surveillance supplémentaire ? La réponse dépend des garanties mises en place pour limiter son utilisation et protéger les données personnelles.',
    question: 'Une identité numérique officielle est-elle compatible avec la protection de la vie privée ?',
    statement: 'Une identité numérique officielle est-elle compatible avec la protection de la vie privée ?',
    options: [
      { value: 'compatible', text: 'Oui, c’est un outil moderne et sûr',                       scores: { LIBERTES: 0.25, AUTORITE: 0.6 } },
      { value: 'garanties',  text: 'Oui, seulement avec des garanties très fortes',            scores: { LIBERTES: 0.5 } },
      { value: 'risque',     text: 'Non, c’est un risque pour la vie privée',                  scores: { LIBERTES: 0.8 } },
    ],
  },
  {
    id: 'lib5', theme: 'Libertés et vie privée',
    title: 'Liberté d\'expression et contenus choquants',
    context: 'La présentation en public de contenus considérés comme choquants ou offensants oppose deux principes : la liberté d\'expression qui devrait permettre toute forme de communication, et la nécessité de protéger les espaces publics, notamment pour les plus jeunes, en définissant des cadres d\'âge et de circonstances.',
    question: 'Certains contenus jugés choquants doivent-ils pouvoir être présentés librement en public ?',
    statement: 'Certains contenus jugés choquants doivent-ils pouvoir être présentés librement en public ?',
    options: [
      { value: 'libre',    text: 'Oui, la libre expression prime sur la sensibilité',  scores: { LIBERTES: 0.9 } },
      { value: 'cadre',    text: 'Dans un cadre d’âge et de circonstances défini',      scores: { LIBERTES: 0.5, SOCIETE: 0.4 } },
      { value: 'limite',   text: 'Non, certains sujets doivent rester hors espace public', scores: { LIBERTES: 0.15, SOCIETE: 0.8 } },
    ],
  },

  /* ================= AUTORITÉ =========================================== */
  {
    id: 'aut1', theme: 'Autorité et sécurité',
    title: 'Répression vs prévention de la délinquance',
    context: 'La lutte contre la délinquance oppose deux stratégies : celle de la sévérité pénale, qui mise sur l\'effet dissuasif des peines lourdes, et celle de la prévention, qui s\'attaque aux causes profondes de la criminalité (éducation, insertion, logement) plutôt qu\'à ses seules conséquences.',
    question: 'Des peines plus sévères réduisent-elles mieux la délinquance que la prévention ?',
    statement: 'Des peines plus sévères réduisent-elles mieux la délinquance que la prévention ?',
    options: [
      { value: 'severite',  text: 'Oui, la sévérité est un meilleur recours',            scores: { AUTORITE: 0.9 } },
      { value: 'mixte',     text: 'Les deux, selon la situation',                        scores: { AUTORITE: 0.5 } },
      { value: 'prevention',text: 'Non, traiter les causes est plus efficace',           scores: { AUTORITE: 0.1, TRAVAIL: 0.5 } },
    ],
  },
  {
    id: 'aut2', theme: 'Autorité et sécurité',
    title: 'Pouvoirs des forces de l\'ordre et sécurité',
    context: 'La question de l\'étendue des pouvoirs des forces de l\'ordre oppose deux impératifs : l\'efficacité dans la lutte contre la criminalité et le terrorisme, d\'une part, et la protection des libertés individuelles contre les risques d\'abus et de dérives autoritaires, d\'autre part.',
    question: "Les forces de l'ordre doivent-elles disposer de pouvoirs élargis au nom de la sécurité ?",
    statement: "Les forces de l'ordre doivent-elles disposer de pouvoirs élargis au nom de la sécurité ?",
    options: [
      { value: 'elargis',   text: 'Oui, nettement élargis',                 scores: { AUTORITE: 0.9 } },
      { value: 'confirme',  text: 'Elles ont déjà les pouvoirs nécessaires', scores: { AUTORITE: 0.55 } },
      { value: 'limite',    text: 'Non, il faut les encadrer davantage',     scores: { AUTORITE: 0.1, LIBERTES: 0.7 } },
    ],
  },
  {
    id: 'aut3', theme: 'Autorité et sécurité',
    title: 'Réponse pénale pour les mineurs délinquants',
    context: 'Face à un mineur de 16 ans ayant commis un délit grave, trois approches s\'opposent : privilégier l\'éducation et la réinsertion, combiner sanction pénale et suivi éducatif, ou appliquer une peine ferme malgré la minorité. Cela reflète le débat entre protection de l\'enfance et réponse adequée à la gravité des faits.',
    question: 'Un mineur de 16 ans commet un délit grave : quelle réponse paraît la plus adéquate ?',
    statement: 'Un mineur de 16 ans commet un délit grave : quelle réponse paraît la plus adéquate ?',
    options: [
      { value: 'educatif',  text: 'Des mesures éducatives renforcées',                     scores: { AUTORITE: 0.1 } },
      { value: 'mixte',     text: 'Une sanction pénale accompagnée d’un suivi éducatif',   scores: { AUTORITE: 0.55 } },
      { value: 'ferme',     text: 'Une peine ferme possible dès cet âge',                  scores: { AUTORITE: 0.9 } },
    ],
  },
  {
    id: 'aut4', theme: 'Autorité et sécurité',
    title: 'Objectif du système pénitentiaire',
    context: 'Le système pénitentiaire peut poursuivre différents objectifs : faire de la réinsertion sa priorité absolue, équilibrer punition et sécurité, ou considérer que la sanction doit primer sur toute autre considération. Cela reflète le débat entre idéal réparateur et réalité sécuritaire.',
    question: 'La réinsertion après la prison doit-elle être au centre du système pénitentiaire ?',
    statement: 'La réinsertion après la prison doit-elle être au centre du système pénitentiaire ?',
    options: [
      { value: 'centre',  text: 'Oui, c’est l’objectif principal',        scores: { AUTORITE: 0.15, TRAVAIL: 0.6 } },
      { value: 'parmi',   text: 'Un objectif parmi d’autres (punition, sécurité)', scores: { AUTORITE: 0.5 } },
      { value: 'second',  text: 'Non, la sanction doit venir d’abord',     scores: { AUTORITE: 0.85 } },
    ],
  },
  {
    id: 'aut5', theme: 'Autorité et sécurité',
    title: 'Restriction des libertés en état d\'urgence',
    context: 'Face à une crise majeure (épidémie, attentat, etc.), l\'État peut-il déroger provisoirement à certaines libertés ? Trois positions s\'opposent : une restriction large lorsque l\'efficacité l\'exige, une restriction encadrée par un contrôle parlementaire strict et temporaire, ou un refus quasi-absolu de telles mesures quel que soit le niveau de menace.',
    question: 'En crise majeure (épidémie, attentats), l’État peut-il restreindre temporairement des libertés ?',
    statement: 'En crise majeure (épidémie, attentats), l’État peut-il restreindre temporairement des libertés ?',
    options: [
      { value: 'oui-large', text: 'Oui, largement si l’efficacité l’exige',              scores: { AUTORITE: 0.9 } },
      { value: 'oui-encadre',text: 'Oui, mais sous contrôle.parlementaire strict et temporaire', scores: { AUTORITE: 0.55, INSTITUTIONS: 0.6 } },
      { value: 'quasi-jamais',text: 'Quasi jamais, quel que soit le péril',               scores: { AUTORITE: 0.1, LIBERTES: 0.85 } },
    ],
  },
  {
    id: 'aut6', theme: 'Autorité et sécurité',
    title: 'Intervention de l\'armée sur le territoire national',
    context: 'Le recours à l\'armée pour le maintien de l\'ordre sur le territoire national soulève la question de l\'équilibre entre sécurité intérieure et démocratie. Trois positions existent : autoriser l\'intervention quand les forces de l\'ordre sont dépassées, limiter cette possibilité aux cas d\'exception extrême, ou réserver exclusivement ce rôle à la police civile.',
    question: "L'armée doit-elle pouvoir intervenir sur le territoire national pour du maintien de l'ordre ?",
    statement: "L'armée doit-elle pouvoir intervenir sur le territoire national pour du maintien de l'ordre ?",
    options: [
      { value: 'favorable', text: 'Oui, quand la police est dépassée',      scores: { AUTORITE: 0.85 } },
      { value: 'exception', text: 'Seulement dans des cas d’exception extrêmes', scores: { AUTORITE: 0.5 } },
      { value: 'oppose',    text: 'Non, cela relève uniquement de la police', scores: { AUTORITE: 0.1, LIBERTES: 0.6 } },
    ],
  },

  /* ================= ÉCOLOGIE =========================================== */
  {
    id: 'ecol1', theme: 'Écologie et transition',
    title: 'Priorité donnée à la protection de l\'environnement',
    context: 'Face aux enjeux environnementaux, dois-t-on accorder la priorité à la protection de la nature même lorsque cela a un coût économique immédiat (impact sur le pouvoir d\'achat, compétitivité), ou doit-on maintenir l\'arbitrage économique comme critère principal, en estimant que la prospérité permet une meilleure protection à long terme ?',
    question: 'La protection de l’environnement doit-elle primer sur les coûts économiques à court terme ?',
    statement: 'La protection de l’environnement doit-elle primer sur les coûts économiques à court terme ?',
    options: [
      { value: 'priorite',  text: 'Oui, même si cela pèse sur le pouvoir d’achat',  scores: { ECOLOGIE: 0.9 } },
      { value: 'equilibre', text: 'Oui, en compensant les effets sur les ménages',  scores: { ECOLOGIE: 0.6, JUSTICE: 0.5 } },
      { value: 'coût',      text: 'Non, l’arbitrage économique reste prioritaire',  scores: { ECOLOGIE: 0.1 } },
    ],
  },
  {
    id: 'ecol2', theme: 'Écologie et transition',
    title: 'Approche réglementaire environnementale pour les entreprises',
    context: 'Pour réduire l\'impact environnemental des activités économiques, trois approches s\'opposent : des règles sévères obligatoires et contrôlées, des mécanismes incitatifs (taxes environnementales, bonus pour bonnes pratiques) plutôt que des obligations pures, ou la crainte que des normes trop strictes ne rendent l\'activité non compétitive et la délocalisent.',
    question: 'Des règles environnementales sévères pour les entreprises sont-elles nécessaires ?',
    statement: 'Des règles environnementales sévères pour les entreprises sont-elles nécessaires ?',
    options: [
      { value: 'severes',   text: 'Oui, obligatoires et contrôlées',                 scores: { ECOLOGIE: 0.9 } },
      { value: 'incitatives',text: 'Plutôt des incitations (taxes, bonus) que des obligations', scores: { ECOLOGIE: 0.55, ECONOMIE: 0.45 } },
      { value: 'excessives',text: 'Elles deviennent excessives et délocalisent l’activité',   scores: { ECOLOGIE: 0.1 } },
    ],
  },
  {
    id: 'ecol3', theme: 'Écologie et transition',
    title: 'Stratégie de sortie des énergies fossiles',
    context: 'Pour réduire notre dépendance aux énergies fossiles, trois leviers principaux s\'opposent : l\'interdiction progressive des équipements fonctionnant aux énergies fossiles, la taxation des émissions pour laisser les acteurs s\'adapter via le marché, ou le soutien à l\'innovation sans imposer de contraintes techniques spécifiques.',
    question: 'Quel levier privilégier pour sortir des énergies fossiles ?',
    statement: 'Quel levier privilégier pour sortir des énergies fossiles ?',
    options: [
      { value: 'interdiction', text: 'Interdire progressivement les équipements fossiles',        scores: { ECOLOGIE: 0.85 } },
      { value: 'taxe',         text: 'Taxer les émissions et laisser les acteurs s’adapter',      scores: { ECOLOGIE: 0.5, ECONOMIE: 0.55 } },
      { value: 'innovation',   text: 'Soutenir l’innovation, sans contrainte imposée',            scores: { ECOLOGIE: 0.15, ECONOMIE: 0.3 } },
    ],
  },
  {
    id: 'ecol4', theme: 'Écologie et transition',
    title: 'Limites à la consommation pour protéger l\'environnement',
    context: 'Pour réduire l\'impact environnemental de notre consommation, doit-on imposer des limites à certains domaines comme la publicité, les emballages ou les vols courts, ou faut-il laisser chacun libre de ses choix de consommation en estimant que l\'éducation et l\'incitation sont plus efficaces que l\'interdiction ?',
    question: 'Des limites à la consommation (publicité, emballages, vols courts) sont-elles acceptables ?',
    statement: 'Des limites à la consommation (publicité, emballages, vols courts) sont-elles acceptables ?',
    options: [
      { value: 'largement', text: 'Oui, largement et même étendues',   scores: { ECOLOGIE: 0.85, LIBERTES: 0.35 } },
      { value: 'certaines', text: 'Oui, certaines seulement',          scores: { ECOLOGIE: 0.55 } },
      { value: 'non',       text: 'Non, chacun choisit sa consommation', scores: { ECOLOGIE: 0.1, LIBERTES: 0.8 } },
    ],
  },
  {
    id: 'ecol5', theme: 'Écologie et transition',
    title: 'Nucléaire et lutte contre le changement climatique',
    context: 'Le rôle de l\'énergie nucléaire dans la transition climatique est débattu : certains la voient comme une source d\'énergie essentielle et décarbonée, d\'autres comme une énergie utile en complément des renouvelables pendant la transition, tandis que d\'autre prônent sa sortie au profit exclusif des énergies renouvelables.',
    question: 'Le nucléaire est-il une bonne réponse au changement climatique ?',
    statement: 'Le nucléaire est-il une bonne réponse au changement climatique ?',
    options: [
      { value: 'essentiel', text: 'Oui, une énergie essentielle de la transition',  scores: { ECOLOGIE: 0.35 } },
      { value: 'transitoire',text: 'Utile en transition, à côté des renouvelables',  scores: { ECOLOGIE: 0.5 } },
      { value: 'sortie',    text: 'Non, il faut en sortir et miser sur les renouvelables', scores: { ECOLOGIE: 0.8 } },
    ],
  },
  {
    id: 'ecol6', theme: 'Écologie et transition',
    title: 'Évaluation écologique des grands projets d\'infrastructure',
    context: 'Face à l\'urgence écologique, doit-on soumettre systématiquement les grands projets d\'infrastructure (routes, aéroports, etc.) à une évaluation environnementale permettant éventuellement leur interdiction, ou privilégier une approche au cas par cas sans interdiction générale, voire considérer que telles évaluations bloquent inutilement des projets nécessaires ?',
    question: 'Les grands projets d’infrastructure (routes, aéroports) doivent-ils être systématiquement évalués au regard de l’urgence écologique ?',
    statement: 'Les grands projets d’infrastructure (routes, aéroports) doivent-ils être systématiquement évalués au regard de l’urgence écologique ?',
    options: [
      { value: 'systematique', text: 'Oui, avec possibilité d’interdiction',  scores: { ECOLOGIE: 0.85 } },
      { value: 'case-par-case',text: 'Oui, mais au cas par case, sans veto général', scores: { ECOLOGIE: 0.5 } },
      { value: 'excessif',     text: 'Non, ces évaluations bloquent inutilement',  scores: { ECOLOGIE: 0.15 } },
    ],
  },

  /* ================= INSTITUTIONS ======================================= */
  {
    id: 'inst1', theme: 'Démocratie et institutions',
    title: 'Fréquence des référendums sur les décisions importantes',
    context: 'Le recours au référendum pour les décisions politiques importantes soulève la question de son utilité fréquente : certains préfèrent une démocratie directe fréquente pour rapprocher le pouvoir du peuple, d\'autres privilégient des consultations ponctuelles sur les grandes questions, tandis que d\'autre estiment que les élus doivent prendre la plupart des décisions.',
    question: 'Les décisions politiques importantes devraient-elles être régulièrement soumises aux citoyens par référendum ?',
    statement: 'Les décisions politiques importantes devraient-elles être régulièrement soumises aux citoyens par référendum ?',
    options: [
      { value: 'frequent',  text: 'Oui, fréquemment, la démocratie directe d’abord',  scores: { INSTITUTIONS: 0.1 } },
      { value: 'ponctuel',  text: 'Ponctuellement, pour les grandes questions',       scores: { INSTITUTIONS: 0.45 } },
      { value: 'rare',      text: 'Rarement : les élus doivent décider',              scores: { INSTITUTIONS: 0.85 } },
    ],
  },
  {
    id: 'inst2', theme: 'Démocratie et institutions',
    title: 'Réforme du mode de scrutin vers la proportionnelle',
    context: 'Le débat sur le mode de scrutin oppose trois positions : une représentation intégralement proportionnelle pour mieux refléter la diversité des opinions, un système mixte cherchant à concilier proportionalité et stabilité, ou le maintien du scrutin actuel jugé garant de l\'équilibre politique.',
    question: 'Le mode de scrutin actuel devrait-il être remplacé par une représentation plus proportionnelle ?',
    statement: 'Le mode de scrutin actuel devrait-il être remplacé par une représentation plus proportionnelle ?',
    options: [
      { value: 'proportionnelle-integrale', text: 'Oui, une proportionnelle intégrale',       scores: { INSTITUTIONS: 0.1 } },
      { value: 'mixte',                     text: 'Un système mixte plus équitable',          scores: { INSTITUTIONS: 0.4 } },
      { value: 'maintien',                  text: 'Non, le scrutin actuel garantit la stabilité', scores: { INSTITUTIONS: 0.85 } },
    ],
  },
  {
    id: 'inst3', theme: 'Démocratie et institutions',
    title: 'Exécutif fort et stabilité politique',
    context: 'Un exécutif puissant est-il nécessaire à l\'efficacité de l\'action publique, ou doit-il être équilibré par des contre-pouvoirs solides pour prévenir les abus ? Certains estiment qu\'un exécutif fort conditionne l\'action, tandis que d\'autre voient dans l\'excès de pouvoir exécutif une menace pour l\'équilibre démocratique.',
    question: 'Un exécutif fort est-il un gage de stabilité ?',
    statement: 'Un exécutif fort est-il un gage de stabilité ?',
    options: [
      { value: 'oui',     text: 'Oui, c’est une condition de l’action publique',        scores: { INSTITUTIONS: 0.9 } },
      { value: 'conditionnel',text: 'Oui, si les contre-pouvoirs sont bien garantis',    scores: { INSTITUTIONS: 0.55 } },
      { value: 'non',     text: 'Non, il déséquilibre le débat démocratique',           scores: { INSTITUTIONS: 0.1 } },
    ],
  },
  {
    id: 'inst4', theme: 'Démocratie et institutions',
    title: 'Priorité des réformes institutionnelles',
    context: 'Lorsqu\'il faut choisir une réforme institutionnelle prioritaire, trois options s\'opposent : développer la participation citoyenne via des conventions et référendums fréquents, renforcer le Parlement face à l\'exécutif pour un meilleur équilibre des pouvoirs, ou accroître l\'efficacité de l\'exécutif lui-même.',
    question: "Quelle réforme institutionnelle est la plus importante ?",
    statement: "Quelle réforme institutionnelle est la plus importante ?",
    options: [
      { value: 'participation', text: 'Conventions citoyennes et référendums fréquents', scores: { INSTITUTIONS: 0.15 } },
      { value: 'parlement',     text: 'Renforcer le Parlement face à l’exécutif',        scores: { INSTITUTIONS: 0.4 } },
      { value: 'executif',      text: "Rendre l'exécutif encore plus efficace",          scores: { INSTITUTIONS: 0.85 } },
    ],
  },
  {
    id: 'inst5', theme: 'Démocratie et institutions',
    title: 'Droit de manifestation et limites étatiques',
    context: 'Le droit de manifester constitue-t-il une liberté presque absolue dans une démocratie, ou l\'État doit-il pouvoir l\'imiter lorsque l\'ordre public est menacé ? Une troisième position souhaite des réglementations plus strictes qu\'actuellement pour prévenir les troubles.',
    question: 'Les manifestations doivent-elles pouvoir être limitées par l’État ?',
    statement: 'Les manifestations doivent-elles pouvoir être limitées par l’État ?',
    options: [
      { value: 'presque-jamais', text: 'Presque jamais : c’est un droit démocratique',   scores: { INSTITUTIONS: 0.15, LIBERTES: 0.7 } },
      { value: 'ordre',          text: 'Oui, quand l’ordre public est menacé',           scores: { INSTITUTIONS: 0.5, AUTORITE: 0.55 } },
      { value: 'regulierement',  text: 'Oui, plus strictement qu’aujourd’hui',           scores: { INSTITUTIONS: 0.85, AUTORITE: 0.7 } },
    ],
  },
  {
    id: 'inst6', theme: 'Démocratie et institutions',
    title: 'Indépendance de la justice par rapport à l\'exécutif',
    context: 'L\'indépendance judiciaire par rapport au pouvoir exécutif doit-elle être renforcée par une réforme constitutionnelle, est-elle actuellement suffisante pour garantir l\'équilibre des pouvoirs, ou au contraire déjà trop forte au point d\'empêcher l\'exécutif d\'agir efficacement ?',
    question: "L'indépendance de la justice face à l'exécutif doit-elle être renforcée ?",
    statement: "L'indépendance de la justice face à l'exécutif doit-elle être renforcée ?",
    options: [
      { value: 'fortement', text: 'Oui, par une réforme constitutionnelle',  scores: { INSTITUTIONS: 0.15, LIBERTES: 0.6 } },
      { value: 'suffisante',text: 'Elle est suffisante aujourd’hui',          scores: { INSTITUTIONS: 0.55 } },
      { value: 'excessive', text: 'Elle est déjà excessive ; l’exécutif doit pouvoir agir', scores: { INSTITUTIONS: 0.85 } },
    ],
  },

  /* ================= INTERNATIONAL ====================================== */
  {
    id: 'int1', theme: 'La France dans le monde',
    title: 'Impact de l\'appartenance à l\'Union européenne pour la France',
    context: 'L\'adhésion de l\'France à l\'Union européenne est-elle globalement avantageuse, bénéfique seulement à condition d\'une réforme profonde de l\'Union, ou au contraire préjudiciable à la souveraineté nationale française ?',
    question: "L'appartenance à l'Union européenne est-elle globalement bénéfique pour la France ?",
    statement: "L'appartenance à l'Union européenne est-elle globalement bénéfique pour la France ?",
    options: [
      { value: 'benefique',   text: 'Oui, globalement bénéfique',                    scores: { INTERNATIONAL: 0.1 } },
      { value: 'conditionnel',text: 'Bénéfique sous condition d’une réforme profonde', scores: { INTERNATIONAL: 0.45 } },
      { value: 'nuit',        text: 'Non, elle nuit à la souveraineté française',     scores: { INTERNATIONAL: 0.9 } },
    ],
  },
  {
    id: 'int2', theme: 'La France dans le monde',
    title: 'Souveraineté nationale et droit européen',
    context: 'Les décisions européennes doivent-elles pouvoir être rejetées par le Parlement français au nom de la souveraineté nationale, ou vaut-il mieux privilégier la négociation ferme préalable à toute acceptation, voire considérer que le droit européen s\'impose et doit être respecté ?',
    question: 'Les décisions européennes importantes peuvent-elles être rejetées par le Parlement français ?',
    statement: 'Les décisions européennes importantes peuvent-elles être rejetées par le Parlement français ?',
    options: [
      { value: 'oui-souverainiste', text: 'Oui, le Parlement français doit pouvoir s’opposer', scores: { INTERNATIONAL: 0.85 } },
      { value: 'negociation',       text: 'Non, mais une négociation ferme doit précéder chaque acceptation', scores: { INTERNATIONAL: 0.5 } },
      { value: 'respect-droit',     text: 'Non, le droit européen doit être respecté',       scores: { INTERNATIONAL: 0.1 } },
    ],
  },
  {
    id: 'int3', theme: 'La France dans le monde',
    title: 'Stratégie de défense nationale : indépendance vs alliances',
    context: 'La France doit-elle privilégier l\'indépendance nationale en matière de défense, adopter une approche équilibrée combinant défense nationale forte et alliances solides, ou considérer que l\'effort collectif dans le cadre d\'alliances est finalement plus efficace pour sa sécurité ?',
    question: 'La défense nationale doit-elle être renforcée plutôt que de compter sur les alliances ?',
    statement: 'La défense nationale doit-elle être renforcée plutôt que de compter sur les alliances ?',
    options: [
      { value: 'priorite-nationale', text: 'Oui, priorité à l’indépendance nationale',         scores: { INTERNATIONAL: 0.85 } },
      { value: 'complement',         text: 'Les deux : une défense forte dans une alliance solide', scores: { INTERNATIONAL: 0.45 } },
      { value: 'alliances',          text: "Non, l'effort collectif est plus efficace",         scores: { INTERNATIONAL: 0.1 } },
    ],
  },
  {
    id: 'int4', theme: 'La France dans le monde',
    title: 'Impact de la mondialisation pour la France',
    context: 'La mondialisation représente-t-elle une opportunité pour la France lorsqu\'elle est régulée au niveau international, une simple utilité si la France en garde le contrôle souverain, ou une menace nécessitant une protection renforcée de son économie nationale ?',
    question: 'La mondialisation est-elle une chance pour la France ?',
    statement: 'La mondialisation est-elle une chance pour la France ?',
    options: [
      { value: 'chance',   text: 'Oui, si elle est régulée à l’échelle internationale',  scores: { INTERNATIONAL: 0.15 } },
      { value: 'critique', text: 'Utile seulement si la France la régule souverainement', scores: { INTERNATIONAL: 0.55 } },
      { value: 'menace',   text: 'Non, elle exige une protection forte de l’économie',   scores: { INTERNATIONAL: 0.85 } },
    ],
  },
  {
    id: 'int5', theme: 'La France dans le monde',
    title: 'Valorisation de l\'identité nationale dans l\'espace public',
    context: 'L\'expression de l\'identité nationale dans l\'espace public doit-elle être activement promue comme facteur d\'union et d\'affirmation, ou existe-t-elle naturellement sans besoin de politique d\'affichage spécifique, ou l\'universalisme républicain suffit-il à garantir la cohésion nationale ?',
    question: "L'expression de l'identité nationale doit-elle être valorisée dans l'espace public ?",
    statement: "L'expression de l'identité nationale doit-elle être valorisée dans l'espace public ?",
    options: [
      { value: 'valorisee', text: 'Oui, elle fédère et doit être affirmée',    scores: { INTERNATIONAL: 0.85, SOCIETE: 0.7 } },
      { value: 'naturelle', text: 'Elle existe naturellement, sans politique d’affichage', scores: { INTERNATIONAL: 0.5 } },
      { value: 'universaliste', text: "Non, l'universalisme républicain suffit", scores: { INTERNATIONAL: 0.15, SOCIETE: 0.35 } },
    ],
  },

  /* ================= SANTÉ / PROTECTION SOCIALE ========================= */
  {
    id: 'sante1', theme: 'Santé et protection sociale',
    title: 'Mode de financement du système de santé',
    context: 'Le financement du système de santé peut suivre différents modèles : un financement solidaire où chacun contribue selon ses moyens pour un accès selon les besoins, un mélange public et assurances complémentaires, ou un financement principalement privé avec une aide ciblée pour les plus démunis.',
    question: 'Comment financer le système de santé ?',
    statement: 'Comment financer le système de santé ?',
    options: [
      { value: 'solidaire', text: 'Un financement solidaire : chacun selon ses moyens, accès selon les besoins', scores: { TRAVAIL: 0.9, JUSTICE: 0.8 } },
      { value: 'mixte',     text: 'Un financement mixte public-complémentaire',   scores: { TRAVAIL: 0.55 } },
      { value: 'prive',     text: 'Un financement principalement privé avec aide ciblée', scores: { TRAVAIL: 0.1, ECONOMIE: 0.4 } },
    ],
  },
  {
    id: 'sante2', theme: 'Santé et protection sociale',
    title: 'Contrôle étatique des prix des médicaments',
    context: 'La fixation des prix des médicaments soulève trois approches : un contrôle strict par l\'État pour garantir l\'accessibilité, une régulation par la négociation avec les entreprises pharmaceutiques, ou laisser entièrement ce mécanisme aux forces du marché.',
    question: "Le prix des médicaments doit-il être contrôlé par l'État ?",
    statement: "Le prix des médicaments doit-il être contrôlé par l'État ?",
    options: [
      { value: 'strict',    text: 'Oui, strictement contrôlé',                     scores: { TRAVAIL: 0.85 } },
      { value: 'negocie',   text: 'Par la négociation avec les laboratoires',       scores: { TRAVAIL: 0.5 } },
      { value: 'marche',    text: 'Laissé au marché',                              scores: { TRAVAIL: 0.1, ECONOMIE: 0.6 } },
    ],
  },
  {
    id: 'sante3', theme: 'Santé et protection sociale',
    title: 'Régulation des complémentaires santé privées',
    context: 'Les complémentaires santé privées doivent-elles faire l\'objet d\'une régulation forte pour éviter le développement d\'une médecine à deux vitesses, sont-elles déjà suffisamment encadrées, ou le marché doit-il rester libre sans intervention ?',
    question: 'Les complémentaires santé privées doivent-elles être régulées pour éviter une médecine à deux vitesses ?',
    statement: 'Les complémentaires santé privées doivent-elles être régulées pour éviter une médecine à deux vitesses ?',
    options: [
      { value: 'fortement', text: 'Oui, fortement régulées',                    scores: { TRAVAIL: 0.85, JUSTICE: 0.7 } },
      { value: 'deja-encadrees',text: 'Elles sont déjà assez encadrées',         scores: { TRAVAIL: 0.5 } },
      { value: 'libre',     text: 'Non, le marché doit rester libre',            scores: { TRAVAIL: 0.15 } },
    ],
  },
  {
    id: 'ret1', theme: 'Santé et protection sociale',
    title: 'Âge légal de départ à la retraite',
    context: 'L\'âge légal de départ à la retraite fait débat : certains privilégient un départ entre 60 et 62 ans financé autrement que par les cotisations actuelles, d\'autres maintiennent l\'âge de 64 ans comme prévu par les réformes récentes, tandis que d\'autre proposent un report à 68 ans pour équilibrer les comptes ou une variation selon la pénibilité du travail et la carrière effectuée.',
    question: 'L’âge légal de départ à la retraite devrait être…',
    statement: 'L’âge légal de départ à la retraite devrait être…',
    options: [
      { value: '60-62',  text: '60 à 62 ans, financés autrement',       scores: { TRAVAIL: 0.9, JUSTICE: 0.6 } },
      { value: '64',     text: '64 ans, comme le projet actuel',         scores: { TRAVAIL: 0.65 } },
      { value: '68',     text: 'Plus tard (68 ans), pour l’équilibre des comptes', scores: { TRAVAIL: 0.15, ECONOMIE: 0.5 } },
      { value: 'penibilite', text: 'Variable selon la pénibilité et la carrière', scores: { TRAVAIL: 0.4, JUSTICE: 0.45 } },
    ],
  },

  /* ================= ÉCOLE ============================================== */
  {
    id: 'edu1', theme: 'École et éducation',
    title: 'Renforcement de l\'école publique',
    context: 'Pour renforcer l\'école publique, trois voies principales s\'opposent : augmenter nettement les moyens (meilleurs salaires, effectifs réduits), réformer en profondeur l\'autonomie et les standards, ou introduire davantage de choix pour les familles et de concurrence entre établissements.',
    question: 'Comment renforcer l’école publique ?',
    statement: 'Comment renforcer l’école publique ?',
    options: [
      { value: 'moyens',   text: 'Augmenter nettement les moyens (salaires, effectifs réduits)', scores: { TRAVAIL: 0.85, JUSTICE: 0.6 } },
      { value: 'reforme',  text: 'Réformer en profondeur (autonomie, standards)',    scores: { TRAVAIL: 0.45 } },
      { value: 'concurrence',text: 'Ouvrir au choix des familles et à la concurrence', scores: { TRAVAIL: 0.1, ECONOMIE: 0.55 } },
    ],
  },
  {
    id: 'edu2', theme: 'École et éducation',
    title: 'Application de la laïcité à l\'école publique',
    context: 'La laïcité à l\'école publique peut être mise en œuvre de différentes manières : application stricte avec interdiction des signes religieux visibles, recherche d\'un équilibre entre neutralité de l\'État et tolérance discrète, ou approche ouverte prévoyant des accommodements raisonnables.',
    question: 'La laïcité à l’école publique doit-elle être appliquée…',
    statement: 'La laïcité à l’école publique doit-elle être appliquée…',
    options: [
      { value: 'strictement', text: 'Strictement : interdiction des signes religieux visibles', scores: { SOCIETE: 0.8, AUTORITE: 0.5 } },
      { value: 'equilibre',   text: "Avec un équilibre : neutralité de l'État, tolérance discrète", scores: { SOCIETE: 0.5 } },
      { value: 'ouvertement', text: 'De façon ouverte : accommodements raisonnables',  scores: { SOCIETE: 0.2, LIBERTES: 0.65 } },
    ],
  },
  {
    id: 'edu3', theme: 'École et éducation',
    title: 'Financement des écoles religieuses sous contrat',
    context: 'Le financement des écoles religieuses sous contrat soulève trois options : un financement public intégral, un financement partiel soumis à certaines conditions, ou l\'absence totale de financement public.',
    question: 'Les écoles religieuses sous contrat devraient-elles bénéficier…',
    statement: 'Les écoles religieuses sous contrat devraient-elles bénéficier…',
    options: [
      { value: 'financement-plein', text: 'D’un financement public intégral',        scores: { TRAVAIL: 0.6, SOCIETE: 0.65 } },
      { value: 'financement-partiel', text: 'D’un financement partiel sous conditions', scores: { TRAVAIL: 0.5 } },
      { value: 'financement-nul',     text: "D'aucun financement public",              scores: { SOCIETE: 0.15, TRAVAIL: 0.3 } },
    ],
  },
];

/* Helpers */
export const getQuestionById = (id) => questions.find((q) => q.id === id) || null;
export const getQuestionsByTheme = (theme) => questions.filter((q) => q.theme === theme);
