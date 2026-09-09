# Curioso — Painel Pessoal & Cofre de Infraestrutura

Um painel leve, moderno e robusto para organização de rotinas, gestão de atividades e armazenamento de scripts/comandos de infraestrutura com cópia em um clique.

Projetado para rodar em servidores locais, VMs e homelabs (Debian, Ubuntu e derivados).

---

## 🚀 Funcionalidades

- **📋 Gestão de Tarefas (CRUD):** 
  - Criação rápida com carimbo de data e hora.
  - Edição inline sem recarregar a tela.
  - Controle de status (*Pendente* / *Concluída*) com barra de progresso em tempo real.
  - Filtros dinâmicos (*Todas*, *Pendentes*, *Concluídas*).

- **💻 Cofre de Snippets:**
  - Armazenamento de blocos de scripts, automações e queries SQL.
  - Categorização por linguagem (Bash, PowerShell, SQL, C#, Node.js, Texto).
  - Cópia em 1 clique para a área de transferência.
  - Edição e exclusão simples.

- **🔐 Autenticação Nativa Integrada:**
  - Tela de login com design moderno (dark mode nativo).
  - Proteção por middleware em todas as rotas.
  - Senha gravada apenas em hash **SHA-256**.
  - Sessão baseada em cookies seguros assinados com **HMAC-SHA256**.
  - **Zero dependências externas de autenticação** (utiliza os módulos nativos do Node.js).

- **🗄️ Armazenamento Autônomo:**
  - Banco local em JSON (`data.json`) via `fs/promises`.
  - Sem necessidade de configurar bancos pesados (MySQL, PostgreSQL ou Docker).

---

## ⚡ Instalação Rápida (1 Comando)

Clone o repositório e execute o script de instalação automatizado:

```bash
git clone <URL_DO_SEU_REPOSITORIO> curioso
cd curioso
chmod +x setup.sh
./setup.sh
```

### O que o instalador faz sozinho:
1. ✅ Verifica e instala automaticamente **Node.js (v20+)**, **npm** e **PM2** se necessário.
2. ✅ Solicita interativamente o **usuário** e a **senha** que você deseja cadastrar.
3. ✅ Calcula os hashes criptográficos e cria o `.env.local` protegido.
4. ✅ Instala as dependências (`npm install`) e compila o projeto otimizado (`npm run build`).
5. ✅ Inicia o processo no **PM2** e configura inicialização automática no boot do sistema operacional.

---

## 🔑 Trocar Usuário ou Senha

Para redefinir o login ou a senha a qualquer momento, execute:

```bash
chmod +x reset-password.sh
./reset-password.sh
```

O script atualizará as credenciais e reiniciará a aplicação instantaneamente.

---

## 🛠️ Comandos Úteis do Dia a Dia

```bash
# Ver status do serviço
pm2 status

# Ver logs em tempo real
pm2 logs curioso

# Reiniciar a aplicação
pm2 restart curioso

# Parar a aplicação
pm2 stop curioso
```

---

## 🔒 Boas Práticas de Segurança

- Por padrão, o painel fica disponível na porta `3000` (`http://IP_DO_SERVIDOR:3000`).
- Recomenda-se utilizar um firewall (`ufw`) ou colocar atrás de um proxy reverso (Nginx/Caddy/Cloudflare Tunnel) com terminação SSL/HTTPS se exposto à internet.
