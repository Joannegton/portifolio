# 📦 Kubernetes Manifests - Portfolio App

## 📁 Estrutura de Arquivos

```
k8s/
├── README.md                    # Este arquivo
├── DEPLOY_PRODUCTION.md         # Guia completo de deploy em produção
│
├── namespace.yaml              # Namespace + RBAC + Quotas
├── configmap.yaml              # Configurações (dev)
├── deployment.yaml             # Deployment (dev)
├── service.yaml                # Service (dev)
├── ingress.yaml                # Ingress (dev)
├── cert-issuer.yaml            # Let's Encrypt ClusterIssuer
│
├── deployment-prod.yaml        # Deployment (produção, com health checks)
├── service-prod.yaml           # Service (produção)
├── configmap-prod.yaml         # ConfigMap (produção)
├── ingressroute-prod.yaml      # IngressRoute Traefik (produção)
│
├── kustomization.yaml          # Kustomize (dev)
└── kustomization-prod.yaml     # Kustomize (produção)
```

## 🚀 Quick Deploy

### Desenvolvimento (com Nginx Ingress)

```bash
# Aplicar todos os manifests de dev
kubectl apply -k k8s/

# Verificar
kubectl get pods
kubectl get services
kubectl get ingress
```

### Produção (com Traefik no RKE2/K3s)

```bash
# 1. Criar namespace e RBAC
kubectl apply -f k8s/namespace.yaml

# 2. Aplicar ConfigMap
kubectl apply -f k8s/configmap-prod.yaml

# 3. Aplicar Deployment + Service + IngressRoute
kubectl apply -k k8s/kustomization-prod.yaml

# Ou manualmente:
kubectl apply -f k8s/deployment-prod.yaml
kubectl apply -f k8s/service-prod.yaml
kubectl apply -f k8s/ingressroute-prod.yaml

# 4. Verificar
kubectl get pods -n portfolio-prod
kubectl get svc -n portfolio-prod
kubectl get ingressroute -n portfolio-prod
kubectl get certificate -n portfolio-prod
```

## 📋 Checklist de Deploy

- [ ] Cluster Kubernetes rodando (`kubectl cluster-info`)
- [ ] kubectl configurado (`kubectl config current-context`)
- [ ] Imagem Docker já publicada em Docker Hub
- [ ] Domínio apontado para o cluster
- [ ] cert-manager instalado (para SSL)
- [ ] Traefik rodando (RKE2/K3s) OU Nginx Ingress (K8s puro)

## 🔐 Produção - Configuração de Secrets

Antes de fazer deploy em produção:

```bash
# 1. Criar secrets (não commitar em Git!)
kubectl create secret generic portfolio-secrets \
  --from-literal=DATABASE_URL='postgres://...' \
  --from-literal=API_KEY='...' \
  -n portfolio-prod

# OU usar Sealed Secrets (recomendado):
kubeseal -f secret.yaml -w sealedsecret.yaml
kubectl apply -f sealedsecret.yaml
```

## 📊 Monitoramento

```bash
# Status dos pods
kubectl get pods -n portfolio-prod -w

# Logs
kubectl logs -f deployment/portfolio-app -n portfolio-prod

# Logs de todos os pods
kubectl logs -f -l app=portfolio -n portfolio-prod

# CPU e Memória
kubectl top pods -n portfolio-prod
```

## 🔄 Atualizar Imagem

```bash
# Atualizar imagem do deployment
kubectl set image deployment/portfolio-app \
  app=joannegton/portfolio:v1.2.3 \
  -n portfolio-prod

# Verificar rollout
kubectl rollout status deployment/portfolio-app -n portfolio-prod

# Rollback se necessário
kubectl rollout undo deployment/portfolio-app -n portfolio-prod
```

## 🗑️ Deletar Deploy

```bash
# Deletar todos os recursos do namespace
kubectl delete namespace portfolio-prod

# Ou deletar manualmente
kubectl delete -f k8s/namespace.yaml
```

## 📚 Documentação Completa

Veja [DEPLOY_PRODUCTION.md](../DEPLOY_PRODUCTION.md) para um guia completo com:

- Arquitetura
- Pré-requisitos
- RBAC e Segurança
- Configuração de Traefik vs Nginx
- Gerenciamento de Secrets
- Monitoring
- Backup e Disaster Recovery
- CI/CD Integration
- Troubleshooting

---

**Versão:** 1.0 | **Data:** 2026-05-13
