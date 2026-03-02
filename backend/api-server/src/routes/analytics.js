const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/stats', async (req, res, next) => {
    try {
        const totalHashes = await prisma.hashRecord.count();
        const totalUsers = await prisma.user.count();
        const totalOrganizations = await prisma.organization.count();
        const revokedHashes = await prisma.hashRecord.count({ where: { isRevoked: true } });

        // Last 7 days volume mock or aggregate (simplistic approach for SQLite)
        const recentRecords = await prisma.hashRecord.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            totalHashes,
            totalUsers,
            totalOrganizations,
            revokedHashes,
            activeRate: totalHashes > 0 ? ((totalHashes - revokedHashes) / totalHashes * 100).toFixed(2) : 100,
            recentRecords
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
