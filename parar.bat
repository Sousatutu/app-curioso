@echo off
title Parar Curioso
echo =================================================================
echo    Encerrando Curioso...
echo =================================================================

taskkill /F /IM node.exe >nul 2>&1

echo [*] Processos do Curioso encerrados com sucesso!
timeout /t 2 >nul
