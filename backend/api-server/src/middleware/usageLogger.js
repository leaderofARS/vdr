/**
 * @file usageLogger.js
 * @module backend/api-server/src/middleware/usageLogger.js
 * @description In-app API usage tracking middleware.
 */

const prisma = require('../config/database');

/**
 * Middleware that logs API request & response details for institutional API keys.
 * Only triggers if req.apiKey and req.organization are set.
 */
function usageLogger(req, res, next) {
    const startTime = Date.now();

    // Listen to the 'finish' event to log after response is sent
    res.on('finish', () => {
        // We only care about API key usage or authenticated org usage for metrics
        if (req.organization) {
            const durationMs = Date.now() - startTime;

            // Fire and forget — we don't await this to avoid slowing down the response
            prisma.apiUsageLog.create({
                data: {
                    apiKeyId: req.apiKey?.id || null, // Optional now
                    orgId: req.organization.id,
                    endpoint: req.path,
                    method: req.method,
                    statusCode: res.statusCode,
                    durationMs: durationMs,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent']
                }
            }).catch(err => {
                console.error('[UsageLogger] Failed to record API log:', err.message);
            });
        }
    });

    next();
}

module.exports = usageLogger;
