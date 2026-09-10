#!/usr/bin/env bash
set -e

echo "================================================================="
echo "   Atualizando Curioso via Git (Linux)                          "
echo "================================================================="
echo ""

echo "[*] Puxando ultimas atualizacoes do GitHub..."
git pull origin main

echo "[*] Atualizando dependencias..."
npm install

echo "[*] Recompilando aplicacao..."
npm run build

echo "[*] Reiniciando processo no PM2..."
pm2 restart curioso --update-env 2>/dev/null || pm2 restart curioso 2>/dev/null || true

echo ""
echo "================================================================="
echo "   Atualizacao concluida com sucesso!                            "
echo "================================================================="
