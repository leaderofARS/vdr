/**
 * @file csrf.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/middleware/csrf.js
 * @description Express middleware for security, authentication, and error handling.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const csrf = require('csurf');

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

module.exports = csrfProtection;
