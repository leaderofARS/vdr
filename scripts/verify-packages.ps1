# Package Verification Script
# Verifies all package.json files have secure versions

$ErrorActionPreference = "Continue"

Write-Host "🔍 Verifying Package Security..." -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0

function Test-Package {
    param(
        [string]$Path,
        [string]$Name,
        [string]$Package,
        [string]$MinVersion
    )
    
    Write-Host "Checking $Name - $Package... " -NoNewline
    
    if (Test-Path $Path) {
        $content = Get-Content $Path -Raw | ConvertFrom-Json
        $version = $null
        
        if ($content.dependencies.$Package) {
            $version = $content.dependencies.$Package
        } elseif ($content.devDependencies.$Package) {
            $version = $content.devDependencies.$Package
        }
        
        if ($version) {
            # Remove ^ or ~ prefix
            $cleanVersion = $version -replace '[\^~]', ''
            
            # Simple version comparison (works for most cases)
            if ([version]$cleanVersion -ge [version]$MinVersion) {
                Write-Host "✓ $version (secure)" -ForegroundColor Green
                $script:passed++
                return $true
            } else {
                Write-Host "✗ $version (outdated, need >= $MinVersion)" -ForegroundColor Red
                $script:failed++
                return $false
            }
        } else {
            Write-Host "⊘ Not found" -ForegroundColor Yellow
            return $true
        }
    } else {
        Write-Host "✗ File not found" -ForegroundColor Red
        $script:failed++
        return $false
    }
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Critical Security Packages" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Check axios in all projects (CVE-2024-39338, CVE-2024-47764)
Test-Package "backend/api-server/package.json" "Backend API" "axios" "1.7.8"
Test-Package "web/dashboard/package.json" "Web Dashboard" "axios" "1.7.8"
Test-Package "cli/vdr-cli/package.json" "CLI" "axios" "1.7.8"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Other Security-Critical Packages" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Check other critical packages
Test-Package "backend/api-server/package.json" "Backend API" "cookie-parser" "1.4.6"
Test-Package "backend/api-server/package.json" "Backend API" "jsonwebtoken" "9.0.0"
Test-Package "backend/api-server/package.json" "Backend API" "bcrypt" "5.0.0"
Test-Package "backend/api-server/package.json" "Backend API" "express" "5.0.0"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Solana SDK Versions" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Test-Package "package.json" "Root" "@solana/web3.js" "1.95.0"
Test-Package "backend/api-server/package.json" "Backend API" "@solana/web3.js" "1.95.0"
Test-Package "web/dashboard/package.json" "Web Dashboard" "@solana/web3.js" "1.95.0"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "Results: $passed passed, $failed failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✅ ALL PACKAGES ARE SECURE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Install dependencies from WSL: wsl" -ForegroundColor White
    Write-Host "2. Run: bash scripts/audit-and-fix.sh" -ForegroundColor White
    Write-Host "3. Verify: npm audit in each project" -ForegroundColor White
    exit 0
} else {
    Write-Host "❌ SOME PACKAGES NEED UPDATES" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please update the packages marked as outdated above."
    exit 1
}
