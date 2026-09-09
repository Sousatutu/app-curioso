#!/usr/bin/env bash
set -e

echo "================================================================="
echo "   🔑 Redefinição de Credenciais — Curioso                      "
echo "================================================================="
echo ""

while true; do
  read -p "Novo NOME DE USUÁRIO: " USER_INPUT
  if [ -n "$USER_INPUT" ]; then
    break
  fi
  echo "❌ O usuário não pode ser vazio."
done

while true; do
  read -s -p "Nova SENHA: " PASS_INPUT
  echo ""
  if [ -z "$PASS_INPUT" ]; then
    echo "❌ A senha não pode ser vazia."
    continue
  fi
  read -s -p "Confirme a nova SENHA: " PASS_CONFIRM
  echo ""
  if [ "$PASS_INPUT" == "$PASS_CONFIRM" ]; then
    break
  else
    echo "❌ As senhas não coincidem. Tente novamente."
  fi
done

SECRETS_JSON=$(node -e "
  const crypto = require('crypto');
  const pass = process.argv[1];
  const hash = crypto.createHash('sha256').update(pass).digest('hex');
  const secret = crypto.randomBytes(32).toString('hex');
  console.log(JSON.stringify({ hash, secret }));
" "$PASS_INPUT")

PASS_HASH=$(echo "$SECRETS_JSON" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).hash)")
SESSION_SECRET=$(echo "$SECRETS_JSON" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).secret)")

cat > .env.local << EOF
AUTH_USERNAME=$USER_INPUT
AUTH_PASSWORD_HASH=$PASS_HASH
SESSION_SECRET=$SESSION_SECRET
EOF

chmod 600 .env.local

echo ""
echo "🔄 Reiniciando o processo no PM2 para aplicar novas credenciais..."
pm2 restart curioso --update-env 2>/dev/null || pm2 restart curioso

echo ""
echo "✅ Credenciais atualizadas com sucesso!"
echo "👤 Novo usuário: $USER_INPUT"
