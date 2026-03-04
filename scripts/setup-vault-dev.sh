#!/bin/bash

# HashiCorp Vault Development Setup Script
# This script sets up Vault in dev mode and stores secrets

set -e

echo "🔐 Setting up HashiCorp Vault for Development..."
echo ""

# Check if Vault is installed
if ! command -v vault &> /dev/null; then
    echo "❌ Vault is not installed. Please install it first:"
    echo ""
    echo "macOS:   brew install hashicorp/tap/vault"
    echo "Linux:   See docs/VAULT_SETUP_GUIDE.md"
    echo "Windows: choco install vault"
    exit 1
fi

echo "✓ Vault is installed: $(vault --version)"
echo ""

# Check if .env file exists
if [ ! -f "backend/api-server/.env" ]; then
    echo "❌ .env file not found at backend/api-server/.env"
    exit 1
fi

# Source .env to get current secrets
echo "📖 Reading secrets from .env file..."
source backend/api-server/.env

# Check required variables
if [ -z "$WALLET_PRIVATE_KEY" ] || [ -z "$JWT_SECRET" ] || [ -z "$PROGRAM_ID" ]; then
    echo "❌ Missing required environment variables in .env"
    echo "Required: WALLET_PRIVATE_KEY, JWT_SECRET, PROGRAM_ID"
    exit 1
fi

echo "✓ Found required secrets"
echo ""

# Start Vault dev server in background
echo "🚀 Starting Vault dev server..."
vault server -dev > vault-dev.log 2>&1 &
VAULT_PID=$!

# Wait for Vault to start
sleep 3

# Extract root token from log
VAULT_TOKEN=$(grep "Root Token:" vault-dev.log | awk '{print $3}')

if [ -z "$VAULT_TOKEN" ]; then
    echo "❌ Failed to start Vault or extract root token"
    kill $VAULT_PID 2>/dev/null || true
    exit 1
fi

echo "✓ Vault started (PID: $VAULT_PID)"
echo "✓ Root Token: $VAULT_TOKEN"
echo ""

# Set Vault environment variables
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN="$VAULT_TOKEN"

# Store secrets in Vault
echo "💾 Storing secrets in Vault..."
vault kv put secret/sipheron/prod \
  WALLET_PRIVATE_KEY="$WALLET_PRIVATE_KEY" \
  JWT_SECRET="$JWT_SECRET" \
  PROGRAM_ID="$PROGRAM_ID" \
  SOLANA_RPC_URL="${SOLANA_RPC_URL:-https://api.devnet.solana.com}"

echo "✓ Secrets stored successfully"
echo ""

# Verify secrets
echo "🔍 Verifying secrets..."
vault kv get secret/sipheron/prod > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Secrets verified"
else
    echo "❌ Failed to verify secrets"
    kill $VAULT_PID 2>/dev/null || true
    exit 1
fi

echo ""

# Create new .env with Vault configuration
echo "📝 Updating .env file..."
cp backend/api-server/.env backend/api-server/.env.backup

cat > backend/api-server/.env <<EOF
# Vault Configuration
VAULT_ADDR=http://127.0.0.1:8200
VAULT_TOKEN=$VAULT_TOKEN
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
EOF

echo "✓ .env file updated (backup saved as .env.backup)"
echo ""

# Create vault-env.sh for easy sourcing
cat > vault-env.sh <<EOF
#!/bin/bash
# Source this file to set Vault environment variables
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='$VAULT_TOKEN'
EOF

chmod +x vault-env.sh

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Vault setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Vault is running in the background (PID: $VAULT_PID)"
echo "Root Token: $VAULT_TOKEN"
echo ""
echo "To use Vault in other terminals:"
echo "  source vault-env.sh"
echo ""
echo "To stop Vault:"
echo "  kill $VAULT_PID"
echo ""
echo "To start your application:"
echo "  cd backend/api-server && npm start"
echo ""
echo "Vault UI: http://127.0.0.1:8200/ui"
echo "  Token: $VAULT_TOKEN"
echo ""

# Save PID for later
echo $VAULT_PID > vault.pid

echo "💡 Tip: Keep this terminal open or Vault will stop"
echo "    To run in background: nohup vault server -dev &"
