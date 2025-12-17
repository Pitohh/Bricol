#!/bin/bash

# Script de démarrage rapide pour Bricol PWA
# Usage: ./start.sh

echo "🏗️  Bricol - Suivi Chantier Orphelinat"
echo "======================================"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé."
    echo "📥 Installez Node.js 18+ depuis https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

echo "🚀 Démarrage de l'application..."
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔒 Comptes de test:"
echo "   - michael / chantier2025 (Boss)"
echo "   - tanguy / coordinateur123 (Coordinateur)"
echo "   - yassa / menuiserie (Artisan)"
echo ""
echo "🛑 Arrêter: Ctrl+C"
echo ""

# Démarrer l'application
npm run dev
