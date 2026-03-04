# HashiCorp Vault Development Setup Script (PowerShell)
# This script sets up Vault in dev mode and stores secrets

$ErrorActionPreference = "Stop"

Write-Host "🔐 Setting up HashiCorp Vault for Development..." -ForegroundColor Cyan
Write-Host ""

# Check if Vault is installed
try {
    $vaultVersion = vault --version
    Write-Host "✓ Vault is installed: $vaultVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vault is not installed. Please install it first:" -ForegroundColor Red
    Write-Host ""
    Write-Host "Windows: choco install vault"
    Write-Host "Or download from: https://www.vaultproject.io/downloads"
    exit 1
}

Write-Host ""

# Check if .env file exists
if (-not (Test-Path "backend/api-server/.env")) {
    Write-Host "❌ .env file not found at backend/api-server/.env" -ForegroundColor Red
    exit 1
}

# Read .env file
Write-Host "📖 Reading secrets from .env file..." -ForegroundColor Yellow
$envContent = Get-Content "backend/api-server/.env" -Raw
$envVars = @{}

foreach ($line in $envContent -split "`n") {
    if ($line -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
    }
}

# Check required variables
$required = @('WALLET_PRIVATE_KEY', 'JWT_SECRET', 'PROGRAM_ID')
foreach ($var in $required) {
    if (-not $envVars.ContainsKey($var) -or [string]::IsNullOrWhiteSpace($envVars[$var])) {
        Write-Host "❌ Missing required environment variable: $var" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✓ Found required secrets" -ForegroundColor Green
Write-Host ""

# Start Vault dev server in background
Write-Host "🚀 Starting Vault dev server..." -ForegroundColor Yellow
$vaultProcess = Start-Process -FilePath "vault" -ArgumentList "server", "-dev" -PassThru -RedirectStandardOutput "vault-dev.log" -NoNewWindow

# Wait for Vault to start
Start-Sleep -Seconds 3

# Extract root token from log
$logContent = Get-Content "vault-dev.log" -Raw
if ($logContent -match 'Root Token: (hvs\.[^\s]+)') {
    $vaultToken = $matches[1]
} else {
    Write-Host "❌ Failed to start Vault or extract root token" -ForegroundColor Red
    Stop-Process -Id $vaultProcess.Id -Force -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "✓ Vault started (PID: $($vaultProcess.Id))" -ForegroundColor Green
Write-Host "✓ Root Token: $vaultToken" -ForegroundColor Green
Write-Host ""

# Set Vault environment variables
$env:VAULT_ADDR = 'http://127.0.0.1:8200'
$env:VAULT_TOKEN = $vaultToken

# Store secrets in Vault
Write-Host "💾 Storing secrets in Vault..." -ForegroundColor Yellow

$solanaRpcUrl = if ($envVars.ContainsKey('SOLANA_RPC_URL')) { $envVars['SOLANA_RPC_URL'] } else { 'https://api.devnet.solana.com' }

vault kv put secret/sipheron/prod `
  WALLET_PRIVATE_KEY="$($envVars['WALLET_PRIVATE_KEY'])" `
  JWT_SECRET="$($envVars['JWT_SECRET'])" `
  PROGRAM_ID="$($envVars['PROGRAM_ID'])" `
  SOLANA_RPC_URL="$solanaRpcUrl"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Secrets stored successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to store secrets" -ForegroundColor Red
    Stop-Process -Id $vaultProcess.Id -Force -ErrorAction SilentlyContinue
    exit 1
}

Write-Host ""

# Verify secrets
Write-Host "🔍 Verifying secrets..." -ForegroundColor Yellow
vault kv get secret/sipheron/prod | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Secrets verified" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to verify secrets" -ForegroundColor Red
    Stop-Process -Id $vaultProcess.Id -Force -ErrorAction SilentlyContinue
    exit 1
}

Write-Host ""

# Create new .env with Vault configuration
Write-Host "📝 Updating .env file..." -ForegroundColor Yellow
Copy-Item "backend/api-server/.env" "backend/api-server/.env.backup"

$newEnvContent = @"
# Vault Configuration
VAULT_ADDR=http://127.0.0.1:8200
VAULT_TOKEN=$vaultToken
VAULT_SECRET_PATH=secret/data/sipheron/prod

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
SOLANA_NETWORK=devnet

# Database (if using)
# DATABASE_URL=...

# Fallback secrets (will be fetched from Vault)
# WALLET_PRIVATE_KEY=...
# JWT_SECRET=...
# PROGRAM_ID=...
# SOLANA_RPC_URL=...
"@

Set-Content -Path "backend/api-server/.env" -Value $newEnvContent

Write-Host "✓ .env file updated (backup saved as .env.backup)" -ForegroundColor Green
Write-Host ""

# Create vault-env.ps1 for easy sourcing
$vaultEnvContent = @"
# Source this file to set Vault environment variables
`$env:VAULT_ADDR = 'http://127.0.0.1:8200'
`$env:VAULT_TOKEN = '$vaultToken'
"@

Set-Content -Path "vault-env.ps1" -Value $vaultEnvContent

# Save PID for later
Set-Content -Path "vault.pid" -Value $vaultProcess.Id

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ Vault setup complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "Vault is running in the background (PID: $($vaultProcess.Id))"
Write-Host "Root Token: $vaultToken"
Write-Host ""
Write-Host "To use Vault in other terminals:"
Write-Host "  . .\vault-env.ps1"
Write-Host ""
Write-Host "To stop Vault:"
Write-Host "  Stop-Process -Id $($vaultProcess.Id)"
Write-Host ""
Write-Host "To start your application:"
Write-Host "  cd backend/api-server; npm start"
Write-Host ""
Write-Host "Vault UI: http://127.0.0.1:8200/ui"
Write-Host "  Token: $vaultToken"
Write-Host ""
Write-Host "💡 Tip: Vault is running in the background" -ForegroundColor Cyan
