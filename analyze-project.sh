#!/bin/bash

echo "╔════════════════════════════════════════════════╗"
echo "║   🔬 ANALYSE COMPLÈTE - BRICOL PROJECT        ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# 1. STRUCTURE DU PROJET
echo "📁 STRUCTURE DES FICHIERS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
tree -L 3 -I 'node_modules|dist|.git' --dirsfirst 2>/dev/null || {
  find . -maxdepth 3 -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | head -50
}
echo ""

# 2. BACKEND - Routes et Endpoints
echo "🔌 BACKEND - ROUTES API DISPONIBLES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "server/routes" ]; then
  for route_file in server/routes/*.js; do
    if [ -f "$route_file" ]; then
      filename=$(basename "$route_file")
      echo "📄 $filename:"
      grep -E "(router\.(get|post|put|delete|patch))" "$route_file" | \
        sed 's/router\./  /' | \
        sed "s/'/ /g" | \
        sed 's/,.*$//' | \
        head -20
      echo ""
    fi
  done
else
  echo "❌ Dossier server/routes/ introuvable"
fi
echo ""

# 3. BASE DE DONNÉES
echo "💾 BASE DE DONNÉES - TABLES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "server/database.sqlite" ]; then
  echo "✅ database.sqlite existe ($(du -h server/database.sqlite | cut -f1))"
  echo ""
  echo "Tables existantes:"
  sqlite3 server/database.sqlite ".tables"
  echo ""
  echo "Nombre d'utilisateurs:"
  sqlite3 server/database.sqlite "SELECT COUNT(*) as total FROM users;" 2>/dev/null
  echo ""
  echo "Nombre de phases:"
  sqlite3 server/database.sqlite "SELECT COUNT(*) as total FROM phases;" 2>/dev/null
  echo ""
  echo "Nombre de sous-tâches:"
  sqlite3 server/database.sqlite "SELECT COUNT(*) as total FROM sub_tasks;" 2>/dev/null || echo "0 (table manquante?)"
else
  echo "❌ database.sqlite introuvable"
fi
echo ""

# 4. FRONTEND - Composants
echo "⚛️  FRONTEND - COMPOSANTS REACT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "src/components" ]; then
  find src/components -name "*.jsx" -o -name "*.js" | while read comp; do
    echo "  📦 $comp"
  done | sort
else
  echo "❌ Dossier src/components/ introuvable"
fi
echo ""

# 5. API CLIENT - Points d'accès
echo "🌐 API CLIENT - ENDPOINTS CONFIGURÉS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "src/utils/api.js" ]; then
  echo "API_URL configurée:"
  grep -E "API_URL|localhost|http" src/utils/api.js | head -5
  echo ""
  echo "Modules API exportés:"
  grep -E "export const \w+Api" src/utils/api.js
else
  echo "❌ src/utils/api.js introuvable"
fi
echo ""

# 6. DÉPENDANCES
echo "📦 DÉPENDANCES INSTALLÉES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "package.json" ]; then
  echo "Backend:"
  jq -r '.dependencies | to_entries[] | "  \(.key): \(.value)"' package.json 2>/dev/null | grep -E "express|sqlite|jwt|multer|socket" || \
    grep -A 20 '"dependencies"' package.json | grep -E "express|sqlite|jwt|multer|socket"
else
  echo "❌ package.json introuvable"
fi
echo ""

# 7. CONFIGURATION
echo "⚙️  FICHIERS DE CONFIGURATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for config in .env netlify.toml vite.config.js render.yaml; do
  if [ -f "$config" ]; then
    echo "✅ $config"
  else
    echo "❌ $config (manquant)"
  fi
done
echo ""

# 8. PROBLÈMES POTENTIELS
echo "⚠️  DIAGNOSTIC - PROBLÈMES POTENTIELS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

issues=0

# Vérifier imports dans server/index.js
if [ -f "server/index.js" ]; then
  if ! grep -q "subTasksRoutes" server/index.js; then
    echo "❌ subTasksRoutes NON importé dans server/index.js"
    ((issues++))
  fi
else
  echo "❌ server/index.js manquant"
  ((issues++))
fi

# Vérifier route subtasks
if [ -f "server/routes/subTasks.js" ]; then
  endpoint_count=$(grep -c "router\." server/routes/subTasks.js)
  echo "✅ subTasks.js existe ($endpoint_count endpoints)"
else
  echo "❌ server/routes/subTasks.js MANQUANT"
  ((issues++))
fi

# Vérifier table sub_tasks
if [ -f "server/database.sqlite" ]; then
  if sqlite3 server/database.sqlite ".schema sub_tasks" &>/dev/null; then
    echo "✅ Table sub_tasks existe"
  else
    echo "❌ Table sub_tasks MANQUANTE dans la DB"
    ((issues++))
  fi
fi

# Vérifier PhaseDetail
if [ -f "src/components/Dashboard/PhaseDetail.jsx" ]; then
  if grep -q "SubTaskList" src/components/Dashboard/PhaseDetail.jsx; then
    echo "✅ PhaseDetail importe SubTaskList"
  else
    echo "⚠️  PhaseDetail n'importe pas SubTaskList"
  fi
else
  echo "❌ PhaseDetail.jsx MANQUANT"
  ((issues++))
fi

echo ""
if [ $issues -eq 0 ]; then
  echo "✅ Aucun problème critique détecté"
else
  echo "🔴 $issues problème(s) critique(s) trouvé(s)"
fi
echo ""

# 9. RÉSUMÉ
echo "╔════════════════════════════════════════════════╗"
echo "║              📊 RÉSUMÉ DE L'ANALYSE           ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "Backend:"
echo "  - Routes API: $(find server/routes -name "*.js" 2>/dev/null | wc -l) fichiers"
echo "  - Database: $([ -f server/database.sqlite ] && echo "✅ Existe" || echo "❌ Manquante")"
echo ""
echo "Frontend:"
echo "  - Composants: $(find src/components -name "*.jsx" 2>/dev/null | wc -l) fichiers"
echo "  - API Client: $([ -f src/utils/api.js ] && echo "✅ Configuré" || echo "❌ Manquant")"
echo ""
echo "Configuration:"
echo "  - Netlify: $([ -f netlify.toml ] && echo "✅" || echo "❌")"
echo "  - Vite: $([ -f vite.config.js ] && echo "✅" || echo "❌")"
echo ""

