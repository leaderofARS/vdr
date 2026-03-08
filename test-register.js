require('dotenv').config();
const solanaService = require("./backend/api-server/src/services/solana");

async function test() {
    console.log("🚀 Starting SipHeron VDR Consistency Test...");

    try {
        await solanaService.initialize();

        // Random hash for a clean test
        const testHash = require('crypto').randomBytes(32).toString('hex');
        console.log(`📡 Registering unique hash: ${testHash}`);

        const result = await solanaService.registerHash(testHash, "Automated Audit Test", 0);
        console.log("✅ SUCCESS: Hash registered on Solana!");
        console.log("🔗 Transaction:", result.tx);
        console.log("📍 PDA Address:", result.pdaAddress);

        console.log("🔍 Verifying on-chain registry...");
        const verification = await solanaService.verifyHash(testHash);

        if (verification.valid) {
            console.log("🎊 VERIFICATION SUCCESSFUL: Data matches exactly.");
            console.log("📄 Record Details:", JSON.stringify(verification.record, null, 2));
        } else {
            console.error("❌ VERIFICATION FAILED:", verification.reason);
            process.exit(1);
        }

    } catch (error) {
        console.error("💥 TEST FAILED unexpectedly:");
        console.error(error.message);
        if (error.logs) console.error("Program Logs:", error.logs);
        process.exit(1);
    }
}

test();
