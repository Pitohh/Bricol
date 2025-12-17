# 📦 Guide d'Installation - Bricol PWA

## Prérequis

- **Node.js** 18+ et npm
- **WSL** (pour Windows) ou Linux/macOS
- **Git** (optionnel mais recommandé)
- Un éditeur de code (VS Code recommandé)

## Installation Étape par Étape

### 1. Naviguer vers le dossier du projet

```bash
cd /chemin/vers/bricol-pwa
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande installera toutes les dépendances listées dans `package.json` :
- React 18
- Vite
- Tailwind CSS
- Lucide React (icônes)
- Express (backend optionnel)
- Et toutes les dépendances de dev

**⏱️ Durée estimée :** 2-3 minutes

### 3. Vérifier l'installation

```bash
npm run dev
```

L'application devrait se lancer sur `http://localhost:5173`

Si vous voyez l'écran de connexion Bricol, **l'installation est réussie !** ✅

## Modes de Démarrage

### Mode 1 : Frontend uniquement (recommandé pour commencer)

```bash
npm run dev
```

- Application accessible sur : `http://localhost:5173`
- Les données sont stockées en local (localStorage)
- Mode offline-first

### Mode 2 : Frontend + Backend

```bash
npm run dev:all
```

- Frontend : `http://localhost:5173`
- Backend API : `http://localhost:3001`
- Utilise concurrently pour lancer les deux en parallèle

### Mode 3 : Backend seul (pour tests API)

```bash
npm run dev:server
```

- API accessible sur : `http://localhost:3001`
- Test avec : `http://localhost:3001/api/health`

## Connexion à l'Application

Utilisez un de ces comptes de test :

| Utilisateur | Mot de passe | Rôle |
|------------|--------------|------|
| `michael` | `chantier2025` | Chef de Projet (Boss) |
| `tanguy` | `coordinateur123` | Coordinateur Travaux |
| `yassa` | `menuiserie` | Menuisier |
| `francis` | `electricite` | Électricien |
| `borel` | `plomberie` | Plombier |
| `joel` | `vitrerie` | Vitrier |
| `rodrigue` | `soudure` | Soudeur |

## Structure du Projet

```
bricol-pwa/
├── public/              # Fichiers statiques et PWA
│   ├── manifest.json    # Configuration PWA
│   ├── sw.js           # Service Worker
│   └── icon-*.png      # Icônes de l'app
├── src/
│   ├── components/     # Composants React
│   │   ├── Auth/       # Connexion
│   │   ├── Dashboard/  # Tableau de bord
│   │   ├── Validations/ # Gestion validations
│   │   ├── Layout/     # Header, Navigation
│   │   └── UI/         # Composants réutilisables
│   ├── contexts/       # Contextes React (Auth, Tasks)
│   ├── App.jsx         # Composant principal
│   ├── main.jsx        # Point d'entrée
│   └── index.css       # Styles Tailwind
├── server/             # Backend Express (optionnel)
├── index.html          # Page HTML principale
├── package.json        # Dépendances
└── vite.config.js      # Configuration Vite
```

## Commandes Utiles

### Développement
```bash
npm run dev              # Frontend seul
npm run dev:server       # Backend seul
npm run dev:all          # Frontend + Backend
```

### Build et Preview
```bash
npm run build            # Build de production
npm run preview          # Prévisualiser le build
```

### Tests et Qualité
```bash
npm run lint             # Vérifier le code
npm run lint:fix         # Corriger automatiquement
npm run format           # Formater avec Prettier
```

### Déploiement
```bash
npm run deploy           # Déployer vers Netlify
```

## Résolution de Problèmes

### Problème : Port 5173 déjà utilisé

```bash
# Arrêter le processus utilisant le port
lsof -ti:5173 | xargs kill -9

# Ou changer le port dans vite.config.js
```

### Problème : Erreurs d'installation npm

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème : Service Worker ne se charge pas

Le Service Worker ne fonctionne qu'en production ou en HTTPS. En développement local, il peut ne pas s'activer.

Pour tester le mode PWA :
```bash
npm run build
npm run preview
```

### Problème : Styles Tailwind ne s'appliquent pas

```bash
# Vérifier que le fichier index.css est bien importé
# dans src/main.jsx
```

## Configuration de l'Éditeur (VS Code)

Extensions recommandées :
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

## Prochaines Étapes

1. ✅ Tester la connexion avec différents comptes
2. ✅ Explorer le Dashboard
3. ✅ Tester le workflow de validation (Tanguy → Michael)
4. ✅ Vérifier les fonctionnalités likes/dislikes
5. ✅ Tester le mode responsive (mobile/desktop)

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que Node.js 18+ est installé : `node --version`
2. Vérifiez que les dépendances sont installées : `ls node_modules`
3. Consultez les logs dans la console du navigateur (F12)
4. Consultez les logs du terminal

## Développement sur WSL

Si vous utilisez Windows avec WSL :

```bash
# Vérifier que vous êtes bien dans WSL
uname -a

# Naviguer vers votre projet
cd /mnt/c/Users/VotreNom/bricol-pwa

# Ou dans votre home WSL
cd ~/bricol-pwa
```

**Note :** Pour de meilleures performances, travaillez dans le système de fichiers WSL (`~`) plutôt que dans `/mnt/c/`.

---

**Bon développement ! 🚀**
