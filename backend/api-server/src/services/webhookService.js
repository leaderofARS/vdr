/**
 * @file webhookService.js
 * @description Service for managing and triggering webhooks for organizational events.
 */

const axios = require('axios');
const crypto = require('crypto');
const prisma = require('../config/database');

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
 * Alias for fireWebhookEvent for backward compatibility.
 */
async function triggerWebhook(organizationId, event, payload, isTest = false) {
    if (!isTest) {
        return await fireWebhookEvent(organizationId, event, payload);
    }
    
    // Test event specific path
    const webhook = await prisma.webhook.findFirst({
        where: { organizationId }
    });
    if (!webhook) return;

    const eventId = `test_${crypto.randomBytes(16).toString('hex')}`;
    const timestamp = new Date().toISOString();
    
    const deliveryPayload = {
        id: eventId,
        event: event,
        created: timestamp,
        data: payload
    };

    const delivery = await prisma.webhookDelivery.create({
        data: {
          webhookId: webhook.id,
          organizationId,
          eventType: event,
          eventId,
          payload: deliveryPayload,
          status: 'pending',
          attemptCount: 0,
          nextRetryAt: new Date(),
        }
    });

    attemptDelivery(delivery.id, webhook, deliveryPayload).catch(err => {
        console.error(`[WEBHOOK] test delivery error:`, err.message);
    });
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

// ── Retry schedule (milliseconds) ──
// Matches Stripe's retry pattern for familiarity
const RETRY_DELAYS = [
  5 * 1000,          // 5 seconds
  30 * 1000,         // 30 seconds
  5 * 60 * 1000,     // 5 minutes
  30 * 60 * 1000,    // 30 minutes
  2 * 60 * 60 * 1000, // 2 hours
  24 * 60 * 60 * 1000, // 24 hours
]

const MAX_ATTEMPTS = RETRY_DELAYS.length + 1 // 7 total attempts

/**
 * Fire a webhook event to all registered endpoints for an organization
 *
 * @param {string} organizationId
 * @param {string} eventType - e.g. 'anchor.confirmed'
 * @param {object} data - event payload data
 */
async function fireWebhookEvent(organizationId, eventType, data) {
  try {
    // Find all active webhooks for this org that subscribe to this event
    const webhooks = await prisma.webhook.findMany({
      where: {
        organizationId,
        active: true,
        disabledAt: null,
        events: { has: eventType }, // Prisma array contains check
      },
      select: {
        id: true,
        url: true,
        secret: true,
        events: true,
      }
    })

    if (webhooks.length === 0) return

    const eventId = `evt_${crypto.randomBytes(16).toString('hex')}`
    const timestamp = new Date().toISOString()

    const payload = {
      id: eventId,
      event: eventType,
      created: timestamp,
      data,
    }

    // Create delivery records for all matching webhooks
    // then attempt delivery for each
    for (const webhook of webhooks) {
      const delivery = await prisma.webhookDelivery.create({
        data: {
          webhookId: webhook.id,
          organizationId,
          eventType,
          eventId,
          payload,
          status: 'pending',
          attemptCount: 0,
          nextRetryAt: new Date(),
        }
      })

      // Attempt delivery immediately (async — does not block the request)
      attemptDelivery(delivery.id, webhook, payload).catch(err => {
        console.error(`[WEBHOOK] delivery error for ${delivery.id}:`, err.message)
      })
    }
  } catch (err) {
    // Never throw — webhook failures must not break the main request flow
    console.error('[WEBHOOK] fireWebhookEvent error:', err.message)
  }
}

/**
 * Attempt to deliver a webhook to a customer endpoint
 * Handles retry scheduling on failure
 */
async function attemptDelivery(deliveryId, webhook, payload) {
  let delivery
  try {
    delivery = await prisma.webhookDelivery.findUnique({
      where: { id: deliveryId }
    })
    if (!delivery) return
    if (delivery.status === 'delivered') return

    const attemptNumber = delivery.attemptCount + 1
    const payloadString = JSON.stringify(payload)

    // Generate HMAC-SHA256 signature
    const signature = webhook.secret
      ? crypto
          .createHmac('sha256', webhook.secret)
          .update(payloadString)
          .digest('hex')
      : null

    // Attempt HTTP delivery with 10s timeout
    let httpStatus = null
    let responseBody = null
    let deliveryError = null

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SipHeron-VDR/1.0',
          'X-SipHeron-Event': payload.event,
          'X-SipHeron-Delivery': deliveryId,
          'X-SipHeron-Timestamp': payload.created,
          ...(signature && { 'X-SipHeron-Signature': `sha256=${signature}` }),
        },
        body: payloadString,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      httpStatus = response.status
      const rawBody = await response.text()
      responseBody = rawBody.slice(0, 1000) // truncate to 1000 chars

      if (response.ok) {
        // SUCCESS
        await prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: {
            status: 'delivered',
            httpStatus,
            responseBody,
            attemptCount: attemptNumber,
            deliveredAt: new Date(),
            nextRetryAt: null,
          }
        })

        // Reset failure count on success
        await prisma.webhook.update({
          where: { id: webhook.id },
          data: {
            failureCount: 0,
            lastTriggeredAt: new Date(),
          }
        })

        console.log(`[WEBHOOK] ✓ Delivered ${payload.event} to ${webhook.url} (attempt ${attemptNumber})`)
        return
      }

      // Non-2xx response — treat as failure
      deliveryError = `HTTP ${httpStatus}`
    } catch (fetchErr) {
      deliveryError = fetchErr.message
      responseBody = fetchErr.message.slice(0, 1000)
    }

    // FAILURE — schedule retry or mark permanently failed
    const retryDelayIndex = attemptNumber - 1
    const hasMoreRetries = retryDelayIndex < RETRY_DELAYS.length

    if (hasMoreRetries) {
      const nextRetryAt = new Date(Date.now() + RETRY_DELAYS[retryDelayIndex])

      await prisma.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
          status: 'retrying',
          httpStatus,
          responseBody,
          attemptCount: attemptNumber,
          nextRetryAt,
        }
      })

      // Increment failure count
      await prisma.webhook.update({
        where: { id: webhook.id },
        data: { failureCount: { increment: 1 } }
      })

      console.warn(
        `[WEBHOOK] ✗ Attempt ${attemptNumber} failed for ${webhook.url}: ${deliveryError}. ` +
        `Retry in ${RETRY_DELAYS[retryDelayIndex] / 1000}s`
      )

      // Schedule next retry
      setTimeout(async () => {
        const freshWebhook = await prisma.webhook.findUnique({
          where: { id: webhook.id },
          select: { id: true, url: true, secret: true, active: true, disabledAt: true }
        })
        if (!freshWebhook || !freshWebhook.active || freshWebhook.disabledAt) return
        await attemptDelivery(deliveryId, freshWebhook, payload)
      }, RETRY_DELAYS[retryDelayIndex])
    } else {
      // PERMANENTLY FAILED — all retries exhausted
      await prisma.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
          status: 'failed',
          httpStatus,
          responseBody,
          attemptCount: attemptNumber,
          nextRetryAt: null,
          failedAt: new Date(),
        }
      })

      // Disable the webhook after too many consecutive failures
      await prisma.webhook.update({
        where: { id: webhook.id },
        data: {
          failureCount: { increment: 1 },
          active: false,
          disabledAt: new Date(),
        }
      })

      console.error(
        `[WEBHOOK] ✗✗ Permanently failed after ${attemptNumber} attempts for ${webhook.url}`
      )

      // Send failure alert to org owner
      notifyWebhookFailure(delivery.organizationId, webhook.url, payload.event)
        .catch(console.error)
    }
  } catch (err) {
    console.error(`[WEBHOOK] attemptDelivery error for ${deliveryId}:`, err.message)
  }
}

/**
 * Send email alert when webhook is permanently disabled
 */
async function notifyWebhookFailure(organizationId, webhookUrl, eventType) {
  try {
    const { sendEmail } = require('./emailService')

    const owner = await prisma.orgMember.findFirst({
      where: { organizationId, role: 'owner' },
      include: { user: { select: { email: true, name: true } } }
    })
    if (!owner?.user?.email) return

    await sendEmail({
      to: owner.user.email,
      subject: 'SipHeron VDR — Webhook endpoint disabled after repeated failures',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#FF4757">Webhook Disabled</h2>
          <p>Hi ${owner.user.name || 'there'},</p>
          <p>Your webhook endpoint has been automatically disabled after
             <strong>${MAX_ATTEMPTS} consecutive delivery failures</strong>.</p>
          <p><strong>Endpoint:</strong> <code>${webhookUrl}</code><br/>
             <strong>Last event:</strong> ${eventType}</p>
          <p>Please check that your endpoint:</p>
          <ul>
            <li>Is publicly accessible (not behind a firewall or localhost)</li>
            <li>Returns a 2xx HTTP status code within 10 seconds</li>
            <li>Is correctly processing the SipHeron webhook payload</li>
          </ul>
          <a href="https://app.sipheron.com/dashboard/webhooks"
             style="display:inline-block;background:#6C63FF;color:white;
                    padding:12px 24px;border-radius:8px;text-decoration:none;
                    font-weight:bold;margin-top:16px">
            Fix Webhook Settings
          </a>
          <p style="color:#888;font-size:12px;margin-top:24px">
            Re-enable the webhook from your dashboard after fixing the endpoint.
          </p>
        </div>
      `
    })
  } catch (err) {
    console.error('[WEBHOOK] failure notification error:', err.message)
  }
}

/**
 * Process pending retries — called by background job every 60 seconds
 * Picks up deliveries where nextRetryAt <= now and status = 'retrying'
 */
async function processPendingRetries() {
  try {
    const pending = await prisma.webhookDelivery.findMany({
      where: {
        status: 'retrying',
        nextRetryAt: { lte: new Date() },
      },
      include: {
        webhook: {
          select: { id: true, url: true, secret: true, active: true, disabledAt: true }
        }
      },
      take: 50, // process max 50 at a time
      orderBy: { nextRetryAt: 'asc' },
    })

    if (pending.length > 0) {
      console.log(`[WEBHOOK] Processing ${pending.length} pending retries`)
    }

    for (const delivery of pending) {
      if (!delivery.webhook.active || delivery.webhook.disabledAt) continue
      attemptDelivery(delivery.id, delivery.webhook, delivery.payload)
        .catch(err => console.error(`[WEBHOOK] retry error ${delivery.id}:`, err.message))
    }
  } catch (err) {
    console.error('[WEBHOOK] processPendingRetries error:', err.message)
  }
}

module.exports = {
    registerWebhook,
    triggerWebhook,
    fireWebhookEvent,
    attemptDelivery,
    processPendingRetries,
    listWebhooks,
    deleteWebhook,
    testWebhook,
    getLogs
};
