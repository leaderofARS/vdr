//! @file mod.rs
//! @module /home/ars0x01/Documents/Github/solana-vdr/programs/vdr_contract/src/state/mod.rs
//! @description Solana Anchor account structures and state definitions.
//! This file is part of the SipHeron VDR smart contract.
//! @author SipHeron Platform

pub mod hash_record;
pub mod protocol_config;
pub mod organization;

pub use hash_record::*;
pub use protocol_config::*;
pub use organization::*;
