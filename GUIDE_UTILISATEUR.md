# 📖 GUIDE UTILISATEUR - BRICOL

Application de suivi de chantier pour la rénovation de l'orphelinat "Les Petits Anges de Dieu"

---

## 🔗 ACCÈS À L'APPLICATION

**URL** : https://bricol.open-road.tech

---

## 👤 PROFILS ET COMPTES

### 1. Michael - Chef de Projet
- **Login** : `michael`
- **Mot de passe** : `chantier2025`
- **Rôle** : Supervision générale, validation finale, gestion budgets

### 2. Tanguy - Coordinateur Travaux
- **Login** : `tanguy`
- **Mot de passe** : `coordinateur123`
- **Rôle** : Coordination terrain, validation technique, gestion sous-tâches

---

## 📊 INTERFACE COMMUNE (Michael & Tanguy)

### Onglets disponibles

| Onglet | Description | Accès |
|--------|-------------|-------|
| **📊 Dashboard** | Vue d'ensemble du projet | Tous |
| **📈 Gantt** | Planning chronologique | Tous |
| **✅ Validations** | File d'attente des approbations | Tous |
| **💰 Budget** | Gestion budgets global et phases | Michael uniquement |
| **💵 Coûts** | Suivi coûts réels vs prévus | Tous |

---

# 👔 MODE D'EMPLOI - PROFIL MICHAEL (Chef de Projet)

## 📊 1. TABLEAU DE BORD

### Vue d'ensemble
Au chargement, vous voyez :
- **Planning d'avancement global** : Barre de progression générale du projet
- **4 statistiques clés** :
  - Total des phases (7)
  - Phases terminées
  - Phases en cours
  - Phases en attente
- **Bouton Réinitialiser le projet** (encadré blanc)
- **Liste détaillée des 7 phases**

### Consulter une phase
1. Cliquez sur n'importe quelle phase pour l'ouvrir
2. Vous voyez :
   - Nom et description
   - Statut actuel (Terminée, En cours, À faire, En attente validation)
   - Barre de progression (0-100%)
   - Budget prévu vs dépensé
3. Cliquez **"📋 Gérer les sous-tâches"** pour voir/créer des sous-tâches

---

## 📋 2. GESTION DES SOUS-TÂCHES

### Créer une sous-tâche
1. Ouvrez une phase
2. Cliquez **"📋 Gérer les sous-tâches"**
3. Cliquez **"Ajouter sous-tâche"**
4. Remplissez :
   - Nom de la tâche
   - Description
   - Coût estimé (XOF)
   - Date de début
5. Cliquez **"Créer"**

### Modifier/Supprimer une sous-tâche
- **Modifier** : Cliquez sur le nom pour éditer
- **Supprimer** : Bouton rouge **"Supprimer"** à droite
- ⚠️ La suppression est définitive

### Suivre l'avancement
- Vous voyez la progression de chaque sous-tâche (0-100%)
- Tanguy ajuste cette progression depuis le terrain
- Quand ≥80%, Tanguy peut valider → passe à 100%

---

## 💰 3. GESTION DES BUDGETS

### Budget Global du Projet

1. Cliquez sur l'onglet **"💰 Budget"**
2. Vous voyez 3 blocs :
   - **Budget total** (modifiable)
   - **Alloué aux phases** (somme des budgets des phases)
   - **Restant** (vert si positif, rouge si dépassement)

#### Modifier le budget global
1. Changez la valeur dans le champ **"Budget total (XOF)"**
2. Cliquez **"Enregistrer"**
3. ✅ Confirmation affichée

### Budgets par Phase

#### Modifier le budget d'une phase
1. Descendez jusqu'à **"Budgets par Phase"**
2. Trouvez la phase concernée
3. Changez la valeur dans **"Budget estimé (XOF)"**
4. Cliquez en dehors du champ (perte de focus)
5. ✅ Sauvegarde automatique

#### Surveiller les dépassements
- Si **Restant** est rouge → Budget global dépassé
- Réajustez les budgets des phases ou augmentez le budget global

---

## 💵 4. SUIVI DES COÛTS

### Vue d'ensemble
1. Cliquez sur l'onglet **"💵 Coûts"**
2. Vous voyez 3 indicateurs :
   - **Budget Total**
   - **Dépensé** (somme des coûts réels)
   - **Restant** (devient rouge si négatif)

### Enregistrer les coûts réels

#### Pour chaque phase :
1. Trouvez la phase dans le tableau
2. Dans la colonne **"Coût réel"**, entrez le montant dépensé
3. Cliquez en dehors du champ
4. ✅ Sauvegarde automatique

#### Interpréter les écarts :
- **Écart vert** = Dans le budget (coût réel < budget prévu)
- **Écart rouge + ⚠️** = Hors budget (coût réel > budget prévu)
- Colonne **Statut** :
  - 🟢 "Dans le budget"
  - 🔴 "Hors budget"
  - ⚪ "Pas de dépenses"

---

## ✅ 5. VALIDATIONS (Approbation finale 15%)

### Workflow de validation
Chaque phase suit ce processus en 2 étapes :

**Étape 1 - Tanguy valide techniquement :**
- Quand travaux avancent bien
- Tanguy clique **"Valider techniquement"**
- Phase passe à **85%**
- Statut : **"En attente validation Boss"** (jaune)
- Apparaît dans votre onglet **"✅ Validations"**

**Étape 2 - Vous approuvez les 15% finaux :**

1. Cliquez sur l'onglet **"✅ Validations"**
2. Vous voyez toutes les phases en attente (fond jaune)
3. Pour chaque phase :
   - Lisez les détails (nom, description, budget)
   - Vérifiez que les travaux sont satisfaisants
   - Cliquez **"Approuver 15% finaux"** (bouton vert)
4. Confirmez l'approbation
5. ✅ Phase passe à **100%** et statut **"Terminée"** (vert)

### Que faire si vous n'approuvez pas ?
- Contactez Tanguy pour demander des corrections
- Ne cliquez pas sur "Approuver"
- Une fois approuvé, c'est définitif (sauf reset complet du projet)

---

## 📈 6. PLANNING GANTT

### Vue chronologique
1. Cliquez sur l'onglet **"📈 Gantt"**
2. Vous voyez :
   - **Planning d'avancement** (identique au Dashboard)
   - **Liste chronologique** des 7 phases avec :
     - Numéro d'ordre
     - Nom et description
     - Statut visuel (pastille de couleur)
     - Barre de progression
     - Budget

### Utilité
- Vision globale de l'enchaînement des phases
- Suivi de l'avancement en un coup d'œil
- Identification rapide des phases en retard

---

## 🔴 7. RÉINITIALISER LE PROJET

### ⚠️ ATTENTION : Action irréversible !

#### Quand utiliser cette fonction ?
- Démarrage d'un nouveau projet
- Erreur majeure nécessitant un redémarrage complet
- Test de l'application

#### Comment réinitialiser :

1. Allez sur le **Dashboard**
2. Trouvez l'encadré blanc **"Réinitialisation du projet"**
3. Cliquez sur le bouton rouge **"Réinitialiser"**
4. Un encadré rouge s'affiche avec la liste complète des suppressions
5. **Lisez attentivement** les conséquences
6. Si vous êtes sûr, cliquez **"Oui, réinitialiser définitivement"**
7. ⏳ Patientez 5-10 secondes
8. ✅ La page se recharge avec tout remis à zéro

#### Ce qui est supprimé :
- ✗ Toutes les progressions (remises à 0%)
- ✗ Tous les statuts (remis à "À faire")
- ✗ Toutes les sous-tâches
- ✗ Toutes les photos uploadées
- ✗ Tous les rapports de chantier
- ✗ Toutes les validations (Tanguy et Michael)
- ✗ Tous les coûts réels (remis à 0)

#### Ce qui est CONSERVÉ :
- ✓ Les 7 phases principales
- ✓ Les budgets prévisionnels
- ✓ Les comptes utilisateurs
- ✓ Le budget global du projet

---

# 📋 MODE D'EMPLOI - PROFIL TANGUY (Coordinateur)

## 📊 1. TABLEAU DE BORD

### Vue d'ensemble
Au chargement, vous voyez :
- **Planning d'avancement global** : Progression générale
- **4 statistiques clés**
- **Liste des 7 phases**
- ❌ Pas de bouton "Réinitialiser" (réservé à Michael)

### Consulter une phase
Identique à Michael (voir ci-dessus)

---

## 📋 2. GESTION DES SOUS-TÂCHES

### Créer une sous-tâche
✅ **Vous pouvez créer des sous-tâches** (même processus que Michael)

1. Ouvrez une phase
2. Cliquez **"📋 Gérer les sous-tâches"**
3. Cliquez **"Ajouter sous-tâche"**
4. Remplissez le formulaire
5. Cliquez **"Créer"**

### Mettre à jour la progression

#### Ajuster le pourcentage :
1. Ouvrez les sous-tâches d'une phase
2. Trouvez la sous-tâche concernée
3. **Déplacez le slider** de progression (0-100%)
4. ✅ Sauvegarde automatique en temps réel

#### Quand utiliser :
- Début des travaux → 10-20%
- Mi-parcours → 50%
- Quasi fini → 70-80%
- Prêt pour validation → ≥80%

### Valider une sous-tâche (technique)

#### Quand une sous-tâche atteint ≥80% :
1. Vérifiez que les travaux sont bien faits
2. Prenez des photos (voir section suivante)
3. Rédigez un rapport de chantier
4. Cliquez **"Valider"**
5. ✅ Sous-tâche passe à **100%** et statut **"Terminée"**

---

## 📸 3. PHOTOS ET RAPPORTS DE CHANTIER

### Uploader des photos

1. Ouvrez les sous-tâches d'une phase
2. Trouvez la sous-tâche concernée
3. Cliquez **"Photos & Rapport"**
4. Dans la section photos :
   - Cliquez **"Choisir un fichier"** ou glissez-déposez
   - Sélectionnez une photo depuis votre appareil
   - ✅ Upload automatique
5. La photo apparaît dans la galerie (3 colonnes)

#### Bonnes pratiques :
- Prenez des photos AVANT et APRÈS les travaux
- Photos claires et bien éclairées
- Plusieurs angles si nécessaire
- Évitez les photos floues

### Rédiger un rapport de chantier

1. Toujours dans **"Photos & Rapport"**
2. Trouvez le champ **"Rapport de chantier"**
3. Rédigez un compte-rendu détaillé :
   - Travaux effectués
   - Difficultés rencontrées
   - Matériaux utilisés
   - Points d'attention
   - Observations
4. Cliquez **"Enregistrer le rapport"**
5. ✅ Confirmation affichée

#### Exemple de rapport :
```
Date: 26/12/2024
Travaux: Installation tableau électrique principal
Matériaux: Disjoncteur 40A, câbles 6mm², gaines ICTA
Durée: 4 heures
Difficultés: Mur en béton armé, nécessité de percer avec marteau-piqueur
État: Travaux terminés, conforme aux normes NF C 15-100
Observations: Prêt pour validation et mise sous tension
```

---

## ✅ 4. VALIDATION TECHNIQUE DES PHASES

### Workflow de validation (votre rôle)

#### Quand valider une phase ?
- Toutes les sous-tâches sont à 100% (ou la majorité)
- Les travaux sont de bonne qualité
- Les photos et rapports sont à jour
- Vous êtes satisfait du résultat technique

#### Comment valider :

**Option 1 - Depuis le Dashboard :**
1. Ouvrez la phase concernée
2. Si progression ≥70%, un bouton **"Valider techniquement"** apparaît
3. Cliquez dessus
4. Confirmez la validation
5. ✅ Phase passe à **85%** et statut **"En attente Boss"** (jaune)

**Option 2 - Depuis l'onglet Validations :**
1. Allez dans **"✅ Validations"**
2. Vous voyez les phases prêtes à valider
3. Cliquez **"Valider techniquement"**
4. ✅ Phase validée à 85%

#### Après votre validation :
- La phase apparaît dans l'onglet Validations de **Michael**
- Il doit approuver les **15% finaux**
- Une fois approuvé par Michael → Phase à **100%**, statut **"Terminée"**

---

## 💵 5. SUIVI DES COÛTS

### Consultation uniquement
1. Cliquez sur l'onglet **"💵 Coûts"**
2. Vous voyez :
   - Budget total, dépensé, restant
   - Tableau des coûts par phase
3. ❌ **Vous ne pouvez PAS modifier les coûts réels**
   - Seul Michael peut enregistrer les dépenses
   - Vous pouvez consulter pour information

### Utilité pour vous :
- Vérifier que vous restez dans les budgets
- Alerter Michael si risque de dépassement
- Ajuster vos choix matériaux si nécessaire

---

## 💰 6. BUDGETS

### ❌ Onglet non accessible
- L'onglet **"💰 Budget"** n'apparaît pas pour vous
- Seul Michael peut modifier les budgets
- Vous voyez les budgets dans l'onglet **Coûts** (lecture seule)

---

## 📈 7. PLANNING GANTT

### Vue chronologique
Identique à Michael :
1. Cliquez sur **"📈 Gantt"**
2. Vue globale des 7 phases avec progression
3. Utile pour :
   - Voir l'enchaînement logique des travaux
   - Identifier les phases en retard
   - Planifier vos interventions

---

## 📞 8. COMMUNICATION AVEC MICHAEL

### Quand contacter Michael ?

#### Pour validation finale :
- Vous avez validé techniquement à 85%
- La phase attend son approbation finale
- Si urgent, rappelez-lui de vérifier l'onglet **"✅ Validations"**

#### Pour problèmes budgétaires :
- Dépassement de budget constaté
- Besoin d'acheter du matériel non prévu
- Coûts plus élevés que prévu

#### Pour problèmes techniques :
- Difficultés nécessitant une décision
- Modifications du plan initial
- Problèmes de qualité ou sécurité

---

## 🎯 RÉSUMÉ - VOS MISSIONS QUOTIDIENNES

### Arrivée sur le chantier
1. ✅ Connectez-vous à Bricol
2. ✅ Consultez le Dashboard
3. ✅ Identifiez les phases en cours

### Pendant les travaux
1. ✅ Créez des sous-tâches si nécessaire
2. ✅ Mettez à jour les progressions régulièrement (slider)
3. ✅ Prenez des photos de l'avancement
4. ✅ Rédigez des rapports de chantier

### Fin de journée / Fin de sous-tâche
1. ✅ Validez les sous-tâches terminées (≥80%)
2. ✅ Uploadez toutes les photos prises
3. ✅ Finalisez les rapports de chantier
4. ✅ Mettez à jour les progressions

### Fin de phase
1. ✅ Vérifiez que toutes les sous-tâches sont à 100%
2. ✅ Validez techniquement la phase (85%)
3. ✅ Informez Michael que la phase attend son approbation

---

# ⚡ ASTUCES ET BONNES PRATIQUES

## Pour Michael

### Gestion budgétaire
- ✅ Mettez à jour les coûts réels **chaque semaine**
- ✅ Surveillez l'encadré "Restant" (vert = OK, rouge = alerte)
- ✅ Ajustez les budgets des phases futures si dépassement

### Validations
- ✅ Vérifiez l'onglet **"✅ Validations"** quotidiennement
- ✅ Ne laissez pas les phases en attente trop longtemps
- ✅ Avant d'approuver, consultez les photos et rapports

### Sous-tâches
- ✅ Créez des sous-tâches détaillées pour chaque phase
- ✅ Divisez les gros travaux en petites tâches mesurables
- ✅ Exemple : "Électricité" → 10 sous-tâches (tableau, prises, éclairage, etc.)

## Pour Tanguy

### Progressions
- ✅ Mettez à jour **tous les jours** les sliders de progression
- ✅ Soyez réaliste dans vos estimations (ni trop optimiste ni trop pessimiste)
- ✅ 80% = vraiment presque fini, prêt pour validation

### Photos
- ✅ AVANT de commencer les travaux → photo de l'état initial
- ✅ PENDANT → photos des étapes clés
- ✅ APRÈS → photos du résultat final
- ✅ Minimum 3 photos par sous-tâche

### Rapports
- ✅ Écrivez des rapports **clairs et détaillés**
- ✅ Mentionnez toujours : date, travaux, matériaux, durée, observations
- ✅ Signalez les problèmes ou difficultés rencontrées
- ✅ Un bon rapport = Michael comprend sans avoir besoin de demander

---

# 🆘 PROBLÈMES FRÉQUENTS ET SOLUTIONS

## "Je ne vois pas mes sous-tâches"
1. Vérifiez que vous avez bien cliqué sur **"📋 Gérer les sous-tâches"**
2. Rafraîchissez la page (F5)
3. Si le problème persiste, déconnectez-vous et reconnectez-vous

## "Impossible d'uploader une photo"
1. Vérifiez la taille de la photo (< 5 Mo)
2. Format accepté : JPG, PNG, JPEG
3. Vérifiez votre connexion Internet
4. Réessayez après quelques secondes

## "L'application est lente"
- **Première connexion** : Normal, le serveur se réveille (5-10 secondes)
- **Connexions suivantes** : Devrait être rapide
- Si toujours lent : Rafraîchissez (F5)

## "Je ne vois pas l'onglet Budget" (Tanguy)
- Normal ! Cet onglet est **réservé à Michael**
- Vous pouvez consulter les budgets dans l'onglet **"💵 Coûts"**

## "Le bouton Réinitialiser n'apparaît pas" (Michael)
- Vérifiez que vous êtes bien connecté en tant que **Michael**
- Le bouton est dans le Dashboard, encadré blanc avant la liste des phases
- Si absent, rafraîchissez la page

---

# 📱 UTILISATION SUR MOBILE

## Responsive
- ✅ L'application fonctionne sur smartphone et tablette
- ✅ Toutes les fonctionnalités sont accessibles
- ✅ Interface adaptée à la taille de l'écran

## Conseils mobile
- Upload photos : Utilisez l'appareil photo directement
- Rapports : Utilisez la dictée vocale pour aller plus vite
- Sliders : Glissez avec le doigt pour ajuster la progression

---

# 📞 SUPPORT

## En cas de problème technique
1. Rafraîchissez la page (F5)
2. Déconnectez-vous et reconnectez-vous
3. Videz le cache du navigateur
4. Si le problème persiste, contactez l'administrateur système

## Améliorations / Suggestions
- Notez vos idées d'amélioration
- Partagez avec Michael pour transmission à l'équipe technique

---

# ✅ CHECKLIST DE DÉMARRAGE

## Michael - Premier lancement
- [ ] Me connecter avec michael / chantier2025
- [ ] Explorer les 5 onglets (Dashboard, Gantt, Validations, Budget, Coûts)
- [ ] Vérifier les 7 phases principales
- [ ] Créer 2-3 sous-tâches de test sur la phase "Électricité"
- [ ] Modifier le budget d'une phase
- [ ] Enregistrer un coût réel de test
- [ ] Tester le bouton Réinitialiser (optionnel)

## Tanguy - Premier lancement
- [ ] Me connecter avec tanguy / coordinateur123
- [ ] Explorer les 4 onglets (Dashboard, Gantt, Validations, Coûts)
- [ ] Créer une sous-tâche de test
- [ ] Ajuster un slider de progression
- [ ] Uploader une photo de test
- [ ] Rédiger un rapport de test
- [ ] Valider une sous-tâche à 100%
- [ ] Valider une phase techniquement à 85%

---

**🎉 Vous êtes prêt à utiliser Bricol ! Bon chantier ! 🏗️**
