//! @file update_protocol_config.rs
//! @module /home/ars0x01/Documents/Github/solana-vdr/programs/vdr_contract/src/instructions/update_protocol_config.rs
//! @description Solana Anchor instruction handlers (smart contract endpoints).
//! This file is part of the SipHeron VDR smart contract.
//! @author SipHeron Platform

use anchor_lang::prelude::*;
use crate::state::protocol_config::*;

#[derive(Accounts)]
pub struct UpdateProtocolConfig<'info> {
    #[account(
        mut,
        seeds = [b"protocol_config"],
        bump,
        has_one = admin,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    pub admin: Signer<'info>,
}

pub fn handler(
    ctx: Context<UpdateProtocolConfig>,
    new_admin: Option<Pubkey>,
    new_fee: Option<u64>,
    new_treasury: Option<Pubkey>
) -> Result<()> {
    let config = &mut ctx.accounts.protocol_config;

    if let Some(val) = new_admin {
        config.admin = val;
        msg!("Protocol Admin updated to: {}", val);
    }

    if let Some(val) = new_fee {
        config.registration_fee = val;
        msg!("Registration Fee updated to: {} lamports", val);
    }

    if let Some(val) = new_treasury {
        config.treasury = val;
        msg!("Treasury updated to: {}", val);
    }

    Ok(())
}
