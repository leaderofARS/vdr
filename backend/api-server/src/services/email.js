/**
 * @file email.js
 * @module backend/api-server/src/services/email.js
 * @description Email dispatch service for SipHeron VDR.
 */

/**
 * Send a password reset email.
 * This is a placeholder for an actual SMTP/API implementation.
 * @param {string} email - Destination email
 * @param {string} token - Reset token
 */
async function sendResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    console.log(`[Email Service] Sending password reset email to ${email}`);
    console.log(`[Email Service] Reset Link: ${resetUrl}`);

    // In production, we would use nodemailer or a service like SendGrid
    return Promise.resolve(true);
}

module.exports = {
    sendResetEmail
};
