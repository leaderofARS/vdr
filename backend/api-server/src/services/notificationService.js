/**
 * @file notificationService.js
 * @description Service for managing organizational notifications.
 */

const prisma = require('../config/database');

/**
 * Create a new notification for an organization.
 */
async function createNotification(organizationId, type, title, message, metadata = {}) {
    try {
        const notification = await prisma.notification.create({
            data: {
                organizationId,
                type,
                title,
                message,
                metadata
            }
        });
        return notification;
    } catch (error) {
        console.error('[NotificationService] Failed to create notification:', error.message);
        throw error;
    }
}

/**
 * Get notifications for an organization.
 */
async function getNotifications(organizationId, { limit = 20, unreadOnly = false } = {}) {
    try {
        const where = { organizationId };
        if (unreadOnly) {
            where.isRead = false;
        }

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return notifications;
    } catch (error) {
        console.error('[NotificationService] Failed to fetch notifications:', error.message);
        throw error;
    }
}

/**
 * Mark specific notifications as read.
 */
async function markAsRead(organizationId, notificationIds) {
    try {
        await prisma.notification.updateMany({
            where: {
                id: { in: notificationIds },
                organizationId
            },
            data: { isRead: true }
        });
    } catch (error) {
        console.error('[NotificationService] Failed to mark notifications as read:', error.message);
        throw error;
    }
}

/**
 * Mark all notifications as read for an organization.
 */
async function markAllAsRead(organizationId) {
    try {
        await prisma.notification.updateMany({
            where: { organizationId, isRead: false },
            data: { isRead: true }
        });
    } catch (error) {
        console.error('[NotificationService] Failed to mark all as read:', error.message);
        throw error;
    }
}

/**
 * Get count of unread notifications.
 */
async function getUnreadCount(organizationId) {
    try {
        return await prisma.notification.count({
            where: { organizationId, isRead: false }
        });
    } catch (error) {
        console.error('[NotificationService] Failed to get unread count:', error.message);
        throw error;
    }
}

/**
 * Delete a single notification.
 */
async function deleteNotification(organizationId, id) {
    try {
        await prisma.notification.delete({
            where: { id, organizationId }
        });
    } catch (error) {
        console.error('[NotificationService] Failed to delete notification:', error.message);
        throw error;
    }
}

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    deleteNotification
};
