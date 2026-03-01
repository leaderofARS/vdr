use anchor_lang::prelude::*;

#[account]
pub struct Organization {
    pub admin: Pubkey,        // Organziation admin
    pub name: String,         // Org name
    pub issuer_count: u64,    // Number of active issuers
    pub created_at: i64,
}

impl Organization {
    // discriminator (8) + admin (32) + name (4 + 32 max) + issuer_count (8) + created_at (8)
    pub const SPACE: usize = 8 + 32 + 36 + 8 + 8;
}
