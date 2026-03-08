/**
 * @file usage.js
 * @module backend/api-server/src/routes/usage.js
 * @description API usage analytics and logs for organizations.
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/usage
 * @description Get usage analytics for the organization.
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const orgId = req.organization.id;
        const period = req.query.period || '7d';
        const keyId = req.query.keyId;

        // Calculate start date
        let startDate = new Date();
        const days = parseInt(period) || 7;
        startDate.setDate(startDate.getDate() - days);

        const where = {
            orgId,
            createdAt: { gte: startDate }
        };

        if (keyId) where.apiKeyId = keyId;

        // 1. Fetch Summary Data
        const logs = await prisma.apiUsageLog.findMany({
            where,
            include: {
                apiKey: {
                    select: { name: true }
                }
            }
        });

        const totalRequests = logs.length;
        const successCount = logs.filter(l => l.statusCode >= 200 && l.statusCode < 300).length;
        const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 0;

        // 2. Aggregate by Endpoint
        const endpointStats = {};
        logs.forEach(log => {
            if (!endpointStats[log.endpoint]) {
                endpointStats[log.endpoint] = { count: 0, totalDuration: 0 };
            }
            endpointStats[log.endpoint].count++;
            endpointStats[log.endpoint].totalDuration += log.durationMs;
        });

        const byEndpoint = Object.keys(endpointStats).map(ep => ({
            endpoint: ep,
            count: endpointStats[ep].count,
            avgDurationMs: Math.round(endpointStats[ep].totalDuration / endpointStats[ep].count)
        })).sort((a, b) => b.count - a.count);

        // 3. Aggregate by Key
        const keyStats = {};
        logs.forEach(log => {
            const kid = log.apiKeyId;
            if (!keyStats[kid]) {
                keyStats[kid] = { keyId: kid, keyName: log.apiKey?.name || 'Unknown', count: 0 };
            }
            keyStats[kid].count++;
        });

        const byKey = Object.values(keyStats).sort((a, b) => b.count - a.count);

        // 4. Aggregate by Day
        const dayStats = {};
        logs.forEach(log => {
            const date = log.createdAt.toISOString().split('T')[0];
            dayStats[date] = (dayStats[date] || 0) + 1;
        });

        const byDay = Object.keys(dayStats).map(date => ({
            date,
            count: dayStats[date]
        })).sort((a, b) => b.date.localeCompare(a.date));

        res.json({
            period,
            totalRequests,
            successRate: parseFloat(successRate.toFixed(2)),
            byEndpoint,
            byKey,
            byDay
        });

    } catch (error) {
        next(error);
    }
});

const { parsePagination, buildPaginationResponse, applyPagination } = require('../utils/paginate');

/**
 * @route GET /api/usage/logs
 * @description Get raw paginated logs.
 */
router.get('/logs', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const { page, limit, sortBy, sortOrder } = parsePagination(
            req.query,
            ['createdAt'],
            'createdAt',
            50
        );

        const keyId = req.query.keyId;
        const endpoint = req.query.endpoint;
        const statusCode = req.query.statusCode ? parseInt(req.query.statusCode) : undefined;

        const where = { orgId: req.organization.id };
        if (keyId) where.apiKeyId = keyId;
        if (endpoint) where.endpoint = endpoint;
        if (statusCode) where.statusCode = statusCode;

        const [total, records] = await Promise.all([
            prisma.apiUsageLog.count({ where }),
            prisma.apiUsageLog.findMany(applyPagination({
                where,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    apiKey: {
                        select: { name: true }
                    }
                }
            }, page, limit))
        ]);

        res.json(buildPaginationResponse(
            records.map(r => ({
                ...r,
                keyName: r.apiKey?.name
            })),
            total,
            page,
            limit
        ));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
