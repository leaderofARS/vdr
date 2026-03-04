/**
 * @file errorHandler.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/middleware/errorHandler.js
 * @description Express middleware for security, authentication, and error handling.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

module.exports = (err, req, res, next) => {
    // Log full error details server-side for debugging and incident response
    console.error('Backend API Error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
    });

    const status = err.status || 500;

    // Return generic messages to clients. Never expose internals.
    const clientMessage = status === 500
        ? 'Internal Server Error'
        : err.message || 'An error occurred';

    res.status(status).json({
        success: false,
        error: clientMessage
    });
};

