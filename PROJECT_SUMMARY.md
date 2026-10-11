# Résumé du projet Examine

## Description
Examine est un site web d'analyse et de positionnement politique français conçu pour aider les utilisateurs à comprendre leurs convictions politiques à travers un questionnaire approfondi et une analyse détaillée de leurs proximités avec les courants, partis et personnalités politiques françaises.

## Fonctionnalités principales

### 1. Identité visuelle élégante
- Design inspiré de la Grèce antique et de l'édition haut de gamme
- Palette de couleurs : blanc cassé, ivoire, noir profond, gris pierre
- Typographie : Cormorant Garamond pour les titres, IBM Plex Sans pour le corps de texte
- Interface sobre, raffinée et contemporaine

### 2. Questionnaire politique approfondi
- Environ 60 questions organisées par thèmes :
  - Économie et fiscalité
  - Travail et entreprises
  - Immigration et intégration
  - École et éducation
  - Féminisme et égalité femmes-hommes
  - Santé et protection sociale
  - Retraites
  - Sécurité et justice
  - Libertés, religion et laïcité
  - Écologie et énergie
  - Démocratie et institutions
  - Europe et international
  - Société, famille et libertés individuelles
  - Culture, médias et information
- Formulations neutres permettant l'expression de nuances
- Possibilité d'indiquer l'incertitude ("Je ne sais pas encore")
- Navigation fluide avec barre de progression
- Sauvegarde locale du progrès

### 3. Moteur d'analyse sophistiqué
- Conversion des réponses en scores multidimensionnels
- Comparaison avec les positions documentées des partis politiques :
  - Rassemblement National (RN)
  - La France Insoumise (LFI)
  - Parti Socialiste (PS)
  - Les Républicains (LR)
  - Renaissance (RE)
  - Horizons
  - Parti Communiste Français (PCF)
  - Les Écologistes (EÉLV)
- Comparaison avec les personnalités politiques :
  - Jordan Bardella
  - Marine Le Pen
  - Jean-Luc Mélenchon
  - Raphaël Glucksmann
  - Gabriel Attal
  - Édouard Philippe
  - François Ruffin
  - Marine Tondelier
  - François Hollande
  - Fabien Roussel
- Calcul de proximité basé sur une analyse multidimensionnelle
- Génération d'une biographie politique personnalisée

### 4. Résultats détaillés
- Titre de profil personnalisé basé sur les réponses
- Biographie politique narrative de plusieurs paragraphes
- Identification du courant politique le plus proche
- Identification du parti politique le plus proche
- Identification de la personnalité politique la plus proche
- Comparaison détaillée des positions sur différents thèmes
- Indication du niveau de confiance et de couverture des données
- Options pour refaire le test ou exporter les résultats

## Structure technique

### Frontend
- React 18 avec hooks
- React Router 6 pour la navigation
- Vite comme outil de build et de développement
- CSS3 avec approche modulaire

### Données
- Banque de questions politiques soigneusement formulées
- Base de données des partis politiques avec positions sur chaque thème
- Base de données des personnalités politiques avec rôles et positions
- Système de mapping entre questions et dimensions politiques

### Logiciel
- Calcul de scores utilisateur basé sur les réponses
- Algorithme de proximité utilisant la distance euclidienne multidimensionnelle
- Génération de biographie personnalisée basée sur le profil politique
- Création de comparaisons détaillées par thème

## Approche méthodologique

### Neutralité
- Aucune orientation idéologique présupposée
- Toutes les positions rattachées à des sources vérifiables
- Méthodologie clairement expliquée et transparente
- Respect de la vie privée : stockage local uniquement, aucune transmission de données

### Nuance
- Questions formulées pour éviter les choix binaires artificiels
- Possibilité d'exprimer des degrés d'accord ou d'incertitude
- Analyse qui montre les accords ET les désaccords spécifiques
- Reconnaissance des tensions légitimes entre différentes valeurs

### Documentation
- Position des partis basée sur programmes officiels, déclarations et votes
- Position des personnalités basée sur rôles vérifiés et déclarations publiques
- Niveau de confiance associé à chaque information
- Limites clairement identifiées et communiquées

## Installation et utilisation

### Prérequis
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation
```bash
cd examine-site
npm install
```

### Développement
```bash
npm run dev
```
Ouvrez http://localhost:3000 dans votre navigateur.

### Production
```bash
npm run build
```
Les fichiers de production seront dans le dossier `dist/`.

### Aperçu de la production
```bash
npm run preview
```

## Limitations et évolutions futures

### Limitations actuelles
- Base de données des partis et personalities à enrichir davantage
- Algorithme de proximité pouvant être affiné avec plus de dimensions
- Génération de biographie pouvant être davantage personnalisée
- Fonctionnalité d'export PDF à implémenter complètement
- Pas d'authentification ou de comptes utilisateurs (par choix de confidentialité)

### Evolutions possibles
- Enrichissement continu de la base politique avec données actualisées
- Ajout de visualisations graphiques plus sophistiquées
- Possibilité de sauvegarder et de comparer plusieurs résultats
- Intégration de questions contextuelles ou d'actualité
- Option de partager les résultats de manière anonyme et sécurisée

## Crédits
Ce site a été créé dans l'optique de fournir un outil sérieux de réflexion politique, inspiré par les meilleures traditions de l'analyse politique française et l'esthétique intemporelle de la Grèce antique.