/**
 * SipHeron VDR — API v1 Router
 *
 * All routes here are mounted at /v1/
 * These are ALIASES of the existing /api/* routes.
 * Both /api/* and /v1/* remain fully functional.
 *
 * /v1/ is the versioned public API for enterprise integrations.
 * /api/ is the internal API used by the dashboard frontend.
 */

const express = require('express')
const router = express.Router()

// Import the SAME route handlers used by /api/*
// Do NOT create new handlers — reuse existing ones
const hashesRouter = require('../hashes')
const keysRouter = require('../keys')
const orgRouter = require('../org')
const membersRouter = require('../members')
const webhooksRouter = require('../webhooks')
const usageRouter = require('../usage')
const auditRouter = require('../audit')
const verifyRouter = require('../verify')

// Mount at v1 paths matching the endpoint inventory:
// /v1/anchors    → same handler as /api/hashes
// /v1/verify     → same handler as /api/verify
// /v1/webhooks   → same handler as /api/webhooks
// /v1/organization → same handler as /api/org
// /v1/keys       → same handler as /api/keys
// /v1/audit      → same handler as /api/audit
// /v1/members    → same handler as /api/members
// /v1/usage      → same handler as /api/usage (also at /v1/organization/usage)

router.use('/anchors', hashesRouter)
router.use('/verify', verifyRouter)
router.use('/webhooks', webhooksRouter)
router.use('/organization', orgRouter)
router.use('/organization/usage', usageRouter)
router.use('/organization/members', membersRouter)
router.use('/keys', keysRouter)
router.use('/audit', auditRouter)

// Version info endpoint
router.get('/', (req, res) => {
  res.json({
    version: 'v1',
    status: 'stable',
    baseUrl: 'https://api.sipheron.com/v1',
    deprecated: false,
    sunsetDate: null,
    docs: 'https://app.sipheron.com/docs/api-reference',
    endpoints: {
      anchors:      '/v1/anchors',
      verify:       '/v1/verify',
      webhooks:     '/v1/webhooks',
      organization: '/v1/organization',
      keys:         '/v1/keys',
      audit:        '/v1/audit',
    }
  })
})

module.exports = router
