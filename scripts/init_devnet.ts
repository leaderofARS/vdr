import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";

async function main() {
    anchor.setProvider(anchor.AnchorProvider.env());
    const provider = anchor.getProvider() as anchor.AnchorProvider;

    // In @coral-xyz/anchor v0.29.0, Program constructor is (idl, provider)
    const idl = require("../target/idl/vdr_contract.json");
    const program = new anchor.Program(idl as any, provider);

    const admin = provider.wallet;
    const treasury = anchor.web3.Keypair.generate();
    const fee = new anchor.BN(1000000); // 0.001 SOL

    const [protocolConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol_config")],
        program.programId
    );

    console.log("Initializing Protocol Config at PDA:", protocolConfigPda.toBase58());

    try {
        const tx1 = await program.methods
            .initProtocol(fee)
            .accounts({
                protocolConfig: protocolConfigPda,
                admin: admin.publicKey,
                treasury: treasury.publicKey,
                systemProgram: SystemProgram.programId,
            } as any)
            .rpc();
        console.log("Init Protocol TX:", tx1);
    } catch (e) {
        console.log("Protocol might already be initialized:", e.message);
    }

    const orgName = "SipHeron Open Source V2";
    const [organizationPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("organization"), admin.publicKey.toBuffer(), Buffer.from(orgName)],
        program.programId
    );

    console.log("Initializing Organization PDA:", organizationPda.toBase58());

    try {
        const tx2 = await program.methods
            .initOrganization(orgName)
            .accounts({
                organization: organizationPda,
                admin: admin.publicKey,
                systemProgram: SystemProgram.programId,
            } as any)
            .rpc();
        console.log("Init Org TX:", tx2);
    } catch (e) {
        console.log("Org might already be initialized:", e.message);
    }
}

main().catch(console.error);
