import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VdrContract } from "../target/types/vdr_contract";
import { expect } from "chai";
import * as crypto from "crypto";

describe("vdr_contract", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const program = anchor.workspace.VdrContract as Program<VdrContract>;

    const admin = provider.wallet;
    const issuer = anchor.web3.Keypair.generate();
    const treasury = anchor.web3.Keypair.generate();

    let protocolConfigPda: anchor.web3.PublicKey;
    let organizationPda: anchor.web3.PublicKey;

    const orgName = "Acme Corp";
    const fee = new anchor.BN(1000000); // 0.001 SOL

    before(async () => {
        // Airdrop to issuer
        const sig = await provider.connection.requestAirdrop(issuer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
        await provider.connection.confirmTransaction(sig);

        [protocolConfigPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("protocol_config")],
            program.programId
        );

        [organizationPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("organization"), admin.publicKey.toBuffer(), Buffer.from(orgName)],
            program.programId
        );
    });

    it("Initializes the Protocol Config", async () => {
        await program.methods
            .initProtocol(fee)
            .accounts({
                protocolConfig: protocolConfigPda,
                admin: admin.publicKey,
                treasury: treasury.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        const config = await program.account.protocolConfig.fetch(protocolConfigPda);
        expect(config.admin.toBase58()).to.equal(admin.publicKey.toBase58());
        expect(config.registrationFee.toNumber()).to.equal(fee.toNumber());
        expect(config.treasury.toBase58()).to.equal(treasury.publicKey.toBase58());
    });

    it("Initializes an Organization", async () => {
        await program.methods
            .initOrganization(orgName)
            .accounts({
                organization: organizationPda,
                admin: admin.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        const org = await program.account.organization.fetch(organizationPda);
        expect(org.name).to.equal(orgName);
    });

    it("Registers a Hash with a Fee under an Organization", async () => {
        const rawData = "VDR Protocol Level 2 SipHeron Upgrade";
        const hashBuffer = crypto.createHash("sha256").update(rawData).digest();
        const hashArray = Array.from(hashBuffer);

        const [hashPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("hash_record"), hashBuffer, issuer.publicKey.toBuffer()],
            program.programId
        );

        const treasuryBalBefore = await provider.connection.getBalance(treasury.publicKey);

        // Register hash by the issuer
        await program.methods
            .registerHash(hashArray, "Test Metadata", new anchor.BN(0)) // No expiry
            .accounts({
                hashRecord: hashPda,
                protocolConfig: protocolConfigPda,
                treasury: treasury.publicKey,
                organization: organizationPda,
                owner: issuer.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([issuer])
            .rpc();

        const record = await program.account.hashRecord.fetch(hashPda);
        expect(record.owner.toBase58()).to.equal(issuer.publicKey.toBase58());
        expect(record.organization.toBase58()).to.equal(organizationPda.toBase58());
        expect(record.isRevoked).to.be.false;

        const treasuryBalAfter = await provider.connection.getBalance(treasury.publicKey);
        expect(treasuryBalAfter - treasuryBalBefore).to.equal(fee.toNumber());
    });

    it("Allows the Organization Admin to Revoke a Hash", async () => {
        const rawData = "VDR Protocol Level 2 SipHeron Upgrade";
        const hashBuffer = crypto.createHash("sha256").update(rawData).digest();

        const [hashPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("hash_record"), hashBuffer, issuer.publicKey.toBuffer()],
            program.programId
        );

        // Admin revokes it
        await program.methods
            .revokeHash()
            .accounts({
                hashRecord: hashPda,
                organization: organizationPda,
                revoker: admin.publicKey,
            })
            .rpc();

        const record = await program.account.hashRecord.fetch(hashPda);
        expect(record.isRevoked).to.be.true;

        // Try to verify, should fail
        try {
            await program.methods
                .verifyHash()
                .accounts({ hashRecord: hashPda })
                .rpc();
            expect.fail("Verify should have thrown an error due to revocation");
        } catch (e) {
            expect(e.error.errorMessage).to.include("This hash has been explicitly revoked");
        }
    });

});
