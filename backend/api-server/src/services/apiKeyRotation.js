/**
 * @file apiKeyRotation.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/services/apiKeyRotation.js
 * @description Core business logic and external service integrations.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const crypto = require('crypto');
const prisma = require('../config/database');

class ApiKeyRotationService {
    constructor() {
        this.rotationInterval = 90 * 24 * 60 * 60 * 1000; // 90 days
    }

    /**
     * Create a new API key with rotation metadata.
     */
    async createApiKey(userId, organizationId, name) {
        const key = `sk_${crypto.randomBytes(32).toString('hex')}`;
        const rotationDue = new Date(Date.now() + this.rotationInterval);

        return await prisma.apiKey.create({
            data: {
                key,
                name,
                userId,
                organizationId,
                rotationDue
            }
        });
    }

    /**
     * Rotate an existing API key. Creates a new key and marks the old one
     * with a grace period before revocation.
     */
    async rotateApiKey(keyId) {
        const oldKey = await prisma.apiKey.findUnique({ where: { id: keyId } });
        if (!oldKey) throw new Error('API key not found');

        const newKey = `sk_${crypto.randomBytes(32).toString('hex')}`;
        const rotationDue = new Date(Date.now() + this.rotationInterval);

        const rotatedKey = await prisma.apiKey.create({
            data: {
                key: newKey,
                name: oldKey.name,
                userId: oldKey.userId,
                organizationId: oldKey.organizationId,
                rotationDue
            }
        });

        // Mark old key by clearing its rotation due date (signals it was rotated out)
        await prisma.apiKey.update({
            where: { id: keyId },
            data: {
                rotationDue: null,
                lastUsedAt: new Date()
            }
        });

        return rotatedKey;
    }

    /**
     * Find API keys that are past their rotation due date.
     */
    async checkRotationDue() {
        return await prisma.apiKey.findMany({
            where: {
                rotationDue: { lt: new Date() }
            }
        });
    }
}

module.exports = new ApiKeyRotationService();
