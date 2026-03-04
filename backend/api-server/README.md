# SipHeron VDR — Backend API Reference

This document provides a high-level architectural overview of the Node.js / Express backend for contributors.

## Architecture & Directory Structure
The backend follows a typical layered Express architecture:

- **`src/routes/`**: Express route handlers. Controllers that define the API endpoints (`/auth`, `/register`, `/verify`, `/batch`, `/organization`, `/analytics`). They handle request validation and responses.
- **`src/middleware/`**: Request interceptors. Includes custom `auth.js` (JWT/API Key verification), `csrf.js`, `errorHandler.js` (ensuring no stack traces leak), and `helmet-config.js` (CSP, HSTS).
- **`src/services/`**: Core business logic and external integrations.
  - `solana.js`: Interacts with the Solana blockchain via `@solana/web3.js` to build and send anchoring transactions.
  - `vault.js`: HashiCorp Vault integration for managing the sensitive Solana wallet key.
  - `jwt.js`: Manages RS256/HS256 tokens and handles the rotation logic.
  - `indexer.js`: Background worker that synchronizes on-chain proofs back into the Prisma database.
  - `apiKeyRotation.js`: Automated system to rotate API keys every 90 days.
  - `encryption.js`: AES-256-GCM encryption for sensitive database fields at rest.
- **`src/workers/`**: BullMQ background workers used for asynchronous batch processing.
- **`src/utils/`**: Helper files (e.g., `sanitizer.js` to cleanse inputs against XSS).
- **`src/config/`**: Database instantiation (`database.js` enforces PostgreSQL in production) and environment checks.

## Key Design Patterns

### Authentication
Two mechanisms are supported:
1. **HttpOnly Cookies**: Used for frontend dashboard users. The `vdr_token` and `vdr_refresh` cookies prevent XSS theft.
2. **API Keys**: Extracted from the `x-api-key` header, meant for CLI or server-to-server integration.

### Background Processing
When an organization submits a batch of files to anchor, the API enqueues a job via Redis + BullMQ. A background worker then assembles the transactions and pays the gas fees asynchronously to prevent timing out HTTP requests.

### Stateful Indexing
The `indexer.js` service constantly monitors the deployed Solana smart contract on `devnet`/`mainnet`. When an anchor transaction is confirmed on-chain, it mirrors the state back to the PostgreSQL database for fast querying on the dashboard.

## Starting the Server
- **Dev**: `npm run dev` (uses SQLite fallback if no POSTGRES_URL)
- **Production**: See `ecosystem.config.js` (PM2 cluster mode) or `docker-compose.yml`.
