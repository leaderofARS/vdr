/**
 * @file webhookService.js
 * @description Service for managing and triggering webhooks for organizational events.
 */

const axios = require('axios');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Register a new webhook for an organization.
 */
async function registerWebhook(organizationId, { url, events, secret }) {
    // Validates URL (must be https)
    if (!url || !url.startsWith('https://')) {
        throw new Error('Webhook URL must use HTTPS');
    }

    // Validates events list
    const validEvents = ["anchor_success", "anchor_failed", "hash_revoked"];
    if (!events || !Array.isArray(events) || events.length === 0 || !events.every(e => validEvents.includes(e))) {
        throw new Error('Invalid events specified. Allowed: anchor_success, anchor_failed, hash_revoked');
    }

    if (!secret || secret.length < 16) {
        throw new Error('Secret must be at least 16 characters for security');
    }

    return await prisma.webhook.create({
        data: {
            organizationId,
            url,
            events,
            secret,
            isActive: true
        }
    });
}

/**
 * Trigger webhooks for a specific event and organization.
 */
async function triggerWebhook(organizationId, event, payload, isTest = false) {
    try {
        const where = { organizationId };
        if (!isTest) {
            where.isActive = true;
            where.events = { has: event };
        }

        const webhooks = await prisma.webhook.findMany({ where });

        for (const webhook of webhooks) {
            const timestamp = Math.floor(Date.now() / 1000);
            const webhookPayload = JSON.stringify({
                event,
                timestamp,
                organizationId,
                data: payload
            });

            const signature = crypto
                .createHmac('sha256', webhook.secret)
                .update(webhookPayload)
                .digest('hex');

            // Exponential backoff strategy: 1s, 5s, 25s
            const backoffs = [1000, 5000, 25000];

            const send = async (retryCount = 0) => {
                const startTime = Date.now();
                try {
                    const response = await axios.post(webhook.url, webhookPayload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-SipHeron-Event': event,
                            'X-SipHeron-Signature': `sha256=${signature}`,
                            'X-SipHeron-Timestamp': timestamp.toString()
                        },
                        timeout: 10000 // 10s timeout
                    });

                    // Log success and reset failure count
                    await Promise.all([
                        prisma.webhookLog.create({
                            data: {
                                webhookId: webhook.id,
                                event,
                                payload: JSON.parse(webhookPayload),
                                statusCode: response.status,
                                duration: Date.now() - startTime
                            }
                        }),
                        prisma.webhook.update({
                            where: { id: webhook.id },
                            data: { failureCount: 0, lastTriggeredAt: new Date() }
                        })
                    ]);

                } catch (error) {
                    const duration = Date.now() - startTime;
                    const statusCode = error.response ? error.response.status : null;
                    const errorMsg = error.message;

                    // Log attempt
                    await prisma.webhookLog.create({
                        data: {
                            webhookId: webhook.id,
                            event,
                            payload: JSON.parse(webhookPayload),
                            statusCode,
                            error: errorMsg,
                            duration
                        }
                    });

                    if (retryCount < backoffs.length) {
                        setTimeout(() => send(retryCount + 1), backoffs[retryCount]);
                    } else if (!isTest) {
                        // Max retries reached, increment failure count
                        const updated = await prisma.webhook.update({
                            where: { id: webhook.id },
                            data: { failureCount: { increment: 1 } }
                        });

                        if (updated.failureCount >= 3) {
                            await prisma.webhook.update({
                                where: { id: webhook.id },
                                data: { isActive: false }
                            });

                            // Notify organization
                            const notificationService = require('./notificationService');
                            await notificationService.createNotification(
                                organizationId,
                                'webhook_disabled',
                                'Webhook Disabled',
                                `Webhook to ${webhook.url} has been disabled after 3 consecutive failed deliveries.`,
                                { url: webhook.url }
                            ).catch(console.error);
                        }
                    }
                }
            };

            send(); // Fire and forget (async background process)
        }
    } catch (error) {
        console.error('[WebhookService] Trigger error:', error.message);
    }
}

async function listWebhooks(organizationId) {
    return await prisma.webhook.findMany({
        where: { organizationId },
        include: {
            _count: {
                select: { logs: true }
            }
        }
    });
}

async function deleteWebhook(organizationId, webhookId) {
    return await prisma.webhook.deleteMany({
        where: { id: webhookId, organizationId }
    });
}

async function testWebhook(organizationId, webhookId) {
    const webhook = await prisma.webhook.findFirst({
        where: { id: webhookId, organizationId }
    });

    if (!webhook) throw new Error('Webhook not found');

    const testPayload = {
        test: true,
        message: 'Hello! This is a test webhook from SipHeron VDR. Your secret was used to sign this request.'
    };

    return await triggerWebhook(organizationId, 'test_event', testPayload, true);
}

async function getLogs(organizationId, webhookId) {
    const webhook = await prisma.webhook.findFirst({
        where: { id: webhookId, organizationId }
    });

    if (!webhook) throw new Error('Webhook not found');

    return await prisma.webhookLog.findMany({
        where: { webhookId },
        orderBy: { createdAt: 'desc' },
        take: 20
    });
}

module.exports = {
    registerWebhook,
    triggerWebhook,
    listWebhooks,
    deleteWebhook,
    testWebhook,
    getLogs
};
