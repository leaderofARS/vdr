use anchor_lang::prelude::*;
use crate::state::hash_record::*;
use crate::state::organization::*;

#[derive(Accounts)]
pub struct RevokeHash<'info> {
    #[account(mut)]
    pub hash_record: Account<'info, HashRecord>,
    
    // Optional organization context if the hash belongs to one
    pub organization: Option<Account<'info, Organization>>,

    pub revoker: Signer<'info>,
}

#[error_code]
pub enum RevokeError {
    #[msg("Only the owner or organization admin can revoke this hash")]
    Unauthorized,
    #[msg("Record is already revoked")]
    AlreadyRevoked,
}

pub fn handler(ctx: Context<RevokeHash>) -> Result<()> {
    let record = &mut ctx.accounts.hash_record;

    require!(!record.is_revoked, RevokeError::AlreadyRevoked);

    let is_owner = record.owner == ctx.accounts.revoker.key();
    
    let is_org_admin = match (&record.organization, &ctx.accounts.organization) {
        (Some(record_org_key), Some(org_account)) => {
            // Must match the org account passed in
            record_org_key == &org_account.key() && org_account.admin == ctx.accounts.revoker.key()
        },
        _ => false,
    };

    require!(is_owner || is_org_admin, RevokeError::Unauthorized);

    record.is_revoked = true;

    msg!("Hash Revoked!");
    Ok(())
}
