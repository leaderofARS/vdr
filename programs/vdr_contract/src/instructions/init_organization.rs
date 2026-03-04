//! @file init_organization.rs
//! @module /home/ars0x01/Documents/Github/solana-vdr/programs/vdr_contract/src/instructions/init_organization.rs
//! @description Solana Anchor instruction handlers (smart contract endpoints).
//! This file is part of the SipHeron VDR smart contract.
//! @author SipHeron Platform

use anchor_lang::prelude::*;
use crate::state::organization::*;
use crate::state::protocol_config::*;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitOrganization<'info> {
    #[account(
        init,
        payer = admin,
        space = Organization::SPACE,
        seeds = [b"organization", name.as_bytes()],
        bump
    )]
    pub organization: Account<'info, Organization>,
    
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        seeds = [b"protocol_config"],
        bump
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum OrgError {
    #[msg("Organization name must be 32 characters or less")]
    NameTooLong,
    #[msg("Protocol is currently paused")]
    ProtocolPaused,
}

pub fn handler(ctx: Context<InitOrganization>, name: String) -> Result<()> {
    // This requires adding protocol_config to the Accounts struct if it's not there.
    // Let me check the struct again.
    require!(name.len() <= 32, OrgError::NameTooLong);

    let org = &mut ctx.accounts.organization;
    org.admin = ctx.accounts.admin.key();
    org.name = name;
    org.issuer_count = 0;
    org.created_at = Clock::get()?.unix_timestamp;

    msg!("Organization Created: {}", org.name);
    
    Ok(())
}
