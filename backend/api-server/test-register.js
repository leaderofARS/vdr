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

        const idl = require("./vdr_contract_old.json");
        const programIdStr = "6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo";
        const programId = new PublicKey(programIdStr);

        console.log("Initializing Program...");
        // Test 0.29.0 format (3 args) or 0.30.1 format (2 args)
        // Let's try 3 args first (0.29.0)
        let program;
        try {
            program = new anchor.Program(idl, programId, provider);
        } catch (e) {
            console.log("3-arg constructor failed, trying 2-arg (0.30.1)...");
            program = new anchor.Program(idl, provider);
        }

        const [protocolConfigPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("protocol_config")],
            programId
        );

        console.log("Fetching config at:", protocolConfigPda.toBase58());
        let config;
        try {
            config = await program.account.protocolConfig.fetch(protocolConfigPda);
        } catch (e) {
            if (e.message.includes("Account does not exist")) {
                console.log("Config doesn't exist, initializing protocol...");
                const tx = await program.methods
                    .initProtocol(new anchor.BN(1000000))
                    .accounts({
                        protocolConfig: protocolConfigPda,
                        admin: wallet.publicKey,
                        treasury: wallet.publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
                console.log("Protocol initialized:", tx);
                config = await program.account.protocolConfig.fetch(protocolConfigPda);
            } else {
                throw e;
            }
        }

        const hashBuffer = Buffer.alloc(32, 0xcc);
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
                treasury: config.treasury,
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
