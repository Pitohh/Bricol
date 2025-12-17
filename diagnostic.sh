#!/bin/bash

echo "🔍 DIAGNOSTIC BRICOL - Analyse Complète"
echo "========================================"
echo ""

# Vérifier Node et npm
echo "📦 Versions:"
node --version
npm --version
echo ""

# Vérifier la structure
echo "📁 Structure du projet:"
echo "Backend routes:"
ls -1 server/routes/ 2>/dev/null || echo "❌ Dossier server/routes manquant"
echo ""
echo "Frontend components:"
ls -1 src/components/ 2>/dev/null || echo "❌ Dossier src/components manquant"
echo ""

# Vérifier les fichiers critiques
echo "📄 Fichiers critiques:"
critical_files=(
  "server/index.js"
  "server/config/database.js"
  "server/config/seed.js"
  "src/App.jsx"
  "src/contexts/AuthContext.jsx"
  "src/contexts/TaskContext.jsx"
  "src/utils/api.js"
  "package.json"
)

for file in "${critical_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file MANQUANT"
  fi
done
echo ""

# Vérifier la base de données
echo "💾 Base de données:"
if [ -f "server/database.sqlite" ]; then
  echo "✅ database.sqlite existe"
  # Compter les utilisateurs
  user_count=$(sqlite3 server/database.sqlite "SELECT COUNT(*) FROM users;" 2>/dev/null)
  if [ $? -eq 0 ]; then
    echo "   Utilisateurs: $user_count"
  fi
else
  echo "❌ database.sqlite manquante"
fi
echo ""

# Vérifier les dépendances
echo "📚 Dépendances manquantes:"
missing_deps=()
required=(
  "better-sqlite3"
  "multer"
  "jsonwebtoken"
  "bcryptjs"
  "socket.io"
)

for dep in "${required[@]}"; do
  if ! npm list "$dep" &>/dev/null; then
    missing_deps+=("$dep")
    echo "❌ $dep"
  fi
done

if [ ${#missing_deps[@]} -eq 0 ]; then
  echo "✅ Toutes les dépendances sont installées"
fi
echo ""

# Tester les ports
echo "🔌 Ports utilisés:"
port_3001=$(lsof -ti:3001 2>/dev/null)
port_5173=$(lsof -ti:5173 2>/dev/null)

if [ -n "$port_3001" ]; then
  echo "✅ Port 3001 (backend) : UTILISÉ (PID: $port_3001)"
else
  echo "⚠️  Port 3001 (backend) : LIBRE"
fi

if [ -n "$port_5173" ]; then
  echo "✅ Port 5173 (frontend) : UTILISÉ (PID: $port_5173)"
else
  echo "⚠️  Port 5173 (frontend) : LIBRE"
fi
echo ""

# Vérifier les erreurs dans les logs
echo "📋 Dernières erreurs (si le serveur tourne):"
if [ -n "$port_3001" ]; then
  curl -s http://localhost:3001/api/health 2>/dev/null && echo "✅ Backend répond" || echo "❌ Backend ne répond pas"
else
  echo "⚠️  Backend non démarré"
fi
echo ""

# Analyser App.jsx pour les imports
echo "🔍 Imports dans App.jsx:"
if [ -f "src/App.jsx" ]; then
  imports=$(grep -c "^import" src/App.jsx)
  echo "   Nombre d'imports: $imports"
  
  # Vérifier imports critiques
  grep -q "BudgetForm" src/App.jsx && echo "   ✅ BudgetForm importé" || echo "   ❌ BudgetForm manquant"
  grep -q "GanttView" src/App.jsx && echo "   ✅ GanttView importé" || echo "   ❌ GanttView manquant"
  grep -q "SubTaskList" src/App.jsx && echo "   ✅ SubTaskList importé" || echo "   ⚠️  SubTaskList non utilisé (normal)"
fi
echo ""

# Résumé
echo "========================================="
echo "📊 RÉSUMÉ:"
echo ""

errors=0
if [ ! -f "server/config/database.js" ]; then
  echo "❌ CRITIQUE: database.js manquant"
  ((errors++))
fi

if [ ${#missing_deps[@]} -gt 0 ]; then
  echo "❌ CRITIQUE: Dépendances manquantes (${#missing_deps[@]})"
  ((errors++))
fi

if [ -z "$port_3001" ]; then
  echo "⚠️  WARNING: Backend non démarré"
fi

if [ $errors -eq 0 ]; then
  echo "✅ Aucune erreur critique détectée"
else
  echo "❌ $errors erreur(s) critique(s) trouvée(s)"
fi

echo ""
echo "========================================="
