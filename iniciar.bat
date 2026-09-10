@echo off
title Curioso - Painel Pessoal
echo =================================================================
echo    Iniciando Curioso no Windows...
echo =================================================================

if not exist ".env.local" (
    echo [!] Arquivo .env.local nao encontrado!
    echo     Executando instalador inicial...
    powershell -ExecutionPolicy Bypass -File .\setup.ps1
    pause
    exit /b
)

echo [*] Iniciando servidor Next.js em http://localhost:3000 ...
npm run start
pause
