//! @file protocol_config.rs
//! @module /home/ars0x01/Documents/Github/solana-vdr/programs/vdr_contract/src/state/protocol_config.rs
//! @description Solana Anchor account structures and state definitions.
//! This file is part of the SipHeron VDR smart contract.
//! @author SipHeron Platform

use anchor_lang::prelude::*;

#[account]
pub struct ProtocolConfig {
    pub admin: Pubkey,
    pub registration_fee: u64, // In lamports
    pub treasury: Pubkey,
    pub is_paused: bool,
}

impl ProtocolConfig {
    // 8 discriminator + 32 admin + 8 fee + 32 treasury + 1 is_paused
    pub const SPACE: usize = 8 + 32 + 8 + 32 + 1;
}
