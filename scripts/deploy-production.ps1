# ============================================================================
# Script de Deploy em Produção - Portfolio App
# ============================================================================
# Uso: .\scripts\deploy-production.ps1 -Action deploy|rollback|status|clean
#
# Prerequisitos:
# - kubectl configurado e conectado ao cluster
# - Imagem Docker já publicada em Docker Hub
# - Domínio apontado para o cluster

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('deploy', 'rollback', 'status', 'clean', 'logs', 'scale')]
    [string]$Action,

    [Parameter(Mandatory=$false)]
    [string]$Namespace = "portfolio-prod",

    [Parameter(Mandatory=$false)]
    [int]$Replicas = 3,

    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

# ============================================================================
# FUNÇÕES
# ============================================================================

function Write-Header {
    param([string]$Message)
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Check-Prerequisites {
    Write-Header "Verificando Pré-requisitos"

    # Verificar kubectl
    try {
        $kubeVersion = kubectl version --client --output=json 2>$null | ConvertFrom-Json
        Write-Success "kubectl disponível (versão $($kubeVersion.clientVersion.gitVersion))"
    } catch {
        Write-Error "kubectl não encontrado. Instale kubectl e tente novamente."
        exit 1
    }

    # Verificar cluster conectado
    try {
        $context = kubectl config current-context
        Write-Success "Conectado ao cluster: $context"
    } catch {
        Write-Error "Não há contexto kubectl configurado"
        exit 1
    }

    # Verificar namespace
    try {
        kubectl get namespace $Namespace >$null 2>&1
        Write-Success "Namespace $Namespace existe"
    } catch {
        Write-Warning "Namespace $Namespace não existe. Será criado."
    }
}

function Deploy-Application {
    Write-Header "Iniciando Deploy em Produção"

    # Verificar manifests
    $requiredFiles = @(
        "k8s/namespace.yaml",
        "k8s/configmap-prod.yaml",
        "k8s/deployment-prod.yaml",
        "k8s/service-prod.yaml",
        "k8s/ingressroute-prod.yaml"
    )

    foreach ($file in $requiredFiles) {
        $fullPath = Join-Path $ProjectRoot $file
        if (-Not (Test-Path $fullPath)) {
            Write-Error "Arquivo não encontrado: $fullPath"
            exit 1
        }
    }

    Write-Host "Aplicando namespace e RBAC..." -ForegroundColor Yellow
    kubectl apply -f "$ProjectRoot\k8s\namespace.yaml"

    Write-Host "Aplicando ConfigMap..." -ForegroundColor Yellow
    kubectl apply -f "$ProjectRoot\k8s\configmap-prod.yaml"

    Write-Host "Aplicando Deployment..." -ForegroundColor Yellow
    kubectl apply -f "$ProjectRoot\k8s\deployment-prod.yaml"

    Write-Host "Aplicando Service..." -ForegroundColor Yellow
    kubectl apply -f "$ProjectRoot\k8s\service-prod.yaml"

    Write-Host "Aplicando IngressRoute..." -ForegroundColor Yellow
    kubectl apply -f "$ProjectRoot\k8s\ingressroute-prod.yaml"

    Write-Success "Manifestos aplicados!"

    # Aguardar rollout
    Write-Host "Aguardando deploy estar pronto..." -ForegroundColor Yellow
    kubectl rollout status deployment/portfolio-app -n $Namespace --timeout=5m

    Write-Success "Deploy concluído com sucesso!"
    Show-Status
}

function Show-Status {
    Write-Header "Status do Deployment"

    Write-Host "`nPods:" -ForegroundColor Yellow
    kubectl get pods -n $Namespace -l app=portfolio -o wide

    Write-Host "`nServices:" -ForegroundColor Yellow
    kubectl get svc -n $Namespace -l app=portfolio -o wide

    Write-Host "`nIngressRoute:" -ForegroundColor Yellow
    kubectl get ingressroute -n $Namespace -l app=portfolio

    Write-Host "`nCertificado SSL:" -ForegroundColor Yellow
    kubectl get certificate -n $Namespace 2>$null || Write-Warning "Sem certificados SSL"

    Write-Host "`nResource Usage:" -ForegroundColor Yellow
    kubectl top pods -n $Namespace -l app=portfolio 2>$null || Write-Warning "Metrics server não disponível"
}

function Rollback-Deployment {
    Write-Header "Rollback do Deployment"

    # Ver histórico de revisões
    Write-Host "Histórico de deployments:" -ForegroundColor Yellow
    kubectl rollout history deployment/portfolio-app -n $Namespace

    # Fazer rollback
    Write-Host "Fazendo rollback..." -ForegroundColor Yellow
    kubectl rollout undo deployment/portfolio-app -n $Namespace

    # Aguardar
    kubectl rollout status deployment/portfolio-app -n $Namespace --timeout=5m

    Write-Success "Rollback concluído!"
    Show-Status
}

function Show-Logs {
    Write-Header "Logs da Aplicação"

    Write-Host "Últimas 50 linhas:" -ForegroundColor Yellow
    kubectl logs -n $Namespace -l app=portfolio --tail=50 --all-containers=true

    Write-Host "`nModo watch (pressione Ctrl+C para parar):" -ForegroundColor Yellow
    kubectl logs -f -n $Namespace -l app=portfolio --all-containers=true
}

function Scale-Deployment {
    Write-Header "Escalando Deployment"

    Write-Host "Escalando para $Replicas replicas..." -ForegroundColor Yellow
    kubectl scale deployment portfolio-app --replicas=$Replicas -n $Namespace

    kubectl rollout status deployment/portfolio-app -n $Namespace --timeout=2m

    Write-Success "Scaled para $Replicas replicas!"
}

function Clean-Deployment {
    Write-Header "Deletando Deploy"

    Write-Warning "Isto deletará TODOS os recursos no namespace $Namespace"
    $confirm = Read-Host "Digite 'sim' para confirmar"

    if ($confirm -eq "sim") {
        Write-Host "Deletando namespace..." -ForegroundColor Yellow
        kubectl delete namespace $Namespace --wait=true

        Write-Success "Deploy deletado!"
    } else {
        Write-Warning "Operação cancelada"
    }
}

# ============================================================================
# MAIN
# ============================================================================

Check-Prerequisites

switch ($Action) {
    'deploy' {
        Deploy-Application
    }
    'status' {
        Show-Status
    }
    'rollback' {
        Rollback-Deployment
    }
    'logs' {
        Show-Logs
    }
    'scale' {
        Scale-Deployment
    }
    'clean' {
        Clean-Deployment
    }
}

Write-Host "`n" -ForegroundColor Cyan
