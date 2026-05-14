# 🚀 Deployment - Portfolio App em Kubernetes (K3s)

**Versão:** 1.0  
**Ambiente:** K3s + Rancher + PostgreSQL  
**Cluster:** racher (bolacha@racher)  
**Aplicação:** Next.js 15 Portfolio  

---

## 📑 Índice

1. [Arquitetura](#arquitetura)
2. [Pré-requisitos](#pré-requisitos)
3. [Deploy Rápido (3 Passos)](#deploy-rápido-3-passos)
4. [Configuração Detalhada](#configuração-detalhada)
5. [Auditoria de Produção](#auditoria-de-produção)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura

```
Internet (HTTPS://joannegton.com)
    ↓
Traefik (K3s kube-system)
    ↓
IngressRoute + SSL (cert-manager)
    ↓
Service portfolio-app (port 80 → 3000)
    ↓
Pod 1, Pod 2, Pod 3 (portfolio:3000)
    ↓
PostgreSQL (namespace postgres)
```

**Stack:**
- **Kubernetes:** K3s (38 dias rodando ✅)
- **Orchestração:** Rancher integrado
- **Ingress:** Traefik nativo (kube-system)
- **SSL:** cert-manager + Let's Encrypt
- **Banco de dados:** PostgreSQL (namespace postgres)
- **Load Balancer:** ServiceLB nativo K3s

---

## ✅ Pré-requisitos

```bash
# Verificar cluster
kubectl cluster-info

# Verificar pods críticos
kubectl get pods -n kube-system | grep traefik
kubectl get pods -n cert-manager | grep cert-manager
kubectl get pods -n postgres | grep postgres

# Esperado: todos RUNNING
```

---

## 🚀 Deploy Rápido (3 Passos)

### Passo 1: Corrigir YAMLs para Produção
```powershell
.\scripts\fix-production.ps1
```

**O que faz:**
- ✅ Muda image tag de `latest` para `v1.2.3`
- ✅ Cria `configmap-prod.yaml`
- ✅ Aumenta liveness probe para 60s
- ✅ Adiciona sizeLimit aos emptyDirs
- ✅ Valida todos os YAMLs

### Passo 2: Criar Secrets
```bash
# Opção A: Secret simples
kubectl create secret generic portfolio-secrets \
  --from-literal=DB_PASSWORD='sua-senha-real' \
  -n portfolio-prod

# Opção B: Sealed Secrets (recomendado para produção)
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/sealedsecrets-0.24.0.yaml

kubectl create secret generic portfolio-secrets \
  --from-literal=DB_PASSWORD='sua-senha-real' \
  -n portfolio-prod \
  --dry-run=client -o yaml | kubeseal > k8s/sealedsecret.yaml

kubectl apply -f k8s/sealedsecret.yaml
```

### Passo 3: Deploy Completo
```powershell
.\scripts\deploy-production.ps1 -Action deploy
```

**Verifica:**
```bash
kubectl get pods -n portfolio-prod -w
kubectl logs -f -l app=portfolio -n portfolio-prod
```

---

## 📋 Configuração Detalhada

### 1. Namespace + RBAC + Segurança

**Arquivo:** `k8s/namespace.yaml`

✅ Cria:
- Namespace `portfolio-prod` isolado
- ServiceAccount `portfolio-app-sa`
- Role com permissões mínimas (least privilege)
- NetworkPolicy com ingress/egress explícito
- ResourceQuota (4 CPU, 4Gi RAM máximo)
- LimitRange (defaults para containers)
- Pod Security Standard labels

**Inicia deployment:**
```bash
kubectl apply -f k8s/namespace.yaml
```

---

### 2. ConfigMaps + Secrets

**Arquivos:**
- `k8s/configmap-prod.yaml` - Variáveis de ambiente
- `k8s/configmap-database.yaml` - Configuração PostgreSQL
- `secret-example.yaml` - 3 formas de criar secrets

**Variáveis principais:**
```yaml
NODE_ENV: production
NEXT_TELEMETRY_DISABLED: 1
PORT: 3000
DB_HOST: postgres-cent.postgres.svc.cluster.local
DB_PORT: 5432
DB_USER: portfolio
DB_PASSWORD: (vem de Secret)
```

---

### 3. Deployment com Best Practices

**Arquivo:** `k8s/deployment-prod.yaml`

#### Replicação & HA
- 3 replicas para alta disponibilidade
- RollingUpdate: sem downtime (`maxSurge: 1, maxUnavailable: 0`)
- PodDisruptionBudget: mínimo 1 pod sempre rodando

#### Security
- `runAsNonRoot: true` (user 1001)
- Capabilities dropadas
- SecurityContext restritivo
- RBAC com ServiceAccount

#### Health Checks
```yaml
livenessProbe:     # Verifica se vivo (restart se morrer)
  initialDelaySeconds: 60     # 60s para Next.js iniciar
  periodSeconds: 10

readinessProbe:    # Verifica se pronto para tráfego
  initialDelaySeconds: 10
  periodSeconds: 5

startupProbe:      # Tempo extra para iniciar (5min total)
  failureThreshold: 30
```

#### Resources
```yaml
requests:          # Garantido
  cpu: 250m
  memory: 256Mi
limits:            # Máximo
  cpu: 500m
  memory: 512Mi
```

#### Pod Anti-Affinity
- Distribui 3 pods em nós diferentes (HA)

#### Graceful Shutdown
- `preStop`: 15s para drenar conexões
- `terminationGracePeriodSeconds`: 30s total

#### Volumes
- `/tmp` (emptyDir 1Gi)
- `/app/.next/cache` (emptyDir 2Gi)

---

### 4. Service

**Arquivo:** `k8s/service-prod.yaml`

```yaml
type: ClusterIP           # Interno (Traefik expõe)
selector: app: portfolio  # Roteia para pods
ports: 80 → 3000         # Service → Container
```

---

### 5. IngressRoute (Traefik)

**Arquivo:** `k8s/ingressroute-prod.yaml`

#### Roteamento
```yaml
hosts: joannegton.com + www.joannegton.com
entryPoints: web (HTTP) + websecure (HTTPS)
```

#### SSL/TLS
```yaml
certResolver: letsencrypt      # cert-manager automático
tls:
  secretName: portfolio-tls    # Armazena certificado
  domains: joannegton.com, www.joannegton.com
```

#### Middlewares
- `redirect-www`: www → non-www
- `redirect-https`: HTTP → HTTPS
- `security-headers`: HSTS, X-Frame-Options, etc

---

### 6. Certificate Issuer

**Arquivo:** `k8s/cert-issuer.yaml`

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod

spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: letsencrypt-alerts@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: traefik    # ✅ K3s nativo
```

---

## 🔍 Auditoria de Produção

### ✅ O Que Está Bom
- ✅ 3 replicas para HA
- ✅ RollingUpdate sem downtime
- ✅ Security context apropriado
- ✅ Resource requests/limits
- ✅ Pod anti-affinity
- ✅ Health checks (liveness, readiness, startup)
- ✅ Graceful shutdown
- ✅ RBAC estruturado
- ✅ ResourceQuota + LimitRange
- ✅ NetworkPolicy com ingress/egress
- ✅ Traefik nativo K3s
- ✅ HTTPS automático

### ⚠️ Pontos de Atenção

#### 1. **Image Tag** - ✅ CORRIGIDO pelo script
```bash
# Antes: latest (imprevisível)
# Depois: v1.2.3 (específica)
```

#### 2. **Secrets**
```bash
# NUNCA commitar em Git!
# Usar Secret ou Sealed Secret
kubectl create secret generic portfolio-secrets \
  --from-literal=DB_PASSWORD='...'
```

#### 3. **DNS**
```bash
# Obter IP do Traefik
kubectl get svc -n kube-system

# Apontar domínio para EXTERNAL-IP
# joannegton.com A <IP-DO-TRAEFIK>
```

#### 4. **Certificado SSL**
```bash
# Verificar
kubectl get certificate -n portfolio-prod
kubectl describe certificate portfolio-tls -n portfolio-prod

# Se não emitir, ver logs
kubectl logs -f -n cert-manager deployment/cert-manager
```

#### 5. **NetworkPolicy**
- Permite tráfego do Traefik (kube-system)
- Permite tráfego interno (pod-to-pod)
- Permite egress para DNS/HTTPS/PostgreSQL
- Default deny outros

#### 6. **Database Connection**
```bash
# Testar do container
kubectl run -it --rm debug --image=postgres:15 \
  -n portfolio-prod -- \
  psql -h postgres-cent.postgres.svc.cluster.local \
       -U seu-usuario \
       -d seu-banco \
       -c "SELECT 1"
```

---

## 🔧 Operações Comuns

### Monitorar Deploy
```bash
# Pods em tempo real
kubectl get pods -n portfolio-prod -w

# Logs
kubectl logs -f deployment/portfolio-app -n portfolio-prod

# CPU/Memory
kubectl top pods -n portfolio-prod

# Eventos
kubectl get events -n portfolio-prod --sort-by='.lastTimestamp'
```

### Atualizar Imagem
```bash
# 1. Build nova versão
docker build -t joannegton/portfolio:v1.2.4 .

# 2. Push
docker push joannegton/portfolio:v1.2.4

# 3. Atualizar
kubectl set image deployment/portfolio-app \
  app=joannegton/portfolio:v1.2.4 \
  -n portfolio-prod

# 4. Verificar rollout
kubectl rollout status deployment/portfolio-app -n portfolio-prod

# 5. Rollback se necessário
kubectl rollout undo deployment/portfolio-app -n portfolio-prod
```

### Escalar Replicas
```bash
# De 3 para 5 replicas
kubectl scale deployment portfolio-app --replicas=5 -n portfolio-prod

# Verificar
kubectl get pods -n portfolio-prod
```

### Deletar Tudo
```bash
kubectl delete namespace portfolio-prod
```

---

## 🆘 Troubleshooting

### Pod não inicia
```bash
# Ver detalhes
kubectl describe pod <pod-name> -n portfolio-prod

# Ver logs
kubectl logs <pod-name> -n portfolio-prod -c app

# Shell no container
kubectl exec -it <pod-name> -n portfolio-prod -- sh
```

### Sem conexão com banco
```bash
# Testar DNS
kubectl run -it --rm debug --image=busybox:1.35 \
  -n portfolio-prod -- nslookup postgres-cent.postgres

# Testar conectividade
kubectl run -it --rm debug --image=busybox:1.35 \
  -n portfolio-prod -- nc -zv postgres-cent.postgres 5432

# Ver logs da app
kubectl logs -f deployment/portfolio-app -n portfolio-prod
```

### Certificado SSL não emite
```bash
# Ver logs cert-manager
kubectl logs -f -n cert-manager deployment/cert-manager

# Status do cert
kubectl describe certificate portfolio-tls -n portfolio-prod

# Recriar
kubectl delete certificate portfolio-tls -n portfolio-prod
kubectl delete ingressroute portfolio-ingress -n portfolio-prod
kubectl apply -f k8s/ingressroute-prod.yaml
```

### Traefik não roteia tráfego
```bash
# Ver IngressRoute
kubectl get ingressroute -n portfolio-prod
kubectl describe ingressroute portfolio-ingress -n portfolio-prod

# Ver logs Traefik
kubectl logs -f -n kube-system deployment/traefik

# Testar conectividade
kubectl run -it --rm debug --image=curlimages/curl:latest \
  -n portfolio-prod -- curl http://portfolio-app
```

### ServiceLB sem IP externo
```bash
# Ver svc
kubectl get svc -n kube-system | grep traefik

# Descrever
kubectl describe svc traefik -n kube-system

# Ver logs ServiceLB
kubectl logs -f -n kube-system deployment/svclb-controller
```

---

## ✅ Checklist Pré-Deploy

- [ ] Cluster K3s rodando (`kubectl cluster-info`)
- [ ] Traefik em kube-system (`kubectl get pods -n kube-system | grep traefik`)
- [ ] cert-manager rodando (`kubectl get pods -n cert-manager`)
- [ ] PostgreSQL rodando (`kubectl get pods -n postgres`)
- [ ] Imagem Docker publicada em Docker Hub
- [ ] Script de correção executado (`.\scripts\fix-production.ps1`)
- [ ] Secrets criados (`kubectl get secrets -n portfolio-prod`)
- [ ] YAMLs validados (`kubectl apply -k k8s --dry-run=client`)
- [ ] DNS apontado para IP do Traefik

---

## 📊 Depois do Deploy

```bash
# 1. Verificar pods
kubectl get pods -n portfolio-prod

# 2. Ver certificado
kubectl get certificate -n portfolio-prod

# 3. Testar acesso
curl -v https://joannegton.com

# 4. Ver logs
kubectl logs -f -l app=portfolio -n portfolio-prod

# 5. Monitorar
kubectl get pods -n portfolio-prod -w
```

---

## 📚 Scripts Disponíveis

| Script | Uso |
|--------|-----|
| `deploy-production.ps1` | Deploy, status, rollback, logs, scale, clean |
| `fix-production.ps1` | Corrige YAMLs para produção |
| `deploy.ps1` | Build, push e deploy (legado) |
| `check-deployment.ps1` | Verifica status do deployment |
| `rollback.ps1` | Faz rollback de versão |

---

## 🎯 Estrutura de Arquivos

```
k8s/
├── namespace.yaml              # Namespace + RBAC + Segurança
├── configmap-prod.yaml         # Variáveis de ambiente
├── configmap-database.yaml     # Config PostgreSQL
├── deployment-prod.yaml        # Deployment com health checks
├── service-prod.yaml           # Service ClusterIP
├── ingressroute-prod.yaml      # Traefik IngressRoute + middlewares
├── cert-issuer.yaml            # Let's Encrypt ClusterIssuer
├── kustomization-prod.yaml     # Kustomize para aplicar tudo
└── README.md                   # Quick reference

scripts/
├── deploy-production.ps1       # Deploy, status, logs, rollback
├── fix-production.ps1          # Corrige YAMLs
├── deploy.ps1                  # Build + push + deploy
├── check-deployment.ps1        # Ver status
└── rollback.ps1                # Rollback

DEPLOYMENT.md                   # Este arquivo (documentação completa)
```

---

## 🔗 Referências

- [K3s Documentation](https://docs.k3s.io)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/security/)
- [Traefik Ingress](https://doc.traefik.io/traefik/)
- [cert-manager](https://cert-manager.io/docs/)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)

---

## 🚀 Próximas Ações

### Agora (Antes de deploy)
```powershell
# 1. Corrigir YAMLs
.\scripts\fix-production.ps1

# 2. Criar secrets
kubectl create secret generic portfolio-secrets `
  --from-literal=DB_PASSWORD='sua-senha' `
  -n portfolio-prod
```

### Deploy
```powershell
# 3. Deploy
.\scripts\deploy-production.ps1 -Action deploy

# 4. Monitorar
kubectl get pods -n portfolio-prod -w
```

### Depois
```bash
# 5. Verificar logs
kubectl logs -f -l app=portfolio -n portfolio-prod

# 6. Testar acesso
curl https://joannegton.com
```

---

**Status:** ✅ Pronto para produção  
**Última atualização:** 2026-05-13  
**Mantido por:** DevOps Team
