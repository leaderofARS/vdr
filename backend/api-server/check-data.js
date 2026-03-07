const { Connection, PublicKey } = require("@solana/web3.js");
async function run() {
    try {
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const programId = new PublicKey("6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo");
        const [protocolConfigPda] = PublicKey.findProgramAddressSync([Buffer.from("protocol_config")], programId);
        const info = await connection.getAccountInfo(protocolConfigPda);
        console.log("Data hex:", info.data.toString("hex"));
    } catch (err) {
        console.error("Error", err);
    }
}
run();
