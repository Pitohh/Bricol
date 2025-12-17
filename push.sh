#!/bin/bash
echo "📤 Mise à jour GitHub..."
git add .
echo ""
echo "💬 Message du commit :"
read -p "> " message
git commit -m "$message"
git push origin main
echo ""
echo "✅ Dépôt mis à jour sur https://github.com/Pitohh/Bricol"
