const anchor = require("@coral-xyz/anchor");
const { Connection, PublicKey, Keypair, SystemProgram } = require("@solana/web3.js");
const fs = require("fs");
const path = require("path");

async function testRegister() {
    try {
        console.log("Loading wallet from ~/.config/solana/id.json...");
        const keyData = JSON.parse(fs.readFileSync(path.join(process.env.HOME, ".config/solana/id.json"), "utf8"));
        const wallet = Keypair.fromSecretKey(Uint8Array.from(keyData));
        console.log("Wallet:", wallet.publicKey.toBase58());

        console.log("Connecting to devnet...");
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), {
            commitment: "confirmed",
        });

        const idl = require("./src/services/vdr_contract.json");
        const programIdStr = "6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo";
        const programId = new PublicKey(programIdStr);

        console.log("Initializing Program (0.30.1)...");
        const program = new anchor.Program(idl, programId, provider);

        const [protocolConfigPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("protocol_config")],
            programId
        );

        console.log("Fetching config at:", protocolConfigPda.toBase58());
        let config;
        try {
            config = await program.account.protocolConfig.fetch(protocolConfigPda);
        } catch (e) {
            if (e.message.includes("Account does not exist") || e.message.includes("Account space")) {
                console.log("Config fetch failed. Error:", e.message);
            } else {
                throw e;
            }
        }

        const hashBuffer = Buffer.alloc(32, 0xaa);
        const hashArray = Array.from(hashBuffer);

        const [pdaAddress] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("hash_record"),
                Buffer.from(hashArray),
                wallet.publicKey.toBuffer()
            ],
            programId
        );

        console.log("Registering hash at PDA:", pdaAddress.toBase58());
        const tx = await program.methods
            .registerHash(
                hashArray,
                "Test Metadata",
                new anchor.BN(0)
            )
            .accounts({
                hashRecord: pdaAddress,
                protocolConfig: protocolConfigPda,
                treasury: wallet.publicKey,
                owner: wallet.publicKey,
                systemProgram: SystemProgram.programId,
                organization: null,
            })
            .rpc();

        console.log("SUCCESS: TX", tx);
    } catch (e) {
        console.error("FAILED:", e);
    }
}

testRegister();
