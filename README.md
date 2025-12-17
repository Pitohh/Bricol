# 🏗️ Bricol - Suivi Chantier Orphelinat PWA

Application Progressive Web App (PWA) pour le suivi de chantier de rénovation de l'orphelinat "Les Petits Anges de Dieu".

## 🚀 Technologies

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Storage**: localStorage (PWA offline-first)
- **Deployment**: Netlify

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- WSL (pour Windows)

### Installation des dépendances

```bash
npm install
```

## 🎯 Démarrage

### Mode Développement (Frontend uniquement - avec localStorage)
```bash
npm run dev
```
Accéder à : http://localhost:5173

### Mode Développement (Frontend + Backend)
```bash
npm run dev:all
```
- Frontend : http://localhost:5173
- Backend API : http://localhost:3001

### Mode Production (Build)
```bash
npm run build
npm run preview
```

## 👥 Comptes de Test

| Utilisateur | Mot de passe | Rôle |
|------------|--------------|------|
| michael | chantier2025 | Chef de Projet (Boss) |
| tanguy | coordinateur123 | Coordinateur Travaux |
| yassa | menuiserie | Menuisier |
| francis | electricite | Électricien |
| borel | plomberie | Plombier |
| joel | vitrerie | Vitrier |
| rodrigue | soudure | Soudeur |

## 🎨 Workflow de Validation

1. **Validation Technique (85%)** : Coordinateur (Tanguy)
2. **Approbation Finale (15%)** : Chef de Projet (Michael)
3. **Total = 100%** : Tâche terminée

## 📁 Structure du Projet

```
bricol-pwa/
├── src/
│   ├── components/
│   │   ├── Auth/           # Authentification
│   │   ├── Dashboard/      # Tableau de bord
│   │   ├── Validations/    # Gestion validations
│   │   ├── Layout/         # Layout (Header, Footer)
│   │   └── UI/             # Composants UI réutilisables
│   ├── contexts/           # Contextes React (Auth, Tasks)
│   ├── hooks/              # Hooks personnalisés
│   ├── utils/              # Utilitaires
│   ├── App.jsx             # Composant principal
│   └── main.jsx            # Point d'entrée
├── server/                 # Backend Express (optionnel)
├── public/                 # Assets statiques + PWA
└── tests/                  # Tests unitaires

```

## 🛠️ Commandes Utiles

```bash
# Développement
npm run dev              # Frontend uniquement
npm run dev:server       # Backend uniquement
npm run dev:all          # Frontend + Backend

# Build & Deploy
npm run build            # Build production
npm run preview          # Preview du build
npm run deploy           # Deploy vers Netlify

# Tests & Qualité
npm run test             # Tests unitaires
npm run lint             # Vérifier le code
npm run lint:fix         # Corriger automatiquement
npm run format           # Formater le code
```

## 🌐 Déploiement Netlify

1. Installer Netlify CLI (si pas déjà fait) :
```bash
npm install -g netlify-cli
```

2. Login Netlify :
```bash
netlify login
```

3. Déployer :
```bash
npm run deploy
```

Ou simplement connecter votre repo GitHub à Netlify pour le déploiement automatique.

## 📱 Fonctionnalités PWA

- ✅ Installation sur appareil (mobile/desktop)
- ✅ Mode hors-ligne
- ✅ Notifications (si activées)
- ✅ Responsive design (mobile-first)
- ✅ Persistance des données (localStorage)

## 🎨 Charte Graphique

### Couleurs
- **Bleu de Travail** : `#1C4488` (Primaire)
- **Vert de Validation** : `#5EC439` (Succès)
- **Orange Énergie** : `#FF9800` (En cours)
- **Rouge Alerte** : `#D32F2F` (Problème)
- **Gris Clair** : `#F5F5F5` (Neutre)

### Typographie
- **Titres** : Montserrat
- **Corps** : Inter

## 📊 Les 7 Phases du Projet

1. Préparation et Sécurisation
2. Menuiserie Générale
3. Électricité
4. Plomberie et Sanitaires
5. Vitrerie
6. Soudure et Métallurgie
7. Finitions et Livraison

## 🔒 Sécurité

- Authentification locale (localStorage)
- Système de permissions par rôle
- Validation des actions selon les permissions

## 📝 Licence

Propriétaire - Bricol © 2025

## 🆘 Support

Pour toute question ou problème :
- Consulter la documentation dans `/docs`
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour Les Petits Anges de Dieu**
