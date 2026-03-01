# SipHeron VDR ⚓ - The Solana Verifiable Data Registry

<div align="center">
  <h3>Institutional-Grade Cryptographic Anchoring on the Solana Blockchain</h3>
</div>

---

SipHeron VDR is a completely decentralized, zero-knowledge verifiable data registry (VDR) built natively on the Solana blockchain. It empowers enterprises, developers, and open-source contributors to mathematically prove the existence, origin, and uncompromised integrity of any digital file, document, or compiled software binary without relying on a centralized intermediary.

In an era of deep-fakes, supply chain hacks, and AI-generated misinformation, proving data authenticity is a critical requirement. SipHeron solves this by executing SHA-256 client-side hashing and permanently locking the resulting cryptographic signatures into Solana's immutable global state. 

Whether you are an institution registering compliance documents locally, or an open-source maintainer proving your latest release binaries weren't intercepted by malware, the SipHeron Protocol provides an unbreakable foundation of cryptographic truth.

---

## 🏛️ Comprehensive Protocol Architecture

SipHeron VDR is composed of four distinct, highly optimized architectural layers designed for maximum security, ease of use, and infinite scalability.

### 1. The Smart Contract (Anchor/Rust)
Located in `programs/vdr_contract/`, this is the beating heart of the protocol. It is an advanced Solana Smart Contract written in Rust utilizing the Anchor framework.
* **Isolated Organization Namespaces:** Unlike early VDR prototypes that suffer from PDA-collision crashes, SipHeron VDR isolates records using `[organization, owner.key(), hash]` seeds. Multiple independent institutions can register the exact same boilerplate file (like a standard NDA) simultaneously without their accounts conflicting on the blockchain.
* **Role-Based Access Control (RBAC):** Cryptographically enforced permissions. Only authorized Issuers can register hashes, and only Organization Admins can computationally `revoke_hash` entries if the underlying data becomes obsolete or compromised.
* **Anti-MEV Front-Running:** The initialization sequence is mathematically locked to the core protocol developer's designated public key, preventing MEV bots from hijacking the global Protocol State and treasury upon mainnet deployment.
* **Rent & Space Optimization:** State structures are tightly constrained to exact byte limits, ensuring Solana rent fees are minimized while preventing `MaxSeedLengthExceeded` panics when creating Organization accounts.

### 2. The Microservice Backend (Express/Node.js/Prisma)
Located in `backend/api-server/`, this service acts as the bridge between traditional Web2 enterprise systems and the Web3 Solana ledger.
* **PostgreSQL + Prisma ORM:** All blockchain events are continuously indexed into a traditional relational database, allowing for sub-millisecond querying without overwhelming RPC nodes.
* **Asynchronous Queueing with BullMQ:** If an institution attempts to hash 10,000 documents at once, the Express API will not crash. Submissions are loaded into a memory-safe Redis caching queue and processed in asynchronous batches.
* **IP Rate Limiting & API Keys:** The backend includes dedicated authentication flow middleware. Unauthenticated requests are rejected, and authenticated users are aggressively rate-limited using `express-rate-limit` to protect the protocol's Solana treasury from DoS loops.

### 3. The Developer CLI (`sipheron-vdr`)
Located in `cli/vdr-cli/`, this tool brings the power of the blockchain directly to the developer's terminal, heavily inspired by modern version control workflows.
* **Zero-Knowledge Staging Pipeline:** Utilize `sipheron-vdr stage <filename>` or even entire `<directory>` paths. The CLI will spider through folders, computing SHA-256 hashes locally. *Your private data never leaves your computer.* The hashes are queued in a local `~/.vdr/staged.json` file.
* **Wallet Auto-Encryption:** Using `sipheron-vdr wallet create`, developers generate localized Solana Keypairs. But unlike standard plain-text configs, SipHeron prompts for a master password. It hashes that password using `scrypt` and encrypts the wallet via AES-256-CBC, preventing malware from stealing local signing authority.
* **The Anchor Command:** When you are ready to publish, run `sipheron-vdr anchor`. The CLI dispatches your localized staging queue to the backend API, transforming your cryptographic proofs into immutable on-chain state.

### 4. The Data Explorer Dashboard (Next.js)
Located in `web/dashboard/`, a beautiful, responsive frontend built with Next.js, React, and Tailwind CSS.
* **Drag-and-Drop Verification:** End-users can drag a file onto the Dashboard. The browser executes an offline SHA-256 check and immediately queries the protocol to see if that precise hash exists, proving the file hasn't been tampered with.
* **Institutional Analytics:** Organization admins can log in via JWT to view comprehensive analytics graphs (built with Recharts) depicting their registration volume over time.
* **Key Management Portal:** Generate, rotate, or revoke backend API keys dynamically via the React dashboard.

---

## 🛡️ Supply Chain Security via CI/CD (GitHub Actions)

One of SipHeron's primary defensive use cases is stopping Open Source Supply Chain Attacks. When an attacker corrupts a developer's release binary before users download it, disastrous consequences follow. 

SipHeron VDR provides a native **Composite GitHub Action** so maintainers can mathematically prove their software binaries are pristine. By dropping our action into your `.github/workflows/release.yml`, SipHeron will automatically hash your compiled code and permanently anchor the fingerprint to the Solana blockchain during the CI/CD pipelne.

```yaml
name: Anchor Release Binaries to Solana
on:
  release:
    types: [published]

jobs:
  build_and_anchor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      
      # The SipHeron Action Integration
      - uses: sipheron/solana-vdr/actions/sipheron-anchor@main
        with:
          directory: './dist'
          api_key: ${{ secrets.SIPHERON_API_KEY }}
          network: 'mainnet'
```
When a user downloads your release, they use `sipheron-vdr verify` to pull the truth directly from the blockchain. For complete implementation details, see our [Full GitHub Actions Documentation](./actions/sipheron-anchor/README.md).

---

## 🚀 Getting Started Guide

Deploying the entire SipHeron stack locally for development or testing requires a functioning Solana toolchain, Node.js, and Redis.

### 1. Booting the Smart Contract
Ensure you have the `solana-cli` and the `anchor-cli` installed on your machine.
```bash
# Terminal 1: Spin up a local Solana validator node
solana-test-validator

# Terminal 2: Build and deploy the Anchor Program
cd programs/vdr_contract
anchor build
anchor deploy
```

### 2. Spinning up the Backend Microservices
The backend requires Redis for BullMQ handling and a database engine (SQLite defaults for local development, Postgres for production).
```bash
cd backend/api-server
npm install

# Build your Prisma database
npx prisma generate
npx prisma db push

# Start the Express API server and the Solana Indexer concurrently
npm run dev
```

### 3. Configuring the CLI
To interact with the registry, install the CLI globally so the `sipheron-vdr` command is recognized by your PATH.
```bash
cd cli/vdr-cli
npm install
npm link

# Create your profile
sipheron-vdr config set --api-key "your_org_api_key_here" --network "localnet" --url "http://localhost:3000"

# Generate a heavily encrypted local wallet
sipheron-vdr wallet create admin_wallet
```

### 4. Anchoring Data
Now you can experience the Zero-Knowledge staging flow.
```bash
# 1. Provide a file to hash offline on your machine
sipheron-vdr stage path/to/important_document.pdf -m "Version 1.0 Final"

# 2. View your staging queue
sipheron-vdr status

# 3. Permanently anchor the hashes to Solana
sipheron-vdr anchor

# 4. Verify the document later to prove authenticity
sipheron-vdr verify path/to/important_document.pdf
```

### 5. Viewing the Dashboard
Finally, visualize the immutable state via the React explorer.
```bash
cd web/dashboard
npm install
npm run dev
# Traverse to http://localhost:3000 to see the beautiful frontend!
```

---

## 🔐 The SipHeron Security & Privacy Promise

The most common concern with Web3 registries is data leakage. **SipHeron operates under an Absolute Privacy Architecture.** 

At no point in the lifecycle across the Dashboard, the CLI, the GitHub Action, or the Backend API does your actual file leave your physical device. The system *only* computes the mathematical `SHA-256` digest locally. The only payload transmitted to the REST API and the Solana RPC Network is the resulting obscure 64-character hex string.

To attackers, the blockchain simply shows meaningless, randomized data. But to you and your authorized verifiers possessing the original file, it executes the ultimate proof of chronological truth.