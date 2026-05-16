# Deploy — Portfolio App

**App:** Next.js 15 (Server Components + Route Handlers + TypeORM)  
**Cluster:** K3s + Rancher (`bolacha@racher`)  
**Namespace principal:** `portfolio-prod`  
**Namespace de demos:** `demos`

---

## Arquitetura

```
Usuário (HTTPS)
    ↓
Cloudflare Edge (TLS + CDN)
    ↓
Cloudflare Tunnel (cloudflared no servidor)
    ↓
Traefik (kube-system)
    ↓
┌─────────────────────────────────┬────────────────────────────────────┐
│  namespace: portfolio-prod      │  namespace: demos                  │
│                                 │                                     │
│  portfolio-app (Next.js)        │  auth-demo (NestJS)                │
│       ↓                         │       ↓                            │
│  portfolio-postgres (Postgres)  │  auth-demo-postgres (Postgres)     │
│                                 │  auth-demo-reset (CronJob 3h)      │
└─────────────────────────────────┴────────────────────────────────────┘
```

**Domínios:**
- `joannegton.com` → portfolio-app (Next.js)
- `auth-demo.joannegton.com` → auth-demo (NestJS + Swagger em `/docs`)

**SSL:** gerenciado pelo Cloudflare. Sem cert-manager nem Let's Encrypt no cluster.

---

## Estrutura k8s — portfolio

```
portifolio/k8s/
├── kustomization.yaml          ← entry point
├── namespace.yaml              ← namespace, RBAC, quotas (pods: 5)
├── configmap.yaml              ← variáveis não-sensíveis
├── postgres.yaml               ← StatefulSet + PVC 5Gi + Service
├── deployment-prod.yaml        ← Deployment + PDB
├── service-prod.yaml           ← Service ClusterIP
├── ingressroute-prod.yaml      ← Traefik IngressRoute + headers
└── secret-portfolio-example.yaml ← template (não commitar com valores reais)
```

## Estrutura k8s — auth demo

```
auth/k8s/
├── kustomization.yaml          ← entry point
├── namespace.yaml              ← namespace demos + quota + NetworkPolicy
├── configmap-demo.yaml         ← ENABLE_DOCS=true e outras vars
├── postgres-demo.yaml          ← StatefulSet + PVC 2Gi + Service
├── deployment-demo.yaml        ← Deployment auth
├── service-demo.yaml           ← Service ClusterIP
├── ingressroute-demo.yaml      ← Traefik IngressRoute (auth-demo.joannegton.com)
├── reset-cronjob.yaml          ← CronJob diário 3h — dropa/recria schema
└── secret-demo-example.yaml    ← template (não commitar com valores reais)
```

---

## Variáveis de ambiente

### ConfigMap `portfolio-config` — valores não-sensíveis (já em k8s/configmap.yaml)

| Var | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `PORT` | `3000` |
| `DB_SSL` | `false` |

### Secret `portfolio-secrets` — aplicar manualmente na VPS

| Var | Para quê | Como obter |
|---|---|---|
| `POSTGRES_USER` | usuário do banco | você define (ex: `portfolio_user`) |
| `POSTGRES_PASSWORD` | senha do banco | você define (senha forte) |
| `DATABASE_URL` | string de conexão TypeORM | `postgresql://<user>:<pass>@portfolio-postgres:5432/portfolio` |
| `AUTH_PUBLIC_KEY` | valida JWT do auth service (RS256) | endpoint `/auth/public-key` do auth service |
| `NEXT_PUBLIC_AUTH_SERVICE_URL` | URL do auth para login admin | `https://auth-demo.joannegton.com` |
| `NEXT_PUBLIC_APP_URL` | URL base para links de aprovação de acesso | `https://joannegton.com` |
| `TELEGRAM_BOT_TOKEN` | notificação ao dono (nova solicitação de acesso) | [@BotFather](https://t.me/botfather) |
| `TELEGRAM_CHAT_ID` | seu chat_id pessoal | bot `@userinfobot` ou `getUpdates` da API |
| `RESEND_API_KEY` | enviar emails ao solicitante | dashboard resend.com |

---

## Primeiro deploy

### Pré-requisitos

```bash
# Traefik rodando
kubectl get pods -n kube-system | grep traefik

# Cloudflare Tunnel ativo
sudo systemctl status cloudflared
```

### 1. Criar o secret — portfolio-prod

Substituir os valores e rodar na VPS (fazer apenas uma vez):

```bash
kubectl create secret generic portfolio-secrets -n portfolio-prod \
  --from-literal=POSTGRES_USER=portfolio_user \
  --from-literal=POSTGRES_PASSWORD=<senha-forte> \
  --from-literal=DATABASE_URL="postgresql://portfolio_user:<senha>@portfolio-postgres:5432/portfolio" \
  --from-literal=AUTH_PUBLIC_KEY="$(curl -s https://auth-demo.joannegton.com/auth/public-key)" \
  --from-literal=NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth-demo.joannegton.com \
  --from-literal=NEXT_PUBLIC_APP_URL=https://joannegton.com \
  --from-literal=TELEGRAM_BOT_TOKEN=<token-do-bot> \
  --from-literal=TELEGRAM_CHAT_ID=<seu-chat-id> \
  --from-literal=RESEND_API_KEY=<chave-resend>
```

> O secret persiste no cluster. Não precisa recriar a cada deploy.

### 2. Aplicar os manifests — portfolio

```bash
kubectl apply -k portifolio/k8s/
```

Isso cria em ordem: namespace → postgres StatefulSet → configmap → deployment → service → ingressroute.

### 3. Acompanhar o startup

```bash
# Aguardar pods subirem
kubectl get pods -n portfolio-prod -w

# Ver migrations rodando via instrumentation.ts
kubectl logs -f deployment/portfolio-app -n portfolio-prod | grep -i "migrat\|error\|typeorm"
```

As migrations e o seed dos projetos rodam automaticamente no startup.

### 4. Criar o secret — demos (auth-demo)

```bash
kubectl create secret generic auth-demo-secrets -n demos \
  --from-literal=POSTGRES_USER=auth_demo \
  --from-literal=POSTGRES_PASSWORD=<senha-forte> \
  --from-literal=JWT_PRIVATE_KEY="$(cat /path/to/private.pem)" \
  --from-literal=JWT_PUBLIC_KEY="$(cat /path/to/public.pem)"
```

### 5. Aplicar os manifests — auth demo

```bash
kubectl apply -k auth/k8s/

kubectl rollout status deployment/auth-demo -n demos
kubectl get pods -n demos
```

---

## Deploy automático (CI/CD)

### Portfolio

Workflow: `portifolio/.github/workflows/deploy.yml`

Trigger: push em `master` com mudanças em `portifolio/**`

1. Build da imagem `joannegton/portfolio:latest`
2. Push para Docker Hub
3. `kubectl rollout restart deployment/portfolio-app -n portfolio-prod`

### Auth Demo

Workflow: `auth/.github/workflows/deploy-demo.yml`

Trigger: push em `master` com mudanças em `auth/**`

1. Build da imagem `joannegton/auth:latest`
2. Push para Docker Hub
3. `kubectl rollout restart deployment/auth-demo -n demos`

---

## Verificar após deploy

```bash
# Pods rodando
kubectl get pods -n portfolio-prod
kubectl get pods -n demos

# API portfolio retornando projetos
curl https://joannegton.com/api/projects

# Swagger auth-demo acessível
curl -I https://auth-demo.joannegton.com/docs

# Logs portfolio
kubectl logs -f deployment/portfolio-app -n portfolio-prod

# Logs auth-demo
kubectl logs -f deployment/auth-demo -n demos
```

---

## Rollback

```bash
# Portfolio
kubectl rollout undo deployment/portfolio-app -n portfolio-prod

# Auth demo
kubectl rollout undo deployment/auth-demo -n demos
```

---

## Cloudflare Tunnel

```bash
sudo systemctl status cloudflared
sudo systemctl restart cloudflared
sudo journalctl -u cloudflared -f
```

**Roteamento no Cloudflare Dashboard:**
```
joannegton.com               → http://192.168.1.150:80
www.joannegton.com           → http://192.168.1.150:80
auth-demo.joannegton.com     → http://192.168.1.150:80
```

---

## Troubleshooting

### Pod não inicia

```bash
kubectl describe pod <pod-name> -n portfolio-prod
kubectl logs <pod-name> -n portfolio-prod --previous
```

### Erro de banco / migrations

```bash
kubectl logs -f deployment/portfolio-app -n portfolio-prod | grep -i "migrat\|error\|typeorm"

# Inspecionar banco direto
kubectl exec -it statefulset/portfolio-postgres -n portfolio-prod -- psql -U portfolio_user -d portfolio -c "\dt"
```

### Erro de variável de ambiente ausente

```bash
# Listar chaves do secret (sem mostrar valores)
kubectl get secret portfolio-secrets -n portfolio-prod -o jsonpath='{.data}' | python3 -c "import sys,json; [print(k) for k in json.load(sys.stdin)]"

# Ver env vars do pod em execução
kubectl exec -it deployment/portfolio-app -n portfolio-prod -- env | grep -E "DATABASE|AUTH|TELEGRAM|RESEND|APP_URL"
```

### Swagger não aparece em auth-demo

```bash
kubectl get configmap auth-demo-config -n demos -o yaml | grep ENABLE_DOCS
kubectl logs -f deployment/auth-demo -n demos | grep -i "swagger\|docs\|error"
```

### Reset manual do banco demo

```bash
kubectl create job --from=cronjob/auth-demo-reset manual-reset-$(date +%s) -n demos
kubectl logs -f job/manual-reset-<suffix> -n demos
```

### Deletar tudo

```bash
kubectl delete namespace portfolio-prod
kubectl delete namespace demos
```

---

## Checklist pré-deploy

- [ ] Traefik rodando (`kubectl get pods -n kube-system | grep traefik`)
- [ ] Cloudflare Tunnel ativo (`sudo systemctl status cloudflared`)
- [ ] Secret `portfolio-secrets` aplicado (`kubectl get secret portfolio-secrets -n portfolio-prod`)
- [ ] Secret `auth-demo-secrets` aplicado (`kubectl get secret auth-demo-secrets -n demos`)
- [ ] Imagem portfolio no Docker Hub (`docker pull joannegton/portfolio:latest`)
- [ ] Imagem auth no Docker Hub (`docker pull joannegton/auth:latest`)
- [ ] Dry-run sem erros (`kubectl apply -k portifolio/k8s/ --dry-run=client`)
