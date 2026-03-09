/**
 * @file record.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/routes/record.js
 * @description Express API route handlers.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const prisma = require('../config/database');

module.exports = async (req, res, next) => {
    try {
        const { hash } = req.params;

        const hexRegex = /^[a-fA-F0-9]{64}$/;
        if (!hash || !hexRegex.test(hash)) {
            return res.status(400).json({ success: false, error: "Invalid SHA-256 hash provided." });
        }

        if (!req.organization) {
            return res.status(403).json({ error: "Institutional Context Required. Please use /api/verify for public validation." });
        }

        // Fetch from DB ensuring it belongs to this organization
        const record = await prisma.hashRecord.findFirst({
            where: {
                hash,
                organizationId: req.organization.id
            }
        });

        if (record) {
            res.status(200).json({
                hash: record.hash,
                owner: record.ownerWallet,
                timestamp: record.timestamp,
                registeredAt: new Date(record.timestamp * 1000).toISOString(),
                metadata: record.metadata,
                pdaAddress: record.pdaAddress,
                isRevoked: record.isRevoked
            });
        } else {
            res.status(404).json({
                error: "Registry Entry Not Found",
                details: "The requested proof does not belong to your organization or does not exist."
            });
        }
    } catch (err) {
        next(err);
    }
};
