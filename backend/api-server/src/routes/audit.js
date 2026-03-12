const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const authenticate = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// GET /api/audit — list audit logs for org with filtering + pagination
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        if (!organizationId) return res.status(400).json({ error: 'No organization linked' });

        const {
            page = 1,
            limit = 50,
            category,
            action,
            userId,
            from,
            to
        } = req.query;

        const where = { organizationId };
        if (category) where.category = category;
        if (action) where.action = action;
        if (userId) where.userId = userId;
        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt.gte = new Date(from);
            if (to) where.createdAt.lte = new Date(to);
        }

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit)
            }),
            prisma.auditLog.count({ where })
        ]);

        // Enrich with user emails
        const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))];
        const users = userIds.length > 0 ? await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, email: true, name: true }
        }) : [];
        const userMap = Object.fromEntries(users.map(u => [u.id, u]));

        const enrichedLogs = logs.map(log => ({
            ...log,
            user: log.userId ? userMap[log.userId] || null : null
        }));

        res.json({
            logs: enrichedLogs,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (err) {
        console.error('[AUDIT] fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});

// GET /api/audit/stats — summary stats for the org
router.get('/stats', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const organizationId = req.organization?.id;

        const [total, last24h, byCategory] = await Promise.all([
            prisma.auditLog.count({ where: { organizationId } }),
            prisma.auditLog.count({
                where: {
                    organizationId,
                    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                }
            }),
            prisma.auditLog.groupBy({
                by: ['category'],
                where: { organizationId },
                _count: { id: true }
            })
        ]);

        res.json({ total, last24h, byCategory });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch audit stats' });
    }
});

module.exports = router;
