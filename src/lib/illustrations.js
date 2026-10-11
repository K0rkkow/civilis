/* ============================================================================
   CIVILIS — illustrations du questionnaire
   ----------------------------------------------------------------------------
   Chaque question peut être accompagnée d'une ou deux photographies réelles,
   choisies pour leur pertinence exacte (le texte de la question a été lu avant
   le choix) et contextualisées quand la question porte sur la France.

   Toutes les images :
   - proviennent de Wikimedia Commons ;
   - ont été vérifiées en HTTP 200 (tests/check-urls.mjs, 2026-10) ;
   - portent une licence de réutilisation explicitée ;
   - sont neutres : aucun portrait, aucune image stigmatisante, aucun angle
     éditorial qui pousserait vers une réponse.

   Les questions sans illustration n'en ont pas : on n'invente pas de lien.
   La couverture exacte est vérifiable via `illustratedQuestionIds()`.
   ========================================================================== */

/* Gabarit : { src, alt, caption, author, license, page, date } */
const IMAGES = {
  'ecole-entree': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Entr%C3%A9e_%C3%A9cole_%C3%A9l%C3%A9mentaire_Jean_Jaur%C3%A8s_de_Nantes_01.jpg/1280px-Entr%C3%A9e_%C3%A9cole_%C3%A9l%C3%A9mentaire_Jean_Jaur%C3%A8s_de_Nantes_01.jpg',
    alt: "Portail d'entrée d'une école élémentaire publique à Nantes, avec grille et panneau de rue.",
    caption: "Entrée de l'école élémentaire Jean-Jaurès à Nantes. © Kalepom, CC0 (Wikimedia Commons)",
    author: 'Kalepom',
    license: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Entr%C3%A9e_%C3%A9cole_%C3%A9l%C3%A9mentaire_Jean_Jaur%C3%A8s_de_Nantes_01.jpg',
    date: '2025-09-13',
  },
  'ecole-facade': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/%C3%89cole_%C3%A9l%C3%A9mentaire%2C_20_rue_de_Musset%2C_Paris_16e_3-1.jpg/1280px-%C3%89cole_%C3%A9l%C3%A9mentaire%2C_20_rue_de_Musset%2C_Paris_16e_3-1.jpg',
    alt: "Façade en pierre d'une école élémentaire parisienne portant l'inscription « École de garçons ».",
    caption: "Façade d'une école élémentaire à Paris 16e. © Polymagou, CC BY-SA 4.0 (Wikimedia Commons)",
    author: 'Polymagou',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:%C3%89cole_%C3%A9l%C3%A9mentaire,_20_rue_de_Musset,_Paris_16e_3-1.jpg',
    date: '2020-07-18',
  },
  'syndicat-cgt': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Manifestation_du_2_octobre_2025_%C3%A0_Dijon_%E2%80%94_CGT.jpg/1280px-Manifestation_du_2_octobre_2025_%C3%A0_Dijon_%E2%80%94_CGT.jpg',
    alt: 'Rassemblement de salariés à Dijon avant une manifestation inter-syndicale, octobre 2025.',
    caption: 'Manifestation intersyndicale à Dijon, 2 octobre 2025. © Haldu, CC0 (Wikimedia Commons)',
    author: 'Haldu',
    license: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Manifestation_du_2_octobre_2025_%C3%A0_Dijon_%E2%80%94_CGT.jpg',
    date: '2025-10-02',
  },
  'service-public-culture': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Salle_Ovale_BnF_Richelieu_2024-05-19.jpg/1280px-Salle_Ovale_BnF_Richelieu_2024-05-19.jpg',
    alt: 'Salle ovale de lecture de la Bibliothèque nationale de France, site Richelieu à Paris.',
    caption: 'Salle ovale du site Richelieu de la BnF, Paris, mai 2024. © DominikPeters, CC BY 4.0 (Wikimedia Commons)',
    author: 'DominikPeters',
    license: 'CC BY 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Salle_Ovale_BnF_Richelieu_2024-05-19.jpg',
    date: '2024-05-19',
  },
  'hopital': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Paris_10e_H%C3%B4pital_Saint-Louis_636.jpg/1280px-Paris_10e_H%C3%B4pital_Saint-Louis_636.jpg',
    alt: "Bâtiment de l'hôpital Saint-Louis, rue Bichat, dans le 10e arrondissement de Paris.",
    caption: 'Hôpital Saint-Louis, Paris 10e. © GFreihalter, CC BY-SA 4.0 (Wikimedia Commons)',
    author: 'GFreihalter',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Paris_10e_H%C3%B4pital_Saint-Louis_636.jpg',
    date: '2024-08-04',
  },
  'residence-personnes-agees': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Panneau_R%C3%A9sidence_pour_personnes_%C3%A2g%C3%A9es_Sylvain_Roy%C3%A9.jpg/1280px-Panneau_R%C3%A9sidence_pour_personnes_%C3%A2g%C3%A9es_Sylvain_Roy%C3%A9.jpg',
    alt: "Panneau de signalétique d'une résidence pour personnes âgées à Nantes.",
    caption: "Panneau d'une résidence pour personnes âgées à Nantes. © Kalepom, CC BY-SA 4.0 (Wikimedia Commons)",
    author: 'Kalepom',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Panneau_R%C3%A9sidence_pour_personnes_%C3%A2g%C3%A9es_Sylvain_Roy%C3%A9.jpg',
    date: '2023-08-27',
  },
  'senat': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/S%C3%A9nat%2C_h%C3%A9micycle.jpg/1280px-S%C3%A9nat%2C_h%C3%A9micycle.jpg',
    alt: "Hémicycle et gradins du Sénat, au palais du Luxembourg à Paris.",
    caption: 'Hémicycle du Sénat, palais du Luxembourg, Paris. © Soleil1409, CC BY-SA 4.0 (Wikimedia Commons)',
    author: 'Soleil1409',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:S%C3%A9nat,_h%C3%A9micycle.jpg',
    date: '2017-11-14',
  },
  'assemblee-nationale': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Fa%C3%A7ade_Palais_Bourbon_3.jpg/1280px-Fa%C3%A7ade_Palais_Bourbon_3.jpg',
    alt: "Façade néoclassique du Palais Bourbon, siège de l'Assemblée nationale, à Paris.",
    caption: "Le Palais Bourbon, siège de l'Assemblée nationale. © ZeusUpsistos, CC BY-SA 4.0 (Wikimedia Commons)",
    author: 'ZeusUpsistos',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Fa%C3%A7ade_Palais_Bourbon_3.jpg',
    date: '2023-05-17',
  },
  'palais-justice': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Palais_de_Justice_de_Paris.jpg/1280px-Palais_de_Justice_de_Paris.jpg',
    alt: "Façade principale du palais de justice de Paris, sur l'île de la Cité.",
    caption: 'Palais de justice de Paris. © Carlos Delgado, CC BY-SA 3.0 (Wikimedia Commons)',
    author: 'Carlos Delgado',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:Palais_de_Justice_de_Paris.jpg',
    date: '2012-03-25',
  },
  'gendarmerie': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Chinon_-_Gendarmerie_nationale.jpg/1280px-Chinon_-_Gendarmerie_nationale.jpg',
    alt: 'Bâtiment abritant une brigade de gendarmerie nationale à Chinon, en Indre-et-Loire.',
    caption: 'Gendarmerie nationale à Chinon (Indre-et-Loire). © Benjamin Smith, CC BY-SA 4.0 (Wikimedia Commons)',
    author: 'Benjamin Smith',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Chinon_-_Gendarmerie_nationale.jpg',
    date: '2025-06-09',
  },
  'prefecture-police': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Paris_75004_Rue_de_Lut%C3%A8ce_20170204_Pr%C3%A9fecture_de_Police.jpg/1280px-Paris_75004_Rue_de_Lut%C3%A8ce_20170204_Pr%C3%A9fecture_de_Police.jpg',
    alt: 'Entrée nord de la Préfecture de Police, rue de Lutèce, dans le 4e arrondissement de Paris.',
    caption: 'Préfecture de Police de Paris, rue de Lutèce. © besopha, CC BY 2.0 (Wikimedia Commons)',
    author: 'besopha',
    license: 'CC BY 2.0',
    page: 'https://commons.wikimedia.org/wiki/File:Paris_75004_Rue_de_Lut%C3%A8ce_20170204_Pr%C3%A9fecture_de_Police.jpg',
    date: '2017-02-04',
  },
  'memorial-migrants': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/M%C3%A9morial_aux_migrants_disparus_en_montagne%2C_Brian%C3%A7on%2C_mars_2024_01.jpg/1280px-M%C3%A9morial_aux_migrants_disparus_en_montagne%2C_Brian%C3%A7on%2C_mars_2024_01.jpg',
    alt: "Mémorial aux migrants disparus en montagne dans la région de Briançon, lors d'une cérémonie en mars 2024.",
    caption: "Mémorial aux migrants disparus en montagne, Briançon, mars 2024. © Yann, CC BY-SA 4.0 (Wikimedia Commons)",
    author: 'Yann',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:M%C3%A9morial_aux_migrants_disparus_en_montagne,_Briançon,_mars_2024_01.jpg',
    date: '2024-03-16',
  },
  'parlement-europeen': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/European_Parliament_Strasbourg_Hemicycle_-_Diliff.jpg/1280px-European_Parliament_Strasbourg_Hemicycle_-_Diliff.jpg',
    alt: "Hémicycle du Parlement européen lors d'une session plénière à Strasbourg.",
    caption: 'Hémicycle du Parlement européen à Strasbourg. © Diliff, CC BY-SA 3.0 (Wikimedia Commons)',
    author: 'Diliff',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:European_Parliament_Strasbourg_Hemicycle_-_Diliff.jpg',
    date: '2014-02-05',
  },
  'assemblee-generale-onu': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/United_Nations_General_Assembly_2024.jpg/1280px-United_Nations_General_Assembly_2024.jpg',
    alt: "Salle de l'Assemblée générale des Nations unies, au siège de l'ONU à New York, en février 2024.",
    caption: "Assemblée générale des Nations unies, New York, février 2024. © Mojnsen, CC BY-SA 4.0 (Wikimedia Commons)",
    author: 'Mojnsen',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:United_Nations_General_Assembly_2024.jpg',
    date: '2024-02-20',
  },
  'parc-eolien': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Parc_%C3%A9olien_d%27Apremont%2C_Apremont%2C_2025_%281%29.jpg/1280px-Parc_%C3%A9olien_d%27Apremont%2C_Apremont%2C_2025_%281%29.jpg',
    alt: "Éolienne du parc éolien d'Apremont, dans l'Ain, photographiée en février 2025.",
    caption: "Parc éolien d'Apremont (Ain), février 2025. © Antimuonium, CC BY-SA 4.0 (Wikimedia Commons)",
    author: 'Antimuonium',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Parc_%C3%A9olien_d%27Apremont,_Apremont,_2025_(1).jpg',
    date: '2025-02-16',
  },
  'fibre-optique': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Tirage_de_fibre_optique_%C3%A0_Albi_-_2018-11-21_-_01.jpg/1280px-Tirage_de_fibre_optique_%C3%A0_Albi_-_2018-11-21_-_01.jpg',
    alt: 'Pose et tirage de câbles de fibre optique lors de travaux de voirie à Albi, dans le Tarn.',
    caption: 'Travaux de pose de fibre optique à Albi (Tarn), novembre 2018. © MathieuMD, CC BY-SA 4.0 (Wikimedia Commons)',
    author: 'MathieuMD',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Tirage_de_fibre_optique_%C3%A0_Albi_-_2018-11-21_-_01.jpg',
    date: '2018-11-21',
  },
  'marianne': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Statue_Marianne%2C_for_Gloire_de_la_Republique_Francaise%2C_there_is_in_Place_de_la_Republique.JPG/1280px-Statue_Marianne%2C_for_Gloire_de_la_Republique_Francaise%2C_there_is_in_Place_de_la_Republique.JPG',
    alt: "Statue de Marianne, allégorie de la République, place de la République à Paris.",
    caption: "Statue de Marianne, place de la République, Paris. © Britchi Mirela, CC BY-SA 3.0 (Wikimedia Commons)",
    author: 'Britchi Mirela',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:Statue_Marianne,_for_Gloire_de_la_Republique_Francaise,_there_is_in_Place_de_la_Republique.JPG',
    date: '2011-09-01',
  },
  'logement-social': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Construction_logement_social_Uzer_Ard%C3%A8che_nov_2023.jpg/1280px-Construction_logement_social_Uzer_Ard%C3%A8che_nov_2023.jpg',
    alt: 'Immeubles de logements sociaux en construction à Uzer, en Ardèche, en novembre 2023.',
    caption: 'Construction de logements sociaux à Uzer (Ardèche), novembre 2023. © Kakoula10, CC BY-SA 4.0 (Wikimedia Commons)',
    author: 'Kakoula10',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Construction_logement_social_Uzer_Ard%C3%A8che_nov_2023.jpg',
    date: '2023-11-21',
  },
};

/**
 * Association question → illustration.
 * La clé est l'identifiant de question lu dans questions.js ; la valeur est la
 * ou les images retenues. Une question absente de cette table n'a pas
 * d'illustration : c'est un choix, pas un oubli.
 */
const QUESTION_ILLUSTRATIONS = {
  edu1: ['ecole-entree'],            // renforcer l'école publique
  edu2: ['ecole-facade'],            // laïcité à l'école
  tra2: ['syndicat-cgt'],            // rôle des syndicats
  tra6: ['service-public-culture'],  // développer les services publics
  sante1: ['hopital'],               // financer le système de santé
  ret1: ['residence-personnes-agees'], // âge de départ à la retraite
  inst2: ['senat'],                  // mode de scrutin / représentation
  inst4: ['assemblee-nationale'],    // réforme institutionnelle
  inst6: ['palais-justice'],         // indépendance de la justice
  aut1: ['gendarmerie'],             // peine et prévention
  aut2: ['prefecture-police'],       // pouvoirs des forces de l'ordre
  imm4: ['memorial-migrants'],       // protection internationale
  int1: ['parlement-europeen'],      // appartenance à l'Union européenne
  int4: ['assemblee-generale-onu'],  // mondialisation
  ecol3: ['parc-eolien'],            // sortir des énergies fossiles
  lib4: ['fibre-optique'],           // identité numérique
  lib5: ['marianne'],                // limites sur les contenus
  jst4: ['logement-social'],         // égalité territoriale des moyens
};

/** Illustration(s) d'une question, ou null. */
export function getIllustration(questionId) {
  const keys = QUESTION_ILLUSTRATIONS[questionId];
  if (!keys || !keys.length) return null;
  const images = keys.map((k) => IMAGES[k]).filter(Boolean);
  if (!images.length) return null;
  return images.length === 1
    ? { images, src: images[0].src, alt: images[0].alt, caption: images[0].caption }
    : { images };
}

/** Identifiants des questions réellement illustrées (pour le reporting). */
export function illustratedQuestionIds() {
  return Object.keys(QUESTION_ILLUSTRATIONS);
}

/** Nombre d'images distinctes utilisées. */
export function illustrationCount() {
  return new Set(Object.values(QUESTION_ILLUSTRATIONS).flat()).size;
}
