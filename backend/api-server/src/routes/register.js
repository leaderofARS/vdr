/**
 * @file register.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/routes/register.js
 * @description Express API route handlers.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const solanaService = require("../services/solana");
const { sanitizeMetadata, sanitizeHash } = require("../utils/sanitizer");

module.exports = async (req, res, next) => {
    try {
        const { hash, metadata = "", expiry = 0 } = req.body;

        // Fix 1.11: Sanitize hash input
        const sanitizedHash = sanitizeHash(hash);
        if (!sanitizedHash) {
            return res.status(400).json({ 
                success: false, 
                error: "Invalid SHA-256 hash provided. Must be a 64-character hex string" 
            });
        }

        // Fix 1.11: Sanitize metadata to prevent injection attacks
        const sanitizedMetadata = sanitizeMetadata(metadata);
        
        if (sanitizedMetadata.length > 200) {
            return res.status(400).json({ 
                success: false, 
                error: "Metadata exceeds maximum length of 200 characters." 
            });
        }

        // Check if it already exists to return 409
        const existing = await solanaService.verifyHash(sanitizedHash);
        if (existing) {
            return res.status(409).json({
                success: false,
                error: "Hash already registered",
                hash: sanitizedHash,
            });
        }

        const { tx, owner } = await solanaService.registerHash(
            sanitizedHash, 
            sanitizedMetadata, 
            parseInt(expiry)
        );

        res.status(200).json({
            success: true,
            hash: sanitizedHash,
            txSignature: tx,
            explorerUrl: `https://explorer.solana.com/tx/${tx}?cluster=${process.env.SOLANA_NETWORK || 'devnet'}`,
            owner,
            timestamp: Math.floor(Date.now() / 1000),
            registeredAt: new Date().toISOString()
        });
    } catch (err) {
        next(err);
    }
};
