# Script para fazer rollback do deployment

param(
    [Parameter(Mandatory=$false)]
    [int]$Revisions = 1
)

Write-Host "`n=== Rollback do Deployment ===" -ForegroundColor Cyan

Write-Host "`nHistórico de deployments:" -ForegroundColor Yellow
kubectl rollout history deployment/portfolio-app

Write-Host "`nFazendo rollback de $Revisions revisão(ões)..." -ForegroundColor Yellow
kubectl rollout undo deployment/portfolio-app --to-revision=$Revisions

Write-Host "`nAguardando estabilização..." -ForegroundColor Yellow
kubectl rollout status deployment/portfolio-app

Write-Host "`n✅ Rollback concluído!" -ForegroundColor Green
kubectl get pods -l app=portfolio
