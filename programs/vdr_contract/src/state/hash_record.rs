//! @file hash_record.rs
//! @module /home/ars0x01/Documents/Github/solana-vdr/programs/vdr_contract/src/state/hash_record.rs
//! @description Solana Anchor account structures and state definitions.
//! This file is part of the SipHeron VDR smart contract.
//! @author SipHeron Platform

use anchor_lang::prelude::*;

#[account]
pub struct HashRecord {
    pub owner: Pubkey,           // 32
    pub organization: Option<Pubkey>, // 1 + 32
    pub hash: [u8; 32],          // 32
    pub timestamp: i64,          // 8
    pub expiry: i64,             // 8 (0 means no expiry)
    pub is_revoked: bool,        // 1
    pub metadata: String,        // 4 + 200
}

impl HashRecord {
    // discriminator(8) + owner(32) + org(33) + hash(32) + 
    // timestamp(8) + expiry(8) + revoked(1) + str(4+200) = 326
    pub const SPACE: usize = 8 + 32 + 33 + 32 + 8 + 8 + 1 + 204;
}
