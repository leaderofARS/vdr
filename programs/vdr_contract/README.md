# SipHeron VDR — Smart Contract Reference

This folder contains the Anchor-based Solana program (smart contract) that anchors the cryptographic truth of the file hashes.

## Architecture

The contract is built using the **Anchor framework**, which abstract away much of Solana's boilerplate.

- **`src/lib.rs`**: The main entry point. Defines the program ID and routes incoming calls to the instruction handlers.
- **`src/instructions/`**: Handlers for each endpoint.
  - `init_protocol.rs`: Called once by the admin to set the treasury and system state.
  - `update_protocol_config.rs`: Allows the admin to update config thresholds or trigger the emergency protocol pause.
  - `init_organization.rs`: Provisions an on-chain identity (PDA) for a new organization.
  - `register_hash.rs`: The core function. Registers a SHA-256 hash. Ensures PDA collision resistance by mixing the owner's pubkey into the seeds.
  - `verify_hash.rs`: Endpoint to verify a hash. It enforces the mathematical Time-To-Live (TTL) by comparing `Clock::get()?.unix_timestamp` with the record's expiry field.
  - `revoke_hash.rs`: Allows an organization to explicitly mark a previously anchored hash as revoked/invalid.
- **`src/state/`**: The data structures stored in Solana's ledger (Accounts).
  - `protocol_config.rs`: Global settings.
  - `organization.rs`: Identity for customers.
  - `hash_record.rs`: The actual storage for a hash, metadata, and timestamps.

## Security Mechanisms
- **PDA Collisions**: Handled by strict macro seeds `#[account(init, seeds = [b"hash", owner.key().as_ref(), hash.as_bytes()], ...)]`
- **Arithmetic Overflows**: Handled safely because Rust prevents overflow by default in debug, but we use strict numeric types.
- **TTL Enforcement**: `require!(clock.unix_timestamp < record.expiry, ErrorCode::HashExpired);`

## Testing
To run the rust integration tests:
```bash
anchor test
```
