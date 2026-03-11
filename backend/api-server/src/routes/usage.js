/**
 * @file usage.js
 * @module backend/api-server/src/routes/usage.js
 * @description API usage analytics and logs for organizations.
 */

const express = require('express');
const authenticate = require('../middleware/auth');

const router = express.Router();
const prisma = require('../config/database');

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

        // 1. Fetch Summary Data - group by day and success status for chart
        const logs = await prisma.apiUsageLog.findMany({
            where,
            include: {
                apiKey: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        const totalRequests = logs.length;
        const successCount = logs.filter(l => l.statusCode >= 200 && l.statusCode < 300).length;
        const totalDuration = logs.reduce((sum, l) => sum + l.durationMs, 0);
        const successRate = totalRequests > 0 ? (successCount / totalRequests * 100).toFixed(1) + "%" : "0%";
        const avgResponseTime = totalRequests > 0 ? Math.round(totalDuration / totalRequests) : 0;

        // 2. Aggregate by Endpoint
        const endpointStats = {};
        logs.forEach(log => {
            if (!endpointStats[log.endpoint]) {
                endpointStats[log.endpoint] = { endpoint: log.endpoint, method: log.method, total: 0, totalDuration: 0, successCount: 0 };
            }
            endpointStats[log.endpoint].total++;
            endpointStats[log.endpoint].totalDuration += log.durationMs;
            if (log.statusCode >= 200 && log.statusCode < 300) endpointStats[log.endpoint].successCount++;
        });

        const endpoints = Object.values(endpointStats).map(ep => ({
            ...ep,
            avgDuration: Math.round(ep.totalDuration / ep.total),
            successRate: (ep.successCount / ep.total * 100).toFixed(1) + "%"
        })).sort((a, b) => b.total - a.total);

        const mostUsedEndpoint = endpoints.length > 0 ? endpoints[0].endpoint : 'N/A';

        // 3. Aggregate by Key
        const keyStats = {};
        logs.forEach(log => {
            const kid = log.apiKeyId;
            if (!keyStats[kid]) {
                keyStats[kid] = { id: kid, name: log.apiKey?.name || 'Unknown', total: 0, successCount: 0, lastUsed: log.createdAt };
            }
            keyStats[kid].total++;
            if (log.statusCode >= 200 && log.statusCode < 300) keyStats[kid].successCount++;
            if (new Date(log.createdAt) > new Date(keyStats[kid].lastUsed)) keyStats[kid].lastUsed = log.createdAt;
        });

        const apiKeys = Object.values(keyStats).map(k => ({
            ...k,
            successRate: (k.successCount / k.total * 100).toFixed(1) + "%"
        })).sort((a, b) => b.total - a.total);

        // 4. Aggregate by Day for Chart (Success/Error breakdown)
        const dayStats = {};
        logs.forEach(log => {
            const date = log.createdAt.toISOString().split('T')[0];
            if (!dayStats[date]) {
                dayStats[date] = { date, success: 0, error: 0 };
            }
            if (log.statusCode >= 200 && log.statusCode < 300) {
                dayStats[date].success++;
            } else {
                dayStats[date].error++;
            }
        });

        const chartData = Object.values(dayStats).sort((a, b) => a.date.localeCompare(b.date));

        // Calculate specific summary metrics for main dashboard
        const today = new Date().toISOString().split('T')[0];
        const requestsToday = dayStats[today] ? (dayStats[today].success + dayStats[today].error) : 0;

        // Sum last 7 days for requestsThisWeek
        const requestsThisWeek = chartData.slice(-7).reduce((sum, d) => sum + d.success + d.error, 0);

        res.json({
            period,
            summary: {
                totalRequests,
                successRate,
                avgResponseTime,
                mostUsedEndpoint,
                requestsToday,
                requestsThisWeek
            },
            endpoints,
            apiKeys,
            chartData,
            analytics: chartData.map(d => ({ date: d.date, count: d.success + d.error }))
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
                keyName: r.apiKey?.name,
                timestamp: r.createdAt
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
