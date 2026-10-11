/**
 * CIVILIS — Mode enfant (5–12 ans)
 * ----------------------------------------------------------------------------
 * Parcours pédagogique distinct, construit SUR la banque de questions existante :
 * - les questions du mode classique ne sont jamais modifiées ;
 * - chaque reformulation réutilise EXACTEMENT les `value` des options d'origine,
 *   donc le moteur de calcul (analysis.js) fonctionne sans aucun changement ;
 * - les questions trop abstraites pour un enfant sont sautées : elles ne
 *   reçoivent aucune réponse et ne sont jamais interprétées comme une opinion
 *   (le moteur ignore naturellement les réponses absentes via la couverture) ;
 * - aucune donnée personnelle supplémentaire n'est collectée : l'âge n'est pas
 *   demandé, le choix du mode est un simple drapeau localStorage réversible.
 *
 * Vérifié par tests/kids.test.mjs (valeurs, couverture des dimensions, moteur).
 */

import { questions } from './questions.js';

/* Questions retenues pour le parcours enfant, dans l'ordre de la banque. */
export const KIDS_QUESTION_IDS = [
  'eco1', 'eco2', 'eco4', 'eco5',
  'tra3', 'tra4', 'tra6',
  'jst1', 'jst4', 'jst5',
  'soc1', 'soc2', 'soc3',
  'imm1', 'imm2', 'imm4', 'imm5',
  'lib1', 'lib2', 'lib3',
  'aut1', 'aut2', 'aut3', 'aut4', 'aut5',
  'ecol1', 'ecol2', 'ecol3', 'ecol4',
  'inst1', 'inst3', 'inst5',
  'int1', 'int3',
  'sante1', 'sante2',
  'ret1',
  'edu1', 'edu2',
];

/* ---------------------------------------------------------------------------
   Reformulations pédagogiques.
   `options` réutilise les `value` d'origine (contrat vérifié par les tests) ;
   l'ordre des options est conservé pour ne pas déformer le sens de la question.
   `explain` est facultatif : une phrase courte, jamais infantilisante.
   --------------------------------------------------------------------------- */
export const KIDS_REWRITES = {

  eco1: {
    explain: 'Un impôt, c\'est de l\'argent que les habitants donnent ensemble pour payer des choses utiles à tous : les écoles, les hôpitaux, les routes.',
    statement: 'Faut-il donner plus d\'argent commun aux écoles et aux hôpitaux, ou en dépenser moins ?',
    options: [
      { value: 'redistribution', text: 'Plus d\'argent pour les écoles et les hôpitaux, même si on doit tous donner un peu plus.' },
      { value: 'egalite-chances', text: 'Garder ce qu\'on donne aujourd\'hui, mais mieux utiliser cet argent.' },
      { value: 'creation-richesse', text: 'Dépenser moins, pour que chacun garde plus d\'argent dans sa poche.' },
      { value: 'mixte', text: 'Ça dépend : oui pour certaines choses, non pour d\'autres.' },
    ],
  },

  eco2: {
    explain: 'Les impôts servent à payer ce qui est utile à tous. Ceux qui gagnent très très gros salaires pourraient en donner une plus grosse part.',
    statement: 'Les personnes qui gagnent énormément d\'argent doivent-elles donner une très grosse part de ce qu\'elles gagnent ?',
    options: [
      { value: 'tre-haut', text: 'Oui, une très grosse part : ceux qui ont le plus aident le plus.' },
      { value: 'haut', text: 'Oui, une grosse part, mais pas trop non plus.' },
      { value: 'modere', text: 'Un peu, comme à peu près tout le monde.' },
      { value: 'bas', text: 'Non, une petite part seulement : chacun garde ce qu\'il gagne.' },
      { value: 'pas-impot', text: 'Non, pas d\'impôt sur ce que les gens gagnent.' },
    ],
  },

  eco4: {
    explain: 'Parfois, le prix de choses très importantes — la nourriture, le chauffage — monte beaucoup.',
    statement: 'Si le pain ou le chauffage deviennent trop chers, est-ce que l\'État doit pouvoir dire : « le prix ne montera pas plus haut » ?',
    options: [
      { value: 'encadrement', text: 'Oui, il peut fixer un prix maximum pour tout le monde.' },
      { value: 'situationnel', text: 'Seulement en cas de gros problème, et pour un petit moment.' },
      { value: 'marche', text: 'Non, les prix se règlent tout seuls, sans l\'État.' },
    ],
  },

  eco5: {
    explain: 'Certaines choses très importantes, comme l\'électricité ou les trains, peuvent être gérées par l\'État (par tout le monde ensemble) ou par des entreprises privées.',
    statement: 'Qui devrait s\'occuper de l\'électricité et des trains : l\'État, ou des entreprises privées ?',
    options: [
      { value: 'etatisation', text: 'L\'État, pour ces services-là et d\'autres encore.' },
      { value: 'cibles', text: 'L\'État seulement pour quelques services très importants.' },
      { value: 'prive', text: 'Des entreprises privées : elles font mieux marcher.' },
    ],
  },

  tra3: {
    explain: 'Quand un adulte travaille, la loi dit qu\'on ne peut pas lui payer moins qu\'un petit minimum : c\'est le « salaire minimum ».',
    statement: 'Ce minimum d\'argent que les travailleurs reçoivent au moins : faut-il l\'augmenter beaucoup ?',
    options: [
      { value: 'forte-hausse', text: 'Oui, beaucoup : tout le monde doit pouvoir bien vivre avec son travail.' },
      { value: 'hausse-moderee', text: 'Oui, un peu, sans casser les petites entreprises.' },
      { value: 'maintien', text: 'Non, le laisser comme il est aujourd\'hui.' },
    ],
  },

  tra4: {
    explain: 'Les adultes en France travaillent en général 35 heures chaque semaine.',
    statement: 'Les adultes devraient-ils travailler moins d\'heures, pareil, ou plus ?',
    options: [
      { value: '32h', text: 'Moins (32 heures ou moins) : plus de temps pour la famille et les loisirs.' },
      { value: '35h', text: 'Pareil qu\'aujourd\'hui (35 heures).' },
      { value: '39h-plus', text: 'Plus (39 heures ou plus) : on ferait plus de choses.' },
    ],
  },

  tra6: {
    explain: 'Les services publics, ce sont les services pour tous : écoles, hôpitaux, bus. Ils sont payés avec l\'argent commun (les impôts).',
    statement: 'Faut-il encore plus d\'écoles, d\'hôpitaux et de transports, même si ça demande de donner plus d\'impôts ?',
    options: [
      { value: 'oui-fort', text: 'Oui, beaucoup plus, même si on paye plus d\'impôts.' },
      { value: 'oui-modere', text: 'Oui, mais sans augmenter les impôts.' },
      { value: 'non', text: 'Non, il faut surtout faire attention à ne pas dépenser trop.' },
    ],
  },

  jst1: {
    explain: 'Il y a deux façons d\'être juste : donner à chacun les mêmes chances au départ, ou faire en sorte que tout le monde finisse à peu près pareil.',
    statement: 'Pour être juste, faut-il surtout que tout le monde parte à égalité, ou que tout le monde arrive à peu près au même endroit ?',
    options: [
      { value: 'resultats', text: 'Que tout le monde arrive à peu près pareil : on aide ceux qui ont moins.' },
      { value: 'milieu', text: 'Un peu les deux, ça dépend des situations.' },
      { value: 'chances', text: 'Que chacun parte à égalité : après, chacun fait ses efforts.' },
    ],
  },

  jst4: {
    explain: null,
    statement: 'Si une école a beaucoup moins de choses que les autres (livres, salles, activités), faut-il lui en donner plus pour rattraper ?',
    options: [
      { value: 'compenser-fort', text: 'Oui, beaucoup plus, jusqu\'à ce qu\'elle soit aussi bien équipée.' },
      { value: 'compenser-un-peu', text: 'Oui, un peu plus.' },
      { value: 'egalite', text: 'Non, exactement la même chose pour toutes les écoles.' },
    ],
  },

  jst5: {
    explain: 'Dans une entreprise, le chef gagne parfois beaucoup plus d\'argent que les personnes qui travaillent avec lui.',
    statement: 'Est-ce juste qu\'un chef gagne très très beaucoup plus que les autres ?',
    options: [
      { value: 'injuste', text: 'Non, c\'est trop : les écarts devraient être plus petits.' },
      { value: 'nuance', text: 'Ça dépend : quelques fois c\'est mérité.' },
      { value: 'juste', text: 'Oui, c\'est normal : il a plus de responsabilités.' },
    ],
  },

  soc1: {
    explain: 'Les façons de vivre ensemble changent avec le temps : les familles, les rôles de chacun, les habitudes.',
    statement: 'Ces changements dans la vie des gens : sont-ils plutôt une bonne chose ?',
    options: [
      { value: 'favorable', text: 'Oui : ça rend les gens plus libres et plus égaux.' },
      { value: 'nuance', text: 'Certains changements sont bien, d\'autres trop rapides.' },
      { value: 'defavorable', text: 'Non : avant, les repères étaient plus clairs.' },
    ],
  },

  soc2: {
    explain: 'Chaque famille a ses habitudes et ses idées. Mais tous les enfants vivent aussi ensemble, à l\'école.',
    statement: 'Les parents doivent-ils pouvoir élever leurs enfants comme ils le souhaitent, même si c\'est différent des autres ?',
    options: [
      { value: 'liberte', text: 'Oui, les parents décident chez eux.' },
      { value: 'cadre-commun', text: 'Oui, mais avec des règles communes pour tous les enfants.' },
      { value: 'norme-avant', text: 'Non, tout le monde doit suivre les mêmes habitudes.' },
    ],
  },

  soc3: {
    explain: 'L\'État peut aider les familles (argent pour les enfants, crèches…). Mais quelles familles aider, et comment ?',
    statement: 'Comment aider les familles ?',
    options: [
      { value: 'ouvert', text: 'Toutes les familles pareil, quelle que soit leur forme.' },
      { value: 'besoins', text: 'Surtout celles qui en ont le plus besoin.' },
      { value: 'tradition', text: 'Surtout les familles les plus classiques (un papa, une maman).' },
    ],
  },

  imm1: {
    explain: 'Des familles viennent parfois d\'autres pays pour vivre en France.',
    statement: 'La France devrait-elle accueillir moins de familles venues d\'ailleurs, ou continuer comme aujourd\'hui ?',
    options: [
      { value: 'nettement', text: 'Beaucoup moins qu\'aujourd\'hui.' },
      { value: 'un-peu', text: 'Un peu moins, en choisissant mieux.' },
      { value: 'non', text: 'Comme aujourd\'hui, ou même un peu plus.' },
    ],
  },

  imm2: {
    explain: 'Les personnes nées ailleurs vivent aussi en France : elles vont à l\'école, chez le médecin, comme tout le monde.',
    statement: 'Les personnes nées ailleurs doivent-elles avoir les mêmes soins et la même aide que tout le monde ?',
    options: [
      { value: 'reserve', text: 'Non, d\'abord les personnes nées ici.' },
      { value: 'conditions', text: 'Seulement si elles vivent ici depuis longtemps ou travaillent.' },
      { value: 'egalite', text: 'Oui, la même chose pour toutes les personnes qui vivent ici.' },
    ],
  },

  imm4: {
    explain: 'Des familles fuient parfois des pays en guerre ou très dangereux. Elles demandent à être protégées ailleurs.',
    statement: 'Des familles fuient un pays dangereux. La France doit-elle en accueillir ?',
    options: [
      { value: 'accueil', text: 'Oui, et en faire plus pour bien les accueillir.' },
      { value: 'equilibre', text: 'Oui, mais en vérifiant bien qui arrive.' },
      { value: 'fermete', text: 'Non, en accueillir beaucoup moins.' },
    ],
  },

  imm5: {
    explain: null,
    statement: 'Un nouvel élève arrive dans ta classe. Il vient d\'un autre pays. Pour qu\'il se sente bien, qui doit faire des efforts ?',
    options: [
      { value: 'volonte', text: 'Surtout lui : s\'il fait des efforts, tout ira bien.' },
      { value: 'partagee', text: 'Lui et nous, tous ensemble.' },
      { value: 'societe', text: 'Surtout nous : on doit l\'aider et lui donner les moyens.' },
    ],
  },

  lib1: {
    explain: 'Chacun fait des choix dans sa vie : ses loisirs, ses idées, sa façon de vivre.',
    statement: 'Tant que ça ne dérange personne d\'autre, chacun doit-il être libre de vivre comme il veut ?',
    options: [
      { value: 'd’accord', text: 'Oui, toujours, sans exception.' },
      { value: 'nuance', text: 'Oui, mais avec quelques règles quand même.' },
      { value: 'pas-d’accord', text: 'Non, il faut des règles communes pour vivre ensemble.' },
    ],
  },

  lib2: {
    explain: 'La vie privée, c\'est ce qui est à toi : tes messages, tes cahiers, tes secrets. Personne ne doit les lire sans demander.',
    statement: 'Pour attraper les voleurs et les gens dangereux, est-ce qu\'on peut lire les messages privés de tout le monde ?',
    options: [
      { value: 'jamais', text: 'Non, jamais : la vie privée, c\'est comme chez soi.' },
      { value: 'justice', text: 'Seulement si un juge dit d\'accord, au cas par cas.' },
      { value: 'oui', text: 'Oui, si ça aide à protéger tout le monde.' },
    ],
  },

  lib3: {
    explain: 'Sur internet, il y a des vidéos gentilles et d\'autres méchantes ou fausses. Les sites peuvent décider d\'enlever des vidéos.',
    statement: 'Sur internet, qui devrait décider d\'enlever les vidéos méchantes ou fausses ?',
    options: [
      { value: 'libre', text: 'Les sites eux-mêmes, comme ils veulent.' },
      { value: 'encadre', text: 'Les sites, mais avec des règles claires pour tous.' },
      { value: 'contraint', text: 'L\'État, avec des règles fortes.' },
    ],
  },

  aut1: {
    explain: 'Quand quelqu\'un ne respecte pas la loi, on peut le punir plus fort, ou essayer de comprendre pourquoi il l\'a fait et l\'aider.',
    statement: 'Pour éviter que les gens fassent des bêtises graves, vaut-il mieux punir plus fort, ou aider avant ?',
    options: [
      { value: 'severite', text: 'Punir plus fort : on a peur de la punition.' },
      { value: 'mixte', text: 'Les deux, selon la situation.' },
      { value: 'prevention', text: 'Aider avant : comprendre et empêcher les problèmes à la source.' },
    ],
  },

  aut2: {
    explain: 'La police protège les gens. Mais elle doit aussi respecter la liberté de chacun.',
    statement: 'La police devrait-elle avoir plus de pouvoir pour protéger, ou faut-il faire attention à la liberté des gens ?',
    options: [
      { value: 'elargis', text: 'Plus de pouvoir : la sécurité d\'abord.' },
      { value: 'confirme', text: 'Elle a déjà ce qu\'il faut.' },
      { value: 'limite', text: 'Moins de pouvoir : la liberté compte aussi.' },
    ],
  },

  aut3: {
    explain: null,
    statement: 'Un adolescent de 16 ans a fait quelque chose de très interdit. Que devrait-il se passer pour lui ?',
    options: [
      { value: 'educatif', text: 'Surtout de l\'aide et de l\'éducation pour repartir du bon pied.' },
      { value: 'mixte', text: 'Une punition, mais aussi des adultes pour l\'aider.' },
      { value: 'ferme', text: 'Une vraie punition, presque comme pour un adulte.' },
    ],
  },

  aut4: {
    explain: 'Quand quelqu\'un sort de prison, il doit recommencer sa vie : trouver un travail, un logement.',
    statement: 'Après la prison, faut-il surtout aider la personne à bien repartir ?',
    options: [
      { value: 'centre', text: 'Oui, c\'est le plus important.' },
      { value: 'parmi', text: 'C\'est important, mais la punition compte aussi.' },
      { value: 'second', text: 'Non, d\'abord la punition ; l\'aide vient après.' },
    ],
  },

  aut5: {
    explain: 'Parfois, il arrive de très gros problèmes à un pays : une épidémie, par exemple.',
    statement: 'Pendant un très gros problème, est-ce qu\'on peut interdire certaines choses, pour un moment ?',
    options: [
      { value: 'oui-large', text: 'Oui, beaucoup de choses s\'il le faut.' },
      { value: 'oui-encadre', text: 'Oui, mais seulement ce qu\'il faut, et pour un temps limité.' },
      { value: 'quasi-jamais', text: 'Presque jamais : la liberté avant tout.' },
    ],
  },

  ecol1: {
    explain: 'Protéger la nature — les forêts, l\'air, l\'eau — coûte parfois cher, et peut rendre certaines choses plus chères.',
    statement: 'Faut-il protéger la nature même si ça coûte cher ?',
    options: [
      { value: 'priorite', text: 'Oui, la nature avant tout, même si c\'est cher.' },
      { value: 'equilibre', text: 'Oui, mais en aidant les familles à payer.' },
      { value: 'coût', text: 'Non, il faut d\'abord que ça coûte moins cher.' },
    ],
  },

  ecol2: {
    explain: 'Les usines et les entreprises peuvent polluer : l\'air, l\'eau, la terre.',
    statement: 'Pour que les entreprises polluent moins, faut-il leur donner des règles très strictes ?',
    options: [
      { value: 'severes', text: 'Oui, des règles strictes, et on vérifie qu\'elles sont respectées.' },
      { value: 'incitatives', text: 'Plutôt des récompenses quand elles polluent moins.' },
      { value: 'excessives', text: 'Non, trop de règles empêchent de travailler.' },
    ],
  },

  ecol3: {
    explain: 'Les voitures à essence polluent l\'air. Beaucoup de pays veulent les remplacer.',
    statement: 'Comment faire partir les voitures qui polluent ?',
    options: [
      { value: 'interdiction', text: 'Les interdire peu à peu : c\'est plus sûr.' },
      { value: 'taxe', text: 'Les rendre plus chères pour que les gens en choisissent d\'autres.' },
      { value: 'innovation', text: 'Attendre de meilleures inventions.' },
    ],
  },

  ecol4: {
    explain: 'On jette parfois trop d\'emballages, il y a beaucoup de publicité, on prend l\'avion pour de très courts voyages.',
    statement: 'Pour protéger la planète, peut-on interdire certaines choses (trop d\'emballages, trop de pub) ?',
    options: [
      { value: 'largement', text: 'Oui, beaucoup de choses, et même plus.' },
      { value: 'certaines', text: 'Oui, certaines seulement.' },
      { value: 'non', text: 'Non, chacun choisit ce qu\'il achète.' },
    ],
  },

  inst1: {
    explain: 'Dans un pays, on peut faire voter tous les habitants pour les grandes décisions, ou laisser les personnes élises décider.',
    statement: 'Pour les grandes décisions du pays, tout le monde devrait-il voter plus souvent ?',
    options: [
      { value: 'frequent', text: 'Oui, souvent : tout le monde donne son avis.' },
      { value: 'ponctuel', text: 'Parfois, pour les très grandes questions.' },
      { value: 'rare', text: 'Non, ceux qu\'on a élus décident.' },
    ],
  },

  inst3: {
    explain: 'Pour diriger, il faut quelqu\'un qui décide vite. Mais si cette personne a trop de pouvoir, elle peut en abuser.',
    statement: 'Faut-il un chef très fort qui décide, ou plusieurs personnes qui se contrôlent ?',
    options: [
      { value: 'oui', text: 'Un chef fort : on avance plus vite.' },
      { value: 'conditionnel', text: 'Un chef fort, mais avec des gens pour vérifier.' },
      { value: 'non', text: 'Non, il vaut mieux partager le pouvoir.' },
    ],
  },

  inst5: {
    explain: 'Manifester, c\'est descendre dans la rue avec des pancartes pour dire qu\'on n\'est pas d\'accord.',
    statement: 'Les manifestations dans la rue : peut-on les interdire ?',
    options: [
      { value: 'presque-jamais', text: 'Presque jamais : c\'est un droit très important.' },
      { value: 'ordre', text: 'Oui, si ça devient dangereux ou trop désordonné.' },
      { value: 'regulierement', text: 'Oui, plus souvent qu\'aujourd\'hui.' },
    ],
  },

  int1: {
    explain: 'La France décide de certaines choses avec d\'autres pays d\'Europe, ensemble. On appelle ça l\'Union européenne.',
    statement: 'Décider ensemble avec les autres pays d\'Europe : est-ce une bonne chose pour la France ?',
    options: [
      { value: 'benefique', text: 'Oui, c\'est plutôt une bonne chose.' },
      { value: 'conditionnel', text: 'Oui, mais il faudrait changer certaines règles.' },
      { value: 'nuit', text: 'Non, la France devrait décider plus souvent toute seule.' },
    ],
  },

  int3: {
    explain: 'Pour se protéger, un pays a une armée. Il peut aussi se mettre avec d\'autres pays amis.',
    statement: 'Pour se protéger, la France doit-elle compter surtout sur elle-même, ou avec d\'autres pays amis ?',
    options: [
      { value: 'priorite-nationale', text: 'Surtout sur elle-même : être forte toute seule.' },
      { value: 'complement', text: 'Les deux : être forte et avoir des amis.' },
      { value: 'alliances', text: 'Surtout avec ses amis : être forts ensemble.' },
    ],
  },

  sante1: {
    explain: 'Aller chez le médecin coûte de l\'argent. Il faut décider ensemble comment le payer.',
    statement: 'Comment payer pour que tout le monde puisse aller chez le médecin ?',
    options: [
      { value: 'solidaire', text: 'Tous ensemble : chacun donne selon ses moyens, et on soigne ceux qui en ont besoin.' },
      { value: 'mixte', text: 'Un peu avec l\'argent commun, un peu avec des assurances.' },
      { value: 'prive', text: 'Chacun paye ses soins, avec une aide pour ceux qui n\'ont pas d\'argent.' },
    ],
  },

  sante2: {
    explain: 'Les médicaments soignent, mais ils coûtent cher à fabriquer.',
    statement: 'Qui devrait décider du prix des médicaments ?',
    options: [
      { value: 'strict', text: 'L\'État décide, pour que tout le monde puisse les acheter.' },
      { value: 'negocie', text: 'L\'État discute avec ceux qui les fabriquent.' },
      { value: 'marche', text: 'Ceux qui les fabriquent décident du prix.' },
    ],
  },

  ret1: {
    explain: 'La retraite, c\'est quand on devient vieux et qu\'on peut s\'arrêter de travailler. La loi dit à partir de quel âge.',
    statement: 'À quel âge devrait-on pouvoir s\'arrêter de travailler ?',
    options: [
      { value: '60-62', text: 'Plutôt vers 60 ou 62 ans.' },
      { value: '64', text: 'À 64 ans, comme prévu aujourd\'hui.' },
      { value: '68', text: 'Plus tard (68 ans), parce qu\'on vit plus longtemps.' },
      { value: 'penibilite', text: 'Ça dépend du métier : ceux qui ont des métiers très durs, plus tôt.' },
    ],
  },

  edu1: {
    explain: null,
    statement: 'Comment rendre l\'école meilleure ?',
    options: [
      { value: 'moyens', text: 'Plus de moyens : plus de maîtres et maîtresses, des classes moins remplies.' },
      { value: 'reforme', text: 'Changer la façon d\'apprendre et d\'organiser l\'école.' },
      { value: 'concurrence', text: 'Les familles choisissent l\'école qu\'elles veulent.' },
    ],
  },

  edu2: {
    explain: 'L\'école publique est un endroit pour tous : on n\'y met pas en avant ses croyances religieuses.',
    statement: 'À l\'école publique, comment appliquer cette règle ?',
    options: [
      { value: 'strictement', text: 'De façon stricte : on ne porte pas de signes religieux à l\'école.' },
      { value: 'equilibre', text: 'Avec un équilibre : la règle vaut pour tous, sans être trop dure.' },
      { value: 'ouvertement', text: 'De façon ouverte : on accepte des exceptions raisonnables.' },
    ],
  },
};

/* ---------------------------------------------------------------------------
   Grandes idées (courants) racontées aux enfants, pour la page de résultats.
   Rien n'est inventé politiquement : ce sont les courants réels de
   currents.js, décrits avec des mots simples et un exemple du quotidien.
   --------------------------------------------------------------------------- */
export const KIDS_CURRENTS = {
  'social-democratie': {
    title: 'Prendre soin de tous',
    simple: 'Une grande idée où l\'État aide beaucoup : écoles, hôpitaux, aide pour les malades et les personnes âgées. Les entreprises privées existent aussi.',
    example: 'comme si la classe gardait une caisse commune pour que personne ne manque de matériel.',
  },
  'socialisme-democratique': {
    title: 'Partager les richesses',
    simple: 'Les grandes entreprises et les richesses appartiendraient surtout à tous, pas seulement à quelques personnes très riches.',
    example: 'comme si les jeux de la cour de récréation appartenaient à tous les élèves, pas à un seul.',
  },
  'liberalisme-economique': {
    title: 'La liberté d\'entreprendre',
    simple: 'Chacun crée son activité, garde ce qu\'il gagne, et l\'État ne met pas trop de règles.',
    example: 'comme si chacun pouvait ouvrir sa petite buvette sans demander la permission à chaque fois.',
  },
  'liberalisme-politique': {
    title: 'La liberté de chacun',
    simple: 'L\'essentiel : que chacun puisse penser, dire et choisir librement, tant qu\'il ne dérange pas les autres.',
    example: 'comme pouvoir choisir ses amis et ses jeux sans que personne ne l\'interdise.',
  },
  'conservatisme': {
    title: 'Garder ce qui marche',
    simple: 'On change lentement, en gardant les habitudes et les traditions qui ont fait leurs preuves.',
    example: 'comme garder les règles de la maison même quand on pourrait en changer.',
  },
  'democratie-chretienne': {
    title: 'S\'entraider et décider près des gens',
    simple: 'Aider les plus fragiles, et laisser les petites communautés (villages, associations) décider de ce qui les concerne.',
    example: 'comme demander aux délégués ce qui est le mieux pour la classe.',
  },
  'ecologie-politique': {
    title: 'Protéger la planète',
    simple: 'La nature et le climat passent avant beaucoup d\'autres choses : polluer moins, protéger les animaux et les forêts.',
    example: 'comme trier ses déchets et éteindre les lumières, mais pour tout un pays.',
  },
  'souverainisme': {
    title: 'Notre pays d\'abord',
    simple: 'La France doit décider seule, garder ses frontières et ses habitudes, sans laisser d\'autres pays décider à sa place.',
    example: 'comme une équipe qui préfère choisir seule ses règles de jeu.',
  },
  'federalisme-europeen': {
    title: 'Forts ensemble en Europe',
    simple: 'Les pays d\'Europe décident beaucoup de choses ensemble, comme une grande équipe.',
    example: 'comme tous les élèves de l\'école qui préparent la fête ensemble.',
  },
  'libertarianisme': {
    title: 'Le moins de règles possible',
    simple: 'Presque pas de règles : chacun fait ce qu\'il veut avec son argent et sa vie, et l\'État est tout petit.',
    example: 'comme une récréation où chacun s\'organise librement, sans arbitre.',
  },
  'gaullisme': {
    title: 'Un pays fort et indépendant',
    simple: 'La France doit être forte, fière et indépendante, avec un État qui agit et décide.',
    example: 'comme un capitaine qui mène son équipe d\'une main sûre.',
  },
  'communisme': {
    title: 'Tout partager',
    simple: 'Les richesses seraient partagées entre tous : les usines et les terres appartiendraient à tout le monde.',
    example: 'comme mettre tous les goûters en commun pour que chacun en ait autant.',
  },
  'anarchisme': {
    title: 'Décider sans chef',
    simple: 'Pas de chef du tout : les gens s\'organisent entre eux, librement et à égalité.',
    example: 'comme un jeu où tout le monde décide des règles ensemble, sans arbitre.',
  },
  'centrisme': {
    title: 'Chercher le juste milieu',
    simple: 'Prendre de bonnes idées un peu partout, sans suivre une seule grande idée jusqu\'au bout.',
    example: 'comme se placer au milieu du terrain pour bien voir tout le jeu.',
  },
};

/* ---------------- helpers -------------------------------------------------- */

/** La liste des questions originales retenues pour le parcours enfant. */
export function getKidsQuestions() {
  return KIDS_QUESTION_IDS
    .map((id) => questions.find((q) => q.id === id))
    .filter(Boolean);
}

/** La reformulation pédagogique d'une question (null si non réécrite). */
export function getKidsRewrite(id) {
  return KIDS_REWRITES[id] || null;
}

/** Texte de réponse (mode enfant) d'une question à partir de sa valeur. */
export function getKidsOptionText(qId, value) {
  const r = KIDS_REWRITES[qId];
  if (r) {
    const o = r.options.find((x) => x.value === value);
    if (o) return o.text;
  }
  return null;
}
