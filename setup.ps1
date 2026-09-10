<#
.SYNOPSIS
    Script de Instalacao e Inicializacao Automatizada do Curioso no Windows (PowerShell).
    Compativel com PowerShell 5.1 e PowerShell 7+ (sem caracteres especiais que causem falhas de parsing).
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   Instalador Automatizado - Curioso (Windows PowerShell)        " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se nao esta rodando no system32
$currentDir = Get-Location
if ($currentDir.Path -like "*\system32*") {
    Write-Host "[!] AVISO: Voce esta executando dentro de C:\Windows\System32." -ForegroundColor Yellow
    Write-Host "    Recomendamos mover a pasta do projeto para C:\Projetos ou para sua pasta de Usuario." -ForegroundColor Yellow
    Write-Host ""
}

# 2. Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[-] Node.js nao foi encontrado no seu Windows." -ForegroundColor Red
    Write-Host "    Por favor instale o Node.js LTS em https://nodejs.org/ ou execute:" -ForegroundColor Yellow
    Write-Host "    winget install OpenJS.NodeJS.LTS" -ForegroundColor White
    exit 1
} else {
    $nodeVer = node -v
    Write-Host "[+] Node.js detectado: $nodeVer" -ForegroundColor Green
}

# 3. Configurar Credenciais Interativas
Write-Host ""
Write-Host "-----------------------------------------------------------------" -ForegroundColor Gray
Write-Host "[*] Configuracao de Acesso (Login e Senha)" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------------" -ForegroundColor Gray

do {
    $username = Read-Host "Digite o NOME DE USUARIO desejado"
    if ([string]::IsNullOrWhiteSpace($username)) {
        Write-Host "[-] O usuario nao pode ser vazio." -ForegroundColor Red
    }
} while ([string]::IsNullOrWhiteSpace($username))

do {
    $pass1 = Read-Host "Digite a SENHA desejada" -AsSecureString
    $pass1BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass1)
    $plainPass1 = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($pass1BSTR)

    $pass2 = Read-Host "Confirme a SENHA" -AsSecureString
    $pass2BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass2)
    $plainPass2 = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($pass2BSTR)

    if ([string]::IsNullOrWhiteSpace($plainPass1)) {
        Write-Host "[-] A senha nao pode ser vazia." -ForegroundColor Red
        $match = $false
    } elseif ($plainPass1 -ne $plainPass2) {
        Write-Host "[-] As senhas nao coincidem. Tente novamente." -ForegroundColor Red
        $match = $false
    } else {
        $match = $true
    }
} until ($match)

Write-Host ""
Write-Host "[*] Gerando hashes criptograficos seguros..." -ForegroundColor Gray

# Gerar SHA-256 e Session Secret via Node.js
$hashScript = @"
const crypto = require('crypto');
const pass = process.argv[1];
const hash = crypto.createHash('sha256').update(pass).digest('hex');
const secret = crypto.randomBytes(32).toString('hex');
console.log(JSON.stringify({ hash, secret }));
"@

$secretsJson = node -e $hashScript $plainPass1 | ConvertFrom-Json

# Criar .env.local
$envContent = @"
AUTH_USERNAME=$username
AUTH_PASSWORD_HASH=$($secretsJson.hash)
SESSION_SECRET=$($secretsJson.secret)
"@

Set-Content -Path ".env.local" -Value $envContent -Encoding utf8
Write-Host "[+] Arquivo .env.local gerado com sucesso!" -ForegroundColor Green

# 4. Criar data.json se nao existir
if (-not (Test-Path "data.json")) {
    $initialData = @"
{
  "tasks": [],
  "notes": [],
  "snippets": []
}
"@
    Set-Content -Path "data.json" -Value $initialData -Encoding utf8
    Write-Host "[+] Banco local data.json inicializado." -ForegroundColor Green
}

# 5. Instalar dependencias e compilar
Write-Host ""
Write-Host "[*] Instalando dependencias (npm install)..." -ForegroundColor Gray
npm install

Write-Host ""
Write-Host "[*] Compilando a aplicacao para producao (npm run build)..." -ForegroundColor Gray
npm run build

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "   Instalacao concluida com sucesso no Windows!                  " -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o servidor agora, execute:" -ForegroundColor Yellow
Write-Host "   npm run start" -ForegroundColor White
Write-Host ""
Write-Host "E acesse no navegador: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
