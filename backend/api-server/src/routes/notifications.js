/**
 * @file notifications.js
 * @module backend/api-server/src/routes/notifications.js
 * @description Express API route handlers for notifications.
 */

const express = require('express');
const authenticate = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const { parsePagination, buildPaginationResponse, applyPagination } = require('../utils/paginate');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

/**
 * @route GET /api/notifications
 * @description Get all notifications for the organization.
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const { page, limit, sortBy, sortOrder } = parsePagination(
            req.query,
            ['createdAt'],
            'createdAt',
            20
        );

        const unreadOnly = req.query.unreadOnly === 'true';
        const isReadQuery = req.query.isRead;
        const type = req.query.type;

        const where = { organizationId: req.organization.id };
        if (unreadOnly) where.isRead = false;
        if (isReadQuery !== undefined) where.isRead = isReadQuery === 'true';
        if (type) where.type = type;

        const [total, notifications, unreadCount] = await Promise.all([
            prisma.notification.count({ where }),
            prisma.notification.findMany(applyPagination({
                where,
                orderBy: { [sortBy]: sortOrder }
            }, page, limit)),
            prisma.notification.count({ where: { organizationId: req.organization.id, isRead: false } })
        ]);

        const response = buildPaginationResponse(notifications, total, page, limit);
        response.unreadCount = unreadCount;

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * @route PUT /api/notifications/read
 * @description Mark notifications as read.
 */
router.put('/read', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const { ids, all } = req.body;

        if (all) {
            await notificationService.markAllAsRead(req.organization.id);
        } else if (Array.isArray(ids) && ids.length > 0) {
            await notificationService.markAsRead(req.organization.id, ids);
        } else {
            return res.status(400).json({ error: 'Notification IDs or "all" flag required' });
        }

        res.json({ success: true, message: 'Notifications marked as read' });
    } catch (error) {
        next(error);
    }
});

/**
 * @route DELETE /api/notifications/:id
 * @description Delete a single notification.
 */
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        await notificationService.deleteNotification(req.organization.id, req.params.id);
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
