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
    };
    return;
}

/**
 * Custom handler to match the required JSON format
 */
const rateLimitHandler = (message, windowMs) => (req, res, next, options) => {
    const retryAfter = Math.ceil(windowMs / 1000);
    res.status(429).set('Retry-After', retryAfter).json({
        error: "Rate limit exceeded",
        message: message,
        retryAfter: retryAfter
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
    handler: rateLimitHandler("Too many requests. Please try again in 15 minutes.", 15 * 60 * 1000),
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. Auth limiter — login/register/forgot-password (10 requests per 15 minutes per IP)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    keyGenerator: (req) => ipKeyGenerator(req),
    store: createStore('auth'),
    handler: rateLimitHandler("Too many authentication attempts. Please try again in 15 minutes.", 15 * 60 * 1000),
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
    handler: rateLimitHandler("Too many batch registration requests. Please try again in 1 hour.", 60 * 60 * 1000),
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
    handler: rateLimitHandler("Daily API key creation limit reached. Please try again tomorrow.", 24 * 60 * 60 * 1000),
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    globalLimiter,
    authLimiter,
    batchRegisterLimiter,
    keyCreationLimiter
};
