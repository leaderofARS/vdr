const prisma = require('../config/database')
const crypto = require('crypto')

/**
 * Idempotency middleware for POST endpoints
 *
 * How it works:
 * 1. Client sends Idempotency-Key header with any unique string
 * 2. First request: process normally, store response in IdempotencyRecord
 * 3. Subsequent requests with same key: return stored response immediately
 * 4. Records expire after 24 hours
 *
 * Usage: router.post('/', authenticate, idempotency, handler)
 */
async function idempotencyMiddleware(req, res, next) {
  const idempotencyKey = req.headers['idempotency-key'] ||
                         req.headers['x-idempotency-key']

  // If no idempotency key provided, proceed normally
  if (!idempotencyKey) return next()

  // Validate key format — must be non-empty string under 255 chars
  if (typeof idempotencyKey !== 'string' || idempotencyKey.length > 255) {
    return res.status(400).json({
      error: 'INVALID_IDEMPOTENCY_KEY',
      message: 'Idempotency-Key must be a string under 255 characters',
    })
  }

  const organizationId = req.organization?.id
  if (!organizationId) return next()

  const endpoint = `${req.method} ${req.path}`
  const requestHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(req.body || {}))
    .digest('hex')

  try {
    // Check for existing record
    const existing = await prisma.idempotencyRecord.findUnique({
      where: {
        key_organizationId: {
          key: idempotencyKey,
          organizationId,
        }
      }
    })

    if (existing) {
      // Check if expired
      if (new Date() > new Date(existing.expiresAt)) {
        // Expired — delete and process fresh
        await prisma.idempotencyRecord.delete({
          where: { id: existing.id }
        }).catch(() => {})
        // Fall through to process fresh
      } else {
        // Valid existing record — return stored response
        console.log(`[IDEMPOTENCY] Returning cached response for key: ${idempotencyKey}`)
        res.setHeader('Idempotency-Key', idempotencyKey)
        res.setHeader('X-Idempotency-Replayed', 'true')
        return res.status(existing.responseStatus).json(existing.responseBody)
      }
    }

    // Intercept the response to store it
    const originalJson = res.json.bind(res)
    res.json = async function(body) {
      // Store the response for future idempotent requests
      try {
        await prisma.idempotencyRecord.create({
          data: {
            key: idempotencyKey,
            organizationId,
            endpoint,
            requestHash,
            responseStatus: res.statusCode,
            responseBody: body,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          }
        })
      } catch (storeErr) {
        // If unique constraint violation — race condition, another request
        // already stored a response. This is fine, continue.
        if (!storeErr.message?.includes('Unique constraint')) {
          console.error('[IDEMPOTENCY] store error:', storeErr.message)
        }
      }

      // Set idempotency headers
      res.setHeader('Idempotency-Key', idempotencyKey)
      res.setHeader('X-Idempotency-Replayed', 'false')

      // Call original json method
      return originalJson(body)
    }

    next()
  } catch (err) {
    console.error('[IDEMPOTENCY] middleware error:', err)
    next() // never block on idempotency errors
  }
}

// Cleanup job — delete expired idempotency records
// Call this periodically (e.g. once per hour via setInterval)
async function cleanupExpiredRecords() {
  try {
    const deleted = await prisma.idempotencyRecord.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    })
    if (deleted.count > 0) {
      console.log(`[IDEMPOTENCY] Cleaned up ${deleted.count} expired records`)
    }
  } catch (err) {
    console.error('[IDEMPOTENCY] cleanup error:', err)
  }
}

module.exports = { idempotencyMiddleware, cleanupExpiredRecords }
