const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Register a new SipHeron Admin User
router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword }
        });

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        next(error);
    }
});

// Login and get JWT
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        next(error);
    }
});

// Generate an API Key for an Organization
router.post('/api-key', authenticate, async (req, res, next) => {
    try {
        const { name, organizationId } = req.body;

        // Simple hex key generation
        const key = require('crypto').randomBytes(32).toString('hex');

        const apiKey = await prisma.apiKey.create({
            data: {
                name,
                key,
                userId: req.user.id,
                organizationId: organizationId || null
            }
        });

        res.json({ message: 'API Key Created', key: apiKey.key, id: apiKey.id });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
