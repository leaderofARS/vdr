# SipHeron VDR — CLI Tool Reference

This directory contains the Node.js Command Line Interface (CLI) source code. Contributor notes and architecture details are below.

## Architecture & Directory Structure

The CLI is built using **Commander.js** and handles all continuous integration (CI) and developer workflows for anchoring hashes to the blockchain.

- **`src/index.js`**: The main entry point. Registers all commands via Commander and handles global error catching.
- **`src/commands/`**: Subcommands for the CLI.
  - `config.js`: Manages local `.vdr/config.json` settings (`apiUrl`, `network`, API key).
  - `login.js`: Authenticates a user and securely stores their API key.
  - `stage.js`: Recursively scans a directory, calculate SHA-256 hashes for all files, and prepares them in a local staging file.
  - `anchor.js`: Reads the staged hashes, securely signs requests, and submits them to the backend API for Solana anchoring.
  - `verify.js`: Takes a local file, recalculates its hash, queries the Solana RPC, and cryptographic proves whether the hash exists and is valid on-chain.
  - `batch.js`: Monitors pending asynchronous bulk-anchor operations on the backend.
- **`src/utils/`**: Utilities and core helpers.
  - `configManager.js`: Secures the CLI configuration. Critically, it **encrypts** the `apiKey` using an AES-256-GCM cipher derived from a machine-specific scrypt salt (combining OS hostname and username). This prevents simple token theft from the filesystem.
  - `permissionValidator.js`: Ensures that internal directories and staging files have strict `0600`/`0700` filesystem permissions to prevent cross-user snooping on shared CI runners.
  - `hash.js`: Node.js crypto wrappers for calculating deterministic SHA-256 hashes.
  - `stagingManager.js`: Handles the local state of files that have been hashed but not yet anchored.

## Security Model

The CLI operates on a **Zero-Knowledge** principle.
It never uploads source code or binary files to the backend server. All hashing (`SHA-256`) happens strictly locally on the user's machine or ephemeral CI runner. Only the 32-byte cryptographic hash string and the filename are transmitted via HTTPS to the SipHeron API.

## Testing
Run the utility tests using:
```bash
npm test
```
