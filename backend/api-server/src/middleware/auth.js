/**
 * @file auth.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/middleware/auth.js
 * @description Express middleware for security, authentication, and error handling.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const prisma = require('../config/database');
const { verifyToken } = require('../services/jwt');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const apiKeyHeader = req.headers['x-api-key'];

        // 1. Check API Key
        if (apiKeyHeader) {
            const apiKeyRecord = await prisma.apiKey.findUnique({
                where: { key: apiKeyHeader },
                include: { organization: true, user: true }
            });

            if (!apiKeyRecord) {
                return res.status(401).json({ error: 'Invalid API Key' });
            }

            await prisma.apiKey.update({
                where: { id: apiKeyRecord.id },
                data: { lastUsedAt: new Date() }
            });

            req.user = apiKeyRecord.user;
            req.organization = apiKeyRecord.organization;
            req.apiKey = apiKeyRecord; // Set this for usageLogger
            return next();
        }

        // 2. Check JWT from HttpOnly cookie first, then Authorization header fallback
        let token = null;

        if (req.cookies && req.cookies.vdr_token) {
            token = req.cookies.vdr_token;
        } else if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (token) {
            const decoded = verifyToken(token);

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: {
                    organizations: {
                        take: 1,
                        orderBy: { createdAt: 'asc' }
                    }
                }
            });

            if (!user) {
                return res.status(401).json({ error: 'Unauthorized User' });
            }

            req.user = user;
            req.organization = user.organizations.length > 0 ? user.organizations[0] : null;
            return next();
        }

        return res.status(401).json({
            error: 'Missing Authentication (Bearer Token, Cookie, or x-api-key required)'
        });

    } catch (error) {
        return res.status(401).json({ error: 'Authentication Failed' });
    }
};

module.exports = authenticate;
