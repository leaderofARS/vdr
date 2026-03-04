/**
 * @file verify.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/routes/verify.js
 * @description Express API route handlers.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const solanaService = require("../services/solana");

module.exports = async (req, res, next) => {
    try {
        const { hash } = req.body;

        const hexRegex = /^[a-fA-F0-9]{64}$/;
        if (!hash || !hexRegex.test(hash)) {
            return res.status(400).json({ success: false, error: "Invalid SHA-256 hash provided. Must be a 64-character hex string" });
        }

        const record = await solanaService.verifyHash(hash);

        if (record) {
            res.status(200).json({
                verified: true,
                record: {
                    hash: record.hash,
                    owner: record.owner,
                    timestamp: record.timestamp,
                    registeredAt: new Date(record.timestamp * 1000).toISOString(),
                    metadata: record.metadata,
                    pdaAddress: record.pdaAddress,
                    expiry: record.expiry || 0,
                    isRevoked: record.isRevoked || false
                }
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
