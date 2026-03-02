const solanaService = require("../services/solana");

module.exports = async (req, res, next) => {
    try {
        const { hash } = req.params;

        if (!hash || hash.length !== 64) {
            return res.status(400).json({ success: false, error: "Invalid SHA-256 hash provided" });
        }

        const record = await solanaService.verifyHash(hash);

        if (record) {
            res.status(200).json({
                hash: record.hash,
                owner: record.owner,
                timestamp: record.timestamp,
                registeredAt: new Date(record.timestamp * 1000).toISOString(),
                metadata: record.metadata,
                pdaAddress: record.pdaAddress
            });
        } else {
            res.status(404).json({
                error: "Record not found",
                hash
            });
        }
    } catch (err) {
        next(err);
    }
};
