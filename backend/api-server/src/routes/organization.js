/**
 * @file organization.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/routes/organization.js
 * @description Express API route handlers.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middleware/auth');
const { sanitizeOrganizationName } = require('../utils/sanitizer');

const router = express.Router();
const prisma = new PrismaClient();

// Base58 character set for Solana public key validation
const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

// Create/Initialize a new Organization
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { name, solanaPubkey } = req.body;

        if (!name || !solanaPubkey) {
            return res.status(400).json({ error: 'Name and Solana Public Key are required' });
        }

        // Sanitize organization name to prevent injection
        const sanitizedName = sanitizeOrganizationName(name);
        if (!sanitizedName) {
            return res.status(400).json({ error: 'Invalid organization name' });
        }

        // Validate Solana public key format (base58, 32-44 chars)
        if (!BASE58_REGEX.test(solanaPubkey)) {
            return res.status(400).json({ error: 'Invalid Solana public key format' });
        }

        // Check if pubkey is already in use
        const existing = await prisma.organization.findUnique({
            where: { solanaPubkey }
        });

        if (existing) {
            return res.status(400).json({ error: 'This Solana Public Key is already registered to an organization' });
        }

        const org = await prisma.organization.create({
            data: {
                name: sanitizedName,
                solanaPubkey,
                ownerId: req.user.id
            }
        });

        res.status(201).json(org);
    } catch (error) {
        next(error);
    }
});

// Get user's organizations
router.get('/my', authenticate, async (req, res, next) => {
    try {
        const orgs = await prisma.organization.findMany({
            where: { ownerId: req.user.id },
            include: {
                apiKeys: true,
                _count: {
                    select: { records: true }
                }
            }
        });
        res.json(orgs);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

