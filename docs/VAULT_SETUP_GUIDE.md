# HashiCorp Vault Setup Guide
## Complete Implementation for SipHeron VDR

This guide provides step-by-step instructions to set up HashiCorp Vault for secure key management.

---

## Quick Start (Development)

### Step 1: Install Vault

**macOS:**
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/vault
```

**Linux:**
```bash
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install vault
```

**Windows:**
```powershell
choco install vault
```

**Verify Installation:**
```bash
vault --version
```

---

### Step 2: Start Vault Dev Server

For development/testing, use Vault's dev server:

```bash
vault server -dev
```

**Output will show:**
```
Root Token: hvs.xxxxxxxxxxxxx
Unseal Key: xxxxxxxxxxxxx
```

**Save these values!** You'll need them.

In another terminal, set environment variables:

```bash
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='hvs.xxxxxxxxxxxxx'  # Use the Root Token from above
```

---

### Step 3: Store Secrets in Vault

```bash
# Store all secrets at once
vault kv put secret/sipheron/prod \
  WALLET_PRIVATE_KEY='[1,2,3,...]' \
  JWT_SECRET='your-jwt-secret-here' \
  PROGRAM_ID='YourProgramIdHere' \
  SOLANA_RPC_URL='https://api.devnet.solana.com'

# Verify secrets were stored
vault kv get secret/sipheron/prod
```

---

### Step 4: Configure Application

Update `backend/api-server/.env`:

```bash
# Vault Configuration
VAULT_ADDR=http://127.0.0.1:8200
VAULT_TOKEN=hvs.xxxxxxxxxxxxx
VAULT_SECRET_PATH=secret/data/sipheron/prod

# These will be fetched from Vault (keep as fallback)
# WALLET_PRIVATE_KEY=[...]
# JWT_SECRET=...
# PROGRAM_ID=...
```

---

### Step 5: Test the Integration

```bash
cd backend/api-server
npm start
```

**Expected output:**
```
[Vault] Successfully fetched secrets
[Solana] Service initialized successfully
[Solana] Wallet: YourWalletPublicKey
VDR Backend API running on port 3001
```

---

## Production Setup

### Step 1: Install Vault (Production Mode)

```bash
# Create Vault user
sudo useradd --system --home /etc/vault.d --shell /bin/false vault

# Create directories
sudo mkdir -p /opt/vault/data
sudo mkdir -p /etc/vault.d
sudo chown -R vault:vault /opt/vault /etc/vault.d
```

### Step 2: Configure Vault

Create `/etc/vault.d/vault.hcl`:

```hcl
storage "file" {
  path = "/opt/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 0
  tls_cert_file = "/etc/vault.d/vault.crt"
  tls_key_file  = "/etc/vault.d/vault.key"
}

api_addr = "https://vault.yourdomain.com:8200"
cluster_addr = "https://vault.yourdomain.com:8201"
ui = true
```

### Step 3: Start Vault Service

```bash
# Create systemd service
sudo tee /etc/systemd/system/vault.service > /dev/null <<EOF
[Unit]
Description=HashiCorp Vault
Documentation=https://www.vaultproject.io/docs/
Requires=network-online.target
After=network-online.target

[Service]
User=vault
Group=vault
ExecStart=/usr/bin/vault server -config=/etc/vault.d/vault.hcl
ExecReload=/bin/kill --signal HUP \$MAINPID
KillMode=process
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# Start service
sudo systemctl enable vault
sudo systemctl start vault
```

### Step 4: Initialize Vault

```bash
export VAULT_ADDR='https://vault.yourdomain.com:8200'

# Initialize (do this ONCE)
vault operator init

# Save the output! You'll get:
# - 5 Unseal Keys
# - 1 Root Token
```

**CRITICAL:** Store unseal keys and root token in a secure location (password manager, safe, etc.)

### Step 5: Unseal Vault

Vault starts sealed. You need 3 of 5 unseal keys to unseal it:

```bash
vault operator unseal <key1>
vault operator unseal <key2>
vault operator unseal <key3>
```

### Step 6: Enable KV Secrets Engine

```bash
export VAULT_TOKEN='<root-token>'

# Enable KV v2 secrets engine
vault secrets enable -path=secret kv-v2

# Store secrets
vault kv put secret/sipheron/prod \
  WALLET_PRIVATE_KEY='[...]' \
  JWT_SECRET='...' \
  PROGRAM_ID='...' \
  SOLANA_RPC_URL='...'
```

### Step 7: Create Application Policy

```bash
# Create policy file
cat > sipheron-policy.hcl <<EOF
path "secret/data/sipheron/prod" {
  capabilities = ["read"]
}
EOF

# Apply policy
vault policy write sipheron-app sipheron-policy.hcl

# Create token for application
vault token create -policy=sipheron-app -ttl=720h
```

Use this token in your application's `VAULT_TOKEN` environment variable.

---

## Docker Deployment

### docker-compose.yml

```yaml
version: '3.8'

services:
  vault:
    image: vault:latest
    container_name: vault
    ports:
      - "8200:8200"
    environment:
      VAULT_DEV_ROOT_TOKEN_ID: myroot
      VAULT_DEV_LISTEN_ADDRESS: 0.0.0.0:8200
    cap_add:
      - IPC_LOCK
    volumes:
      - ./vault/data:/vault/data
      - ./vault/config:/vault/config
    command: server -dev

  api:
    build: ./backend/api-server
    depends_on:
      - vault
    environment:
      VAULT_ADDR: http://vault:8200
      VAULT_TOKEN: myroot
      VAULT_SECRET_PATH: secret/data/sipheron/prod
    ports:
      - "3001:3001"
```

### Initialize Secrets

```bash
# Start services
docker-compose up -d

# Store secrets
docker exec -it vault vault kv put secret/sipheron/prod \
  WALLET_PRIVATE_KEY='[...]' \
  JWT_SECRET='...' \
  PROGRAM_ID='...' \
  SOLANA_RPC_URL='...'
```

---

## Kubernetes Deployment

### vault-deployment.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: vault-config
data:
  vault.hcl: |
    storage "file" {
      path = "/vault/data"
    }
    listener "tcp" {
      address = "0.0.0.0:8200"
      tls_disable = 1
    }
    ui = true

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vault
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vault
  template:
    metadata:
      labels:
        app: vault
    spec:
      containers:
      - name: vault
        image: vault:latest
        ports:
        - containerPort: 8200
        env:
        - name: VAULT_DEV_ROOT_TOKEN_ID
          value: "myroot"
        volumeMounts:
        - name: vault-data
          mountPath: /vault/data
        - name: vault-config
          mountPath: /vault/config
      volumes:
      - name: vault-data
        emptyDir: {}
      - name: vault-config
        configMap:
          name: vault-config

---
apiVersion: v1
kind: Service
metadata:
  name: vault
spec:
  selector:
    app: vault
  ports:
  - port: 8200
    targetPort: 8200
```

---

## Security Best Practices

### 1. Token Management
- Use short-lived tokens (TTL)
- Rotate tokens regularly
- Never commit tokens to git
- Use different tokens per environment

### 2. Access Control
- Create specific policies for each application
- Use least privilege principle
- Audit access logs regularly

### 3. Backup & Recovery
- Backup Vault data regularly
- Store unseal keys securely (split among team members)
- Test recovery procedures

### 4. Monitoring
- Monitor Vault health
- Alert on failed authentication attempts
- Track secret access patterns

---

## Troubleshooting

### Vault Not Starting
```bash
# Check logs
journalctl -u vault -f

# Check configuration
vault server -config=/etc/vault.d/vault.hcl -log-level=debug
```

### Cannot Connect to Vault
```bash
# Verify Vault is running
curl http://127.0.0.1:8200/v1/sys/health

# Check environment variables
echo $VAULT_ADDR
echo $VAULT_TOKEN
```

### Secrets Not Found
```bash
# List secrets
vault kv list secret/sipheron

# Get specific secret
vault kv get secret/sipheron/prod

# Check path (KV v2 uses /data/ in path)
# Correct: secret/data/sipheron/prod
# Wrong: secret/sipheron/prod
```

### Application Cannot Authenticate
```bash
# Verify token has correct policy
vault token lookup

# Test secret retrieval
vault kv get secret/sipheron/prod
```

---

## Migration from .env to Vault

### Step 1: Backup Current .env
```bash
cp backend/api-server/.env backend/api-server/.env.backup
```

### Step 2: Extract Secrets
```bash
# Read current secrets
source backend/api-server/.env

# Store in Vault
vault kv put secret/sipheron/prod \
  WALLET_PRIVATE_KEY="$WALLET_PRIVATE_KEY" \
  JWT_SECRET="$JWT_SECRET" \
  PROGRAM_ID="$PROGRAM_ID" \
  SOLANA_RPC_URL="$SOLANA_RPC_URL"
```

### Step 3: Update .env
```bash
# Keep only Vault configuration
cat > backend/api-server/.env <<EOF
VAULT_ADDR=http://127.0.0.1:8200
VAULT_TOKEN=your-vault-token
VAULT_SECRET_PATH=secret/data/sipheron/prod
NODE_ENV=development
PORT=3001
EOF
```

### Step 4: Test
```bash
npm start
```

### Step 5: Remove Backup (after verification)
```bash
rm backend/api-server/.env.backup
```

---

## Vault CLI Cheat Sheet

```bash
# Store secret
vault kv put secret/path key=value

# Get secret
vault kv get secret/path

# Get specific field
vault kv get -field=key secret/path

# List secrets
vault kv list secret/

# Delete secret
vault kv delete secret/path

# Check Vault status
vault status

# Seal Vault
vault operator seal

# Unseal Vault
vault operator unseal <key>

# Create token
vault token create -policy=myapp

# Revoke token
vault token revoke <token>
```

---

## Support

For issues or questions:
- Vault Documentation: https://www.vaultproject.io/docs
- Vault Tutorials: https://learn.hashicorp.com/vault
- Community Forum: https://discuss.hashicorp.com/c/vault

---

**Status:** ✅ Production-Ready Key Management with HashiCorp Vault
