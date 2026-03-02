const { Connection, PublicKey, Keypair, SystemProgram } = require("@solana/web3.js");
const anchor = require("@coral-xyz/anchor");
const bs58 = require("bs58");

const connection = new Connection(process.env.SOLANA_RPC_URL, "confirmed");

// The SipHeron wallet acting as the payer and admin
const secretKey = Uint8Array.from(JSON.parse(process.env.WALLET_PRIVATE_KEY));
const wallet = Keypair.fromSecretKey(secretKey);
const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), {
    commitment: "confirmed",
});

// Program ID and IDL loading
const idl = require("../../../../target/idl/vdr_contract.json");
const programId = new PublicKey(process.env.PROGRAM_ID);
const program = new anchor.Program(idl, provider);

// Protocol Config PDA
const [protocolConfigPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("protocol_config")],
    programId
);

/**
 * Register a SHA-256 hash on-chain (V2 Protocol).
 */
async function registerHash(hexHash, metadata = "", expiry = 0) {
    const hashBytes = Buffer.from(hexHash, "hex");
    const hashArray = Array.from(hashBytes);

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from("hash_record"), Buffer.from(hashArray)],
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

    return { tx, pdaAddress: pdaAddress.toBase58(), owner: wallet.publicKey.toBase58() };
}

/**
 * Verify a hash by querying the PDA.
 */
async function verifyHash(hexHash) {
    const hashBytes = Buffer.from(hexHash, "hex");
    const hashArray = Array.from(hashBytes);

    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from("hash_record"), Buffer.from(hashArray)],
        programId
    );

    try {
        const account = await program.account.hashRecord.fetch(pdaAddress);
        return {
            hash: Buffer.from(account.hash).toString("hex"),
            owner: account.owner.toBase58(),
            timestamp: account.timestamp.toNumber(),
            expiry: account.expiry.toNumber(),
            isRevoked: account.isRevoked,
            metadata: account.metadata,
            pdaAddress: pdaAddress.toBase58()
        };
    } catch (error) {
        if (error.message.includes("Account does not exist")) {
            return null;
        }
        throw error;
    }
}

module.exports = { registerHash, verifyHash, program, provider, wallet };
