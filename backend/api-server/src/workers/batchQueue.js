/**
 * @file batchQueue.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/workers/batchQueue.js
 * @description Background job queue processors.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Queue, Worker } = require('bullmq');
const redisClient = require('../services/redis');
const solanaService = require('../services/solana');

// Use existing Redis client for BullMQ
const connection = redisClient;

connection.on('connect', () => {
    console.log('[Redis] Connected successfully');
});

connection.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
});

const hashQueue = new Queue('HashRegistration', { connection });

const prisma = require('../config/database');
const { isDrained } = require('../services/walletMonitor');
const notificationService = require('../services/notificationService');
const webhookService = require('../services/webhookService');

// Define the background worker
const worker = new Worker('HashRegistration', async job => {
    // 0. Check for drained wallet flag before processing batch
    if (isDrained()) {
        const errorMsg = "Wallet balance critical — registration paused. Contact support.";
        console.error(`[Worker] Wallet drained. Failing Batch Job ${job.id}`);
        throw new Error(errorMsg);
    }

    const { hashes, metadata, expiry, organizationId } = job.data;

    console.log(`Processing batch of ${hashes.length} hashes for organization ${organizationId}`);

    const results = [];

    for (const hash of hashes) {
        try {
            // 1. Register on Solana
            const { tx, pdaAddress, owner } = await solanaService.registerHash(hash, metadata, expiry);

            // 2. Immediate Database Reflection (GitHub-style instant update)
            const updatedRecord = await prisma.hashRecord.upsert({
                where: { pdaAddress },
                update: {
                    txSignature: tx,
                    organizationId: organizationId
                },
                create: {
                    hash,
                    pdaAddress,
                    ownerWallet: owner,
                    timestamp: Math.floor(Date.now() / 1000),
                    expiry: expiry || 0,
                    metadata: metadata,
                    txSignature: tx,
                    organizationId: organizationId
                },
                include: {
                    organization: {
                        include: {
                            owner: true
                        }
                    }
                }
            });

            // 3. Create In-App Notification
            await notificationService.createNotification(
                organizationId,
                'anchor_success',
                'Hash anchored successfully',
                `Hash ${hash.slice(0, 8)}...${hash.slice(-4)} registered on Solana`,
                { hash, txSignature: tx }
            ).catch(err => console.error('[Worker] Notification failed:', err.message));

            // 4. Send professional anchoring confirmation (Non-blocking)
            const { sendHashAnchoredEmail } = require('../services/emailService');
            if (updatedRecord?.organization?.owner?.email) {
                sendHashAnchoredEmail(updatedRecord.organization.owner.email, hash, tx, metadata).catch(err => {
                    console.error('[Worker] Email dispatch failed:', err.message);
                });
            }

            // 5. Trigger Webhooks
            await webhookService.triggerWebhook(organizationId, 'anchor_success', {
                hash,
                txSignature: tx,
                pdaAddress,
                metadata,
                registeredAt: new Date(updatedRecord.timestamp * 1000).toISOString()
            });

            results.push({ hash, status: 'success', tx, pdaAddress });
        } catch (e) {
            console.error(`Failed to register hash ${hash}`, e.message);

            // Create Failure Notification
            await notificationService.createNotification(
                organizationId,
                'anchor_failed',
                'Hash registration failed',
                `Failed to anchor hash ${hash.slice(0, 8)}...`,
                { hash, error: e.message }
            ).catch(err => console.error('[Worker] Notification failed:', err.message));

            // Trigger Failure Webhook
            await webhookService.triggerWebhook(organizationId, 'anchor_failed', {
                hash,
                error: e.message
            });

            results.push({ hash, status: 'error', error: e.message });
        }
    }

    return results;
}, { connection });

worker.on('completed', job => {
    console.log(`Batch Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`Batch Job ${job.id} has failed with ${err.message}`);
});

module.exports = {
    hashQueue
};