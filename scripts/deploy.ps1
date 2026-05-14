# Script para Build, Push e Deploy da aplicação Portfolio
# Uso: .\scripts\deploy.ps1 -Action build|push|deploy -DockerUser seu-usuario -Domain seu-dominio.com

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('build', 'push', 'deploy', 'all')]
    [string]$Action,

    [Parameter(Mandatory=$false)]
    [string]$DockerUser = "seu-usuario",

    [Parameter(Mandatory=$false)]
    [string]$Domain = "seu-dominio.com",

    [Parameter(Mandatory=$false)]
    [string]$Version = "latest"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ImageName = "$DockerUser/portfolio:$Version"

function Write-Header {
    param([string]$Message)
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Build-Image {
    Write-Header "Building Docker Image: $ImageName"

    if (-Not (Test-Path $ProjectRoot\Dockerfile)) {
        Write-Host "❌ Dockerfile not found in $ProjectRoot" -ForegroundColor Red
        exit 1
    }

    Push-Location $ProjectRoot
    docker build -t $ImageName .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    Pop-Location

    Write-Host "✅ Image built successfully!" -ForegroundColor Green
}

function Push-Image {
    Write-Header "Pushing Image to Docker Hub"

    Write-Host "Make sure you are logged in to Docker Hub:" -ForegroundColor Yellow
    docker push $ImageName

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Push failed!" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ Image pushed successfully!" -ForegroundColor Green
}

function Deploy-Kubernetes {
    Write-Header "Updating Kubernetes Manifests"

    # Update deployment.yaml
    $deploymentFile = "$ProjectRoot\k8s\deployment.yaml"
    if (Test-Path $deploymentFile) {
        $content = Get-Content $deploymentFile -Raw
        $content = $content -replace 'seu-usuario/portfolio:latest', $ImageName
        Set-Content $deploymentFile $content
        Write-Host "✅ Updated $deploymentFile" -ForegroundColor Green
    }

    # Update ingress.yaml
    $ingressFile = "$ProjectRoot\k8s\ingress.yaml"
    if (Test-Path $ingressFile) {
        $content = Get-Content $ingressFile -Raw
        $content = $content -replace 'seu-dominio\.com', $Domain
        Set-Content $ingressFile $content
        Write-Host "✅ Updated $ingressFile" -ForegroundColor Green
    }

    Write-Header "Deploying to Kubernetes"

    kubectl apply -k "$ProjectRoot\k8s\"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Deploy failed!" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ Deployment applied successfully!" -ForegroundColor Green

    Write-Header "Checking Deployment Status"

    kubectl get pods -l app=portfolio
    kubectl get svc portfolio-service
    kubectl get ingress portfolio-ingress
}

switch ($Action) {
    'build' {
        Build-Image
    }
    'push' {
        Push-Image
    }
    'deploy' {
        Deploy-Kubernetes
    }
    'all' {
        Build-Image
        Push-Image
        Write-Host "`nPush complete! Make sure kubectl is configured, then run: $($MyInvocation.MyCommand.Name) -Action deploy" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Done!" -ForegroundColor Green
