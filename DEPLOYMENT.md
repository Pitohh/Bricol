# 🚀 Guide de Déploiement - Netlify

## Méthode 1 : Déploiement via CLI (Ligne de commande)

### Étape 1 : Installer Netlify CLI

```bash
npm install -g netlify-cli
```

### Étape 2 : Se connecter à Netlify

```bash
netlify login
```

Cela ouvrira votre navigateur pour vous authentifier.

### Étape 3 : Build du projet

```bash
npm run build
```

Le dossier `dist/` sera créé avec les fichiers de production.

### Étape 4 : Déploiement

Pour un déploiement de test :
```bash
netlify deploy
```

Pour un déploiement en production :
```bash
netlify deploy --prod
```

Ou utilisez le script npm :
```bash
npm run deploy
```

### Étape 5 : Configurer le site (première fois)

Lors du premier déploiement, Netlify vous demandera :
- **Create & configure a new site** : Oui
- **Team** : Choisissez votre équipe
- **Site name** : `bricol-chantier` (ou votre choix)
- **Publish directory** : `dist`

## Méthode 2 : Déploiement via GitHub (recommandé)

### Étape 1 : Créer un dépôt GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit - Bricol PWA"

# Créer un repo sur GitHub et le lier
git remote add origin https://github.com/VOTRE_USERNAME/bricol-pwa.git
git branch -M main
git push -u origin main
```

### Étape 2 : Connecter à Netlify

1. Allez sur [https://app.netlify.com](https://app.netlify.com)
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Choisissez **GitHub**
4. Sélectionnez votre repository `bricol-pwa`

### Étape 3 : Configuration du Build

Netlify détectera automatiquement la configuration grâce à `netlify.toml`, mais vérifiez :

- **Build command** : `npm run build`
- **Publish directory** : `dist`
- **Functions directory** : (laisser vide)

### Étape 4 : Déploiement

Cliquez sur **"Deploy site"**

Le déploiement prendra 1-2 minutes. Vous obtiendrez une URL comme :
`https://bricol-chantier-abc123.netlify.app`

### Étape 5 : Configuration du domaine personnalisé (optionnel)

1. Dans les paramètres Netlify → **Domain management**
2. Cliquez sur **"Add custom domain"**
3. Suivez les instructions pour configurer votre DNS

## Méthode 3 : Déploiement par Drag & Drop

### Étape 1 : Build local

```bash
npm run build
```

### Étape 2 : Upload sur Netlify

1. Allez sur [https://app.netlify.com](https://app.netlify.com)
2. Faites glisser le dossier `dist/` directement sur la page
3. Netlify uploadera et déploiera automatiquement

## Configuration Post-Déploiement

### 1. Configurer les variables d'environnement

Si vous avez besoin de variables d'environnement en production :

1. Dans Netlify → **Site settings** → **Environment variables**
2. Ajoutez vos variables :
   - `VITE_API_URL` (si backend séparé)
   - Autres configs nécessaires

### 2. Configurer le HTTPS

Netlify active automatiquement le HTTPS. Vérifiez dans :
**Domain settings** → **HTTPS** → **Force HTTPS** (activé)

### 3. Configurer les Headers de Sécurité

Le fichier `netlify.toml` inclut déjà les headers nécessaires pour :
- Service Worker
- Manifest PWA
- Redirections SPA

### 4. Tester l'installation PWA

1. Visitez votre site : `https://votre-site.netlify.app`
2. Testez l'installation :
   - **Desktop** : Icône ⊕ dans la barre d'adresse
   - **Mobile** : Bannière "Ajouter à l'écran d'accueil"

## Déploiement Continu (CI/CD)

Avec la méthode GitHub, chaque push sur `main` déclenchera un nouveau déploiement automatiquement.

### Configuration des branches

- `main` → Production (`https://votre-site.netlify.app`)
- `dev` → Preview (`https://dev--votre-site.netlify.app`)

Pour créer une branche de preview :
```bash
git checkout -b dev
git push origin dev
```

## Rollback (Retour en arrière)

Si un déploiement pose problème :

1. Dans Netlify → **Deploys**
2. Sélectionnez un déploiement précédent
3. Cliquez sur **"Publish deploy"**

## Monitoring et Analytics

### Activer Netlify Analytics

1. Dans Netlify → **Analytics** (payant mais utile)
2. Voir les statistiques de trafic, performance, etc.

### Logs et Erreurs

Pour voir les logs de build :
1. **Deploys** → Sélectionner un déploiement
2. Consulter les **Deploy logs**

## Optimisations de Performance

### 1. Activer le Split Testing (A/B Testing)

Netlify permet de tester différentes versions :
```toml
# Dans netlify.toml
[[split_tests]]
  path = "/*"
  branches = ["main", "feature-branch"]
```

### 2. Optimiser les Images

Si vous ajoutez des images plus tard :
- Utilisez des formats modernes (WebP, AVIF)
- Activez **Netlify Image CDN** (payant)

### 3. Activer le Asset Optimization

Dans Netlify → **Build & deploy** → **Asset optimization** :
- ✅ Minify CSS
- ✅ Minify JS
- ✅ Optimize images

## Checklist Pré-Déploiement

Avant de déployer en production :

- [ ] Tests sur tous les comptes utilisateurs
- [ ] Vérification du responsive design (mobile/desktop)
- [ ] Test du workflow de validation complet
- [ ] Vérification du Service Worker
- [ ] Test de l'installation PWA
- [ ] Vérification des icônes (192x192, 512x512)
- [ ] Test du mode offline
- [ ] Vérification des couleurs (charte graphique)
- [ ] Test sur différents navigateurs (Chrome, Firefox, Safari, Edge)

## URLs Importantes

Après le déploiement, notez ces URLs :

- **Site principal** : `https://votre-site.netlify.app`
- **Dashboard Netlify** : `https://app.netlify.com/sites/votre-site`
- **Manifest** : `https://votre-site.netlify.app/manifest.json`
- **Service Worker** : `https://votre-site.netlify.app/sw.js`

## Maintenance et Mises à Jour

### Pour déployer une mise à jour :

**Via GitHub :**
```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
```

**Via CLI :**
```bash
npm run build
netlify deploy --prod
```

## Coûts

Netlify offre un plan gratuit incluant :
- ✅ 100 GB de bande passante / mois
- ✅ 300 minutes de build / mois
- ✅ Déploiements illimités
- ✅ HTTPS automatique
- ✅ Déploiement continu
- ✅ Formulaires (100 soumissions/mois)

**Pour ce projet, le plan gratuit est largement suffisant !**

## Support

En cas de problème :
1. Consultez les **Deploy logs** dans Netlify
2. Vérifiez le fichier `netlify.toml`
3. Testez le build en local : `npm run build && npm run preview`
4. Consultez la [documentation Netlify](https://docs.netlify.com)

---

**Bon déploiement ! 🎉**
