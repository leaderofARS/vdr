/**
 * @file auth.js
 * @module backend/api-server/src/routes/auth.js
 * @description Express API route handlers.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const authenticate = require('../middleware/auth');
const { sanitizeEmail } = require('../utils/sanitizer');
const { generateToken, generateRefreshToken, verifyToken, revokeToken } = require('../services/jwt');
const notificationService = require('../services/notificationService');
const { z } = require('zod');
const { validateInput, sanitizeOutput } = require('../middleware/security');
const redisClient = require('../services/redis');
const crypto = require('crypto');

const router = express.Router();

const isProd = process.env.NODE_ENV === 'production';

const ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 60 * 1000,  // 15 minutes
    path: '/'
};

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    path: '/'
};

// Zod Schemas
const registerSchema = z.object({
    email: z.string().email().max(255).toLowerCase(),
    password: z.string().min(8).max(128).regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/),
    name: z.string().min(2).max(100).regex(/^[a-zA-Z\s'-]+$/).optional(),
    organizationName: z.string().min(2).max(100).optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const forgotSchema = z.object({
    email: z.string().email()
});

const resetSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(8).max(128).regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/)
});

// Brute force protection mechanism
async function checkBruteForce(req, res, next) {
    const { email } = req.body;
    if (!email) return next();

    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail) return next();

    const locked = await redisClient.get(`lockout:${sanitizedEmail}`);
    if (locked) {
        return res.status(403).json({ error: 'Account temporarily locked due to excessive failed attempts' });
    }

    const attemptsStr = await redisClient.get(`login_attempts:${sanitizedEmail}`);
    const attempts = parseInt(attemptsStr || 0);

    if (attempts > 0) {
        let maxDelay = 8;
        let delay = Math.min(maxDelay, Math.pow(2, attempts - 1)); // 1s, 2s, 4s, 8s max
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }
    }
    next();
}

async function handleFailedLogin(email) {
    const attemptsStr = await redisClient.get(`login_attempts:${email}`);
    let attempts = parseInt(attemptsStr || 0) + 1;

    await redisClient.set(`login_attempts:${email}`, attempts, 'EX', 15 * 60);

    if (attempts >= 10) {
        await redisClient.set(`lockout:${email}`, 'true', 'EX', 15 * 60); // lock for 15 mins

        try {
            console.log(`[ALERT] Account lockout email would be sent to ${email}`);
        } catch (err) { }

        const hashForLog = crypto.createHash('sha256').update(email).digest('hex').substring(0, 8);
        console.log(JSON.stringify({
            type: 'SECURITY_EVENT',
            event: 'ACCOUNT_LOCKOUT',
            timestamp: new Date().toISOString(),
            user_hash: hashForLog
        }));
    }
}

// Strip sensitive fields when responding with user data
const safeUserObj = sanitizeOutput(['password', 'passwordResetToken', 'passwordResetExpiry', 'activeTokenId']);

// Register a new user
router.post('/register', validateInput(registerSchema), async (req, res, next) => {
    try {
        const { email, password, name, organizationName } = req.body;

        const sanitizedEmail = sanitizeEmail(email);
        if (!sanitizedEmail) return res.status(400).json({ error: 'Invalid email format' });

        const existing = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
        if (existing) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { email: sanitizedEmail, password: hashedPassword }
        });

        // Send Welcome Email (Non-blocking)
        try {
            const { sendWelcomeEmail } = require('../services/emailService');
            sendWelcomeEmail(sanitizedEmail).catch(console.error);
        } catch (e) { }

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        next(error);
    }
});

// Login
router.post('/login', validateInput(loginSchema), checkBruteForce, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const sanitizedEmail = sanitizeEmail(email);

        const hashForLog = crypto.createHash('sha256').update(email).digest('hex').substring(0, 8);
        console.log(`[Auth] Login attempt for user ${hashForLog}`);

        if (!sanitizedEmail) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            await handleFailedLogin(sanitizedEmail);
            console.log(JSON.stringify({
                type: 'SECURITY_EVENT',
                event: 'FAILED_LOGIN',
                timestamp: new Date().toISOString(),
                user_hash: hashForLog
            }));
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Reset lockout and attempts upon success
        await redisClient.del(`login_attempts:${sanitizedEmail}`);
        await redisClient.del(`lockout:${sanitizedEmail}`);

        const accessToken = generateToken(user.id, user.email);
        const refreshToken = generateRefreshToken(user.id);

        const csrfToken = crypto.randomBytes(32).toString('hex');

        res.cookie('vdr_token', accessToken, ACCESS_COOKIE_OPTIONS);
        res.cookie('vdr_refresh', refreshToken, REFRESH_COOKIE_OPTIONS);
        res.cookie('csrf_token', csrfToken, { httpOnly: false, secure: true, sameSite: 'none', path: '/' });

        res.json({
            success: true,
            message: 'Login successful',
            csrfToken: csrfToken,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
});

// Admin unlock endpoint
router.post('/unlock', authenticate, async (req, res) => {
    try {
        const { targetEmail } = req.body;
        if (!targetEmail) return res.status(400).json({ error: 'targetEmail required' });

        await redisClient.del(`lockout:${sanitizeEmail(targetEmail)}`);
        await redisClient.del(`login_attempts:${sanitizeEmail(targetEmail)}`);

        console.log(JSON.stringify({
            type: 'SECURITY_EVENT',
            event: 'ADMIN_UNLOCK',
            timestamp: new Date().toISOString(),
            target: targetEmail,
            actor: req.user.email
        }));

        res.json({ message: 'Account unlocked' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Refresh — exchanges a valid refresh token for a new access token
router.post('/refresh', async (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies && req.cookies.vdr_refresh;
        if (!refreshTokenCookie) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }

        const decoded = await verifyToken(refreshTokenCookie);
        if (decoded.type !== 'refresh') {
            return res.status(401).json({ error: 'Invalid token type' });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        await revokeToken(decoded);
        const newAccessToken = generateToken(user.id, user.email);
        const newRefreshToken = generateRefreshToken(user.id);

        res.cookie('vdr_token', newAccessToken, ACCESS_COOKIE_OPTIONS);
        res.cookie('vdr_refresh', newRefreshToken, REFRESH_COOKIE_OPTIONS);

        res.json({ success: true, message: 'Token refreshed' });
    } catch (error) {
        return res.status(401).json({ error: 'Token refresh failed' });
    }
});

// Logout — clears both cookies
router.post('/logout', async (req, res) => {
    try {
        const accToken = req.cookies && req.cookies.vdr_token;
        if (accToken) {
            const decoded = await verifyToken(accToken).catch(() => null);
            if (decoded) await revokeToken(decoded);
        }
    } catch (err) { }

    res.clearCookie('vdr_token', { path: '/', sameSite: 'strict', secure: true });
    res.clearCookie('vdr_refresh', { path: '/', sameSite: 'strict', secure: true });
    res.clearCookie('csrf_token', { path: '/', sameSite: 'strict', secure: true });
    res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * @route GET /auth/verify-key
 * @description Verify an API key — used by CLI link command.
 * FIX: Hash the incoming key before DB lookup, same as auth middleware does.
 */
router.get('/verify-key', async (req, res, next) => {
    try {
        const rawKey = req.headers['x-api-key'];

        if (!rawKey) {
            return res.status(401).json({ error: 'API key required' });
        }

        // FIX: Hash the raw key before lookup — DB stores SHA-256 hashed keys
        const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

        // Try hashed key first
        let apiKeyRecord = await prisma.apiKey.findUnique({
            where: { key: hashedKey },
            include: {
                organization: true,
                user: true
            }
        });

        // Fallback: try raw key (legacy plain-text keys)
        if (!apiKeyRecord) {
            apiKeyRecord = await prisma.apiKey.findUnique({
                where: { key: rawKey },
                include: {
                    organization: true,
                    user: true
                }
            });

            // Migrate legacy plain-text key to hashed
            if (apiKeyRecord) {
                await prisma.apiKey.update({
                    where: { id: apiKeyRecord.id },
                    data: { key: hashedKey }
                });
            }
        }

        if (!apiKeyRecord) {
            return res.status(401).json({ error: 'Invalid API Key' });
        }

        if (apiKeyRecord.status === 'revoked') {
            return res.status(401).json({ error: 'API Key has been revoked' });
        }

        // Update last used
        await prisma.apiKey.update({
            where: { id: apiKeyRecord.id },
            data: { lastUsedAt: new Date() }
        });

        // Never return the full key back
        const safeOrg = {
            id: apiKeyRecord.organization?.id,
            name: apiKeyRecord.organization?.name,
            solanaPubkey: apiKeyRecord.organization?.solanaPubkey,
            walletAddress: apiKeyRecord.organization?.walletAddress,
            createdAt: apiKeyRecord.organization?.createdAt,
        };

        res.json({
            success: true,
            organization: safeOrg,
            user: {
                id: apiKeyRecord.user.id,
                email: apiKeyRecord.user.email
            }
        });
    } catch (error) {
        next(error);
    }
});

// Forgot Password
router.post('/forgot-password', validateInput(forgotSchema), async (req, res, next) => {
    try {
        const { email } = req.body;
        const sanitizedEmail = sanitizeEmail(email);

        const genericMessage = { message: "If that email exists, a reset link has been sent" };

        if (!sanitizedEmail) return res.json(genericMessage);

        const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
        if (!user) return res.json(genericMessage);

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: token,
                passwordResetExpiry: expiry
            }
        });

        try {
            const { sendPasswordResetEmail } = require('../services/emailService');
            await sendPasswordResetEmail(sanitizedEmail, token);
        } catch (e) { }

        res.json(genericMessage);
    } catch (error) {
        next(error);
    }
});

// Reset Password
router.post('/reset-password', validateInput(resetSchema), async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { passwordResetToken: token }
        });

        if (!user || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpiry: null
            }
        });

        res.clearCookie('vdr_token', { path: '/', sameSite: 'strict', secure: true });
        res.clearCookie('vdr_refresh', { path: '/', sameSite: 'strict', secure: true });
        res.clearCookie('csrf_token', { path: '/', sameSite: 'strict', secure: true });

        console.log(JSON.stringify({
            type: 'SECURITY_EVENT',
            event: 'PASSWORD_RESET',
            timestamp: new Date().toISOString(),
            user_id: user.id
        }));

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;