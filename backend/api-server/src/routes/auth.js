/**
 * @file auth.js
 * @module backend/api-server/src/routes/auth.js
 * @description Express API route handlers.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middleware/auth');
const { sanitizeEmail } = require('../utils/sanitizer');
const { generateToken, generateRefreshToken, verifyToken } = require('../services/jwt');

const router = express.Router();
const prisma = new PrismaClient();

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

// Generate an API Key for an Organization
router.post('/api-key', authenticate, async (req, res, next) => {
    try {
        const { name, organizationId } = req.body;

        if (organizationId) {
            const org = await prisma.organization.findFirst({
                where: {
                    id: organizationId,
                    ownerId: req.user.id
                }
            });

            if (!org) {
                return res.status(403).json({
                    error: 'Unauthorized: You do not have management rights for this organization'
                });
            }
        }

        const key = require('crypto').randomBytes(32).toString('hex');

        const apiKey = await prisma.apiKey.create({
            data: {
                name,
                key,
                userId: req.user.id,
                organizationId: organizationId || null
            }
        });

        res.status(201).json({
            success: true,
            apiKey: apiKey.key,
            id: apiKey.id,
            message: 'Store this API key securely. It will not be shown again.'
        });
    } catch (error) {
        next(error);
    }
});

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

module.exports = router;