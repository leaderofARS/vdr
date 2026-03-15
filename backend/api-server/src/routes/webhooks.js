/**
 * @file webhooks.js
 * @module backend/api-server/src/routes/webhooks.js
 * @description Express API route handlers for webhook management.
 */

const express = require('express');
const authenticate = require('../middleware/auth');
const webhookService = require('../services/webhookService');
const { z } = require('zod');
const { validateInput } = require('../middleware/security');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();

const webhookSchema = z.object({
    url: z.string().url().regex(/^https:\/\//, "Webhook URL must be HTTPS"),
    events: z.array(z.enum(["anchor_success", "anchor_failed", "hash_revoked"])).min(1),
    secret: z.string().min(16).max(128).optional()
});

/**
 * @route GET /api/webhooks
 * @description List all webhooks for the organization.
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const constPrisma = require('../config/database');
        const webhooks = await constPrisma.webhook.findMany({
          where: { organizationId: req.organization.id },
          select: {
            id: true,
            url: true,
            events: true,
            active: true,
            failureCount: true,
            lastTriggeredAt: true,
            createdAt: true,
            // secret: false — never return
          }
        });
        res.json({ webhooks });
    } catch (error) {
        next(error);
    }
});

/**
 * @route POST /api/webhooks
 * @description Register a new webhook.
 */
router.post('/', authenticate, requireRole('admin'), validateInput(webhookSchema), async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        let { url, events, secret } = req.body;
        const crypto = require('crypto');
        const webhookSecret = secret || crypto.randomBytes(32).toString('hex');
                        
        const webhook = await webhookService.registerWebhook(req.organization.id, { url, events, secret: webhookSecret });

        res.status(201).json({ 
            success: true, 
            webhook: {
                id: webhook.id,
                url: webhook.url,
                events: webhook.events,
                active: webhook.active,
                createdAt: webhook.createdAt,
            },
            secret: webhookSecret,
            warning: 'Store this secret securely. It is used to verify webhook signatures and will never be shown again.',
        });
    } catch (error) {
        if (error.message.includes('Webhook URL') || error.message.includes('Invalid events') || error.message.includes('Secret must be')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
});

/**
 * @route DELETE /api/webhooks/:id
 * @description Delete a single webhook.
 */
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const deleted = await webhookService.deleteWebhook(req.organization.id, req.params.id);
        res.json({ success: true, count: deleted.count });
    } catch (error) {
        next(error);
    }
});

/**
 * @route GET /api/webhooks/:id
 * @description Get single webhook
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const constPrisma = require('../config/database');
    const organizationId = req.organization?.id
    const webhook = await constPrisma.webhook.findFirst({
      where: { id: req.params.id, organizationId }
    })
    if (!webhook) return res.status(404).json({ error: 'Webhook not found' })
    res.json({ webhook })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch webhook' })
  }
})

/**
 * @route PATCH /api/webhooks/:id
 * @description Update webhook
 */
router.patch('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const constPrisma = require('../config/database');
    const organizationId = req.organization?.id
    const { url, events, active } = req.body

    const existing = await constPrisma.webhook.findFirst({
      where: { id: req.params.id, organizationId }
    })
    if (!existing) return res.status(404).json({ error: 'Webhook not found' })

    const updated = await constPrisma.webhook.update({
      where: { id: req.params.id },
      data: {
        ...(url && { url }),
        ...(events && { events }),
        ...(typeof active === 'boolean' && { active }),
        updatedAt: new Date(),
      }
    })
    res.json({ webhook: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update webhook' })
  }
})

/**
 * @route POST /api/webhooks/:id/test
 * @description Send a test payload to the webhook.
 */
router.post('/:id/test', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        await webhookService.testWebhook(req.organization.id, req.params.id);
        res.json({ success: true, message: 'Test delivery initiated in background' });
    } catch (error) {
        if (error.message === 'Webhook not found') return res.status(404).json({ error: error.message });
        next(error);
    }
});

/**
 * @route GET /api/webhooks/:id/logs
 * @description Get last 20 delivery attempts for a webhook.
 */
router.get('/:id/logs', authenticate, async (req, res, next) => {
    try {
        if (!req.organization) {
            return res.status(403).json({ error: 'Institutional Context Required' });
        }

        const logs = await webhookService.getLogs(req.organization.id, req.params.id);
        res.json({ logs });
    } catch (error) {
        if (error.message === 'Webhook not found') return res.status(404).json({ error: error.message });
        next(error);
    }
});

// GET /api/webhooks/:id/deliveries — delivery history for a webhook
router.get('/:id/deliveries', authenticate, async (req, res) => {
  try {
    const constPrisma = require('../config/database');
    const organizationId = req.organization?.id
    const webhook = await constPrisma.webhook.findFirst({
      where: { id: req.params.id, organizationId }
    })
    if (!webhook) return res.status(404).json({ error: 'Webhook not found' })

    const deliveries = await constPrisma.webhookDelivery.findMany({
      where: { webhookId: req.params.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        eventType: true,
        eventId: true,
        status: true,
        httpStatus: true,
        responseBody: true,
        attemptCount: true,
        nextRetryAt: true,
        deliveredAt: true,
        failedAt: true,
        createdAt: true,
      }
    })

    res.json({
      webhookId: req.params.id,
      deliveries,
      total: deliveries.length,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' })
  }
})

// POST /api/webhooks/:id/enable — re-enable a disabled webhook
router.post('/:id/enable', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const constPrisma = require('../config/database');
    const organizationId = req.organization?.id
    const webhook = await constPrisma.webhook.findFirst({
      where: { id: req.params.id, organizationId }
    })
    if (!webhook) return res.status(404).json({ error: 'Webhook not found' })

    const updated = await constPrisma.webhook.update({
      where: { id: req.params.id },
      data: {
        active: true,
        disabledAt: null,
        failureCount: 0,
      }
    })
    res.json({ webhook: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to enable webhook' })
  }
})

module.exports = router;
