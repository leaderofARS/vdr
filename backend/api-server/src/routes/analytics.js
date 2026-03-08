/**
 * @file analytics.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/routes/analytics.js
 * @description Express API route handlers.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const walletMonitor = require('../services/walletMonitor');

router.get('/stats', authenticate, async (req, res, next) => {
    try {
        const walletInfo = {
            walletBalance: walletMonitor.getBalance(),
            walletStatus: walletMonitor.getStatus()
        };

        // If user has no organization linked, return onboarding state
        if (!req.organization) {
            return res.json({
                noOrganization: true,
                totalHashes: 0,
                activeRate: 100,
                revokedHashes: 0,
                recentRecords: [],
                ...walletInfo
            });
        }

        // Find organization based on current institutional context
        const org = await prisma.organization.findUnique({
            where: { id: req.organization.id },
            include: {
                _count: {
                    select: { records: true }
                }
            }
        });

        if (!org) {
            return res.json({
                noOrganization: true,
                totalHashes: 0,
                activeRate: 100,
                revokedHashes: 0,
                recentRecords: []
            });
        }

        const totalHashes = org._count.records;
        const revokedHashes = await prisma.hashRecord.count({
            where: {
                organizationId: org.id,
                isRevoked: true
            }
        });

        const recentRecords = await prisma.hashRecord.findMany({
            where: { organizationId: org.id },
            take: 20,
            orderBy: { timestamp: 'desc' }
        });

        // Add computed fields for the frontend dashboard while preserving original fields for compatibility
        const dashboardRecords = recentRecords.map(record => ({
            ...record,
            registeredAt: new Date(record.timestamp * 1000).toISOString(),
            status: record.isRevoked ? 'revoked' : 'active'
        }));

        res.json({
            organizationName: org.name,
            solanaPubkey: org.solanaPubkey,
            totalHashes,
            revokedHashes,
            activeRate: totalHashes > 0 ? (((totalHashes - revokedHashes) / totalHashes) * 100).toFixed(2) : 100,
            recentRecords: dashboardRecords,
            ...walletInfo
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
