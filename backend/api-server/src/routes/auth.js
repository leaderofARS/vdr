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
const { generateToken, generateRefreshToken, verifyToken } = require('../services/jwt');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Cookie configuration for HttpOnly JWT storage
// sameSite: 'none' required for cross-site requests (Vercel → Railway)
const ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true, // always true — required when sameSite: 'none'
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,  // 15 minutes
    path: '/'
};

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true, // always true — required when sameSite: 'none'
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    path: '/'  // Changed from '/auth' — path scoping unreliable in cross-site context
};

// Register a new user
router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const sanitizedEmail = sanitizeEmail(email);
        if (!sanitizedEmail) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (!password || password.length < 12) {
            return res.status(400).json({ error: 'Password must be at least 12 characters long' });
        }

        const existing = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
        if (existing) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { email: sanitizedEmail, password: hashedPassword }
        });

        // Send Welcome Email (Non-blocking)
        const { sendWelcomeEmail } = require('../services/emailService');
        sendWelcomeEmail(sanitizedEmail).catch(console.error);

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        next(error);
    }
});

// Login — issues access token (15m) and refresh token (7d) via HttpOnly cookies
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const sanitizedEmail = sanitizeEmail(email);
        if (!sanitizedEmail) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = generateToken(user.id, user.email);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('vdr_token', accessToken, ACCESS_COOKIE_OPTIONS);
        res.cookie('vdr_refresh', refreshToken, REFRESH_COOKIE_OPTIONS);

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
});

// Refresh — exchanges a valid refresh token for a new access token
router.post('/refresh', async (req, res, next) => {
    try {
        const refreshToken = req.cookies && req.cookies.vdr_refresh;
        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }

        const decoded = verifyToken(refreshToken);
        if (decoded.type !== 'refresh') {
            return res.status(401).json({ error: 'Invalid token type' });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const newAccessToken = generateToken(user.id, user.email);
        res.cookie('vdr_token', newAccessToken, ACCESS_COOKIE_OPTIONS);

        res.json({ success: true, message: 'Token refreshed' });
    } catch (error) {
        return res.status(401).json({ error: 'Token refresh failed' });
    }
});

// Logout — clears both cookies
router.post('/logout', (req, res) => {
    res.clearCookie('vdr_token', { path: '/', sameSite: 'none', secure: true });
    res.clearCookie('vdr_refresh', { path: '/', sameSite: 'none', secure: true });
    res.json({ success: true, message: 'Logged out successfully' });
});

// Generate an API Key for an Organization (REMOVED: Moved to /api/keys)


// Verify API Key — used by CLI link command
router.get('/verify-key', authenticate, async (req, res, next) => {
    try {
        const apiKey = await prisma.apiKey.findUnique({
            where: { key: req.headers['x-api-key'] },
            include: {
                organization: true,
                user: true
            }
        });

        if (!apiKey) {
            return res.status(401).json({ error: 'Invalid API Key' });
        }

        res.json({
            success: true,
            organization: apiKey.organization,
            user: {
                id: apiKey.user.id,
                email: apiKey.user.email
            }
        });
    } catch (error) {
        next(error);
    }
});

// Forgot Password — generates token and sends placeholder email
router.post('/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body;
        const sanitizedEmail = sanitizeEmail(email);

        // Always return generic message for security
        const genericMessage = { message: "If that email exists, a reset link has been sent" };

        if (!sanitizedEmail) return res.json(genericMessage);

        const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
        if (!user) return res.json(genericMessage);

        const token = require('crypto').randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: token,
                passwordResetExpiry: expiry
            }
        });

        const { sendPasswordResetEmail } = require('../services/emailService');
        await sendPasswordResetEmail(sanitizedEmail, token);

        res.json(genericMessage);
    } catch (error) {
        next(error);
    }
});

// Reset Password — validates token and updates password
router.post('/reset-password', async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token) return res.status(400).json({ error: 'Token is required' });

        const user = await prisma.user.findUnique({
            where: { passwordResetToken: token }
        });

        if (!user || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Complexity validation: min 8 chars, 1 uppercase, 1 number, 1 special char
        const complexityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!complexityRegex.test(newPassword)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character (@$!%*?&).'
            });
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

        // Invalidate all existing sessions (clears cookies for the resetting device)
        res.clearCookie('vdr_token', { path: '/', sameSite: 'none', secure: true });
        res.clearCookie('vdr_refresh', { path: '/', sameSite: 'none', secure: true });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;