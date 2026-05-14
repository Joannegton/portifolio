# ============================================================================
# Script para Corrigir YAMLs para Produção
# ============================================================================
# Uso: .\scripts\fix-production.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "v1.2.3"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🔧 Corrigindo YAMLs para Produção" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ========== 1. Image Tags ==========
Write-Host "1️⃣  Corrigindo image tags de 'latest' para '$ImageTag'..." -ForegroundColor Yellow

$files = @(
    "k8s/deployment-prod.yaml",
    "k8s/kustomization-prod.yaml"
)

foreach ($file in $files) {
    $fullPath = Join-Path $ProjectRoot $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        $content = $content -replace 'latest', $ImageTag
        Set-Content $fullPath $content
        Write-Host "   ✅ $file atualizado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $file não encontrado" -ForegroundColor Yellow
    }
}

# ========== 2. Criar configmap-prod.yaml ==========
Write-Host "`n2️⃣  Verificando configmap-prod.yaml..." -ForegroundColor Yellow

$configmapFile = Join-Path $ProjectRoot "k8s/configmap-prod.yaml"
if (-Not (Test-Path $configmapFile)) {
    Write-Host "   Criando configmap-prod.yaml..." -ForegroundColor Cyan

    $configmapContent = @"
# ============================================================================
# CONFIGMAP - Configuração Principal (Produção)
# ============================================================================

apiVersion: v1
kind: ConfigMap
metadata:
  name: portfolio-config
  namespace: portfolio-prod
  labels:
    app: portfolio
    environment: production
data:
  NODE_ENV: "production"
  NEXT_TELEMETRY_DISABLED: "1"
  PORT: "3000"
  LOG_LEVEL: "info"
"@

    Set-Content $configmapFile $configmapContent
    Write-Host "   ✅ configmap-prod.yaml criado" -ForegroundColor Green
} else {
    Write-Host "   ✅ configmap-prod.yaml já existe" -ForegroundColor Green
}

# ========== 3. Aumentar Liveness Probe ==========
Write-Host "`n3️⃣  Corrigindo liveness probe (30s → 60s)..." -ForegroundColor Yellow

$deploymentFile = Join-Path $ProjectRoot "k8s/deployment-prod.yaml"
$content = Get-Content $deploymentFile -Raw
$content = $content -replace '(?m)initialDelaySeconds: 30(\s+)$', 'initialDelaySeconds: 60$1'
Set-Content $deploymentFile $content
Write-Host "   ✅ Liveness probe atualizado" -ForegroundColor Green

# ========== 4. Adicionar sizeLimit aos emptyDirs ==========
Write-Host "`n4️⃣  Corrigindo emptyDir com sizeLimit..." -ForegroundColor Yellow

$content = Get-Content $deploymentFile -Raw

# Verificar se já tem sizeLimit
if ($content -match 'sizeLimit:') {
    Write-Host "   ✅ sizeLimit já está configurado" -ForegroundColor Green
} else {
    $content = $content -replace `
        "(?m)  - name: tmp\r?\n    emptyDir: \{\}", `
        "  - name: tmp`n    emptyDir:`n      sizeLimit: 1Gi`n      medium: Memory"

    $content = $content -replace `
        "(?m)  - name: cache\r?\n    emptyDir: \{\}", `
        "  - name: cache`n    emptyDir:`n      sizeLimit: 2Gi"

    Set-Content $deploymentFile $content
    Write-Host "   ✅ sizeLimit adicionado aos emptyDirs" -ForegroundColor Green
}

# ========== 5. Restringir NetworkPolicy ==========
Write-Host "`n5️⃣  Melhorando NetworkPolicy..." -ForegroundColor Yellow

$namespaceFile = Join-Path $ProjectRoot "k8s/namespace.yaml"
$content = Get-Content $namespaceFile -Raw

# Verificar se já tem a restrição
if ($content -match 'matchLabels:\s+name: kube-system') {
    Write-Host "   ✅ NetworkPolicy já está restrita" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  NetworkPolicy ainda está permissiva - revisar manualmente" -ForegroundColor Yellow
    Write-Host "   Ver: AUDITORIA_PRODUCAO.md seção 'NetworkPolicy Muito Permissiva'" -ForegroundColor Cyan
}

# ========== 6. Especificar namespaces das middlewares ==========
Write-Host "`n6️⃣  Corrigindo middleware namespaces..." -ForegroundColor Yellow

$ingressrouteFile = Join-Path $ProjectRoot "k8s/ingressroute-prod.yaml"
$content = Get-Content $ingressrouteFile -Raw

# Verificar se já tem namespace
if ($content -match 'namespace: portfolio-prod') {
    Write-Host "   ✅ Middlewares já têm namespaces especificados" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Middlewares ainda precisam de namespaces - revisar manualmente" -ForegroundColor Yellow
}

# ========== 7. Validar YAMLs ==========
Write-Host "`n7️⃣  Validando sintaxe dos YAMLs..." -ForegroundColor Yellow

try {
    # Verificar se kubectl está disponível
    $kubeVersion = kubectl version --client --output=json 2>$null

    # Testar validação
    $allFiles = Get-ChildItem -Path "$ProjectRoot/k8s/*.yaml" -File
    $validFiles = 0
    $invalidFiles = 0

    foreach ($file in $allFiles) {
        try {
            kubectl apply -f $file.FullName --dry-run=client -o yaml | Out-Null
            $validFiles++
        } catch {
            Write-Host "   ❌ $($file.Name) - ERRO: $($_)" -ForegroundColor Red
            $invalidFiles++
        }
    }

    if ($invalidFiles -eq 0) {
        Write-Host "   ✅ Todos os $validFiles YAMLs são válidos" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $validFiles válidos, $invalidFiles com erro" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  kubectl não disponível - skipping validação" -ForegroundColor Yellow
}

# ========== Resumo ==========
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ CORREÇÕES APLICADAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📋 Checklist de Ações Restantes:`n" -ForegroundColor Yellow

Write-Host "  [ ] Revisar NetworkPolicy (AUDITORIA_PRODUCAO.md)" -ForegroundColor Cyan
Write-Host "  [ ] Adicionar rate limiting ao IngressRoute" -ForegroundColor Cyan
Write-Host "  [ ] Criar secrets do banco de dados:" -ForegroundColor Cyan
Write-Host "      kubectl create secret generic portfolio-secrets \" -ForegroundColor Cyan
Write-Host "        --from-literal=DB_PASSWORD='sua-senha' \" -ForegroundColor Cyan
Write-Host "        -n portfolio-prod" -ForegroundColor Cyan
Write-Host "  [ ] Apontar DNS para IP do Traefik" -ForegroundColor Cyan
Write-Host "  [ ] Executar deployment:" -ForegroundColor Cyan
Write-Host "      kubectl apply -k k8s/kustomization-prod.yaml" -ForegroundColor Cyan
Write-Host "  [ ] Monitorar pods:" -ForegroundColor Cyan
Write-Host "      kubectl get pods -n portfolio-prod -w" -ForegroundColor Cyan

Write-Host "`n📖 Leia: AUDITORIA_PRODUCAO.md`n" -ForegroundColor Green
