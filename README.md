# OddScan — Comparador de Melhores Odds & Análise EV (Fase 1: MVP)

O **OddScan** é uma plataforma analítica para apostas esportivas com foco prioritário no mercado brasileiro regulamentado pela Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF).

O aplicativo busca automaticamente odds em segundo plano, remove o vig (margem das casas) para estimar a probabilidade justa e calcula o Valor Esperado (EV%), destacando a melhor opção de aposta e priorizando as casas favoritas do usuário.

---

## 🚀 Arquitetura e Stack

- **Frontend**: PWA Mobile-First em React 18 + Vite + TypeScript + Design System Dark/Neon Esportivo.
- **Backend / Worker**: Serviço agendado em Node.js/TypeScript (`@oddscan/worker`) com cron periódico (15 min) e suporte a execução sob demanda.
- **Banco de Dados & Auth**: Supabase (PostgreSQL + RLS + Supabase Auth).
- **Provedor de Odds**: The Odds API (com suporte a dados mockados realistas para desenvolvimento local imediato).
- **Pacote Compartilhado**: `@oddscan/shared` contendo a modelagem de dados e as fórmulas matemáticas de remoção de vig proporcional e EV%.

---

## 📁 Estrutura do Repositório

```
OddScan/
├── apps/
│   ├── web/                     # Frontend PWA Mobile-First
│   │   ├── src/
│   │   │   ├── components/      # EventCard, Header, Modais de Comparação e Favoritos
│   │   │   ├── contexts/        # Auth e Casas Favoritas
│   │   │   ├── lib/             # Supabase client e mock data
│   │   │   └── styles/          # Design system CSS
│   │   └── package.json
│   │
│   └── worker/                  # Backend de Ingestão e Cálculo
│       ├── src/
│       │   ├── api/             # Cliente The Odds API & fallback realista
│       │   ├── services/        # Engine de cálculo e persistência
│       │   ├── cron.ts          # Scheduler contínuo
│       │   └── runOnce.ts       # Script de disparo único
│       └── package.json
│
├── packages/
│   └── shared/                  # Algoritmos matemáticos (No-Vig & EV%) e Tipos
│       └── src/
│           ├── math/            # Funções noVig e EV
│           └── types/           # Interfaces TypeScript
│
├── supabase/
│   └── migrations/              # Migrações SQL completas
│       ├── 20260903000001_initial_schema.sql
│       ├── 20260903000002_seed_brazil_bookmakers.sql
│       └── 20260903000003_views_and_policies.sql
│
├── .env.example
└── package.json
```

---

## ⚙️ Como Rodar o Projeto

### 1. Instalação de Dependências
Na raiz do projeto:
```bash
npm install
```

### 2. Configuração de Variáveis de Ambiente
Copie o `.env.example` para `.env`:
```bash
cp .env.example .env
```
Preencha suas credenciais do Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) e a chave da The Odds API (`ODDS_API_KEY`).
*Nota: Se você ainda não configurou as chaves, o sistema continuará funcionando perfeitamente usando o fallback mockado realista com partidas do Brasileirão.*

### 3. Aplicar as Migrações no Supabase
Execute as migrations em `supabase/migrations/` no **SQL Editor** do seu dashboard Supabase na seguinte ordem:
1. `20260903000001_initial_schema.sql` (Criação de tabelas, índices e RLS)
2. `20260903000002_seed_brazil_bookmakers.sql` (Seed das casas brasileiras autorizadas pela SPA/MF)
3. `20260903000003_views_and_policies.sql` (Views analíticas de alta velocidade)

### 4. Executar o Backend / Worker
- Para rodar um único ciclo de coleta e cálculo:
  ```bash
  npm run worker:run
  ```
- Para deixar o job rodando em segundo plano a cada 15 minutos:
  ```bash
  npm run worker:dev
  ```

### 5. Iniciar o Frontend Web (PWA)
```bash
npm run dev
```
O app estará acessível em `http://localhost:3000`.

---

## 📊 Regras Matemáticas Implementadas

### 1. Remoção de Margem (No-Vig Proporcional)
Dado um mercado com probabilidades implícitas brutas $P_i = 1 / O_i$:
- Overround total: $S = \sum P_i$
- Probabilidade justa: $P_{justa, i} = P_i / S$
- Odd justa: $O_{justa, i} = 1 / P_{justa, i}$

### 2. Valor Esperado (EV%)
$$EV\% = (P_{justa, i} \times O_{oferecida} - 1) \times 100$$
Se $EV\% > 0$, a aposta possui valor positivo estimado frente ao mercado.

---

## 🛡️ Jogo Responsável
O OddScan exibe avisos obrigatórios para maiores de 18 anos e ressalva estatística em todas as telas, conforme as diretrizes de integridade e jogo responsável do Ministério da Fazenda.
