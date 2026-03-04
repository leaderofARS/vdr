#!/bin/bash

# Comprehensive npm audit and fix script
# Run this from WSL terminal to avoid path issues

set -e

echo "🔍 Starting comprehensive npm audit and vulnerability fix..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
TOTAL_PROJECTS=0
SUCCESSFUL=0
FAILED=0
VULNERABILITIES_FOUND=0
VULNERABILITIES_FIXED=0

# Function to audit and fix a project
audit_project() {
    local project_path=$1
    local project_name=$2
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Project: $project_name"
    echo "📁 Path: $project_path"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    TOTAL_PROJECTS=$((TOTAL_PROJECTS + 1))
    
    cd "$project_path"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠ node_modules not found. Installing dependencies...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}✗ npm install failed${NC}"
            FAILED=$((FAILED + 1))
            cd - > /dev/null
            return 1
        fi
    fi
    
    # Run npm audit
    echo ""
    echo "🔍 Running npm audit..."
    audit_output=$(npm audit --json 2>/dev/null || true)
    
    # Parse audit results
    if [ -n "$audit_output" ]; then
        vulnerabilities=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities | to_entries[] | "\(.key): \(.value)"' 2>/dev/null || echo "")
        
        if [ -n "$vulnerabilities" ]; then
            echo -e "${YELLOW}⚠ Vulnerabilities found:${NC}"
            echo "$vulnerabilities"
            VULNERABILITIES_FOUND=$((VULNERABILITIES_FOUND + 1))
            
            # Try to fix automatically
            echo ""
            echo "🔧 Attempting automatic fix..."
            npm audit fix --force
            
            # Re-audit to check if fixed
            echo ""
            echo "🔍 Re-auditing after fix..."
            audit_output_after=$(npm audit --json 2>/dev/null || true)
            
            if [ -n "$audit_output_after" ]; then
                vulnerabilities_after=$(echo "$audit_output_after" | jq -r '.metadata.vulnerabilities.total' 2>/dev/null || echo "0")
                
                if [ "$vulnerabilities_after" = "0" ]; then
                    echo -e "${GREEN}✓ All vulnerabilities fixed!${NC}"
                    VULNERABILITIES_FIXED=$((VULNERABILITIES_FIXED + 1))
                else
                    echo -e "${YELLOW}⚠ Some vulnerabilities remain:${NC}"
                    echo "$audit_output_after" | jq -r '.metadata.vulnerabilities | to_entries[] | "\(.key): \(.value)"' 2>/dev/null || echo ""
                fi
            fi
        else
            echo -e "${GREEN}✓ No vulnerabilities found${NC}"
        fi
    else
        echo -e "${GREEN}✓ No vulnerabilities found${NC}"
    fi
    
    SUCCESSFUL=$((SUCCESSFUL + 1))
    cd - > /dev/null
    echo ""
}

# Main execution
echo "Starting audit of all projects..."
echo ""

# Root project
if [ -f "package.json" ]; then
    audit_project "." "Root Project"
fi

# Backend API
if [ -f "backend/api-server/package.json" ]; then
    audit_project "backend/api-server" "Backend API Server"
fi

# CLI
if [ -f "cli/vdr-cli/package.json" ]; then
    audit_project "cli/vdr-cli" "VDR CLI"
fi

# Web Dashboard
if [ -f "web/dashboard/package.json" ]; then
    audit_project "web/dashboard" "Web Dashboard"
fi

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Audit Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total projects audited: $TOTAL_PROJECTS"
echo "Successful audits: $SUCCESSFUL"
echo "Failed audits: $FAILED"
echo "Projects with vulnerabilities: $VULNERABILITIES_FOUND"
echo "Projects with vulnerabilities fixed: $VULNERABILITIES_FIXED"
echo ""

if [ $FAILED -eq 0 ] && [ $VULNERABILITIES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ All projects are secure and up to date!${NC}"
    exit 0
elif [ $FAILED -eq 0 ] && [ $VULNERABILITIES_FIXED -eq $VULNERABILITIES_FOUND ]; then
    echo -e "${GREEN}✅ All vulnerabilities have been fixed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some issues remain. Please review the output above.${NC}"
    exit 1
fi
