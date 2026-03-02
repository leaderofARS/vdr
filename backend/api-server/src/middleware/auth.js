const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

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
            return next();
        }

        // 2. Check JWT
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId }
            });

            if (!user) {
                return res.status(401).json({ error: 'Unauthorized User' });
            }

            req.user = user;
            return next();
        }

        return res.status(401).json({ error: 'Missing Authentication (Bearer Token or x-api-key required)' });

    } catch (error) {
        return res.status(401).json({ error: 'Authentication Failed', details: error.message });
    }
};

module.exports = authenticate;
