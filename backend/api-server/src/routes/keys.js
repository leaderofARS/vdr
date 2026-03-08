/**
 * @file keys.js
 * @module backend/api-server/src/routes/keys.js
 * @description API route handlers for API key management and listing.
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middleware/auth');
const { parsePagination, buildPaginationResponse, applyPagination } = require('../utils/paginate');

const router = express.Router();
const prisma = new PrismaClient();

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
                    // key is NOT returned in list for security
                }
            }, page, limit))
        ]);

        res.json(buildPaginationResponse(keys, total, page, limit));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
