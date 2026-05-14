# Script para verificar status do deployment no Kubernetes

Write-Host "`n=== Portfolio Kubernetes Status ===" -ForegroundColor Cyan

Write-Host "`nPods:" -ForegroundColor Yellow
kubectl get pods -l app=portfolio -o wide

Write-Host "`nServices:" -ForegroundColor Yellow
kubectl get svc portfolio-service -o wide

Write-Host "`nIngress:" -ForegroundColor Yellow
kubectl get ingress portfolio-ingress -o wide

Write-Host "`nCertificado SSL:" -ForegroundColor Yellow
kubectl get certificate -A

Write-Host "`nReplicaSets:" -ForegroundColor Yellow
kubectl get rs -l app=portfolio

Write-Host "`nDeployment:" -ForegroundColor Yellow
kubectl describe deployment portfolio-app

Write-Host "`nÚltimos logs:" -ForegroundColor Yellow
kubectl logs -l app=portfolio --tail=20 --timestamps=true

Write-Host "`n" -ForegroundColor Cyan
