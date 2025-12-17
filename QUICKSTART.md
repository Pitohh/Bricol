# ⚡ Démarrage Rapide - Bricol PWA

## En 3 commandes ! 🚀

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer l'application
npm run dev

# 3. Ouvrir dans le navigateur
# http://localhost:5173
```

**Ou utilisez le script :**
```bash
./start.sh
```

## 🔐 Connexion

Utilisez ces comptes pour tester :

### 👔 Chef de Projet (Michael)
- **Login :** `michael`
- **Mot de passe :** `chantier2025`
- **Peut :** Approuver les validations finales (15%)

### 📋 Coordinateur (Tanguy)
- **Login :** `tanguy`
- **Mot de passe :** `coordinateur123`
- **Peut :** Valider techniquement les tâches (85%)

### 🔨 Artisans
| Nom | Login | Mot de passe | Spécialité |
|-----|-------|--------------|------------|
| Yassa | `yassa` | `menuiserie` | Menuisier |
| Francis | `francis` | `electricite` | Électricien |
| Borel | `borel` | `plomberie` | Plombier |
| Joël | `joel` | `vitrerie` | Vitrier |
| Rodrigue | `rodrigue` | `soudure` | Soudeur |

## 📱 Fonctionnalités Principales

### Dashboard
- Vue d'ensemble de toutes les phases
- Progression globale du chantier
- Statistiques budgétaires
- Système de likes/dislikes

### Validations
- Workflow à 2 niveaux :
  1. **85%** → Validation technique (Coordinateur)
  2. **15%** → Approbation finale (Boss)
  3. **100%** → Phase complétée

### Coûts
- Suivi budgétaire détaillé
- Budget estimé vs réel
- Alertes de dépassement

### Équipe
- Liste des 7 membres
- Rôles et permissions
- Workflow de validation

## 🎯 Tester le Workflow Complet

1. **Connectez-vous avec Tanguy**
   - Allez dans Dashboard
   - Cliquez sur "Valider 85%" pour une phase en cours (ex: Électricité)
   - La phase passe à "En attente Boss"

2. **Déconnectez-vous et connectez-vous avec Michael**
   - Allez dans "Validations"
   - Cliquez sur "Approuver 15% finaux"
   - La phase est maintenant à 100% ✅

3. **Testez les réactions**
   - Connectez-vous avec n'importe quel utilisateur
   - Cliquez sur 👍 ou 👎 pour une phase

## 📂 Structure des Fichiers

```
bricol-pwa/
├── src/
│   ├── components/        # Tous les composants React
│   ├── contexts/          # AuthContext, TaskContext
│   ├── App.jsx            # Composant principal
│   └── main.jsx           # Point d'entrée
├── public/               # Fichiers statiques
├── server/               # Backend Express (optionnel)
├── package.json          # Dépendances
└── README.md            # Documentation complète
```

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev              # Frontend seul
npm run dev:all          # Frontend + Backend

# Build
npm run build            # Créer le build de production
npm run preview          # Prévisualiser le build

# Déploiement
npm run deploy           # Déployer vers Netlify

# Code qualité
npm run lint             # Vérifier le code
npm run format           # Formater le code
```

## 🌐 Accès depuis d'autres appareils

Pour tester sur mobile depuis votre réseau local :

1. Trouvez votre IP locale :
   ```bash
   # Linux/Mac
   ifconfig | grep "inet "
   
   # Windows (dans PowerShell)
   ipconfig
   ```

2. Lancez avec l'option --host :
   ```bash
   npm run dev -- --host
   ```

3. Accédez depuis mobile :
   ```
   http://VOTRE_IP:5173
   ```

## 💾 Données et Stockage

- Les données sont stockées en **localStorage**
- Persistance automatique après chaque action
- Pour réinitialiser les données :
  1. Ouvrez la console du navigateur (F12)
  2. Application → Storage → Clear site data

## 📱 Installation PWA

### Sur Desktop (Chrome/Edge)
1. Icône ⊕ dans la barre d'adresse
2. Cliquer sur "Installer"

### Sur Mobile (Chrome Android/Safari iOS)
1. Menu ⋮ → "Ajouter à l'écran d'accueil"
2. L'app apparaîtra comme une app native

## 🐛 Résolution de Problèmes

### Port 5173 déjà utilisé
```bash
# Arrêter le processus
lsof -ti:5173 | xargs kill -9
```

### Erreur d'installation npm
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Styles ne s'appliquent pas
```bash
# Vider le cache du navigateur (Ctrl+Shift+R)
```

## 📚 Documentation Complète

- **README.md** - Vue d'ensemble et fonctionnalités
- **INSTALLATION.md** - Guide d'installation détaillé
- **DEPLOYMENT.md** - Déploiement vers Netlify

## 🎉 C'est Parti !

Vous êtes prêt à utiliser Bricol ! 

**Questions ?** Consultez la documentation complète dans les fichiers README, INSTALLATION et DEPLOYMENT.

---

**Développé avec ❤️ pour Les Petits Anges de Dieu**
