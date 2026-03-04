//! @file mod.rs
//! @module /home/ars0x01/Documents/Github/solana-vdr/programs/vdr_contract/src/instructions/mod.rs
//! @description Solana Anchor instruction handlers (smart contract endpoints).
//! This file is part of the SipHeron VDR smart contract.
//! @author SipHeron Platform

pub mod register_hash;
pub mod verify_hash;
pub mod init_protocol;
pub mod init_organization;
pub mod revoke_hash;
pub mod update_protocol_config;

pub use register_hash::RegisterHash;
pub use verify_hash::VerifyHash;
pub use init_protocol::InitProtocol;
pub use init_organization::InitOrganization;
pub use revoke_hash::RevokeHash;

// Specifically AVOID glob re-exporting the modules themselves to avoid 'handler' collisions
// but make the structs visible.
