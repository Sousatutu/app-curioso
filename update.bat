@echo off
title Atualizar Curioso
echo =================================================================
echo    Atualizando Curioso via Git...
echo =================================================================

echo [*] Puxando ultimas atualizacoes do GitHub...
git pull origin main

echo [*] Atualizando dependencias...
call npm install

echo [*] Recompilando aplicacao...
call npm run build

echo =================================================================
echo    Atualizacao concluida com sucesso!
echo =================================================================
echo Voce ja pode iniciar o sistema normalmente.
pause
