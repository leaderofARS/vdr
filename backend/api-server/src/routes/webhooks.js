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
    secret: z.string().min(16).max(128)
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

        const webhooks = await webhookService.listWebhooks(req.organization.id);
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

        const { url, events, secret } = req.body;
        const webhook = await webhookService.registerWebhook(req.organization.id, { url, events, secret });

        res.status(201).json({ success: true, webhook });
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

module.exports = router;
