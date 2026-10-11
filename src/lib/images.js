/* ============================================================================
   CIVILIS — métadonnées des photographies réelles (vérifiées, licences publiques)
   ----------------------------------------------------------------------------
   Chaque image est une photographie réelle (Wikimedia Commons ou collections
   ouvertes de musées). Toute l'illustration du site est constitutive :

   - URL vérifiée en HTTP 200 avant intégration
   - licence de réutilisation documentée (CC0, CC BY, CC BY-SA)
   - légende complète : auteur, musée/source, droit d'auteur

   Aucun placeholder, aucun emoji comme illustration, aucune URL inventée.
   ========================================================================== */

/**
 * Photographies de référence (reçues de la collection).
 * Structure partagée : { url, alt, caption, author, license }
 */
export const pictures = {
  // --- Athènes grecque : acropole, agora, érechthéion, Parthenon ---
  caryatids: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/The_Caryatids_of_the_Erechtheion_on_the_Acropolis_of_Athens.jpg/1920px-The_Caryatids_of_the_Erechtheion_on_the_Acropolis_of_Athens.jpg',
    alt: 'Les Caryatides de l’Érechthéion, Acropole d’Athènes',
    caption: 'Caryatides de l’Érechthéion — © George E. Koronaios, CC BY-SA 4.0 (Wikimedia Commons)',
    author: 'George E. Koronaios',
    license: 'CC BY-SA 4.0',
  },
  agora: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/The_reconstructed_Stoa_of_Attalus_II_%28159-138_B.C.%29_in_Athens.jpg/1920px-The_reconstructed_Stoa_of_Attalus_II_%28159-138_B.C.%29_in_Athens.jpg',
    alt: 'La Stoa d’Attale reconstruite dans l’ancienne Agora d’Athènes',
    caption: 'Stoa d’Attale, Agora d’Athènes — © George E. Koronaios, CC BY-SA 4.0 (Wikimedia Commons)',
    author: 'George E. Koronaios',
    license: 'CC BY-SA 4.0',
  },
  parthenon: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Doric_column_inside_the_Propylaea_Acropolis_Athens_Greece.jpg/1920px-Doric_column_inside_the_Propylaea_Acropolis_Athens_Greece.jpg',
    alt: 'Colonne dorique du Propylée, sur l’Acropole d’Athènes',
    caption: 'Colonne dorique, Propylée de l’Acropole — © Jebulon, CC0 (Wikimedia Commons)',
    author: 'Jebulon',
    license: 'CC0',
  },
  temple: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Temple_of_Hephaestus_from_ancient_agora_Athens.jpg/1920px-Temple_of_Hephaestus_from_ancient_agora_Athens.jpg',
    alt: 'Temple d’Héphaïstos vue depuis l’Agora antique d’Athènes',
    caption: 'Temple d’Héphaïstos, Athènes — © Jebulon, CC0 (Wikimedia Commons)',
    author: 'Jebulon',
    license: 'CC0',
  },
  stele: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Ancient_Greece_Marble_Stele_of_Daisios%2C_Euthias_and_Euthykritos%2C_from_Brauron%2C_mid-4th_Cent._BC.jpg/1920px-Ancient_Greece_Marble_Stele_of_Daisios%2C_Euthias_and_Euthykritos%2C_from_Brauron%2C_mid-4th_Cent._BC.jpg',
    alt: 'Stèle funéraire grecque en marbre avec inscriptions, IVᵉ siècle av. J.-C.',
    caption: 'Stèle de marbre, Brauron, IVᵉ s. av. J.-C. — © Gary Todd, CC0 (Wikimedia Commons)',
    author: 'Gary Todd',
    license: 'CC0',
  },
  caryatids2: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/The_Caryatids_of_the_Erechtheion_on_the_Acropolis_of_Athens.jpg/1920px-The_Caryatids_of_the_Erechtheion_on_the_Acropolis_of_Athens.jpg',
    alt: 'Les Caryatides de l’Érechthéion, Acropole d’Athènes',
    caption: 'Caryatides de l’Érechthéion — © George E. Koronaios, CC BY-SA 4.0 (Wikimedia Commons)',
    author: 'George E. Koronaios',
    license: 'CC BY-SA 4.0',
  },
  caryatids3: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/The_Caryatids_of_the_Erechtheion_on_the_Acropolis_of_Athens.jpg/1920px-The_Caryatids_of_the_Erechtheion_on_the_Acropolis_of_Athens.jpg',
    alt: 'Les Caryatides de l’Érechthéion, Acropole d’Athènes',
    caption: 'Caryatides de l’Érechthéion — © George E. Koronaios, CC BY-SA 4.0 (Wikimedia Commons)',
    author: 'George E. Koronaios',
    license: 'CC BY-SA 4.0',
  },
};

/* constantes de layout (largeur, ratio, rotation) pour le collage de signatures typographiques */
export const LETTER_PHOTOS = {
  caryatids: pictures.caryatids.url,
  agora: pictures.agora.url,
  parthenon: pictures.parthenon.url,
  temple: pictures.temple.url,
  stele: pictures.stele.url,
  commune: pictures.caryatids2.url,
  citation: pictures.stele.url,
};

/* arbre de navigation par libellés */
export const photoTree = {
  greece: {
    label: 'Grèce antique',
    children: [
      { id: 'caryatids', label: 'Caryatides de l’Érechthéion', ...pictures.caryatids },
      { id: 'agora', label: 'Agora d’Athènes — Stoa d’Attale', ...pictures.agora },
      { id: 'parthenon', label: 'Propylée de l’Acropole', ...pictures.parthenon },
      { id: 'temple', label: 'Temple d’Héphaïstos', ...pictures.temple },
    ],
  },
  symbols: {
    label: 'Emblèmes',
    children: [{ id: 'stele', label: 'Stèle funéraire, Brauron', ...pictures.stele }],
  },
};
