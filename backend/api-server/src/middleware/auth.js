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
            const crypto = require('crypto');
            const hashedKey = crypto.createHash('sha256').update(apiKeyHeader).digest('hex');

            let apiKeyRecord = await prisma.apiKey.findUnique({
                where: { key: hashedKey },
                include: { organization: true, user: true }
            });

            // Fallback for legacy plain-text keys (flyway migration pattern to prevent breakage)
            if (!apiKeyRecord) {
                apiKeyRecord = await prisma.apiKey.findUnique({
                    where: { key: apiKeyHeader },
                    include: { organization: true, user: true }
                });
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

            // Scope validation
            // read - GET, write - POST/PUT/PATCH, admin - DELETE + org
            const scope = apiKeyRecord.scope || 'write'; 
            const reqMethod = req.method.toUpperCase();

            if (scope === 'read' && reqMethod !== 'GET') {
                return res.status(403).json({ error: 'API key scope insufficient: read-only access' });
            }
            if (scope === 'write' && reqMethod === 'DELETE') {
                return res.status(403).json({ error: 'API key scope insufficient: admin access required for DELETE' });
            }

            await prisma.apiKey.update({
                where: { id: apiKeyRecord.id },
                data: { lastUsedAt: new Date() }
            });

            req.user = apiKeyRecord.user;
            req.organization = apiKeyRecord.organization;
            req.apiKey = apiKeyRecord; // Set this for usageLogger

            // Attach orgRole for RBAC checks
            if (req.user && req.organization) {
                try {
                    const org = await prisma.organization.findUnique({
                        where: { id: req.organization.id },
                        select: { ownerId: true }
                    });

                    if (org?.ownerId === req.user.id) {
                        req.user.orgRole = 'owner';
                    } else {
                        const member = await prisma.orgMember.findUnique({
                            where: {
                                organizationId_userId: {
                                    organizationId: req.organization.id,
                                    userId: req.user.id
                                }
                            },
                            select: { role: true }
                        });
                        req.user.orgRole = member?.role || 'member';
                    }
                } catch (err) {
                    req.user.orgRole = 'member';
                }
            }

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
            const decoded = await verifyToken(token);

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

            // Attach orgRole for RBAC checks
            if (req.user && req.organization) {
                try {
                    const org = await prisma.organization.findUnique({
                        where: { id: req.organization.id },
                        select: { ownerId: true }
                    });

                    if (org?.ownerId === req.user.id) {
                        req.user.orgRole = 'owner';
                    } else {
                        const member = await prisma.orgMember.findUnique({
                            where: {
                                organizationId_userId: {
                                    organizationId: req.organization.id,
                                    userId: req.user.id
                                }
                            },
                            select: { role: true }
                        });
                        req.user.orgRole = member?.role || 'member';
                    }
                } catch (err) {
                    req.user.orgRole = 'member';
                }
            }

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
