/**
 * @file solana.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/services/solana.js
 * @description Core business logic and external service integrations.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Connection, PublicKey, Keypair, SystemProgram } = require("@solana/web3.js");
const anchor = require("@coral-xyz/anchor");
const bs58 = require("bs58");
const vaultService = require("./vault");

let connection, wallet, provider, program, programId, protocolConfigPda;

/**
 * Initialize Solana service with secrets from Vault
 * Fix 1.3 & 1.4: Load sensitive keys from HashiCorp Vault instead of .env
 */
async function initialize() {
    try {
        // Get secrets from Vault (falls back to .env if Vault not configured)
        const walletPrivateKey = await vaultService.getSecret('WALLET_PRIVATE_KEY');
        const programIdStr = await vaultService.getSecret('PROGRAM_ID');
        const solanaRpcUrl = await vaultService.getSecret('SOLANA_RPC_URL') || process.env.SOLANA_RPC_URL;

        if (!walletPrivateKey) {
            throw new Error('WALLET_PRIVATE_KEY not found in Vault or environment');
        }

        if (!programIdStr) {
            throw new Error('PROGRAM_ID not found in Vault or environment');
        }

        // Initialize connection
        connection = new Connection(solanaRpcUrl, "confirmed");

        // Initialize wallet from Vault secret
        const secretKey = Uint8Array.from(JSON.parse(walletPrivateKey));
        wallet = Keypair.fromSecretKey(secretKey);
        
        provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), {
            commitment: "confirmed",
        });

        // Program ID and IDL loading
        const idl = require("./vdr_contract.json");
        programId = new PublicKey(programIdStr);
        program = new anchor.Program(idl, programId, provider);

        // Protocol Config PDA
        [protocolConfigPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("protocol_config")],
            programId
        );

        console.log('[Solana] Service initialized successfully');
        console.log('[Solana] Wallet:', wallet.publicKey.toBase58());
        console.log('[Solana] Program ID:', programId.toBase58());
    } catch (error) {
        console.error('[Solana] Initialization error:', error.message);
        throw error;
    }
}

/**
 * Ensure service is initialized before use
 */
async function ensureInitialized() {
    if (!wallet || !program) {
        await initialize();
    }
}

/**
 * Register a SHA-256 hash on-chain (V2 Protocol).
 */
async function registerHash(hexHash, metadata = "", expiry = 0) {
    await ensureInitialized();

    const hashBytes = Buffer.from(hexHash, "hex");
    const hashArray = Array.from(hashBytes);

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from("hash_record"), Buffer.from(hashArray), wallet.publicKey.toBuffer()],
        programId
    );

    // Fetch config to pass treasury
    const config = await program.account.protocolConfig.fetchNullable(protocolConfigPda);
    if (!config) throw new Error("VDR Protocol is not initialized");

    const tx = await program.methods
        .registerHash(hashArray, metadata, new anchor.BN(expiry))
        .accounts({
            hashRecord: pdaAddress,
            protocolConfig: protocolConfigPda,
            treasury: config.treasury,
            organization: null, // Global namespace
            owner: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    return { tx, owner: wallet.publicKey.toBase58() };
}

/**
 * Verify a hash on-chain.
 */
async function verifyHash(hexHash) {
    await ensureInitialized();

    const hashBytes = Buffer.from(hexHash, "hex");
    const hashArray = Array.from(hashBytes);

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from("hash_record"), Buffer.from(hashArray), wallet.publicKey.toBuffer()],
        programId
    );

    try {
        const record = await program.account.hashRecord.fetch(pdaAddress);
        
        // Check if revoked
        if (record.isRevoked) {
            return {
                exists: true,
                valid: false,
                reason: "Hash has been revoked",
                record: null
            };
        }

        // Check if expired
        if (record.expiry > 0) {
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > record.expiry) {
                return {
                    exists: true,
                    valid: false,
                    reason: "Hash has expired",
                    record: null
                };
            }
        }

        return {
            exists: true,
            valid: true,
            record: {
                hash: Buffer.from(record.hash).toString("hex"),
                owner: record.owner.toBase58(),
                timestamp: record.timestamp.toNumber(),
                expiry: record.expiry.toNumber(),
                metadata: record.metadata,
                isRevoked: record.isRevoked,
                organization: record.organization ? record.organization.toBase58() : null
            }
        };
    } catch (err) {
        if (err.message.includes("Account does not exist")) {
            return {
                exists: false,
                valid: false,
                reason: "Hash not found in registry",
                record: null
            };
        }
        throw err;
    }
}

/**
 * Revoke a hash on-chain.
 */
async function revokeHash(hexHash) {
    await ensureInitialized();

    const hashBytes = Buffer.from(hexHash, "hex");
    const hashArray = Array.from(hashBytes);

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from("hash_record"), Buffer.from(hashArray), wallet.publicKey.toBuffer()],
        programId
    );

    const tx = await program.methods
        .revokeHash()
        .accounts({
            hashRecord: pdaAddress,
            owner: wallet.publicKey,
        })
        .rpc();

    return { tx };
}

/**
 * Get hash record details
 */
async function getHashRecord(hexHash) {
    await ensureInitialized();

    const hashBytes = Buffer.from(hexHash, "hex");
    const hashArray = Array.from(hashBytes);

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from("hash_record"), Buffer.from(hashArray), wallet.publicKey.toBuffer()],
        programId
    );

    try {
        const record = await program.account.hashRecord.fetch(pdaAddress);
        return {
            hash: Buffer.from(record.hash).toString("hex"),
            owner: record.owner.toBase58(),
            timestamp: record.timestamp.toNumber(),
            expiry: record.expiry.toNumber(),
            metadata: record.metadata,
            isRevoked: record.isRevoked,
            organization: record.organization ? record.organization.toBase58() : null,
            pda: pdaAddress.toBase58()
        };
    } catch (err) {
        if (err.message.includes("Account does not exist")) {
            return null;
        }
        throw err;
    }
}

module.exports = {
    initialize,
    registerHash,
    verifyHash,
    revokeHash,
    getHashRecord,
    getWallet: () => wallet,
    getConnection: () => connection,
    getProgram: () => program
};
