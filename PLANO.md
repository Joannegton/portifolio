# Plano: Portfolio CMS + Demo Access Flow + Demo Namespace

## Context

O portfolio hoje tem os projetos hardcoded em `minhasInfos.ts`. O objetivo é:
1. Substituir por banco + API + admin UI → adicionar projetos sem tocar em código.
2. Criar um fluxo de "solicitar acesso" para projetos testáveis → visitante pede acesso, dono aprova/rejeita, sistema notifica.
3. Criar um namespace k3s isolado com o `auth` deployado como demo público + Swagger interativo.

**Decisões:**
- Backend: Next.js Route Handlers (dentro do próprio portfolio app)
- ORM: TypeORM (consistente com auth, leadfinder, beleze)
- Admin auth: JWT do serviço `auth` — validação local via public key RS256 (sem chamada de rede)
- Notificações: Telegram (dono) + email via Resend (solicitante)
- Escopo: arquitetura completa, execução faseada

---

## Arquitetura Geral

```
joannegton.com
  /api/projects             → Route Handler (GET público / POST-PUT-DELETE admin)
  /api/access-requests      → Route Handler (POST público / PATCH admin)
  /admin/*                  → Páginas protegidas (JWT validado localmente)

auth-demo.joannegton.com    → auth service (namespace demos, Swagger em /docs)

Postgres StatefulSet        → dentro do namespace portfolio-prod
```

**JWT sem chamada de rede ao auth:** o middleware valida RS256 localmente com `AUTH_PUBLIC_KEY` (env var / k8s Secret). Zero acoplamento em runtime.

---

## Fase 1 — CMS de Projetos

### 1.1 TypeORM — DataSource e Entities

**Novo:** `src/lib/data-source.ts`
```ts
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Project, AccessRequest],
  migrations: ["src/migrations/*.ts"],
})
```

**Novo:** `src/entities/Project.entity.ts`
```ts
@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid") id: string
  @Column() titulo: string
  @Column("text") descricao: string
  @Column() imagem: string
  @Column("simple-array") tecnologias: string[]
  @Column({ nullable: true }) github: string
  @Column({ nullable: true }) demo: string
  @Column() categoria: string
  @Column("simple-array") categorias: string[]
  @Column() data: string                          // "MM/AAAA"
  @Column({ default: false }) testavel: boolean
  @Column({ nullable: true, unique: true }) requestSlug: string
  @Column({ nullable: true }) docsUrl: string
  @Column({ default: true }) active: boolean      // projeto ainda ativo/mantido
  @Column({ default: true }) allowDisplay: boolean // exibir no portfólio público
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
  @OneToMany(() => AccessRequest, r => r.project) accessRequests: AccessRequest[]
}
```

**Novo:** `src/entities/AccessRequest.entity.ts`
```ts
@Entity("access_requests")
export class AccessRequest {
  @PrimaryGeneratedColumn("uuid") id: string
  @ManyToOne(() => Project) project: Project
  @Column() nome: string
  @Column() email: string
  @Column({ nullable: true }) motivo: string
  @Column({ default: "PENDING" }) status: "PENDING" | "APPROVED" | "REJECTED"
  @Column({ nullable: true, unique: true }) token: string
  @Column({ nullable: true }) expiresAt: Date
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
}
```

### 1.2 Migration inicial com dados existentes

**Novo:** `src/migrations/1_InitialSchema.ts` — cria tabelas `projects` e `access_requests`.

**Novo:** `src/migrations/2_SeedProjects.ts` — insere os 13 projetos de `minhasInfos.ts`
como dados iniciais diretamente no migration (não seed separado), garantindo idempotência.

Comando de geração:
```bash
npm run typeorm migration:generate -- src/migrations/InitialSchema
npm run typeorm migration:run
```

### 1.3 Postgres no k3s

**Novo:** `k8s/postgres.yaml`
- StatefulSet `portfolio-postgres`, image `postgres:16-alpine`
- PVC 5Gi com `storageClassName: local-path` (k3s default)
- Service ClusterIP `portfolio-postgres:5432`
- Namespace: `portfolio-prod`

**Modificar:** `k8s/namespace.yaml` — quota `pods: "3"` → `pods: "5"`

**Novo:** `k8s/secret-portfolio.yaml` (template — valores aplicados manualmente na VPS):
```yaml
stringData:
  DATABASE_URL: "postgresql://user:pass@portfolio-postgres:5432/portfolio"
  AUTH_PUBLIC_KEY: "-----BEGIN PUBLIC KEY-----..."
```

### 1.4 Route Handlers

- `src/app/api/projects/route.ts` — GET (filtro `allowDisplay: true`, `active: true`) / POST admin
- `src/app/api/projects/[id]/route.ts` — PUT / DELETE admin

### 1.5 Middleware JWT

**Novo:** `src/middleware.ts` — protege `/admin/*` e métodos não-GET de `/api/projects`:
```ts
import { joseVerify } from "./lib/auth"
// verifica RS256 com AUTH_PUBLIC_KEY, retorna 401 se inválido
```

**Novo:** `src/lib/auth.ts` — wrapper do `jose` para verificar RS256.

Biblioteca: `jose` (Edge Runtime compatível, suporta RS256 nativo).

### 1.6 Admin UI

- `src/app/admin/login/page.tsx` — chama `POST <AUTH_SERVICE_URL>/auth/login` → salva token em cookie httpOnly
- `src/app/admin/page.tsx` — dashboard com links
- `src/app/admin/projetos/page.tsx` — lista com editar/excluir + toggle `allowDisplay`/`active`
- `src/app/admin/projetos/novo/page.tsx` — form de criação
- `src/app/admin/projetos/[id]/page.tsx` — form de edição

### 1.7 Portfolio atualizado

**Modificar:** `src/app/projetos/page.tsx`
- Trocar import estático por Server Component com `fetch('/api/projects', { next: { revalidate: 60 } })`
- Filtro de categoria/ordenação no lado cliente como já existe hoje (sem quebrar UX)

### 1.8 Dockerfile

```dockerfile
# Adicionar no builder stage:
RUN npm run typeorm migration:run   # roda migrations no startup via entrypoint
```

Ou melhor: usar entrypoint script `scripts/start.sh`:
```bash
#!/bin/sh
node_modules/.bin/ts-node -e "require('./src/lib/data-source').AppDataSource.initialize().then(ds => ds.runMigrations())"
node_modules/.bin/next start
```

**Arquivos Fase 1:**
```
src/entities/Project.entity.ts
src/entities/AccessRequest.entity.ts
src/lib/data-source.ts
src/lib/auth.ts
src/lib/db.ts                      # helper getRepository
src/middleware.ts
src/migrations/1_InitialSchema.ts
src/migrations/2_SeedProjects.ts
src/app/api/projects/route.ts
src/app/api/projects/[id]/route.ts
src/app/admin/**                   # ~5 páginas
src/app/projetos/page.tsx          (modificar)
k8s/postgres.yaml
k8s/namespace.yaml                 (modificar — quota)
k8s/secret-portfolio.yaml
k8s/configmap.yaml                 (modificar — DATABASE_URL, AUTH_SERVICE_URL)
k8s/kustomization.yaml             (modificar — incluir postgres.yaml, secret)
Dockerfile                         (modificar — entrypoint migration)
scripts/start.sh
package.json                       (modificar — typeorm, pg, reflect-metadata, jose)
tsconfig.json                      (modificar — emitDecoratorMetadata: true)
```

---

## Fase 2 — Fluxo de Solicitação de Acesso

### 2.1 Route Handlers

- `src/app/api/access-requests/route.ts`
  - POST público → cria request com status PENDING → dispara Telegram + email de confirmação

- `src/app/api/access-requests/[id]/route.ts`
  - PATCH `{ action: "approve" | "reject" }` (admin) →
    - Aprovação: gera `token = uuidv4()`, `expiresAt = now + 7d`, envia email com link
    - Rejeição: envia email educado

### 2.2 Notificações

**Novo:** `src/lib/notifications.ts`
```ts
export async function notifyTelegram(message: string): Promise<void>
export async function sendEmail(opts: { to; subject; html }): Promise<void>
```

Env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `RESEND_API_KEY`

### 2.3 UI de solicitação

- `src/components/SolicitarAcessoModal.tsx` — modal com nome, email, motivo (opcional)
- `src/app/projetos/page.tsx` — cards com `testavel: true` ganham botão "Solicitar acesso"
- Após submit: toast "Solicitação enviada! Aguarde contato no seu email."

### 2.4 Admin UI — Pedidos

- `src/app/admin/pedidos/page.tsx` — tabela com filtro PENDING/APPROVED/REJECTED
- Aprovar / Rejeitar com feedback visual imediato
- Badge de contagem de pendentes no dashboard

### 2.5 Gateway de token

- `src/app/demo/[slug]/page.tsx` — valida token no banco, verifica `expiresAt`, redireciona para `docsUrl`

**Arquivos Fase 2:**
```
src/app/api/access-requests/route.ts
src/app/api/access-requests/[id]/route.ts
src/lib/notifications.ts
src/components/SolicitarAcessoModal.tsx
src/app/projetos/page.tsx          (modificar — botão)
src/app/admin/pedidos/page.tsx
src/app/demo/[slug]/page.tsx
k8s/secret-portfolio.yaml          (modificar — Telegram + Resend keys)
```

---

## Fase 3 — Namespace `demos` + auth deployado com Swagger

### 3.1 Swagger no auth service

**Modificar:** `../auth/src/main.ts`
```ts
if (process.env.ENABLE_DOCS === "true") {
  const config = new DocumentBuilder()
    .setTitle("Auth-Hub API")
    .addBearerAuth()
    .build()
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config))
}
```

**Modificar:** `../auth/package.json` — adicionar `@nestjs/swagger`, `swagger-ui-express`

Decorar controllers/DTOs com `@ApiOperation`, `@ApiResponse`, `@ApiProperty`.

### 3.2 Namespace `demos` no k3s

**Novo:** `../auth/k8s/`
- `namespace.yaml` — namespace `demos`, ResourceQuota (2 pods, 500m CPU, 512Mi RAM), NetworkPolicy isolada
- `postgres-demo.yaml` — Postgres dedicado (banco `auth_demo`), PVC 2Gi
- `deployment-demo.yaml` — 1 replica, `ENABLE_DOCS=true`, Secrets injetados
- `service-demo.yaml` — ClusterIP
- `ingressroute-demo.yaml` — Traefik, host `auth-demo.joannegton.com`
- `reset-cronjob.yaml` — CronJob diário às 3h: dropa schema, roda migrations, reseed com usuários demo
- `secret-demo-example.yaml` — template (valores aplicados manualmente)

### 3.3 CI/CD auth-demo

**Novo:** `../auth/.github/workflows/deploy-demo.yml`
- Trigger: push em `master` com mudanças no path `auth/**`
- Build + push `joannegton/auth:latest` → `kubectl rollout restart deployment/auth-demo -n demos`

### 3.4 Integração com Fase 2

No admin (Fase 1), ao cadastrar o projeto auth com `testavel: true`:
- `requestSlug = "auth-hub"`
- `docsUrl = "https://auth-demo.joannegton.com/docs"`

Email de aprovação: link `joannegton.com/demo/auth-hub?token=<uuid>` → redireciona para docs.

**Arquivos Fase 3:**
```
../auth/src/main.ts                (modificar — Swagger)
../auth/package.json               (modificar — @nestjs/swagger)
../auth/k8s/                       (novo — todos manifests)
../auth/.github/workflows/deploy-demo.yml (novo)
```

---

## Ordem de execução

```
Fase 1 → deploy → validar CMS funcionando
Fase 2 → deploy → testar fluxo completo de aprovação
Fase 3 → pode ser paralelo ao Fase 2 (toca repo diferente: auth)
```

## Verificação end-to-end

**Fase 1:**
1. `kubectl get pods -n portfolio-prod` → `portfolio-app` + `portfolio-postgres` Running
2. `GET joannegton.com/api/projects` → retorna os 13 projetos vindos do banco
3. `/admin/login` → JWT setado via cookie → acesso ao dashboard
4. Criar projeto no admin → aparece em `/projetos` após revalidação (≤60s)

**Fase 2:**
1. Projeto com `testavel: true` exibe botão "Solicitar acesso"
2. Submit → Telegram alerta o dono + solicitante recebe email de confirmação
3. Admin aprova em `/admin/pedidos` → solicitante recebe email com link de acesso
4. `joannegton.com/demo/auth-hub?token=<uuid>` → redireciona para docs (valida expiresAt)

**Fase 3:**
1. `kubectl get pods -n demos` → auth + postgres Running
2. `https://auth-demo.joannegton.com/docs` → Swagger UI acessível
3. POST `/auth/login` no Swagger com credenciais demo → retorna JWT
4. CronJob às 3h → `kubectl get jobs -n demos` mostra reset concluído

---

## Dependências por fase

| Fase | npm adds | k8s adds |
|------|----------|----------|
| 1 | `typeorm`, `pg`, `reflect-metadata`, `jose` | Postgres StatefulSet, Secret, quota bump |
| 2 | `resend`, `uuid` | Telegram/Resend secrets |
| 3 | `@nestjs/swagger` (no auth) | namespace demos, IngressRoute, CronJob |
