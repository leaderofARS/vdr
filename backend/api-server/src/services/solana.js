/**
 * @file solana.js
 * @module backend/api-server/src/services/solana.js
 * @description Core business logic and external service integrations.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Connection, PublicKey, Keypair, SystemProgram } = require("@solana/web3.js");
const anchor = require("@coral-xyz/anchor");
const bs58 = require("bs58");
const vaultService = require("./vault");

let connection, wallet, provider, program, programId, protocolConfigPda;

async function initialize() {
    try {
        const walletPrivateKey = await vaultService.getSecret('WALLET_PRIVATE_KEY');
        const programIdStr = await vaultService.getSecret('PROGRAM_ID');
        const solanaRpcUrl = await vaultService.getSecret('SOLANA_RPC_URL') || process.env.SOLANA_RPC_URL;

        if (!walletPrivateKey) throw new Error('WALLET_PRIVATE_KEY not found in Vault or environment');
        if (!programIdStr) throw new Error('PROGRAM_ID not found in Vault or environment');

        connection = new Connection(solanaRpcUrl, "confirmed");

        const secretKey = Uint8Array.from(JSON.parse(walletPrivateKey));
        wallet = Keypair.fromSecretKey(secretKey);

        provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), {
            commitment: "confirmed",
        });

        const idl = require("./vdr_contract.json");
        programId = new PublicKey(programIdStr);
        program = new anchor.Program(idl, programId, provider);

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

async function ensureInitialized() {
    if (!wallet || !program) {
        await initialize();
    }
}

/**
 * Convert hex hash string to [u8; 32] array for Anchor
 * Must be a plain JS number array — not a Buffer or Uint8Array
 */
function hexToHashArray(hexHash) {
    const buf = Buffer.from(hexHash, "hex");
    if (buf.length !== 32) throw new Error(`Invalid hash length: expected 32 bytes, got ${buf.length}`);
    return Array.from(buf); // plain number array [0..255]
}

/**
 * Register a SHA-256 hash on-chain (V2 Protocol).
 */
async function registerHash(hexHash, metadata = "", expiry = 0) {
    await ensureInitialized();

    const hashArray = hexToHashArray(hexHash); // [u8; 32] as plain number array

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("hash_record"),
            Buffer.from(hashArray),         // 32 raw bytes for PDA seed
            wallet.publicKey.toBuffer()
        ],
        programId
    );

    const config = await program.account.protocolConfig.fetchNullable(protocolConfigPda);
    if (!config) throw new Error("VDR Protocol is not initialized");

    const tx = await program.methods
        .registerHash(
            hashArray,                      // [u8; 32] — plain number array
            metadata,                       // String
            new anchor.BN(expiry)           // i64
        )
        .accounts({
            hashRecord: pdaAddress,
            protocolConfig: protocolConfigPda,
            treasury: config.treasury,
            organization: null,
            owner: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    return { tx, owner: wallet.publicKey.toBase58(), pdaAddress: pdaAddress.toBase58() };
}

/**
 * Verify a hash on-chain.
 */
async function verifyHash(hexHash) {
    await ensureInitialized();

    const hashArray = hexToHashArray(hexHash);

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("hash_record"),
            Buffer.from(hashArray),
            wallet.publicKey.toBuffer()
        ],
        programId
    );

    try {
        const record = await program.account.hashRecord.fetch(pdaAddress);

        if (record.isRevoked) {
            return { exists: true, valid: false, reason: "Hash has been revoked", record: null };
        }

        if (record.expiry > 0) {
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > record.expiry) {
                return { exists: true, valid: false, reason: "Hash has expired", record: null };
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
                organization: record.organization ? record.organization.toBase58() : null,
                pdaAddress: pdaAddress.toBase58()
            }
        };
    } catch (err) {
        if (err.message.includes("Account does not exist")) {
            return { exists: false, valid: false, reason: "Hash not found in registry", record: null };
        }
        throw err;
    }
}

/**
 * Revoke a hash on-chain.
 */
async function revokeHash(hexHash) {
    await ensureInitialized();

    const hashArray = hexToHashArray(hexHash);

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("hash_record"),
            Buffer.from(hashArray),
            wallet.publicKey.toBuffer()
        ],
        programId
    );

    const tx = await program.methods
        .revokeHash()
        .accounts({
            hashRecord: pdaAddress,
            owner: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    return { tx };
}

/**
 * Get hash record details
 */
async function getHashRecord(hexHash) {
    await ensureInitialized();

    const hashArray = hexToHashArray(hexHash);

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("hash_record"),
            Buffer.from(hashArray),
            wallet.publicKey.toBuffer()
        ],
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