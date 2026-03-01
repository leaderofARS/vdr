use anchor_lang::prelude::*;
use crate::state::hash_record::*;
use crate::state::protocol_config::*;
use crate::state::organization::*;
use anchor_lang::system_program;

#[derive(Accounts)]
#[instruction(hash: [u8; 32])]
pub struct RegisterHash<'info> {
    #[account(
        init,
        payer = owner,
        space = HashRecord::SPACE,
        seeds = [b"hash_record", hash.as_ref(), owner.key().as_ref()],
        bump
    )]
    pub hash_record: Account<'info, HashRecord>,

    #[account(
        seeds = [b"protocol_config"],
        bump
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    // Ensure the treasury matches config
    #[account(mut, address = protocol_config.treasury)]
    /// CHECK: Treasury receiving fees
    pub treasury: UncheckedAccount<'info>,

    // Optional organization context
    pub organization: Option<Account<'info, Organization>>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum VDRError {
    #[msg("Metadata must be 200 characters or less")]
    MetadataTooLong,
}

pub fn handler(
    ctx: Context<RegisterHash>, 
    hash: [u8; 32], 
    metadata: String, 
    expiry: i64
) -> Result<()> {
    require!(metadata.len() <= 200, VDRError::MetadataTooLong);

    // Pay registration fee if it's > 0
    let fee = ctx.accounts.protocol_config.registration_fee;
    if fee > 0 {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.owner.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, fee)?;
    }

    let record = &mut ctx.accounts.hash_record;
    record.owner = ctx.accounts.owner.key();
    record.hash = hash;
    record.timestamp = Clock::get()?.unix_timestamp;
    record.expiry = expiry;
    record.is_revoked = false;
    record.metadata = metadata;

    if let Some(org) = &ctx.accounts.organization {
        record.organization = Some(org.key());
    } else {
        record.organization = None;
    }

    msg!("Hash Registered: {:?}", hash);
    Ok(())
}
