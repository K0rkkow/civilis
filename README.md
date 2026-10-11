# CIVILIS

Un parcours de réflexion politique, conçu comme une **bibliothèque philosophique
de l'Antiquée** : chaque question est une statue, chaque résultat est un portrait
intellectuel, et le test n'attribue aucune étiquette mais explique le raisonnement.

> « Connais tes idées. Comprends le monde. »

CIVILIS est construit à partir du site **Examine** (ancien projet)
— un analyseur de positionnement politique français — qui a été transformé en
projet complet et indépendant : pages, données, moteur et styles ont été
complètement réécrits pour y remettre la page.

---

## Principes

### Méthodologie
- **10 dimensions** politiques analysées séparément (économie, libertés, autorité,
  société, immigration, écologie, institutions, nation, justice, travail) — jamais
  une ligne droite économie/gauche-droite.
- **62 questions** (banque dans `src/lib/questions.js`), chacune avec ses propres
  options, dont 2 questions spécifiques.
- **Réponse incertaine** : « Je ne sais pas / cela dépend » est toujours proposé et
  ne compte jamais comme une opinion.
- **Aucune réponse non renseignée** n'est traitée comme une opinion.
- **Scores explicables** : chaque score de dimension est la moyenne pondérée des
  options choisies, et la page résultats indique quel dimension a contribué au
  résultat (écart en points par rapport au courant).
- **Courants = modèles de référence**, pas des partis : la distance est calculée
  sur les dimensions couvertes, et une tension n'est jamais qualifiée
  d'incohérence.

### Biais de neutralité
- Aucune donnée de profil (âge, sexe) n'entre dans le calcul.
- Aucun partenaire publicitaire, aucune trace de session, aucun envoi de données.
- Les résultats partis sont un module **séparé** (données datées, programme,
  disclaimer explicite, pas défini comme résultat principal) et sont affichés
  seulement sur demande.

### Architecture technique
- React 18 + Vite (no framework supplémentaire), CSS module (styles propres).
- Moteur de calcul : fichier **pur**, sans dépendance (sans DOM, sans React), dans
  `src/lib/analysis.js` — donc testable en Node.
- Données séparées : `src/lib/questions.js`, `src/lib/dimensions.js`,
  `src/lib/currents.js`, `src/lib/parties.js`.
- Navigation par ancre + header opaque au scroll.
- Animations : révélation au scroll (IntersectionObserver, avec fallback
  `prefers-reduced-motion: reduce` → contenu visible sans animation).

---

## Lancer

```bash
npm install
npm run dev      # http://localhost:3000
```

Pour un serveur statique de production (build Vite) :

```bash
npm run build    # dist/
npm run preview
```

---

## Tests

```bash
npm test
```

Les 21 tests vérifient :
- la structure des questions (ids uniques, options bien formées, scores dans [0,1]),
- la complétude des courants et des partis,
- le calcul des scores de dimension (pondération, incertitude exclue, réponses inconnues ignorées),
- la détermination des résultats (mêmes entrées → mêmes sorties),
- la plage des scores, la couverture des dimensions,
- la polarité des profils de référence (gauche → course gauche, écologiste → écologie-politique, souverainiste → souverainisme, libertaire → anarchisme/libéralisme politique, …),
- la distance de proximité triée, la question neutre comme profile,
- la détection de tensions, le portrait généré, les questions de réflexion.

---

## Organisation des fichiers

```text
src/
├── main.jsx
├── App.jsx                  # header/nav (avec CTA distinct), intro d'accueil, footer avec suppression des données
├── components/
│   └── LetterCollage.jsx    # système de fragments SVG de lettres pour les titres collés
├── pages/
│   ├── Home.jsx             # héro asymétrique (vraies photographies régulières), 4 chapitres storytelling, bande d'images
│   ├── Test.jsx             # écran de profil facultatif → consentement → une question/écran → récap
│   ├── Results.jsx          # portrait, radar, courants, tensions, réflexion, module partis, fiche exportable
│   ├── Method.jsx           # la démarche : 10 dimensions documentées
│   ├── Currents.jsx         # les 14 courants (photographies, citations sourcées, barres de signature)
│   ├── Results.jsx          # résultat : portrait, radar, courants, tensions, réflexion, explication des scores
│   └── PartisPersonnalites.jsx  # catalogue : recherche par nom, filtres, séparation courant/parti/personnalité, sources
├── lib/
│   ├── analysis.js          # moteur de calcul pur et déterministe
│   ├── questions.js         # banque 62 questions
│   ├── dimensions.js        # 10 dimensions avec leurs pôles 0/100
│   ├── currents.js          # 14 courants de référence (positions, traits, divergences, limites)
│   ├── parties.js           # 8 partis français (sources datées, disclaimer)
│   ├── politicians.js       # 10 personnalités vérifiées (sources, dates, candidature 2027)
│   └── images.js            # métadonnées des photographies réelles (URL, licences, légendes)
└── styles/
    ├── main.css             # palette, typographies, header, footer, pages éditoriales
    ├── collage.css          # lettres découpées : papiers, tranches, encres, textures, apparition
    ├── test.css             # questionnaire : progression, contexte, choix, recap
    └── results.css          # résultats : radar, courants, tensions, partis, fiche, explication
tests/
  engine.test.mjs            # 21 tests moteur
```

---

## La signature « lettres découpées »

L'intro d'accueil et quelques mots de l'accroche d'accueil sont composés de
fragments de papier découpés un à un dans des journaux et des magazines.

- `createLetterSpans(texte, { variant, start, stagger })` — `src/pages/Home.jsx`.
  Chaque caractère est un vrai texte (donc sélectionnable, indexable) posé sur
  un rectangle de papier : typographie, graisse, teinte, tranche de découpe,
  marges, rotation, décalage et texture varient.
- Les variations proviennent d'une graine déterministe (texte + index) : le
  collage est irrégulier mais identique à chaque rendu, jamais « aléatoire ».
- `variant` : `lg` (nom CIVILIS), `md` (mots d'accroche), `sm` (phrase courte),
  `xs` (surtitre). `start` / `stagger` orchestrent l'apparition fragment par
  fragment.
- Palette : ivoire, crème, linen, beige, papier journal, gris, vieilli, plus
  quelques coupes sombres (titre inversé). Aucune couleur saturée.
- Accessibilité : chaque mot porte `role="img"` + `aria-label` (le texte reste
  lisible par les lecteurs d'écran et le `textContent` reste exact) ; sous
  `prefers-reduced-motion: reduce` les fragments sont figés, déjà composés.
- Vérification visuelle : `node shots.cjs <dossier>` (captures desktop/mobile,
  mouvement réduit, apparition progressive) et `node smoke.cjs` (routes).

---

## Données image

Chaque image est une photographie réelle (Wikimedia Commons / collections ouvertes
musées), avec :
- URL vérifiée en HTTP 200 avant intégration,
- licence de réutilisation (en général CC0, CC BY ou CC BY-SA),
- légende complète : auteur, musée/source, droit d'auteur.

Aucun placeholder, aucun emoji comme illustration, aucune URL inventée.

---

## Développement

### Ajouter une question
Éditez `src/lib/questions.js` — chaque question porte un identifiant stable,
une dimension principale et des options avec un score normalisé (0 = pôle 0,
1 = pôle 100). Le moteur gère tout automatiquement.

### Ajouter un courant
Éditez `src/lib/currents.js` : `name`, `family`, `summary`, `traits`,
`divergences`, `limits`, `position` sur les 10 dimensions (0–100). Les tests
vérifient la forme et la cohérence des positions.

### Ajouter un parti
Éditez `src/lib/parties.js` : `name`, `id`, `color`, `program` (source avec date),
`description`, `position`. Position documentée et lisible.

### Ajouter une personnalité
Éditez `src/lib/politicians.js` : `id`, `name`, `role`, `party`, `position`
(sur les 10 dimensions), `bio`, `verifiedAt`, `status`, `source`.

### Explications
Si tu veux modifier la manière de calculer les proximités, le code se trouve
dans `src/lib/analysis.js` : les fonctions `calculateCurrentProximities` et
`detectTensions` sont auto-documentées et isolées du reste.
