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
        // Filter out ALL ambient GET requests from the dashboard to prevent graph inflation
        // Transactions graph should only track mutations (POST/PUT) for dashboard users,
        // while tracking all throughput for API Key users.
        const isDashboardAmbientGet = !req.apiKey && req.method === 'GET';
        
        if (req.organization && !isDashboardAmbientGet) {
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
