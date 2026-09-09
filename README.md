# Curioso — Painel Pessoal & Cofre de Infraestrutura

Um painel leve, moderno e robusto para organização de rotinas, gestão de atividades em formato **Kanban** e armazenamento de scripts/comandos de infraestrutura com cópia em um clique.

Projetado com suporte nativo de alto desempenho tanto para **Linux** (Debian, Ubuntu, Rocky, Raspberry Pi) quanto para **Windows** (PowerShell Nativo ou WSL2).

---

## 💻 Requisitos do Sistema (Linux & Windows)

O sistema foi arquitetado para ser extremamente leve e econômico em consumo de recursos, rodando com folga em servidores dedicados, máquinas virtuais modestas ou notebooks pessoais:

### ⚙️ Hardware Mínimo Recomendado
| Componente | Mínimo | Recomendado |
|---|---|---|
| **Processador (CPU)** | 1 vCPU / 1 Core | 2 vCPUs ou superior |
| **Memória RAM** | 512 MB *(com swap ativo no build)* | 1 GB ou superior |
| **Armazenamento (Disco)** | 500 MB livres | 2 GB livres |
| **Arquitetura** | `x86_64` (amd64) ou `aarch64` (ARM64) | amd64 / ARM64 |

> 💡 *Nota de consumo:* Após compilado, a aplicação em execução consome apenas cerca de **70 MB a 90 MB de memória RAM**.

---

### 🐧 Requisitos para Linux
- **Sistemas Operacionais Testados:**
  - Debian 11, 12 e 13
  - Ubuntu 20.04, 22.04 e 24.04 LTS
  - Fedora, Rocky Linux, AlmaLinux, Arch Linux, Alpine Linux
  - Raspberry Pi OS
- **Pré-requisitos de Software:**
  - **Git:** para clonar o repositório (`sudo apt install git` no Debian/Ubuntu).
  - **Node.js (v18.18+ ou v20+ LTS), npm e PM2:** *(não se preocupe, o script `./setup.sh` detecta e instala tudo automaticamente se você ainda não tiver)*.

---

### 🪟 Requisitos para Windows
- **Sistemas Operacionais Testados:**
  - Windows 10 (Home / Pro / Enterprise)
  - Windows 11 (Home / Pro / Enterprise)
  - Windows Server 2019, 2022
- **Pré-requisitos de Software:**
  - **Node.js (LTS v20+):** Baixe e instale via [nodejs.org](https://nodejs.org/) ou via terminal com winget:
    ```powershell
    winget install OpenJS.NodeJS.LTS
    ```
  - **Git for Windows:** Baixe em [git-scm.com](https://git-scm.com/) ou:
    ```powershell
    winget install Git.Git
    ```
  - **PowerShell 5.1+ ou PowerShell 7+** *(padrão nativo do Windows)*.

---

### 🌐 Portas de Rede
- **Porta 3000 TCP** liberada para acesso web local (`http://localhost:3000` ou `http://IP_DO_COMPUTADOR:3000`).

---

## ⚡ Guia de Instalação Rápida

O repositório possui instaladores interativos automatizados tanto para ambientes Linux quanto para Windows.

### 🐧 Opção 1: No Linux (Instalação em 1 Comando)

Abra o terminal do seu servidor ou VM e execute:

```bash
git clone https://github.com/Sousatutu/app-curioso.git
cd app-curioso
chmod +x setup.sh
./setup.sh
```

**O que o instalador Linux faz:**
1. Instala Node.js v20 e PM2 automaticamente se necessário.
2. Solicita seu **usuário** e **senha** desejados na tela.
3. Gera o hash SHA-256 e as chaves de sessão automaticamente.
4. Compila o projeto otimizado e inicia no **PM2** com boot no systemd.

---

### 🪟 Opção 2: No Windows (PowerShell Nativo)

Abra o **PowerShell** (não precisa ser como Administrador) e rode:

```powershell
git clone https://github.com/Sousatutu/app-curioso.git
cd app-curioso
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

**O que o instalador Windows faz:**
1. Valida o ambiente Node.js.
2. Solicita interativamente seu **usuário** e **senha** (com máscara de caracteres).
3. Gera o `.env.local` e o banco `data.json` zerado.
4. Roda `npm install` e `npm run build`.
5. Deixa a aplicação pronta para rodar com `npm run start`!

---

## 🚀 Funcionalidades da Aplicação

- **📋 Quadro Kanban Completo & Flexível:** 
  - 4 colunas de fluxo: **A Fazer** (`TODO`), **Em Andamento** (`IN_PROGRESS`), **Em Revisão** (`REVIEW`) e **Concluído** (`DONE`).
  - Navegação e avanço de estágio rápido com 1 clique (botões ◀ e ▶).
  - Níveis de prioridade visual: *Baixa*, *Média*, *Alta* e *Crítica*.
  - Categorização por tipo de demanda: *Infraestrutura*, *Segurança*, *Deploy*, *Correção*, *Rotina* ou *Geral*.
  - Alternância instantânea entre **Visão Kanban** (Colunas) e **Visão em Lista**.
  - Campo de busca em tempo real e barra de progresso de conclusão.

- **💻 Cofre de Snippets:**
  - Armazenamento de scripts, consultas SQL e comandos frequentes.
  - Categorização por linguagem (Bash, PowerShell, SQL, C#, Node.js, Texto).
  - Botão de cópia rápida para a área de transferência com confirmação visual.

- **🔐 Autenticação Nativa Integrada:**
  - Login elegante com design Dark Mode nativo.
  - Senha gravada estritamente como hash **SHA-256**.
  - Sessões por cookies criptografados via **HMAC-SHA256**.
  - **Zero dependências externas de autenticação** (utiliza os módulos nativos do Node.js).

- **🗄️ Armazenamento Autônomo:**
  - Banco local embutido em JSON (`data.json`) via `fs/promises`.
  - Sem necessidade de instalar bancos relacionais externos pesados ou Docker.

---

## 🔑 Trocar Usuário ou Senha

- **No Linux:**
  ```bash
  chmod +x reset-password.sh
  ./reset-password.sh
  ```
- **No Windows:**
  Basta executar novamente o `setup.ps1` ou editar o arquivo `.env.local`.

---

## 🛠️ Gerenciamento do Serviço no Dia a Dia

### No Linux (com PM2):
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

### No Windows:
```powershell
# Iniciar a aplicação
npm run start

# Executar em segundo plano no Windows (opcional com pm2)
npm install -g pm2
pm2 start npm --name "curioso" -- run start
```

---

## 🔒 Recomendações de Segurança

- Por padrão, o painel roda na porta `3000` (`http://SEU_IP:3000`).
- Se exposto à internet, recomenda-se configurar um proxy reverso (Nginx no Linux ou Caddy/IIS no Windows) com certificado SSL/HTTPS.
