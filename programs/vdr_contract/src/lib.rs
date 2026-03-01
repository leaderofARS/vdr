use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo");

#[program]
pub mod vdr_contract {
    use super::*;

    pub fn register_hash(
        ctx: Context<RegisterHash>, 
        hash: [u8; 32], 
        metadata: String,
        expiry: i64 // V2 param
    ) -> Result<()> {
        instructions::register_hash::handler(ctx, hash, metadata, expiry)
    }

    pub fn verify_hash(ctx: Context<VerifyHash>) -> Result<()> {
        instructions::verify_hash::handler(ctx)
    }

    pub fn init_protocol(ctx: Context<InitProtocol>, registration_fee: u64) -> Result<()> {
        instructions::init_protocol::hander(ctx, registration_fee)
    }

    pub fn init_organization(ctx: Context<InitOrganization>, name: String) -> Result<()> {
        instructions::init_organization::handler(ctx, name)
    }

    pub fn revoke_hash(ctx: Context<RevokeHash>) -> Result<()> {
        instructions::revoke_hash::handler(ctx)
    }
}
