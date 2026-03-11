/**
 * @file keys.js
 * @module backend/api-server/src/routes/keys.js
 * @description API route handlers for API key management and listing.
 */

const express = require('express');
const prisma = require('../config/database');
const authenticate = require('../middleware/auth');
const notificationService = require('../services/notificationService');
const { parsePagination, buildPaginationResponse, applyPagination } = require('../utils/paginate');
const crypto = require('crypto');
const { z } = require('zod');
const { validateInput } = require('../middleware/security');

const router = express.Router();

const createKeySchema = z.object({
    name: z.string().max(50).regex(/^[a-zA-Z0-9 ]+$/),
    scope: z.enum(['read', 'write', 'admin']).optional().default('write')
});

/**
 * @route GET /api/keys
 * @description List all API keys for the organization with pagination and filters.
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const { page, limit, sortBy, sortOrder } = parsePagination(
            req.query,
            ['createdAt', 'name'],
            'createdAt',
            20
        );

        const status = req.query.status; // active or revoked

        const where = { organizationId: req.organization.id };
        if (status) where.status = status;

        const [total, keys] = await Promise.all([
            prisma.apiKey.count({ where }),
            prisma.apiKey.findMany(applyPagination({
                where,
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    lastUsedAt: true,
                    scope: true,
                    // key is NOT returned in list for security
                }
            }, page, limit))
        ]);

        res.json(buildPaginationResponse(keys, total, page, limit));
    } catch (error) {
        next(error);
    }
});

/**
 * @route DELETE /api/keys/:id
 * @description Revoke (deactivate) an API key. 
 */
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const { id } = req.params;

        // Ensure key belongs to this org
        const key = await prisma.apiKey.findFirst({
            where: {
                id,
                organizationId: req.organization.id
            }
        });

        if (!key) {
            return res.status(404).json({ error: 'API Key not found in this organization' });
        }

        // Just mark as revoked instead of hard deleting for audit trail
        await prisma.apiKey.update({
            where: { id },
            data: { status: 'revoked' }
        });

        res.json({ success: true, message: 'API Key revoked successfully' });
    } catch (error) {
        next(error);
    }
});

/**
 * @route POST /api/keys
 * @description Create a new API key for the organization.
 */
router.post('/', authenticate, validateInput(createKeySchema), async (req, res, next) => {
    try {
        const { name, scope } = req.body;
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const resolvedScope = scope || 'write';
        const rawKey = 'svdr_' + crypto.randomBytes(32).toString('hex');
        const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

        const apiKey = await prisma.apiKey.create({
            data: {
                name,
                key: hashedKey,
                scope: resolvedScope,
                userId: req.user.id,
                organizationId: req.organization.id
            }
        });

        // Send API Key Creation Notification (Non-blocking)
        const { sendApiKeyCreatedEmail } = require('../services/emailService');
        sendApiKeyCreatedEmail(req.user.email, name).catch(console.error);

        notificationService.createNotification(
            req.organization.id,
            'key_created',
            'API key created',
            `New API key "${name}" was created`,
            { keyName: name }
        ).catch(err => console.error('[Keys] Notification failed:', err.message));

        res.status(201).json({
            success: true,
            apiKey: rawKey,
            id: apiKey.id,
            message: 'Store this API key securely. It will not be shown again.'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
