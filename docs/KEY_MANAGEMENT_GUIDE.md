# Key Management Security Guide
## Fix 1.3 & 1.4: Institutional-Grade Key Management

### Current Status
The application currently loads sensitive keys from environment variables:
- `WALLET_PRIVATE_KEY` - Solana wallet private key for transaction signing
- `JWT_SECRET` - Secret for JWT token signing
- Database credentials and API keys

### Pre-Release Requirements (Minimum)

#### Option 1: Encrypted Environment Variables (Quick Win)
For immediate pre-release deployment, use encrypted environment variable services:

**Recommended Services:**
1. **AWS Systems Manager Parameter Store** (Free tier available)
   ```bash
   # Store encrypted parameter
   aws ssm put-parameter \
     --name "/sipheron/prod/wallet-key" \
     --value "YOUR_PRIVATE_KEY" \
     --type "SecureString" \
     --key-id "alias/aws/ssm"
   
   # Retrieve in application
   aws ssm get-parameter \
     --name "/sipheron/prod/wallet-key" \
     --with-decryption \
     --query "Parameter.Value" \
     --output text
   ```

2. **HashiCorp Vault** (Open source)
   ```bash
   # Store secret
   vault kv put secret/sipheron/prod wallet_key="YOUR_PRIVATE_KEY"
   
   # Retrieve in application
   vault kv get -field=wallet_key secret/sipheron/prod
   ```

3. **Doppler** (Developer-friendly, free tier)
   - Web UI for secret management
   - Automatic environment variable injection
   - Audit logging included

**Implementation Steps:**
1. Choose a service (AWS SSM recommended for Solana projects)
2. Migrate secrets from `.env` to encrypted storage
3. Update deployment scripts to fetch secrets at runtime
4. Remove plaintext secrets from `.env` files
5. Add `.env` to `.gitignore` (already done)

#### Option 2: Docker Secrets (For containerized deployments)
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    image: sipheron-api:latest
    secrets:
      - wallet_private_key
      - jwt_secret
    environment:
      WALLET_PRIVATE_KEY_FILE: /run/secrets/wallet_private_key
      JWT_SECRET_FILE: /run/secrets/jwt_secret

secrets:
  wallet_private_key:
    external: true
  jwt_secret:
    external: true
```

### Production Requirements (v1.0 Mainnet)

#### AWS KMS Integration (Recommended)
For mainnet launch, implement full KMS integration:

**Architecture:**
```
Application → AWS KMS → Encrypted Key Material
     ↓
Transaction Signing (in-memory only)
```

**Benefits:**
- Keys never leave KMS in plaintext
- Hardware Security Module (HSM) backing
- Audit trail for all key operations
- Automatic key rotation
- Compliance-ready (SOC 2, PCI DSS)

**Implementation:**
```javascript
// backend/api-server/src/services/kms-wallet.js
const { KMSClient, SignCommand } = require("@aws-sdk/client-kms");
const { Keypair, Transaction } = require("@solana/web3.js");

class KMSWallet {
    constructor(keyId) {
        this.kmsClient = new KMSClient({ region: process.env.AWS_REGION });
        this.keyId = keyId;
    }

    async signTransaction(transaction) {
        const message = transaction.serializeMessage();
        
        const command = new SignCommand({
            KeyId: this.keyId,
            Message: message,
            MessageType: 'RAW',
            SigningAlgorithm: 'ECDSA_SHA_256'
        });

        const { Signature } = await this.kmsClient.send(command);
        transaction.addSignature(this.publicKey, Buffer.from(Signature));
        
        return transaction;
    }
}

module.exports = KMSWallet;
```

**Cost Estimate:**
- KMS key: $1/month
- API calls: $0.03 per 10,000 requests
- Estimated monthly cost for 1M transactions: ~$4

### Security Checklist

#### Pre-Release (Required)
- [ ] Remove plaintext keys from `.env` files
- [ ] Implement encrypted environment variable storage
- [ ] Update deployment documentation
- [ ] Test key retrieval in staging environment
- [ ] Verify `.env` is in `.gitignore`
- [ ] Audit git history for accidentally committed secrets
- [ ] Rotate any previously exposed keys

#### Production (v1.0 Mainnet)
- [ ] Implement AWS KMS or equivalent HSM solution
- [ ] Set up key rotation schedule (90 days recommended)
- [ ] Configure CloudWatch alarms for key usage anomalies
- [ ] Implement multi-signature wallet for treasury operations
- [ ] Document key recovery procedures
- [ ] Set up monitoring and alerting for key access
- [ ] Conduct security audit of key management system

### Emergency Key Rotation Procedure

If a key is compromised:

1. **Immediate Actions** (< 5 minutes)
   ```bash
   # Generate new key
   solana-keygen new --outfile new-wallet.json
   
   # Update KMS/encrypted storage
   aws ssm put-parameter --name "/sipheron/prod/wallet-key" \
     --value "$(cat new-wallet.json)" --overwrite
   
   # Restart services
   kubectl rollout restart deployment/sipheron-api
   ```

2. **Transfer Assets** (< 30 minutes)
   - Transfer SOL from old wallet to new wallet
   - Update program authority if necessary
   - Notify users of maintenance window

3. **Post-Incident** (< 24 hours)
   - Audit logs for unauthorized access
   - Document incident in security log
   - Review and update security procedures
   - Consider security audit if breach was significant

### Compliance Notes

**For Solana Foundation Review:**
- KMS integration demonstrates institutional-grade security
- Audit trails satisfy compliance requirements
- HSM backing meets financial services standards
- Key rotation shows operational maturity

**For Enterprise Customers:**
- SOC 2 Type II compliance path
- GDPR-compliant key management
- PCI DSS Level 1 compatible (with full KMS)
- ISO 27001 alignment

### References
- [AWS KMS Best Practices](https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html)
- [Solana Key Management](https://docs.solana.com/wallet-guide/paper-wallet)
- [NIST Key Management Guidelines](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
