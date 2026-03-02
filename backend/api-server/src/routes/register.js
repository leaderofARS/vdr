const solanaService = require("../services/solana");

module.exports = async (req, res, next) => {
    try {
        const { hash, metadata = "", expiry = 0 } = req.body;

        if (!hash || hash.length !== 64) {
            return res.status(400).json({ success: false, error: "Invalid SHA-256 hash provided" });
        }

        // Check if it already exists to return 409
        const existing = await solanaService.verifyHash(hash);
        if (existing) {
            return res.status(409).json({
                success: false,
                error: "Hash already registered",
                hash,
            });
        }

        const { tx, owner } = await solanaService.registerHash(hash, metadata, parseInt(expiry));

        res.status(200).json({
            success: true,
            hash,
            txSignature: tx,
            explorerUrl: `https://explorer.solana.com/tx/${tx}?cluster=${process.env.SOLANA_NETWORK || 'devnet'}`,
            owner,
            timestamp: Math.floor(Date.now() / 1000), // Approximate timestamp
            registeredAt: new Date().toISOString()
        });
    } catch (err) {
        next(err);
    }
};
