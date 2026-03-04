//! @file verify_hash.rs
//! @module /home/ars0x01/Documents/Github/solana-vdr/programs/vdr_contract/src/instructions/verify_hash.rs
//! @description Solana Anchor instruction handlers (smart contract endpoints).
//! This file is part of the SipHeron VDR smart contract.
//! @author SipHeron Platform

use anchor_lang::prelude::*;
use crate::state::hash_record::*;

#[derive(Accounts)]
pub struct VerifyHash<'info> {
    pub hash_record: Account<'info, HashRecord>,
}

#[error_code]
pub enum VerifyError {
    #[msg("This hash has been explicitly revoked by the owner or organization")]
    HashRevoked,
    #[msg("This hash has expired")]
    HashExpired,
}

pub fn handler(ctx: Context<VerifyHash>) -> Result<()> {
    let record = &ctx.accounts.hash_record;
    
    // Check revocation
    require!(!record.is_revoked, VerifyError::HashRevoked);

    // If expiry > 0, check if current timestamp exceeds expiry
    if record.expiry > 0 {
        let current_time = Clock::get()?.unix_timestamp;
        require!(current_time <= record.expiry, VerifyError::HashExpired);
    }
    
    msg!("Hash is Authentic: {:?}", record.hash);
    Ok(())
}
