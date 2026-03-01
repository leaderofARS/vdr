use anchor_lang::prelude::*;
use crate::state::organization::*;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitOrganization<'info> {
    #[account(
        init,
        payer = admin,
        space = Organization::SPACE,
        seeds = [b"organization", admin.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub organization: Account<'info, Organization>,
    
    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum OrgError {
    #[msg("Organization name must be 32 characters or less")]
    NameTooLong,
}

pub fn handler(ctx: Context<InitOrganization>, name: String) -> Result<()> {
    require!(name.len() <= 32, OrgError::NameTooLong);

    let org = &mut ctx.accounts.organization;
    org.admin = ctx.accounts.admin.key();
    org.name = name;
    org.issuer_count = 0;
    org.created_at = Clock::get()?.unix_timestamp;

    msg!("Organization Created: {}", org.name);
    
    Ok(())
}
