# Security Fixes Verification Script
# Verifies all critical security fixes are properly implemented

$ErrorActionPreference = "Continue"

Write-Host "🔱 Verifying Security Fixes Implementation..." -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0

function Test-Fix {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    
    Write-Host "Testing: $Name... " -NoNewline
    
    try {
        $result = & $Test
        if ($result) {
            Write-Host "✓ PASSED" -ForegroundColor Green
            $script:passed++
        } else {
            Write-Host "✗ FAILED" -ForegroundColor Red
            $script:failed++
        }
    } catch {
        Write-Host "✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
    }
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Smart Contract Layer" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Test-Fix "Fix 1.1 & 1.2: TTL Enforcement" {
    $content = Get-Content "programs/vdr_contract/src/instructions/verify_hash.rs" -Raw
    $content -match "Clock::get\(\)\?\.unix_timestamp" -and $content -match "require!\(current_time <= record\.expiry"
}

Test-Fix "Regression 3.2: PDA Collision Prevention" {
    $content = Get-Content "programs/vdr_contract/src/instructions/register_hash.rs" -Raw
    $content -match 'seeds = \[b"hash_record", hash\.as_ref\(\), owner\.key\(\)\.as_ref\(\)\]'
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Backend API" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Test-Fix "Fix 1.3 & 1.4: Vault Integration Created" {
    Test-Path "backend/api-server/src/services/vault.js"
}

Test-Fix "Fix 1.3 & 1.4: Solana Service Uses Vault" {
    $content = Get-Content "backend/api-server/src/services/solana.js" -Raw
    $content -match "vaultService" -and $content -match "getSecret"
}

Test-Fix "Fix 1.8: Security Headers Middleware Created" {
    Test-Path "backend/api-server/src/middleware/helmet-config.js"
}

Test-Fix "Fix 1.8: Security Headers Applied in app.js" {
    $content = Get-Content "backend/api-server/src/app.js" -Raw
    $content -match "helmetConfig" -and $content -match "app\.use\(helmetConfig\)"
}

Test-Fix "Fix 1.11: Input Sanitizer Created" {
    Test-Path "backend/api-server/src/utils/sanitizer.js"
}

Test-Fix "Fix 1.11: Sanitization Applied in register.js" {
    $content = Get-Content "backend/api-server/src/routes/register.js" -Raw
    $content -match "sanitizeMetadata" -and $content -match "sanitizeHash"
}

Test-Fix "Fix 1.16: Cookie Parser Added" {
    $content = Get-Content "backend/api-server/src/app.js" -Raw
    $content -match "cookie-parser" -and $content -match "cookieParser\(\)"
}

Test-Fix "Fix 1.16: HttpOnly Cookies in auth.js" {
    $content = Get-Content "backend/api-server/src/routes/auth.js" -Raw
    $content -match "httpOnly: true" -and $content -match "res\.cookie"
}

Test-Fix "Fix 1.16: Auth Middleware Supports Cookies" {
    $content = Get-Content "backend/api-server/src/middleware/auth.js" -Raw
    $content -match "req\.cookies" -and $content -match "vdr_token"
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Frontend" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Test-Fix "Fix 1.16: Frontend Uses withCredentials" {
    $content = Get-Content "web/dashboard/src/utils/api.js" -Raw
    $content -match "withCredentials: true"
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "CLI" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Test-Fix "Fix 1.14: CLI Uses Secure File Permissions" {
    $content = Get-Content "cli/vdr-cli/src/utils/configManager.js" -Raw
    $content -match "0o600" -and $content -match "PermissionValidator"
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Documentation" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Test-Fix "Vault Setup Guide Created" {
    Test-Path "docs/VAULT_SETUP_GUIDE.md"
}

Test-Fix "Security Testing Guide Created" {
    Test-Path "docs/SECURITY_TESTING_GUIDE.md"
}

Test-Fix "Vault Setup Scripts Created" {
    (Test-Path "scripts/setup-vault-dev.sh") -and (Test-Path "scripts/setup-vault-dev.ps1")
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "Test Results: $passed passed, $failed failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✅ ALL SECURITY FIXES VERIFIED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Install dependencies: cd backend/api-server; npm install cookie-parser axios"
    Write-Host "2. Setup Vault: .\scripts\setup-vault-dev.ps1"
    Write-Host "3. Start application: cd backend/api-server; npm start"
    Write-Host "4. Run tests: See docs/SECURITY_TESTING_GUIDE.md"
    exit 0
} else {
    Write-Host "❌ SOME FIXES FAILED VERIFICATION" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review the failed tests above and ensure all files are properly updated."
    exit 1
}
