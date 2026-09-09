# Curioso — Painel Pessoal & Cofre de Infraestrutura

Um painel leve, moderno e robusto para organização de rotinas, gestão de atividades em formato **Kanban** e armazenamento de scripts/comandos de infraestrutura com cópia em um clique.

Projetado para rodar com alta eficiência em **Linux** (Debian, Ubuntu, Raspberry Pi) e **Windows** (Nativo ou WSL).

---

## 💻 Requisitos do Sistema

O sistema foi arquitetado para ser extremamente leve e econômico em consumo de recursos:

### ⚙️ Hardware Mínimo Recomendado
| Componente | Mínimo | Recomendado |
|---|---|---|
| **Processador (CPU)** | 1 vCPU / Core | 2 vCPUs |
| **Memória RAM** | 512 MB *(com swap ativo no build)* | 1 GB ou superior |
| **Armazenamento (Disco)** | 500 MB livres | 2 GB livres |
| **Arquitetura** | `x86_64` (amd64) ou `aarch64` (ARM64) | amd64 / ARM64 |

> 💡 *Nota de consumo:* Após compilado, a aplicação em execução contínua consome apenas cerca de **70 MB a 90 MB de memória RAM**.

---

### 🖥️ Sistemas Operacionais Suportados
- **Linux:** Debian 11/12/13, Ubuntu 20.04/22.04/24.04, Fedora, Rocky Linux, Alpine, Raspberry Pi OS.
- **Windows:** Windows 10, Windows 11, Windows Server 2019/2022 *(suporte nativo via PowerShell ou WSL2)*.
- **Softwares Necessários:**
  - **Node.js:** v18.18+ ou v20+ LTS
  - **npm:** v9+
  - **PM2:** *(em ambientes Linux para daemon em segundo plano)*

---

## 🚀 Funcionalidades

- **📋 Quadro Kanban Completo & Flexível:** 
  - 4 estágios organizados: **A Fazer** (`TODO`), **Em Andamento** (`IN_PROGRESS`), **Em Revisão** (`REVIEW`) e **Concluído** (`DONE`).
  - Navegação e avanço de estágio rápido com 1 clique (◀ / ▶).
  - Níveis de prioridade visual: *Baixa*, *Média*, *Alta* e *Crítica*.
  - Categorização por tipo de demanda: *Infraestrutura*, *Segurança*, *Deploy*, *Correção*, *Rotina* ou *Geral*.
  - Alternância instantânea entre **Visão Kanban** (Colunas) e **Visão em Lista**.
  - Campo de busca instantâneo e barra de progresso em tempo real.

- **💻 Cofre de Snippets:**
  - Armazenamento de blocos de scripts, comandos bash e queries SQL.
  - Categorização por linguagem (Bash, PowerShell, SQL, C#, Node.js, Texto).
  - Botão de cópia rápida para o clipboard com feedback visual.

- **🔐 Autenticação Nativa Integrada:**
  - Login elegante com design dark mode.
  - Senha gravada apenas como hash **SHA-256**.
  - Sessão por cookies assinados com **HMAC-SHA256**.
  - **Zero dependências externas de autenticação**.

- **🗄️ Armazenamento Autônomo:**
  - Banco local embutido em JSON (`data.json`) via `fs/promises`.
  - Sem necessidade de bancos externos ou containers pesados.

---

## ⚡ Instalação Rápida

### 🐧 No Linux (Debian, Ubuntu, etc.)
Clone o repositório e execute o instalador automatizado:

```bash
git clone https://github.com/Sousatutu/app-curioso.git
cd app-curioso
chmod +x setup.sh
./setup.sh
```

### 🪟 No Windows (PowerShell Nativo)
Abra o PowerShell na pasta do projeto e execute:

```powershell
git clone https://github.com/Sousatutu/app-curioso.git
cd app-curioso
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

> O script perguntará interativamente o **usuário** e a **senha** que você deseja definir, gerando os hashes e preparando o servidor de forma 100% automática.

---

## 🔑 Trocar Usuário ou Senha (Linux)

```bash
chmod +x reset-password.sh
./reset-password.sh
```

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

- Por padrão, o painel roda na porta `3000` (`http://SEU_IP:3000`).
- Recomenda-se utilizar firewall (`ufw` no Linux ou Firewall do Windows) para liberar acesso somente às redes ou IPs desejados.
