/**
 * @file org.js
 * @module backend/api-server/src/routes/org.js
 * @description Organization-level management and stats.
 */

const express = require('express');
const prisma = require('../config/database');
const solanaService = require('../services/solana');
const authenticate = require('../middleware/auth');
const walletMonitor = require('../services/walletMonitor');

const router = express.Router();

// In-memory cache for wallet balance (60 seconds)
let balanceCache = {
    balanceSol: 0,
    balanceLamports: 0,
    timestamp: 0
};

// Formatting helper for hash records
const formatHashRecordShort = (record) => {
    const network = process.env.SOLANA_NETWORK || 'devnet';
    return {
        hash: record.hash,
        pdaAddress: record.pdaAddress,
        txSignature: record.txSignature,
        owner: record.ownerWallet || record.owner,
        organizationId: record.organizationId,
        metadata: record.metadata,
        registeredAt: record.timestamp ? new Date(record.timestamp * 1000).toISOString() : record.createdAt.toISOString(),
        expiry: record.expiry > 0 ? new Date(record.expiry * 1000).toISOString() : null,
        status: record.status || (record.isRevoked ? 'revoked' : 'active'),
        revokedAt: record.revokedAt ? record.revokedAt.toISOString() : null,
        explorerUrl: `https://explorer.solana.com/tx/${record.txSignature}?cluster=${network}`,
        pdaExplorerUrl: `https://explorer.solana.com/address/${record.pdaAddress}?cluster=${network}`
    };
};

/**
 * @route GET /api/org
 * @description Get current organization details.
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(404).json({ error: 'No organization linked to this session' });
        }

        const org = await prisma.organization.findUnique({
            where: { id: req.organization.id }
        });

        if (!org) return res.status(404).json({ error: 'Organization not found' });

        res.json({
            id: org.id,
            name: org.name,
            createdAt: org.createdAt.toISOString(),
            walletAddress: org.walletAddress || "FxNzogprmve9aubt4B6VT21DKBbERz47cYYQnuF9Xgi5", // Default backend wallet if not set
            pdaAddress: org.solanaPubkey,
            issuerCount: org.issuerCount
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route PUT /api/org
 * @description Update organization details.
 */
router.put('/', authenticate, async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!req.organization) {
            return res.status(403).json({ error: 'Management rights required' });
        }

        // Validation: name 3-50 chars, alphanumeric + spaces
        if (!name || name.length < 3 || name.length > 50 || !/^[a-zA-Z0-9 ]+$/.test(name)) {
            return res.status(400).json({ error: 'Invalid name: Must be 3-50 alphanumeric characters and spaces' });
        }

        // Check if user is owner
        const org = await prisma.organization.findUnique({
            where: { id: req.organization.id }
        });

        if (!org || org.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'Administrative rights (Owner) required for this action' });
        }

        const updated = await prisma.organization.update({
            where: { id: org.id },
            data: { name }
        });

        res.json({
            id: updated.id,
            name: updated.name,
            createdAt: updated.createdAt,
            walletAddress: updated.walletAddress,
            pdaAddress: updated.solanaPubkey
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route GET /api/org/stats
 * @description Comprehensive organization stats.
 */
router.get('/stats', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional context required' });
        }

        const orgId = req.organization.id;

        // Fetch concurrently
        const [org, totalAnchors, revokedAnchors, totalKeys, activeKeys, recentActivity] = await Promise.all([
            prisma.organization.findUnique({ where: { id: orgId } }),
            prisma.hashRecord.count({ where: { organizationId: orgId } }),
            prisma.hashRecord.count({ where: { organizationId: orgId, OR: [{ status: 'revoked' }, { isRevoked: true }] } }),
            prisma.apiKey.count({ where: { organizationId: orgId } }),
            prisma.apiKey.count({ where: { organizationId: orgId, status: 'active' } }),
            prisma.hashRecord.findMany({
                where: { organizationId: orgId },
                take: 5,
                orderBy: { timestamp: 'desc' }
            })
        ]);

        // Wallet Balance with 60s cache
        const now = Date.now();
        if (now - balanceCache.timestamp > 60000) {
            try {
                const connection = solanaService.getConnection();
                const wallet = solanaService.getWallet();
                if (connection && wallet) {
                    const balance = await connection.getBalance(wallet.publicKey);
                    balanceCache = {
                        balanceSol: balance / 1e9,
                        balanceLamports: balance,
                        timestamp: now
                    };
                }
            } catch (rpcError) {
                console.error('[OrgStats] RPC balance fetch failed:', rpcError.message);
                // Continue with stale cache or default
            }
        }

        res.json({
            org: {
                id: org.id,
                name: org.name,
                createdAt: org.createdAt.toISOString(),
                walletAddress: org.walletAddress || "FxNzogprmve9aubt4B6VT21DKBbERz47cYYQnuF9Xgi5",
                pdaAddress: org.solanaPubkey
            },
            stats: {
                totalAnchors,
                activeAnchors: totalAnchors - revokedAnchors,
                revokedAnchors,
                activeApiKeys: activeKeys,
                totalApiKeys: totalKeys
            },
            wallet: {
                address: solanaService.getWallet()?.publicKey.toBase58() || "FxNzogprmve9aubt4B6VT21DKBbERz47cYYQnuF9Xgi5",
                balanceSol: balanceCache.balanceSol,
                balanceLamports: balanceCache.balanceLamports,
                status: walletMonitor.getStatus(),
                network: process.env.SOLANA_NETWORK || 'devnet'
            },
            user: {
                email: req.user.email,
                role: 'Administrator'
            },
            recentActivity: recentActivity.map(formatHashRecordShort)
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
