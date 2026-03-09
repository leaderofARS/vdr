/**
 * @file errorHandler.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/middleware/errorHandler.js
 * @description Express middleware for security, authentication, and error handling.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

module.exports = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV === 'development';

    // Log full error internally
    console.error('[ERROR]', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    const status = err.status || 500;

    // Return safe error to client
    res.status(status).json({
        error: isDev ? err.message : (status === 500 ? 'Internal Server Error' : (err.message || 'An error occurred')),
        ...(isDev && { stack: err.stack })
    });
};
