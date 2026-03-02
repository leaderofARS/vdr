# SipHeron VDR: Feature Catalog & Roadmap

This document serves as the central record for all capabilities currently active within the SipHeron Verifiable Data Registry, alongside the roadmap for future enhancements.

## 🟢 Currently Implemented Features

### 1. Cryptographic File Anchoring
*   **Zero-Knowledge Local Hashing**: Files never leave the user's machine. The CLI computes a SHA-256 hash locally before submitting only the hex digest.
*   **Immutability Registry**: The 64-character hash is securely anchored into a PDA on the Solana network using the Anchor rust framework.

### 2. SipHeron Organizational Namespacing
*   **Multi-Tenancy Domains**: Organizations have distinct, isolated namespaces on-chain grouping all their subsequent cryptographic hashes.
*   **RBAC (Role-Based Access Control)**: Strict permissions requiring System Admins to authorize API usage or hash anchoring under their specific organization.

### 3. "Git-Style" Async Batching Pipeline
*   **Local Staging Array**: Executing `sipheron-vdr register` places the file hash into a local pending queue (`.vdr/staged.json`) similar to `git commit`. 
*   **Bulk Queue Dispatching**: Calling `sipheron-vdr push` sends the entire staged queue to the Backend in one cost-efficient HTTP request.
*   **BullMQ Redis Handlers**: The backend aggressively throats and queues mass submissions via Redis to bypass aggressive blockchain RPC limits.

### 4. Advanced System Infrastructure
*   **Background PDA Indexing**: A silent `indexer.js` runs alongside the backend, polling Solana for new data states and replicating them into a high-speed PostgreSQL/SQLite relational database.
*   **Web Dashboard & Analytics**: A Next.js visual portal utilizing `Recharts` providing global data lake insights, mapping active Integrity Rates and cryptographic Revocation Indexes.
*   **Admin JWT & API Key Issuance**: Strict authentication tunnels for generating raw CLI connectivity tokens within the Web Portal.

---

## 🟡 Planned / Ideal Features (Next Steps)

*Here are highly advanced features we can implement next to scale SipHeron to its final form:*

### 1. Multi-Signature Hash Validation
*   **Concept**: Instead of a hash being immediately finalized by one key, require M-of-N signatures from different Organization Admins before writing the final hash to the registry.
*   **Value**: Essential for highly sensitive legal documents where multiple parties must agree on the integrity before archiving.

### 2. Zero-Knowledge Proofs (ZKPs) for Data Validation
*   **Concept**: Integrate a ZK-SNARK verifier that proves a file conforms to a specific schema (e.g. valid JSON structure or a specific document type) *without* revealing the file contents.
*   **Value**: Allows the chain to reject invalid formats locally while maintaining absolute data opacity.

### 3. Server-Side Webhook Event Subscriptions
*   **Concept**: Add a mechanism for organizations to register webhook URLs in the Web Dashboard. When the Blockchain Indexer detects a successful anchor or revocation, it fires an HTTP POST payload to their internal servers.
*   **Value**: Removes the need for organizations to manually poll for completion statuses on their batch operations.

### 4. Temporary IPFS Payload Offloading (Hybrid Linkage)
*   **Concept**: Optionally allow users to encrypt the actual physical file payload locally and stream the cipher block to IPFS (InterPlanetary File System), anchoring the `CID` inside the Solana PDA next to the SHA-256 hash.
*   **Value**: Moves the protocol from just "Proof of Existence" into actual "Secure Decentralized Storage & Retrieval".

### 5. Configurable Expiry / Time-To-Live (TTL) Reaper
*   **Concept**: While `expiry` logic is in the smart contract constraints, construct a Backend Reaper service or Solana Clock instruction that automatically destroys and reclaims the SOL rent from expired hash PDAs.
*   **Value**: Makes the system highly affordable by recovering blockchain rent dynamically.

---

## 🔵 Simple MVP / Open Source

*The following features are designed to be high-impact, low-cost implementations perfect for an open-source utility MVP aiming for a Solana Foundation Grant:*

### 1. GitHub Actions (CI/CD) Integrator
A pre-built GitHub action so open-source projects can automatically hash their compiled release binaries across the network. This is huge for preventing "supply-chain" hacks and gives your project an immediate massive use-case.

### 2. "Bring Your Own Key" (BYOK) IPFS Storage
A feature on the CLI where developers put in their own free Pinata/web3.storage API keys. The CLI uploads their encrypted file to IPFS for free and pins the CID directly into your Solana PDA. Decentralized storage, but you don't pay the hosting bill!

### 3. Local Webhook Daemon (`sipheron-vdr watch`)
Instead of you paying for expensive cloud webhooks, this simple command subscribes to Solana WebSockets locally on the developer's machine and automatically triggers bash scripts when their hashes are confirmed.

### 4. Solana NFT Metadata Pinning Integrator
A specialized CLI hook designed explicitly for Metaplex NFT creators to secure their JSON metadata before they mint, directly aligning your project with existing massive Solana communities.

### 5. Drop-in React Verification Portal
A simple `<SipheronVerify />` React component. Every single developer who downloads your package can drop this onto their website so their users can securely verify files. It acts as a viral growth loop, putting a "Secured by SipHeron" badge on hundreds of websites.

### 6. Universal Digital Identity Verification
Solving the phishing and copy-cat problem for official links/downloads. Organizations tie their Public Keys to their real-world identities. When they publish a download link, users can run it through the SipHeron registry. If the Hash + Public Key matches, the user has 100% mathematical proof the link is authentically from the official organization and not a malware clone.
