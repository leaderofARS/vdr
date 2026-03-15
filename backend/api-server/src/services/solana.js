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

async function withRetry(fn, maxAttempts = 3, baseDelayMs = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts) break;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[ANCHOR] Attempt ${attempt} failed, retrying in ${delay}ms:`, err.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

let connection, wallet, provider, program, programId, protocolConfigPda;

const RPC_ENDPOINTS = [
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  process.env.SOLANA_RPC_URL_2 || 'https://devnet.helius-rpc.com/?api-key=free',
  'https://api.devnet.solana.com',
].filter((url, index, arr) => arr.indexOf(url) === index);

let currentRpcIndex = 0;

function getConnectionWithFailover() {
  return {
    async execute(fn) {
      for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
        const idx = (currentRpcIndex + i) % RPC_ENDPOINTS.length;
        try {
          const conn = new Connection(RPC_ENDPOINTS[idx], 'confirmed');
          const result = await fn(conn);
          currentRpcIndex = idx;
          if (connection && connection.rpcEndpoint !== RPC_ENDPOINTS[idx]) {
              connection = conn;
              if (wallet) {
                  provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), { commitment: "confirmed" });
                  program = new anchor.Program(require("./vdr_contract.json"), programId, provider);
              }
          }
          return result;
        } catch (err) {
          console.warn(`[RPC] Endpoint ${RPC_ENDPOINTS[idx]} failed:`, err.message);
          if (i === RPC_ENDPOINTS.length - 1) throw err;
        }
      }
    }
  };
}

async function initialize() {
    try {
        const walletPrivateKey = await vaultService.getSecret('WALLET_PRIVATE_KEY');
        const programIdStr = await vaultService.getSecret('PROGRAM_ID');
        const solanaRpcUrl = await vaultService.getSecret('SOLANA_RPC_URL') || process.env.SOLANA_RPC_URL;

        if (!walletPrivateKey) throw new Error('WALLET_PRIVATE_KEY not found in Vault or environment');
        if (!programIdStr) throw new Error('PROGRAM_ID not found in Vault or environment');

        const secretKey = Uint8Array.from(JSON.parse(walletPrivateKey));
        wallet = Keypair.fromSecretKey(secretKey);
        programId = new PublicKey(programIdStr);

        await getConnectionWithFailover().execute(async (conn) => {
            connection = conn;
            provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), {
                commitment: "confirmed",
            });
            const idl = require("./vdr_contract.json");
            program = new anchor.Program(idl, programId, provider);
            [protocolConfigPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("protocol_config")],
                programId
            );
        });

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
    if (!/^[a-fA-F0-9]{64}$/.test(hexHash)) {
        throw new Error("Invalid hash: must be exactly 64 hex characters (32 bytes)");
    }
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

    const txPromise = withRetry(() => program.methods
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
        .rpc());

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Transaction timeout: no confirmation in 60s")), 60000)
    );

    const tx = await Promise.race([txPromise, timeoutPromise]);

    // Verify signature format before returning for storage (Solana sigs are base58 encoded 64 bytes -> ~87-88 chars)
    if (!tx || !/^[1-9A-HJ-NP-Za-km-z]{86,89}$/.test(tx)) {
        throw new Error("Invalid transaction signature format received");
    }

    let blockNumber = null;
    let blockTimestamp = null;
    try {
        const txDetails = await connection.getTransaction(tx, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0,
        });
        if (txDetails) {
            blockNumber = txDetails.slot ? BigInt(txDetails.slot) : null;
            blockTimestamp = txDetails.blockTime
              ? new Date(txDetails.blockTime * 1000)
              : null;
        }
    } catch (blockErr) {
        console.error('[ANCHOR] Failed to fetch block data:', blockErr.message);
    }

    return { tx, owner: wallet.publicKey.toBase58(), pdaAddress: pdaAddress.toBase58(), blockNumber, blockTimestamp };
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

    const txPromise = program.methods
        .revokeHash()
        .accounts({
            hashRecord: pdaAddress,
            owner: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Transaction timeout: no confirmation in 60s")), 60000)
    );

    const tx = await Promise.race([txPromise, timeoutPromise]);

    if (!tx || !/^[1-9A-HJ-NP-Za-km-z]{86,89}$/.test(tx)) {
        throw new Error("Invalid transaction signature format received");
    }

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