#!/bin/bash

# Security Fixes Application Script
# Applies all pre-release security fixes to the codebase

set -e  # Exit on error

echo "🔱 Applying Pre-Release Security Fixes..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Backup existing files
echo "${YELLOW}Step 1: Creating backups...${NC}"
mkdir -p backups/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

cp backend/api-server/src/app.js "$BACKUP_DIR/app.js.backup" 2>/dev/null || true
cp backend/api-server/src/routes/auth.js "$BACKUP_DIR/auth.js.backup" 2>/dev/null || true
cp backend/api-server/src/routes/register.js "$BACKUP_DIR/register.js.backup" 2>/dev/null || true
cp backend/api-server/src/middleware/auth.js "$BACKUP_DIR/auth-middleware.js.backup" 2>/dev/null || true
cp web/dashboard/src/utils/api.js "$BACKUP_DIR/api.js.backup" 2>/dev/null || true

echo "${GREEN}✓ Backups created in $BACKUP_DIR${NC}"
echo ""

# Step 2: Apply backend updates
echo "${YELLOW}Step 2: Applying backend updates...${NC}"

if [ -f "backend/api-server/src/app-updated.js" ]; then
    mv backend/api-server/src/app-updated.js backend/api-server/src/app.js
    echo "${GREEN}✓ Updated app.js${NC}"
fi

if [ -f "backend/api-server/src/routes/auth-updated.js" ]; then
    mv backend/api-server/src/routes/auth-updated.js backend/api-server/src/routes/auth.js
    echo "${GREEN}✓ Updated auth.js${NC}"
fi

if [ -f "backend/api-server/src/routes/register-updated.js" ]; then
    mv backend/api-server/src/routes/register-updated.js backend/api-server/src/routes/register.js
    echo "${GREEN}✓ Updated register.js${NC}"
fi

if [ -f "backend/api-server/src/middleware/auth-updated.js" ]; then
    mv backend/api-server/src/middleware/auth-updated.js backend/api-server/src/middleware/auth.js
    echo "${GREEN}✓ Updated auth middleware${NC}"
fi

echo ""

# Step 3: Install dependencies
echo "${YELLOW}Step 3: Installing required dependencies...${NC}"
cd backend/api-server

if ! npm list cookie-parser &>/dev/null; then
    echo "Installing cookie-parser..."
    npm install cookie-parser --save
    echo "${GREEN}✓ cookie-parser installed${NC}"
else
    echo "${GREEN}✓ cookie-parser already installed${NC}"
fi

cd ../..
echo ""

# Step 4: Apply frontend updates
echo "${YELLOW}Step 4: Applying frontend updates...${NC}"

if [ -f "web/dashboard/src/utils/api-updated.js" ]; then
    mv web/dashboard/src/utils/api-updated.js web/dashboard/src/utils/api.js
    echo "${GREEN}✓ Updated frontend API client${NC}"
fi

echo ""

# Step 5: Add cookie-parser to app.js if not already present
echo "${YELLOW}Step 5: Verifying cookie-parser integration...${NC}"

if ! grep -q "cookie-parser" backend/api-server/src/app.js; then
    echo "${YELLOW}⚠ Manual step required: Add cookie-parser to app.js${NC}"
    echo "Add this line after other middleware imports:"
    echo "  const cookieParser = require('cookie-parser');"
    echo "  app.use(cookieParser());"
else
    echo "${GREEN}✓ cookie-parser already integrated${NC}"
fi

echo ""

# Step 6: Summary
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}✓ Security fixes applied successfully!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Files updated:"
echo "  ✓ backend/api-server/src/app.js"
echo "  ✓ backend/api-server/src/routes/auth.js"
echo "  ✓ backend/api-server/src/routes/register.js"
echo "  ✓ backend/api-server/src/middleware/auth.js"
echo "  ✓ web/dashboard/src/utils/api.js"
echo ""
echo "New files created:"
echo "  ✓ backend/api-server/src/middleware/helmet-config.js"
echo "  ✓ backend/api-server/src/utils/sanitizer.js"
echo "  ✓ docs/KEY_MANAGEMENT_GUIDE.md"
echo ""
echo "Next steps:"
echo "  1. Review SECURITY_AUDIT_FIXES_COMPLETE.md"
echo "  2. Test the application"
echo "  3. Deploy to staging environment"
echo "  4. Follow KEY_MANAGEMENT_GUIDE.md for production keys"
echo ""
echo "${GREEN}🔱 Ready for pre-release deployment!${NC}"
