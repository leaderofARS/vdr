/**
 * @file rateLimiter.js
 * @description Centralized rate limiting configuration for SipHeron VDR.
 * Uses Redis for distributed rate limiting with a fallback to memory store.
 */

const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redisClient = require('../services/redis');

// Initialize Redis store
let store;
try {
    store = new RedisStore({
        // sendCommand handles ioredis compatibility
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'vdr_rl:', // Prefix to avoid collisions
    });
} catch (error) {
    console.error('[RateLimiter] Redis store initialization failed, falling back to MemoryStore');
    store = undefined; // Defaults to MemoryStore
}

/**
 * Custom handler to match the required JSON format:
 * {
 *   "error": "Rate limit exceeded",
 *   "message": "Too many requests. Please try again in 15 minutes.",
 *   "retryAfter": 900
 * }
 */
const rateLimitHandler = (message, windowMs) => (req, res, next, options) => {
    const retryAfter = Math.ceil(windowMs / 1000);
    res.status(429).set('Retry-After', retryAfter).json({
        error: "Rate limit exceeded",
        message: message,
        retryAfter: retryAfter
    });
};

// 1. Global limiter — all routes (200 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    store: store,
    handler: rateLimitHandler("Too many requests. Please try again in 15 minutes.", 15 * 60 * 1000),
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. Auth limiter — login/register/forgot-password (10 requests per 15 minutes per IP)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    store: store,
    handler: rateLimitHandler("Too many authentication attempts. Please try again in 15 minutes.", 15 * 60 * 1000),
    standardHeaders: true,
    legacyHeaders: false,
});

// 3. Batch register limiter — most critical (50 requests per hour per API key)
const batchRegisterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 50,
    // Extract API key from x-api-key header, fallback to IP
    keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
    store: store,
    handler: rateLimitHandler("Too many batch registration requests. Please try again in 1 hour.", 60 * 60 * 1000),
    standardHeaders: true,
    legacyHeaders: false,
});

// 4. API key limiter — key creation (10 new keys per day per org)
const keyCreationLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 10,
    // Use organization ID if available, fallback to user ID or IP
    keyGenerator: (req) => {
        if (req.organization && req.organization.id) return `org:${req.organization.id}`;
        if (req.user && req.user.id) return `user:${req.user.id}`;
        return req.ip;
    },
    store: store,
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
