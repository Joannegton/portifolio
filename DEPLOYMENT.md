# Deploy - Portfolio App (Kubernetes)

**App:** Next.js 15 (estático, sem banco de dados)  
**Cluster:** K3s + Rancher (`bolacha@racher`)  
**Namespace:** `portfolio-prod`

---

## Arquitetura

```
Usuário (HTTPS)
    ↓
Cloudflare Edge (TLS termination + CDN)
    ↓
Cloudflare Tunnel (cloudflared no servidor)
    ↓
Traefik (kube-system) via HTTP interno
    ↓
Service portfolio-app (port 80 → 3000)
    ↓
Pod 1, Pod 2, Pod 3 (joannegton/portfolio:v1.0.0)
```

**SSL:** Gerenciado pelo Cloudflare — sem cert-manager, sem Let's Encrypt no cluster.

---

## Estrutura dos YAMLs

```
k8s/
├── kustomization.yaml        ← entry point do deploy
├── namespace.yaml            ← namespace, RBAC, quotas, network policy
├── configmap.yaml            ← variáveis de ambiente (NODE_ENV, PORT)
├── deployment-prod.yaml      ← deployment + PDB
├── service-prod.yaml         ← service ClusterIP
├── ingressroute-prod.yaml    ← Traefik IngressRoute + security headers
└── _old/                     ← arquivos antigos (não usar)
```

---

## Pré-requisitos

```bash
# Traefik rodando
kubectl get pods -n kube-system | grep traefik

# Cloudflare Tunnel ativo no servidor
sudo systemctl status cloudflared
```

---

## Deploy (primeira vez)

```bash
# 1. Taguear imagem no Docker Hub
docker pull joannegton/portfolio:latest
docker tag joannegton/portfolio:latest joannegton/portfolio:v1.0.0
docker push joannegton/portfolio:v1.0.0

# 2. Deploy da aplicação
kubectl apply -k k8s/

# 3. Acompanhar
kubectl rollout status deployment/portfolio-app -n portfolio-prod
kubectl get pods -n portfolio-prod
```

---

## Verificar após deploy

```bash
# Pods
kubectl get pods -n portfolio-prod

# Logs da aplicação
kubectl logs -f deployment/portfolio-app -n portfolio-prod

# Testar roteamento interno (da VM)
curl -v -H "Host: joannegton.com" http://192.168.1.150:80

# Testar acesso público
curl -v https://joannegton.com
```

---

## Atualizar versão

```bash
# 1. Build e push da nova imagem
docker build -t joannegton/portfolio:v1.1.0 .
docker push joannegton/portfolio:v1.1.0

# 2. Atualizar newTag no k8s/kustomization.yaml
# 3. Aplicar
kubectl apply -k k8s/

# Rollback se necessário
kubectl rollout undo deployment/portfolio-app -n portfolio-prod
```

---

## Cloudflare Tunnel

O tunnel é instalado como serviço systemd no servidor e inicia automaticamente.

```bash
# Status
sudo systemctl status cloudflared

# Reiniciar se necessário
sudo systemctl restart cloudflared

# Logs
sudo journalctl -u cloudflared -f
```

**Roteamento configurado no Cloudflare Dashboard:**
```
joannegton.com     → http://192.168.1.150:80
www.joannegton.com → http://192.168.1.150:80
```

---

## Troubleshooting

### Pod não inicia
```bash
kubectl describe pod <pod-name> -n portfolio-prod
kubectl logs <pod-name> -n portfolio-prod
```

### Site retorna 404
```bash
# Verificar se Traefik está roteando
curl -v -H "Host: joannegton.com" http://192.168.1.150:80

# Ver logs do Traefik
kubectl logs -f -n kube-system deployment/traefik | grep -i "portfolio\|error"

# Ver IngressRoute
kubectl describe ingressroute portfolio-ingress -n portfolio-prod
```

### Cloudflare Tunnel desconectado
```bash
sudo systemctl status cloudflared
sudo journalctl -u cloudflared --since "10 min ago"
sudo systemctl restart cloudflared
```

### Deletar tudo
```bash
kubectl delete namespace portfolio-prod
```

---

## Checklist pré-deploy

- [ ] Traefik rodando (`kubectl get pods -n kube-system | grep traefik`)
- [ ] Cloudflare Tunnel ativo (`sudo systemctl status cloudflared`)
- [ ] Imagem publicada no Docker Hub com tag versionada
- [ ] Dry-run sem erros (`kubectl apply -k k8s/ --dry-run=client`)
