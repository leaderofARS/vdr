# SipHeron VDR — Organization Portal Guide

The SipHeron VDR Organization Portal is a premium audit and integrity management platform designed for organizations that require secure, sovereign data anchoring on the Solana blockchain.

## 1. Getting Started

### Organization Provisioning
When registering a new account, ensure you provide a valid **Organization Name**. This creates a logical isolation boundary for all your cryptographic proofs.
- All data anchored by your Organization is private by default in the Registry Explorer.
- Analytics are scoped strictly to your organization's activity.

### API Key Management
To integrate the VDR protocol into your automated workflows (CI/CD, internal tools), you must generate an API Key.
1. Navigate to the **API Infrastructure** page in the Dashboard.
2. Click **Generate New Key**.
3. Copy the key immediately and store it securely. For security reasons, the full key is masked after generation.

---

## 2. CLI Organization Linking

The CLI allows you to anchor files and data directly from your terminal. To bind your CLI environment to your Organization:

### The Linking Command
Run the following command in your terminal:
```bash
sipheron-vdr link <YOUR_API_KEY>
```

### Verification
Once linked, you can verify your status at any time:
```bash
sipheron-vdr status
```
This will display your **Linked Organization** name and **Organization ID**, confirming that all future `anchor` commands will be attributed to your professional registry.

---

## 3. Data Privacy & Isolation

SipHeron VDR Phase 17+ implements strict **Database Multi-tenancy Isolation**:
- **Registry Explorer**: While the ledger is public on Solana, the SipHeron Explorer only reveals metadata and history for hashes that belong to *your* organization.
- **Verification**: Public users can verify the integrity of a hash, but they cannot see your internal metadata or file history unless they are authenticated members of your Organization.

## 4. Support & Resources
- **Solana Explorer**: View raw Payer/Owner transactions at [explorer.solana.com](https://explorer.solana.com).
- **Technical Docs**: Refer to the internal `PLAN.md` for deep architecture details.
