#!/usr/bin/env bash
set -e

# ==============================================================================
# Curioso - Script de Instalação e Configuração Automatizada
# ==============================================================================

echo "================================================================="
echo "   🚀 Instalador Automatizado — Curioso (Painel & Cofre)         "
echo "================================================================="
echo ""

# 1. Verificar se está sendo executado como root diretamente
if [ "$EUID" -eq 0 ]; then
  echo "⚠️  Aviso: Não é recomendado rodar a aplicação permanentemente como root."
  echo "   Recomendamos executar este script como usuário comum (com acesso sudo)."
  read -p "Deseja continuar mesmo assim? (s/N): " CONTINUE_ROOT
  if [[ "$CONTINUE_ROOT" != "s" && "$CONTINUE_ROOT" != "S" ]]; then
    echo "Instalação cancelada."
    exit 1
  fi
fi

# 2. Verificar/Instalar Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "📦 Node.js não encontrado. Instalando Node.js v20 LTS..."
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update -y
    sudo apt-get install -y curl ca-certificates
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  else
    echo "❌ Gerenciador de pacotes apt não encontrado. Por favor instale o Node.js v20+ manualmente."
    exit 1
  fi
else
  NODE_VER=$(node -v)
  echo "✅ Node.js detectado ($NODE_VER)"
fi

# 3. Verificar/Instalar PM2
if ! command -v pm2 >/dev/null 2>&1; then
  echo "📦 PM2 não encontrado. Instalando globalmente via npm..."
  sudo npm install -g pm2
else
  echo "✅ PM2 detectado"
fi

# 4. Configuração de Credenciais Interativa
echo ""
echo "-----------------------------------------------------------------"
echo "🔐 Configuração de Acesso (Login & Senha)"
echo "-----------------------------------------------------------------"

while true; do
  read -p "Digite o NOME DE USUÁRIO desejado: " USER_INPUT
  if [ -n "$USER_INPUT" ]; then
    break
  fi
  echo "❌ O usuário não pode ser vazio."
done

while true; do
  read -s -p "Digite a SENHA desejada: " PASS_INPUT
  echo ""
  if [ -z "$PASS_INPUT" ]; then
    echo "❌ A senha não pode ser vazia."
    continue
  fi
  read -s -p "Confirme a SENHA: " PASS_CONFIRM
  echo ""
  if [ "$PASS_INPUT" == "$PASS_CONFIRM" ]; then
    break
  else
    echo "❌ As senhas não coincidem. Tente novamente."
  fi
done

echo ""
echo "⚙️  Gerando hashes criptográficos seguros..."

# Gerar SHA-256 da senha e segredo aleatório via node
SECRETS_JSON=$(node -e "
  const crypto = require('crypto');
  const pass = process.argv[1];
  const hash = crypto.createHash('sha256').update(pass).digest('hex');
  const secret = crypto.randomBytes(32).toString('hex');
  console.log(JSON.stringify({ hash, secret }));
" "$PASS_INPUT")

PASS_HASH=$(echo "$SECRETS_JSON" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).hash)")
SESSION_SECRET=$(echo "$SECRETS_JSON" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).secret)")

# Escrever .env.local
cat > .env.local << EOF
AUTH_USERNAME=$USER_INPUT
AUTH_PASSWORD_HASH=$PASS_HASH
SESSION_SECRET=$SESSION_SECRET
EOF

chmod 600 .env.local
echo "✅ Arquivo .env.local gerado com sucesso!"

# 5. Inicializar data.json zerado caso não exista
if [ ! -f "data.json" ]; then
  cat > data.json << EOF
{
  "tasks": [],
  "notes": [],
  "snippets": []
}
EOF
  echo "✅ Banco local data.json inicializado."
fi

# 6. Instalar dependências e compilar Next.js
echo ""
echo "📦 Instalando dependências (npm install)..."
npm install

echo ""
echo "🏗️  Compilando a aplicação para produção (npm run build)..."
npm run build

# 7. Iniciar com PM2 e salvar
echo ""
echo "🚀 Registrando processo no PM2..."
pm2 delete curioso 2>/dev/null || true
pm2 start npm --name "curioso" -- run start -- -H 0.0.0.0 -p 3000
pm2 save

# 8. Configurar startup automático se disponível
if command -v systemctl >/dev/null 2>&1; then
  echo ""
  echo "🔄 Configurando reinicialização automática com o sistema operacional..."
  pm2 startup systemd -u "$USER" --hp "$HOME" 2>/dev/null || true
fi

# 9. Conclusão
IP_LOCAL=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")

echo ""
echo "================================================================="
echo "   🎉 Instalação do Curioso concluída com sucesso!               "
echo "================================================================="
echo ""
echo "🌐 Acesse no seu navegador:"
echo "   http://${IP_LOCAL}:3000"
echo ""
echo "👤 Usuário cadastrado: $USER_INPUT"
echo "🔑 Senha: (a que você definiu)"
echo ""
echo "Para redefinir a senha no futuro: ./reset-password.sh"
echo "================================================================="
