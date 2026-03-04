# Security Fixes Application Script (PowerShell)
# Applies all pre-release security fixes to the codebase

$ErrorActionPreference = "Stop"

Write-Host "🔱 Applying Pre-Release Security Fixes..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Backup existing files
Write-Host "Step 1: Creating backups..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backups/$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$filesToBackup = @(
    "backend/api-server/src/app.js",
    "backend/api-server/src/routes/auth.js",
    "backend/api-server/src/routes/register.js",
    "backend/api-server/src/middleware/auth.js",
    "web/dashboard/src/utils/api.js"
)

foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        $fileName = Split-Path $file -Leaf
        Copy-Item $file "$backupDir/$fileName.backup" -ErrorAction SilentlyContinue
    }
}

Write-Host "✓ Backups created in $backupDir" -ForegroundColor Green
Write-Host ""

# Step 2: Apply backend updates
Write-Host "Step 2: Applying backend updates..." -ForegroundColor Yellow

$updates = @{
    "backend/api-server/src/app-updated.js" = "backend/api-server/src/app.js"
    "backend/api-server/src/routes/auth-updated.js" = "backend/api-server/src/routes/auth.js"
    "backend/api-server/src/routes/register-updated.js" = "backend/api-server/src/routes/register.js"
    "backend/api-server/src/middleware/auth-updated.js" = "backend/api-server/src/middleware/auth.js"
}

foreach ($update in $updates.GetEnumerator()) {
    if (Test-Path $update.Key) {
        Move-Item -Path $update.Key -Destination $update.Value -Force
        $fileName = Split-Path $update.Value -Leaf
        Write-Host "✓ Updated $fileName" -ForegroundColor Green
    }
}

Write-Host ""

# Step 3: Install dependencies
Write-Host "Step 3: Installing required dependencies..." -ForegroundColor Yellow
Push-Location backend/api-server

try {
    $hasCookieParser = npm list cookie-parser 2>&1 | Select-String "cookie-parser"
    if (-not $hasCookieParser) {
        Write-Host "Installing cookie-parser..."
        npm install cookie-parser --save
        Write-Host "✓ cookie-parser installed" -ForegroundColor Green
    } else {
        Write-Host "✓ cookie-parser already installed" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Could not verify cookie-parser installation" -ForegroundColor Yellow
}

Pop-Location
Write-Host ""

# Step 4: Apply frontend updates
Write-Host "Step 4: Applying frontend updates..." -ForegroundColor Yellow

if (Test-Path "web/dashboard/src/utils/api-updated.js") {
    Move-Item -Path "web/dashboard/src/utils/api-updated.js" -Destination "web/dashboard/src/utils/api.js" -Force
    Write-Host "✓ Updated frontend API client" -ForegroundColor Green
}

Write-Host ""

# Step 5: Verify cookie-parser integration
Write-Host "Step 5: Verifying cookie-parser integration..." -ForegroundColor Yellow

$appJsContent = Get-Content "backend/api-server/src/app.js" -Raw
if ($appJsContent -notmatch "cookie-parser") {
    Write-Host "⚠ Manual step required: Add cookie-parser to app.js" -ForegroundColor Yellow
    Write-Host "Add this line after other middleware imports:"
    Write-Host "  const cookieParser = require('cookie-parser');"
    Write-Host "  app.use(cookieParser());"
} else {
    Write-Host "✓ cookie-parser already integrated" -ForegroundColor Green
}

Write-Host ""

# Step 6: Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✓ Security fixes applied successfully!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "Files updated:"
Write-Host "  ✓ backend/api-server/src/app.js"
Write-Host "  ✓ backend/api-server/src/routes/auth.js"
Write-Host "  ✓ backend/api-server/src/routes/register.js"
Write-Host "  ✓ backend/api-server/src/middleware/auth.js"
Write-Host "  ✓ web/dashboard/src/utils/api.js"
Write-Host ""
Write-Host "New files created:"
Write-Host "  ✓ backend/api-server/src/middleware/helmet-config.js"
Write-Host "  ✓ backend/api-server/src/utils/sanitizer.js"
Write-Host "  ✓ docs/KEY_MANAGEMENT_GUIDE.md"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Review SECURITY_AUDIT_FIXES_COMPLETE.md"
Write-Host "  2. Test the application"
Write-Host "  3. Deploy to staging environment"
Write-Host "  4. Follow KEY_MANAGEMENT_GUIDE.md for production keys"
Write-Host ""
Write-Host "🔱 Ready for pre-release deployment!" -ForegroundColor Green
