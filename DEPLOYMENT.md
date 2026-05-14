# Deploy - Portfolio App (Kubernetes)

**App:** Next.js 15 (estático, sem banco de dados)  
**Cluster:** K3s + Rancher (`bolacha@racher`)  
**Namespace:** `portfolio-prod`

---

## Arquitetura

```
Internet (https://joannegton.com)
    ↓
Traefik (kube-system)
    ↓
IngressRoute + SSL (cert-manager + Let's Encrypt)
    ↓
Service portfolio-app (port 80 → 3000)
    ↓
Pod 1, Pod 2, Pod 3 (joannegton/portfolio:v1.0.0)
```

---

## Estrutura dos YAMLs

```
k8s/
├── kustomization.yaml        ← entry point do deploy
├── namespace.yaml            ← namespace, RBAC, quotas, network policy
├── configmap.yaml            ← variáveis de ambiente (NODE_ENV, PORT)
├── deployment-prod.yaml      ← deployment + PDB
├── service-prod.yaml         ← service ClusterIP
├── ingressroute-prod.yaml    ← Traefik IngressRoute + middlewares TLS
├── certificate.yaml          ← Certificate cert-manager (gera secret portfolio-tls)
├── cert-issuer.yaml          ← ClusterIssuer Let's Encrypt (aplicar 1x, cluster-scoped)
└── _old/                     ← arquivos antigos (não usar)
```

---

## Pré-requisitos

```bash
kubectl get pods -n kube-system | grep traefik    # deve estar RUNNING
kubectl get pods -n cert-manager                  # deve estar RUNNING
```

---

## Deploy (primeira vez)

```bash
# 1. Taguear imagem no Docker Hub
docker pull joannegton/portfolio:latest
docker tag joannegton/portfolio:latest joannegton/portfolio:v1.0.0
docker push joannegton/portfolio:v1.0.0

# 2. Aplicar ClusterIssuer (só na primeira vez — recurso de cluster, fora do kustomize)
kubectl apply -f k8s/cert-issuer.yaml

# 3. Deploy da aplicação
kubectl apply -k k8s/

# 4. Acompanhar
kubectl rollout status deployment/portfolio-app -n portfolio-prod
kubectl get pods -n portfolio-prod
```

---

## Verificar após deploy

```bash
# Pods
kubectl get pods -n portfolio-prod

# Certificado SSL — cert-manager emite via Let's Encrypt (pode demorar 1-2 min)
kubectl get certificate -n portfolio-prod
kubectl describe certificate portfolio-tls -n portfolio-prod

# Logs
kubectl logs -f deployment/portfolio-app -n portfolio-prod

# Testar acesso
curl -v https://joannegton.com
```

---

## Atualizar versão

```bash
# 1. Build e push da nova imagem
docker build -t joannegton/portfolio:v1.1.0 .
docker push joannegton/portfolio:v1.1.0

# 2. Atualizar tag no kustomization.yaml (campo newTag)
# 3. Aplicar
kubectl apply -k k8s/

# Rollback se necessário
kubectl rollout undo deployment/portfolio-app -n portfolio-prod
```

---

## Troubleshooting

### Pod não inicia
```bash
kubectl describe pod <pod-name> -n portfolio-prod
kubectl logs <pod-name> -n portfolio-prod
```

### Certificado SSL não emite
```bash
# Ver status do Certificate
kubectl describe certificate portfolio-tls -n portfolio-prod

# Ver logs do cert-manager
kubectl logs -f -n cert-manager deployment/cert-manager

# Ver CertificateRequest e Order (processo interno do cert-manager)
kubectl get certificaterequest -n portfolio-prod
kubectl get order -n portfolio-prod
```

### Traefik não roteia
```bash
kubectl describe ingressroute portfolio-ingress -n portfolio-prod
kubectl logs -f -n kube-system deployment/traefik
```

### Deletar tudo
```bash
kubectl delete namespace portfolio-prod
```

---

## Checklist pré-deploy

- [ ] Traefik rodando (`kubectl get pods -n kube-system | grep traefik`)
- [ ] cert-manager rodando (`kubectl get pods -n cert-manager`)
- [ ] Imagem publicada no Docker Hub com tag versionada
- [ ] DNS de `joannegton.com` apontado para IP do Traefik
- [ ] Dry-run sem erros (`kubectl apply -k k8s/ --dry-run=client`)
