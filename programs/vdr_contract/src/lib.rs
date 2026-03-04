//! @file lib.rs
//! @module /home/ars0x01/Documents/Github/solana-vdr/programs/vdr_contract/src/lib.rs
//! @description Core component of the SipHeron VDR platform.
//! This file is part of the SipHeron VDR smart contract.
//! @author SipHeron Platform

use anchor_lang::prelude::*;

pub mod init_protocol;
pub mod init_organization;
pub mod register_hash;
pub mod verify_hash;
pub mod revoke_hash;
pub mod update_protocol_config;
pub mod state;

use crate::init_protocol::*;
use crate::init_organization::*;
use crate::register_hash::*;
use crate::verify_hash::*;
use crate::revoke_hash::*;
use crate::update_protocol_config::*;

// This is the generated program ID for Localnet & Devnet
// Ensure this matches the `vdr_contract` key in Anchor.toml
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
        crate::register_hash::handler(ctx, hash, metadata, expiry)
    }

    pub fn verify_hash(ctx: Context<VerifyHash>) -> Result<()> {
        crate::verify_hash::handler(ctx)
    }

    pub fn init_protocol(ctx: Context<InitProtocol>, registration_fee: u64) -> Result<()> {
        crate::init_protocol::handler(ctx, registration_fee)
    }

    pub fn init_organization(ctx: Context<InitOrganization>, name: String) -> Result<()> {
        crate::init_organization::handler(ctx, name)
    }

    pub fn revoke_hash(ctx: Context<RevokeHash>) -> Result<()> {
        crate::revoke_hash::handler(ctx)
    }

    pub fn update_protocol_config(
        ctx: Context<UpdateProtocolConfig>,
        new_admin: Option<Pubkey>,
        new_fee: Option<u64>,
        new_treasury: Option<Pubkey>,
        is_paused: Option<bool>,
    ) -> Result<()> {
        crate::update_protocol_config::handler(ctx, new_admin, new_fee, new_treasury, is_paused)
    }
}
