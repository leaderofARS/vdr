/**
 * @file rateLimiter.js
 * @description Centralized rate limiting configuration for SipHeron VDR.
 * Fixed for Railway deployment: Separate store instances, IPv6 support, and Redis fallback.
 */

const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redisClient = require('../services/redis');

// Disable rate limiting in test environment
if (process.env.NODE_ENV === 'test') {
    module.exports = {
        globalLimiter: (req, res, next) => next(),
        authLimiter: (req, res, next) => next(),
        batchRegisterLimiter: (req, res, next) => next(),
        keyCreationLimiter: (req, res, next) => next(),
        globalRateLimiter: (req, res, next) => next(),
        monthlyQuotaMiddleware: (req, res, next) => next(),
        incrementAnchorUsage: async () => {},
        PLAN_LIMITS: {}
    };
    return;
}

/**
 * Custom handler to match the required JSON format
 */
const rateLimitHandler = (message, windowMs, type, limitValue) => (req, res, next, options) => {
    const retryAfter = Math.ceil(windowMs / 1000);
    const plan = req.organization?.plan || 'free';
    res.setHeader('Retry-After', retryAfter.toString());
    res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message: message,
        limit: {
            type: type || 'requests_per_window',
            limit: limitValue || options?.limit || 0,
            used: (limitValue || options?.limit || 0) + 1,
            remaining: 0,
            resetAt: new Date(Date.now() + windowMs).toISOString(),
            plan: plan
        },
        retryAfter: retryAfter,
        upgrade: 'https://app.sipheron.com/dashboard/billing',
        docs: 'https://app.sipheron.com/docs/api-reference#rate-limiting',
    });
};

/**
 * Creates a unique RedisStore instance for each limiter to avoid ERR_ERL_STORE_REUSE.
 * Falls back to MemoryStore if Redis is unavailable.
 */
const createStore = (prefix) => {
    try {
        return new RedisStore({
            sendCommand: (...args) => redisClient.call(...args),
            prefix: `rl:${prefix}:`,
        });
    } catch (error) {
        console.error(`[RateLimiter] Redis store initialization failed for ${prefix}, falling back to MemoryStore`);
        return undefined;
    }
};

// 1. Global limiter — all routes (200 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    keyGenerator: (req) => ipKeyGenerator(req),
    store: createStore('global'),
    handler: rateLimitHandler("Too many requests. Please try again in 15 minutes.", 15 * 60 * 1000, "requests_per_15min", 200),
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. Auth limiter — login/register/forgot-password (10 requests per 15 minutes per IP)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    keyGenerator: (req) => ipKeyGenerator(req),
    store: createStore('auth'),
    handler: rateLimitHandler("Too many authentication attempts. Please try again in 15 minutes.", 15 * 60 * 1000, "auth_requests_per_15min", 10),
    standardHeaders: true,
    legacyHeaders: false,
});

// 3. Batch register limiter — most critical (50 requests per hour per API key)
const batchRegisterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 50,
    // Extract API key from x-api-key header, fallback to IPv6 safe IP key
    keyGenerator: (req) => req.headers['x-api-key'] || ipKeyGenerator(req),
    store: createStore('batch'),
    handler: rateLimitHandler("Too many batch registration requests. Please try again in 1 hour.", 60 * 60 * 1000, "batch_requests_per_hour", 50),
    standardHeaders: true,
    legacyHeaders: false,
});

// 4. API key limiter — key creation (10 new keys per day per org)
const keyCreationLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 10,
    // Use organization ID if available, fallback to user ID or IPv6 safe IP key
    keyGenerator: (req) => {
        if (req.organization && req.organization.id) return `org:${req.organization.id}`;
        if (req.user && req.user.id) return `user:${req.user.id}`;
        return ipKeyGenerator(req);
    },
    store: createStore('keys'),
    handler: rateLimitHandler("Daily API key creation limit reached. Please try again tomorrow.", 24 * 60 * 60 * 1000, "keys_per_day", 10),
    standardHeaders: true,
    legacyHeaders: false,
});

const PLAN_LIMITS = {
  free:       { anchorsPerMonth: 100,    requestsPerSecond: 10  },
  business:   { anchorsPerMonth: 10000,  requestsPerSecond: 50  },
  enterprise: { anchorsPerMonth: 999999, requestsPerSecond: 200 },
}

// ── Per-second rate limiter (burst protection) ──
// Applied globally to all /api/* and /v1/* routes
const globalRateLimiter = rateLimit({
  windowMs: 1000, // 1 second window
  limit: (req) => { // using `limit` instead of `max` for newer express-rate-limit
    const plan = req.organization?.plan || 'free'
    return PLAN_LIMITS[plan]?.requestsPerSecond ?? 10
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by org ID if authenticated, by IP if not
    return req.organization?.id || ipKeyGenerator(req)
  },
  store: createStore('global_burst'),
  handler: (req, res) => {
    const plan = req.organization?.plan || 'free'
    const limitParams = PLAN_LIMITS[plan]?.requestsPerSecond ?? 10
    const retryAfter = 1;
    res.setHeader('Retry-After', retryAfter.toString());
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests — per-second limit exceeded',
      limit: {
        type: 'requests_per_second',
        limit: limitParams,
        used: limitParams + 1,
        remaining: 0,
        resetAt: new Date(Date.now() + 1000).toISOString(),
        plan,
      },
      retryAfter: retryAfter,
      upgrade: 'https://app.sipheron.com/dashboard/billing',
      docs: 'https://app.sipheron.com/docs/api-reference#rate-limiting',
    })
  },
  skip: (req) => {
    // Skip rate limiting for health checks and public stats
    return req.path === '/health' || req.path.startsWith('/api/stats')
  }
})

// ── Monthly quota middleware (anchor-specific) ──
// Applied only to POST /api/hashes and POST /v1/anchors
async function monthlyQuotaMiddleware(req, res, next) {
  try {
    const org = req.organization
    if (!org) return next()

    const prisma = require('../config/database')

    // Refresh org data to get current usage
    const freshOrg = await prisma.organization.findUnique({
      where: { id: org.id },
      select: {
        id: true,
        plan: true,
        monthlyAnchorLimit: true,
        currentMonthUsage: true,
        usageResetAt: true,
        quotaAlertSent80: true,
        quotaAlertSent95: true,
        name: true,
      }
    })
    if (!freshOrg) return next()

    // Check if monthly usage needs reset
    const now = new Date()
    const resetAt = new Date(freshOrg.usageResetAt)
    const needsReset = now.getFullYear() > resetAt.getFullYear() ||
      now.getMonth() > resetAt.getMonth()

    if (needsReset) {
      await prisma.organization.update({
        where: { id: org.id },
        data: {
          currentMonthUsage: 0,
          usageResetAt: new Date(now.getFullYear(), now.getMonth(), 1),
          quotaAlertSent80: false,
          quotaAlertSent95: false,
        }
      })
      freshOrg.currentMonthUsage = 0
      freshOrg.quotaAlertSent80 = false
      freshOrg.quotaAlertSent95 = false
    }

    const limit = freshOrg.monthlyAnchorLimit
    const used = freshOrg.currentMonthUsage
    const remaining = limit - used
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // Set quota headers on every request
    res.setHeader('X-RateLimit-Limit-Month', limit)
    res.setHeader('X-RateLimit-Remaining-Month', Math.max(0, remaining))
    res.setHeader('X-RateLimit-Reset-Month', resetDate.toISOString())
    res.setHeader('X-RateLimit-Plan', freshOrg.plan)

    // Block if quota exceeded
    if (used >= limit) {
      const retryAfter = Math.max(1, Math.ceil((resetDate.getTime() - now.getTime()) / 1000));
      res.setHeader('Retry-After', retryAfter.toString());
      return res.status(429).json({
        error: 'MONTHLY_QUOTA_EXCEEDED',
        message: `Monthly anchor limit of ${limit} reached for the ${freshOrg.plan} plan`,
        limit: {
          type: 'anchors_per_month',
          limit,
          used,
          remaining: 0,
          resetAt: resetDate.toISOString(),
          plan: freshOrg.plan,
        },
        retryAfter: retryAfter,
        upgrade: 'https://app.sipheron.com/dashboard/billing',
        docs: 'https://app.sipheron.com/docs/api-reference#rate-limiting',
      })
    }

    // Attach to req for use after successful anchor
    req.quotaContext = { freshOrg, limit, used, remaining, resetDate }

    // Check proactive alerts (do not block — fire async)
    const pct = (used / limit) * 100
    if (pct >= 95 && !freshOrg.quotaAlertSent95) {
      sendQuotaAlert(freshOrg, 95, used, limit).catch(console.error)
    } else if (pct >= 80 && !freshOrg.quotaAlertSent80) {
      sendQuotaAlert(freshOrg, 80, used, limit).catch(console.error)
    }

    next()
  } catch (err) {
    console.error('[QUOTA] middleware error:', err)
    next() // never block on quota middleware error
  }
}

// ── Increment usage after successful anchor ──
// Call this AFTER successful Solana confirmation
async function incrementAnchorUsage(organizationId) {
  try {
    const prisma = require('../config/database')
    await prisma.organization.update({
      where: { id: organizationId },
      data: { currentMonthUsage: { increment: 1 } }
    })
  } catch (err) {
    console.error('[QUOTA] increment error:', err)
  }
}

// ── Proactive quota alert emails ──
async function sendQuotaAlert(org, percentage, used, limit) {
  try {
    const prisma = require('../config/database')
    const { sendEmail } = require('../services/emailService')

    // Get org owner email
    const owner = await prisma.orgMember.findFirst({
      where: { organizationId: org.id, role: 'owner' },
      include: { user: { select: { email: true, name: true } } }
    })
    if (!owner?.user?.email) return

    await sendEmail({
      to: owner.user.email,
      subject: `SipHeron VDR — You've used ${percentage}% of your monthly anchor quota`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6C63FF">Quota Alert — ${percentage}% Used</h2>
          <p>Hi ${owner.user.name || 'there'},</p>
          <p>Your organization <strong>${org.name}</strong> has used
             <strong>${used} of ${limit}</strong> anchor operations this month
             (${percentage}% of your ${org.plan} plan quota).</p>
          ${percentage >= 95 ? `
          <p style="color:#FF4757;font-weight:bold">
            ⚠️ You are approaching your limit. Anchoring will be blocked when you reach ${limit}.
          </p>` : ''}
          <a href="https://app.sipheron.com/dashboard/billing"
             style="display:inline-block;background:#6C63FF;color:white;padding:12px 24px;
                    border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px">
            Upgrade Your Plan
          </a>
          <p style="margin-top:24px;color:#888;font-size:12px">
            Your quota resets on the 1st of next month.
          </p>
        </div>
      `
    })

    // Mark alert as sent
    const updateData = percentage >= 95
      ? { quotaAlertSent95: true }
      : { quotaAlertSent80: true }

    await prisma.organization.update({
      where: { id: org.id },
      data: updateData
    })
  } catch (err) {
    console.error('[QUOTA] alert email error:', err)
  }
}

module.exports = {
    globalLimiter,
    authLimiter,
    batchRegisterLimiter,
    keyCreationLimiter,
    monthlyQuotaMiddleware,
    incrementAnchorUsage,
    PLAN_LIMITS
};
