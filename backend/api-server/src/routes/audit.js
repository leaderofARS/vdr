const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const authenticate = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// GET /api/audit — list audit logs for org with filtering + pagination
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        const userRole = req.user?.orgRole;
        
        console.log('[AUDIT] Fetch request:', { orgId: organizationId, userRole, userId: req.user?.id });
        
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

        const RETENTION_DAYS = {
          free:       30,
          business:   365,
          enterprise: 365 * 7, // 2555 days
        }

        const plan = req.organization?.plan || 'free'
        const retentionDays = RETENTION_DAYS[plan] || 30
        const retentionCutoff = new Date(
          Date.now() - retentionDays * 24 * 60 * 60 * 1000
        )

        const where = { organizationId };
        if (category) where.category = category;
        if (action) where.action = action;
        if (userId) where.userId = userId;
        

        where.createdAt = {
          gte: from
            ? new Date(Math.max(new Date(from).getTime(),
                                retentionCutoff.getTime()))
            : retentionCutoff,
          ...(to && { lte: new Date(to) }),
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

        console.log('[AUDIT] Fetch response:', { total, logsCount: enrichedLogs.length });
        
        res.json({
            logs: enrichedLogs,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            retention: {
              plan,
              retentionDays,
              retentionCutoff: retentionCutoff.toISOString(),
              upgradeUrl: 'https://app.sipheron.com/dashboard/billing',
            }
        });
    } catch (err) {
        console.error('[AUDIT] fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch audit logs', details: err.message });
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

// GET /api/audit/export — export full audit log as CSV or JSON
router.get('/export', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const organizationId = req.organization?.id
    const { format = 'csv', from, to, category, action } = req.query

    const plan = req.organization?.plan || 'free'
    const retentionDays = { free: 30, business: 365, enterprise: 2555 }[plan] || 30
    const retentionCutoff = new Date(
      Date.now() - retentionDays * 24 * 60 * 60 * 1000
    )

    const where = {
      organizationId,
      createdAt: {
        gte: from
          ? new Date(Math.max(new Date(from).getTime(),
                              retentionCutoff.getTime()))
          : retentionCutoff,
        ...(to && { lte: new Date(to) }),
      },
      ...(category && { category }),
      ...(action && { action }),
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10000, // max 10k records per export
    })

    // Enrich with user emails
    const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))]
    const users = userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, name: true }
        })
      : []
    const userMap = Object.fromEntries(users.map(u => [u.id, u]))

    const enriched = logs.map(log => ({
      id: log.id,
      action: log.action,
      category: log.category,
      user_email: log.userId ? (userMap[log.userId]?.email || log.userId) : 'system',
      user_name: log.userId ? (userMap[log.userId]?.name || '') : '',
      ip_address: log.ipAddress || '',
      metadata: JSON.stringify(log.metadata || {}),
      created_at: log.createdAt.toISOString(),
    }))

    // Log the export itself
    const { logAudit, AUDIT_ACTIONS } = require('../utils/auditLogger')
    
    logAudit({
      organizationId,
      userId: req.user?.id,
      action: AUDIT_ACTIONS.BULK_EXPORT,
      category: 'org',
      metadata: { format, recordCount: enriched.length, filters: { from, to, category, action } },
      req,
    }).catch(console.error)

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="sipheron-audit-${Date.now()}.json"`
      )
      return res.json({ audit_log: enriched, exported_at: new Date().toISOString(), total: enriched.length })
    }

    // Default: CSV
    const headers = [
      'id', 'action', 'category', 'user_email', 'user_name',
      'ip_address', 'metadata', 'created_at'
    ]
    const csvRows = [
      headers.join(','),
      ...enriched.map(row =>
        headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',')
      )
    ]

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sipheron-audit-${Date.now()}.csv"`
    )
    res.send(csvRows.join('\n'))
  } catch (err) {
    console.error('[AUDIT] export error:', err)
    res.status(500).json({ error: 'Export failed' })
  }
})

module.exports = router;
