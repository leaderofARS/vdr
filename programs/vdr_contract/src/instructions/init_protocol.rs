use anchor_lang::prelude::*;
use crate::state::protocol_config::*;
use std::str::FromStr;

#[derive(Accounts)]
pub struct InitProtocol<'info> {
    #[account(
        init,
        payer = admin,
        space = ProtocolConfig::SPACE,
        seeds = [b"protocol_config"],
        bump
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,
    
    #[account(mut)]
    pub admin: Signer<'info>,

    /// CHECK: The treasury can be any account receiving the SOL fees
    pub treasury: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ProtocolError {
    #[msg("You are not the authorized deployer of this protocol")]
    UnauthorizedInitialization,
}

pub fn hander(ctx: Context<InitProtocol>, registration_fee: u64) -> Result<()> {
    // Front-Running Protection: Only the exact creator can deploy the global config PDA
    let expected_admin = Pubkey::from_str("FxNzogprmve9aubt4B6VT21DKBbERz47cYYQnuF9Xgi5").unwrap();
    require_keys_eq!(ctx.accounts.admin.key(), expected_admin, ProtocolError::UnauthorizedInitialization);

    let config = &mut ctx.accounts.protocol_config;
    config.admin = ctx.accounts.admin.key();
    config.registration_fee = registration_fee;
    config.treasury = ctx.accounts.treasury.key();

    msg!("VDR Protocol Initialized!");
    msg!("Registration Fee: {} lamports", registration_fee);
    
    Ok(())
}
