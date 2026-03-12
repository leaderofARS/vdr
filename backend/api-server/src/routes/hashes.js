/**
 * @file hashes.js
 * @module backend/api-server/src/routes/hashes.js
 * @description API route handlers for document hash management (List, Detail, Revocation).
 */

const express = require('express');
const prisma = require('../config/database');
const solanaService = require('../services/solana');
const authenticate = require('../middleware/auth');
const webhookService = require('../services/webhookService');
const { logAudit, AUDIT_ACTIONS } = require('../utils/auditLogger');

const router = express.Router();

// Helper to format HashRecord response
const formatHashRecord = (record) => {
    const network = process.env.SOLANA_NETWORK || 'devnet';
    // Use timestamp from Solana if available, otherwise fallback to database createdAt
    const registeredAt = record.timestamp
        ? new Date(record.timestamp * 1000).toISOString()
        : (record.createdAt ? record.createdAt.toISOString() : new Date().toISOString());

    return {
        hash: record.hash,
        pdaAddress: record.pdaAddress,
        txSignature: record.txSignature || null,
        owner: record.ownerWallet || record.owner,
        organizationId: record.organizationId || null,
        metadata: record.metadata || "",
        registeredAt: registeredAt,
        expiry: record.expiry && record.expiry > 0 ? new Date(record.expiry * 1000).toISOString() : null,
        status: record.status || (record.isRevoked ? 'revoked' : 'active'),
        revokedAt: record.revokedAt ? record.revokedAt.toISOString() : null,
        explorerUrl: record.txSignature ? `https://explorer.solana.com/tx/${record.txSignature}?cluster=${network}` : null,
        pdaExplorerUrl: `https://explorer.solana.com/address/${record.pdaAddress}?cluster=${network}`
    };
};

const { parsePagination, buildPaginationResponse, applyPagination } = require('../utils/paginate');

/**
 * @route GET /api/hashes
 * @description List all hashes for the organization with pagination and filters.
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const { page, limit, sortBy, sortOrder } = parsePagination(
            req.query,
            ['registeredAt', 'timestamp', 'status'],
            'timestamp',
            10
        );

        const status = req.query.status;
        const search = req.query.search;

        const where = {
            organizationId: req.organization.id,
            AND: []
        };

        if (status === 'revoked') {
            where.AND.push({ OR: [{ status: 'revoked' }, { isRevoked: true }] });
        } else if (status === 'expired') {
            where.AND.push({
                expiry: { gt: 0, lt: Math.floor(Date.now() / 1000) },
                status: { not: 'revoked' }
            });
        } else if (status === 'active') {
            where.AND.push({ status: 'active', isRevoked: false });
            where.AND.push({
                OR: [
                    { expiry: 0 },
                    { expiry: { gt: Math.floor(Date.now() / 1000) } }
                ]
            });
        }

        if (search) {
            where.AND.push({
                OR: [
                    { hash: { startsWith: search, mode: 'insensitive' } },
                    { metadata: { contains: search, mode: 'insensitive' } }
                ]
            });
        }

        if (where.AND.length === 0) delete where.AND;

        const orderField = sortBy === 'registeredAt' ? 'timestamp' : sortBy;

        const [total, records] = await Promise.all([
            prisma.hashRecord.count({ where }),
            prisma.hashRecord.findMany(applyPagination({
                where,
                orderBy: { [orderField]: sortOrder }
            }, page, limit))
        ]);

        res.json(buildPaginationResponse(
            records.map(formatHashRecord),
            total,
            page,
            limit
        ));
    } catch (error) {
        next(error);
    }
});
/**
 * @route GET /api/hashes/export
 * @description Export all hashes as CSV or JSON
 */
router.get('/export', authenticate, requireRole('admin'), async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const format = req.query.format || 'csv'; // csv or json
        const network = process.env.SOLANA_NETWORK || 'devnet';

        const records = await prisma.hashRecord.findMany({
            where: { organizationId: req.organization.id },
            orderBy: { timestamp: 'desc' },
            take: 10000 // hard cap
        });

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="sipheron-hashes-${Date.now()}.json"`);
            return res.json(records.map(formatHashRecord));
        }

        // Build CSV
        const headers = ['Hash', 'Metadata', 'Status', 'Registered At', 'Expiry', 'Revoked At', 'TX Signature', 'Explorer URL', 'PDA Address'];
        const rows = records.map(r => [
            r.hash,
            `"${(r.metadata || '').replace(/"/g, '""')}"`,
            r.status || (r.isRevoked ? 'revoked' : 'active'),
            r.timestamp ? new Date(r.timestamp * 1000).toISOString() : r.createdAt.toISOString(),
            r.expiry > 0 ? new Date(r.expiry * 1000).toISOString() : 'Never',
            r.revokedAt ? r.revokedAt.toISOString() : '',
            r.txSignature || '',
            r.txSignature ? `https://explorer.solana.com/tx/${r.txSignature}?cluster=${network}` : '',
            r.pdaAddress || ''
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="sipheron-hashes-${Date.now()}.csv"`);
        res.send(csv);
    } catch (error) {
        next(error);
    }
});

/**
 * @route GET /api/hashes/public/:hash
 * @description Public hash verification — no authentication required
 */
router.get('/public/:hash', async (req, res, next) => {
    try {
        const { hash } = req.params;

        if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
            return res.status(400).json({ error: 'Invalid SHA-256 hash format' });
        }

        // Try DB first
        const record = await prisma.hashRecord.findUnique({
            where: { hash },
            include: { organization: { select: { name: true, id: true } } }
        });

        if (!record) {
            // Try Solana directly
            const solanaData = await solanaService.verifyHash(hash);
            if (solanaData.exists && solanaData.record) {
                return res.json({
                    verified: true,
                    record: formatHashRecord(solanaData.record),
                    organization: null
                });
            }
            return res.status(404).json({ verified: false, error: 'Hash not found in registry' });
        }

        const network = process.env.SOLANA_NETWORK || 'devnet';
        res.json({
            verified: true,
            record: {
                hash: record.hash,
                metadata: record.metadata || '',
                status: record.status || (record.isRevoked ? 'revoked' : 'active'),
                registeredAt: record.timestamp
                    ? new Date(record.timestamp * 1000).toISOString()
                    : record.createdAt.toISOString(),
                revokedAt: record.revokedAt ? record.revokedAt.toISOString() : null,
                expiry: record.expiry > 0 ? new Date(record.expiry * 1000).toISOString() : null,
                txSignature: record.txSignature,
                pdaAddress: record.pdaAddress,
                explorerUrl: `https://explorer.solana.com/tx/${record.txSignature}?cluster=${network}`,
                pdaExplorerUrl: `https://explorer.solana.com/address/${record.pdaAddress}?cluster=${network}`
            },
            organization: record.organization
                ? { name: record.organization.name, id: record.organization.id }
                : null
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route GET /api/hashes/pending
 * @description returns only PENDING hashes for org used by frontend polling to detect status changes
 */
router.get('/pending', authenticate, async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        if (!organizationId) return res.status(400).json({ error: 'No organization linked' });

        const pending = await prisma.hashRecord.findMany({
            where: {
                organizationId,
                status: 'PENDING'
            },
            select: {
                id: true,
                hash: true,
                status: true,
                metadata: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ pending, count: pending.length });
    } catch (err) {
        console.error('[HASHES] pending error:', err);
        res.status(500).json({ error: 'Failed to fetch pending hashes' });
    }
});

/**
 * @route POST /api/hashes
 * @description Anchor a single document hash (Internal Dashboard use)
 */
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { hash, metadata = "" } = req.body;
        const organizationId = req.organization?.id;

        if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
            return res.status(400).json({ error: 'Invalid SHA-256 hash format' });
        }

        if (!organizationId) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        // 1. Check for duplicates in this organization
        const existing = await prisma.hashRecord.findFirst({
            where: { hash, organizationId }
        });

        if (existing) {
            return res.status(409).json({ error: 'Hash already registered by your organization' });
        }

        // 2. Perform Solana transaction
        const { tx, owner, pdaAddress } = await solanaService.registerHash(hash, metadata, 0);

        // 3. Create PENDING record in DB so UI can show it immediately
        const record = await prisma.hashRecord.create({
            data: {
                hash,
                metadata,
                organizationId,
                status: 'PENDING',
                txSignature: tx,
                ownerWallet: owner,
                pdaAddress: pdaAddress,
                timestamp: Math.floor(Date.now() / 1000)
            }
        });

        await logAudit({
            organizationId,
            userId: req.user?.id,
            action: AUDIT_ACTIONS.HASH_ANCHORED,
            category: 'hash',
            metadata: { hash: hash.slice(0, 16) + '...', metadata },
            req
        });

        res.status(201).json({
            success: true,
            hash: record.hash,
            txSignature: tx
        });
    } catch (err) {
        console.error('[HASHES] anchor error:', err);
        if (err.message?.includes('already in use')) {
            return res.status(409).json({ error: 'Hash PDA already exists on-chain' });
        }
        res.status(500).json({ error: 'Failed to anchor hash to Solana' });
    }
});

/**
 * @route GET /api/hashes/badge/:hash
 * @description returns SVG verification badge (public, no auth)
 */
router.get('/badge/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        const record = await prisma.hashRecord.findUnique({
            where: { hash },
            select: { status: true, hash: true, isRevoked: true }
        });

        const verified = record && (record.status === 'CONFIRMED' || record.status === 'active') && !record.isRevoked;
        const color = verified ? '#22c55e' : (record && (record.status === 'revoked' || record.isRevoked) ? '#ef4444' : '#555555');
        const label = verified ? 'verified' : (record && (record.status === 'revoked' || record.isRevoked) ? 'revoked' : 'not found');
        const icon = verified ? '✓' : '✗';

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="180" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="110" height="20" fill="#2d2d2d"/>
    <rect x="110" width="70" height="20" fill="${color}"/>
    <rect width="180" height="20" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110">
    <text x="555" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="1000" lengthAdjust="spacing">SipHeron VDR</text>
    <text x="555" y="140" transform="scale(.1)" textLength="1000" lengthAdjust="spacing">SipHeron VDR</text>
    <text x="1445" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="600" lengthAdjust="spacing">${icon} ${label}</text>
    <text x="1445" y="140" transform="scale(.1)" textLength="600" lengthAdjust="spacing">${icon} ${label}</text>
  </g>
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5 min cache
        res.send(svg);
    } catch (err) {
        res.status(500).send('');
    }
});

/**
 * @route GET /api/hashes/:hash
 * @description Get detail for a specific hash.
 */
router.get('/:hash', authenticate, async (req, res, next) => {
    try {
        const { hash } = req.params;

        if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
            return res.status(400).json({ error: 'Invalid SHA-256 hash format' });
        }

        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        // 1. Try Prisma first
        let record = await prisma.hashRecord.findFirst({
            where: {
                hash,
                organizationId: req.organization.id
            }
        });

        // 2. If not in DB, try Solana directly
        if (!record) {
            const solanaData = await solanaService.verifyHash(hash);
            if (solanaData.exists && solanaData.record) {
                // Return solana record directly (formatted)
                return res.json(formatHashRecord(solanaData.record));
            }
            return res.status(404).json({ error: 'Hash not found in registry or unauthorized' });
        }

        res.json(formatHashRecord(record));
    } catch (error) {
        next(error);
    }
});

/**
 * @route POST /api/hashes/revoke
 * @description Revoke a document's proof on-chain and in the database.
 * @access Private (Institutional API Key required)
 */
router.post('/revoke', authenticate, requireRole('admin'), async (req, res, next) => {
    try {
        const { hash } = req.body;

        if (!hash) {
            return res.status(400).json({ error: 'Hash is required for revocation' });
        }

        if (!req.organization) {
            return res.status(403).json({ error: 'Unauthorized: No institutional context found' });
        }

        // 1. Look up hash record in Prisma
        const record = await prisma.hashRecord.findFirst({
            where: {
                hash,
                organizationId: req.organization.id
            }
        });

        if (!record) {
            return res.status(404).json({ error: 'Hash not found or unauthorized' });
        }

        if (record.status === 'revoked' || record.isRevoked) {
            return res.status(400).json({ error: 'Hash proof has already been revoked' });
        }

        // 2. Transact on Solana
        const { tx } = await solanaService.revokeHash(hash);

        // 3. Update local database
        await prisma.hashRecord.update({
            where: { id: record.id },
            data: {
                status: 'revoked',
                revokedAt: new Date(),
                isRevoked: true
            }
        });

        await logAudit({
            organizationId: req.organization.id,
            userId: req.user?.id,
            action: AUDIT_ACTIONS.HASH_REVOKED,
            category: 'hash',
            metadata: { hash: hash.slice(0, 16) + '...' },
            req
        });

        // 4. Trigger Webhook
        await webhookService.triggerWebhook(req.organization.id, 'hash_revoked', {
            hash,
            txSignature: tx,
            revokedAt: new Date().toISOString()
        });

        res.json({
            success: true,
            txSignature: tx,
            message: "Hash proof revoked successfully on Solana blockchain"
        });
    } catch (error) {
        console.error('[Registry] Revocation failed:', error.message);
        next(error);
    }
});


module.exports = router;
