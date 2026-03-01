use anchor_lang::prelude::*;

#[account]
pub struct ProtocolConfig {
    pub admin: Pubkey,
    pub registration_fee: u64, // In lamports
    pub treasury: Pubkey,
}

impl ProtocolConfig {
    // 8 discriminator + 32 admin + 8 fee + 32 treasury
    pub const SPACE: usize = 8 + 32 + 8 + 32;
}
