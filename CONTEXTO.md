# 📖 Contexto e Arquitetura do Projeto — Curioso

> Um manifesto técnico sobre a motivação, design, arquitetura autônoma e visão de futuro do **Curioso**.

---

## 🎯 1. O que é o Curioso?

O **Curioso** nasceu da necessidade real de desenvolvedores, administradores de sistemas (SysAdmins), analistas de DevOps e entusiastas de infraestrutura/homelab que precisam de uma ferramenta **centralizada, ultra-rápida e autônoma** para duas tarefas fundamentais do dia a dia:

1. **Gestão de Demandas & Tarefas (Quadro Kanban):** Acompanhar incidentes, rotinas, deploys e tarefas pessoais sem a lentidão ou complexidade de ferramentas pesadas como Jira, Notion ou Trello.
2. **Cofre de Snippets & Scripts:** Um bloco seguro e rápido para armazenar comandos shell, scripts de automação (Bash/PowerShell), queries SQL e procedimentos de infraestrutura, com botão de cópia em 1 clique para colar direto no terminal.

---

## 💡 2. Princípios de Design & Filosofia

O projeto foi concebido sob quatro pilares fundamentais:

### 🪶 A. "Zero-Fat" (Extremamente Leve)
- A maioria das ferramentas modernas exige containers Docker volumosos, instâncias do PostgreSQL, Redis e múltiplos serviços auxiliares que consomem facilmente 1 GB a 2 GB de RAM antes mesmo do primeiro acesso.
- O Curioso foi desenvolvido para rodar com apenas **~70 MB a 90 MB de RAM**, consumindo praticamente **0% de CPU em repouso**. Ele roda com extrema folga em uma VPS de R$ 15, em uma VM local do Proxmox/VirtualBox ou até em um Raspberry Pi antigo.

### 🔌 B. Totalmente Autônomo e Sem Banco Externo
- O armazenamento utiliza um banco de dados local em formato JSON (`data.json`) gerenciado de forma assíncrona através do módulo nativo `fs/promises` do Node.js.
- **Vantagem:** Backup e portabilidade instantâneos. Quer migrar de servidor? Basta copiar o `data.json` para outra máquina e pronto. Sem scripts de dump, sem migrações de schema e sem configurações de permissões de banco.

### 🔐 C. Segurança Nativa e Pragmática
- **Zero bibliotecas externas pesadas de autenticação:** Não depende de NextAuth, Passport ou serviços terceiros de login (Auth0, Firebase).
- Senhas são transformadas em hash criptográfico **SHA-256** antes de qualquer gravação.
- A persistência de sessão utiliza cookies seguros assinados digitalmente com **HMAC-SHA256** e proteção `httpOnly`.
- As credenciais de acesso ficam protegidas em `.env.local` e nunca são versionadas no Git.

### 🌐 D. Multiplataforma Real (Linux & Windows)
- O Curioso não é "adaptado" para rodar em outro sistema; ele possui scripts de automação desenvolvidos especificamente para cada ecossistema:
  - **Linux:** Instalador recursivo `setup.sh` com suporte nativo ao gerenciador de processos PM2 e systemd.
  - **Windows:** Instalador `setup.ps1` compatível com PowerShell 5.1/7+, além de atalhos de inicialização em segundo plano 100% invisíveis (`iniciar-segundo-plano.vbs` e `iniciar.bat`).

---

## 🏗️ 3. Arquitetura da Aplicação

O projeto adota o que há de mais moderno no ecossistema web atual:

```text
[ Cliente (Navegador) ]
          │
          ▼  (HTTP / Porta 3000)
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│                                                        │
│  ┌──────────────────┐          ┌────────────────────┐  │
│  │    Middleware    │ ───────► │   /login (Pública) │  │
│  │ (Auth Gatekeeper)│          └────────────────────┘  │
│  └────────┬─────────┘                                  │
│           │ (Cookie HMAC Válido)                       │
│           ▼                                            │
│  ┌──────────────────┐          ┌────────────────────┐  │
│  │   / (Kanban UI)  │          │  /snippets (UI)    │  │
│  └────────┬─────────┘          └─────────┬──────────┘  │
│           │                              │             │
│           ▼                              ▼             │
│  ┌──────────────────┐          ┌────────────────────┐  │
│  │  /api/tasks      │          │  /api/snippets     │  │
│  └────────┬─────────┘          └─────────┬──────────┘  │
│           └──────────────┬───────────────┘             │
│                          ▼                             │
│               [ src/lib/db.ts ]                        │
└──────────────────────────┼─────────────────────────────┘
                           ▼
                 ┌───────────────────┐
                 │     data.json     │
                 │ (Banco Embutido)  │
                 └───────────────────┘
```

### 📁 Estrutura de Diretórios
- **`src/app/`**: Rotas da aplicação (App Router do Next.js).
  - `page.tsx`: Interface principal do Quadro Kanban com filtros e métricas.
  - `login/page.tsx`: Tela de autenticação com design Dark Mode moderno.
  - `snippets/page.tsx`: Cofre de scripts com realce visual e cópia rápida.
  - `api/`: Rotas de backend RESTful (`/api/tasks`, `/api/snippets`, `/api/auth`).
- **`src/lib/`**:
  - `auth.ts`: Motor criptográfico (hash de senhas, validação de tokens e assinatura HMAC).
  - `db.ts`: Driver de persistência atômica no `data.json`.
- **`src/middleware.ts`**: Interceptador global de rotas que garante que nenhuma página ou API seja acessada sem credenciais ativas.
- **Scripts de Infraestrutura:**
  - `setup.sh` / `setup.ps1`: Instaladores automatizados com assistente de criação de credenciais.
  - `update.sh` / `update.bat`: Atualizadores de 1 clique via Git.
  - `iniciar-segundo-plano.vbs`: Inicializador invisível para Windows.
  - `server.js`: Servidor de produção padronizado para gerenciadores de processo.

---

## 🗺️ 4. Casos de Uso Comuns

O Curioso foi desenhado especialmente para:

1. **Homelab & Servidores Pessoais:** Uma interface bonita e sempre acessível na rede local para acompanhar tarefas da casa, manutenções de rede e scripts de backup.
2. **Máquinas Virtuais de Trabalho:** Painel interno dentro de VMs de desenvolvimento ou laboratório para armazenar comandos rápidos de provisionamento e testes.
3. **Desenvolvedores Solo:** Central de notas rápidas de código e tarefas sem precisar abrir navegadores pesados com abas infinitas de ferramentas de terceiros.
4. **Equipes Pequenas em Rede Interna:** Um quadro compartilhado que roda em um servidor da rede local sem custos de licença ou dependência de nuvem pública.

---

## 🔮 5. Visão de Futuro e Roadmap

Para quem deseja contribuir ou acompanhar a evolução do projeto:

- [x] Autenticação nativa por usuário e senha com hash SHA-256.
- [x] Interface Kanban completa com 4 estágios e navegação em 1 clique.
- [x] Suporte multiplataforma (Linux + Windows).
- [x] Scripts de instalação e atualização em 1 comando.
- [ ] Exportação e importação de backups do `data.json` direto pela interface web.
- [ ] Implementação de arrastar e soltar (Drag and Drop) nos cards do Kanban.
- [ ] Módulo de Notas Rápidas / Markdown Scratchpad.
- [ ] Suporte opcional a múltiplos usuários com perfis individuais.

---

## 🤝 6. Contribuição e Comunidade

O **Curioso** é um projeto de código aberto sob a licença MIT. Qualquer contribuição, abertura de issue, sugestão de melhoria ou pull request é extremamente bem-vinda!

Para clonar e rodar o projeto localmente em modo de desenvolvimento:
```bash
git clone https://github.com/Sousatutu/app-curioso.git
cd app-curioso
npm install
npm run dev
```
Acesse em: `http://localhost:3000`
