# Portfolio — joannegton.com

Portfolio pessoal com CMS dinâmico, fluxo de solicitação de acesso a projetos demo e namespace k8s isolado para demos públicas.

---

## Visão Geral

```
joannegton.com              → Next.js 15 (portfolio-prod namespace)
  /projetos                 → lista projetos do banco (ISR 60s)
  /api/projects             → GET público / POST-PUT-DELETE admin (JWT)
  /api/access-requests      → POST público (solicitar acesso) / PATCH admin (aprovar/rejeitar)
  /admin/*                  → UI protegida por JWT (cookie httpOnly)
  /demo/[slug]?token=...    → gateway de token → redireciona para docsUrl

auth-demo.joannegton.com    → NestJS auth service (demos namespace)
  /docs                     → Swagger UI interativo
  /auth/login               → login com credenciais demo
  /auth/public-key          → chave pública RS256
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend + API | Next.js 15 (App Router, Server Components, Route Handlers) |
| ORM | TypeORM com `EntitySchema` (sem decorators — compatível com SWC) |
| Banco | PostgreSQL 16 (StatefulSet k8s, namespace isolado) |
| Auth | JWT RS256 via `jose` — valida localmente sem chamada ao auth service |
| Notificações | Telegram Bot API (dono) + Resend (email para solicitante) |
| Infra | K3s + Traefik + Cloudflare Tunnel |
| CI/CD | GitHub Actions (self-hosted runner) → Docker Hub → kubectl rollout |

---

## Desenvolvimento local

### Pré-requisitos

- Node.js 20+
- PostgreSQL local ou Docker

### Subir banco local

```bash
docker run -d \
  --name portfolio-postgres \
  -e POSTGRES_USER=portfolio \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=portfolio \
  -p 5432:5432 \
  postgres:16-alpine
```

### Variáveis de ambiente

Crie `.env.local` na raiz de `portifolio/`:

```env
DATABASE_URL=postgresql://portfolio:postgres@localhost:5432/portfolio
AUTH_PUBLIC_KEY=<PEM da chave pública do auth service>
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
TELEGRAM_BOT_TOKEN=<token do bot>
TELEGRAM_CHAT_ID=<seu chat id>
RESEND_API_KEY=<chave Resend>
DB_SSL=false
```

### Rodar

```bash
cd portifolio
npm install
npm run dev
```

Migrations e seed rodam automaticamente no startup via `src/instrumentation.ts`.

---

## Admin

Acesse `/admin/login` e autentique com o JWT do auth service.

Funcionalidades:
- **Projetos** — CRUD completo (`/admin/projetos`)
- **Pedidos** — aprovar/rejeitar solicitações de acesso (`/admin/pedidos`)

---

## Fluxo de solicitação de acesso

1. Visitante vê projeto com `testavel: true` → clica "Solicitar acesso"
2. Preenche nome, email e motivo opcional
3. Telegram recebe alerta; solicitante recebe e-mail de confirmação
4. Admin aprova/rejeita em `/admin/pedidos`
5. Na aprovação: token UUID gerado (TTL 7 dias), e-mail enviado com link
6. Link `joannegton.com/demo/[slug]?token=<uuid>` → valida token → redireciona para `docsUrl`

---

## Estrutura de pastas relevantes

```
portifolio/
├── src/
│   ├── app/
│   │   ├── admin/          ← UI admin (login, dashboard, projetos, pedidos)
│   │   ├── api/
│   │   │   ├── projects/   ← CRUD projetos
│   │   │   ├── access-requests/ ← fluxo de acesso
│   │   │   └── admin/session/   ← cookie httpOnly
│   │   ├── demo/[slug]/    ← gateway de token
│   │   └── projetos/       ← listagem pública (ISR 60s)
│   ├── components/
│   │   ├── admin/          ← ProjetoForm, ApproveRejectButtons
│   │   ├── ProjetosClient.tsx
│   │   └── SolicitarAcessoModal.tsx
│   ├── entities/           ← EntitySchema TypeORM (Project, AccessRequest)
│   ├── lib/
│   │   ├── auth.ts         ← verifyJwt (jose RS256)
│   │   ├── data-source.ts  ← AppDataSource TypeORM
│   │   ├── db.ts           ← getProjectRepository, getAccessRequestRepository
│   │   └── notifications.ts ← Telegram + Resend
│   ├── migrations/         ← InitialSchema + SeedProjects
│   └── middleware.ts       ← protege /admin/* e /api não-públicos
└── k8s/                    ← manifests Kubernetes
```

---

## Deploy

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para instruções completas de deploy no K3s, secrets, CI/CD e troubleshooting.

---

## Auth Demo

O serviço `auth` roda em namespace `demos` com Swagger em `https://auth-demo.joannegton.com/docs`.

Credenciais de demo: solicite acesso na página do projeto no portfolio.

O banco é resetado diariamente às 3h via CronJob para manter o ambiente limpo.
