const solanaService = require("../services/solana");

module.exports = async (req, res, next) => {
    try {
        const { hash } = req.body;

        if (!hash || hash.length !== 64) {
            return res.status(400).json({ success: false, error: "Invalid SHA-256 hash provided" });
        }

        const record = await solanaService.verifyHash(hash);

        if (record) {
            res.status(200).json({
                verified: true,
                hash: record.hash,
                owner: record.owner,
                timestamp: record.timestamp,
                registeredAt: new Date(record.timestamp * 1000).toISOString(),
                metadata: record.metadata,
                pdaAddress: record.pdaAddress
            });
        } else {
            res.status(200).json({
                verified: false,
                hash,
                message: "Hash not found in registry"
            });
        }
    } catch (err) {
        next(err);
    }
};
