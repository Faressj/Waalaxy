# Nom du Projet

## Prérequis
- Node.js version: v21.1.0
- npm version: 10.2.0

## Installation et Démarrage

### Étape 1 : Installation des Dépendances
Ouvrir deux terminaux séparés, un pour le dossier `front` et l'autre pour `back`.

Dans chaque terminal, exécuter :
```bash
npm install
```

Dans le terminal du dossier back, exécuter :

```bash
npm run build
npm start
```

Dans le terminal du dossier front, exécuter :

```bash
npm start
```

## Update v.1.0.1

### Front
- Déplacement de tous les hooks (`useEffect`) dans le dossier `hook`.
- Suppression des dépendances inutilisées.
- Amélioration de la syntaxe dans les logs.

### Back
- Suppression de `setInterval` dans le backend qui mettait à jour les valeurs automatiquement.

## Update v.1.0.2

### Modifications Générales
- Changement de `nom` en `name` pour une meilleure cohérence.
- Introduction de nouveaux tests pour améliorer la couverture de code.
- Suppression des imports inutiles pour optimiser la performance.
- Nettoyage des commentaires et du code pour une meilleure lisibilité.
- Mise en place de Prettier pour une uniformisation du formatage du code.

### Front
- Refonte de la structure SCSS pour une meilleure organisation.
- Séparation des styles SCSS pour faciliter la maintenance.

### Back
- Restructuration du backend pour améliorer la modularité et la maintenabilité.
- Création d'un dossier `types` pour une gestion centralisée des types TypeScript.

### Fonctionnalités
- Ajout de subtilités pour les stratégies FIFO (First In, First Out) et FILO (First In, Last Out).
- Suppression des rechargements de page (`window.reload`) pour une expérience utilisateur plus fluide.

