/**
 * @file batchQueue.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/workers/batchQueue.js
 * @description Background job queue processors.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const solanaService = require('../services/solana');

// Use REDIS_URL from environment — falls back to localhost for local dev
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

connection.on('connect', () => {
    console.log('[Redis] Connected successfully');
});

connection.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
});

const hashQueue = new Queue('HashRegistration', { connection });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the background worker
const worker = new Worker('HashRegistration', async job => {
    const { hashes, metadata, expiry, organizationId } = job.data;

    console.log(`Processing batch of ${hashes.length} hashes for organization ${organizationId}`);

    const results = [];

    for (const hash of hashes) {
        try {
            // 1. Register on Solana
            const { tx, pdaAddress, owner } = await solanaService.registerHash(hash, metadata, expiry);

            // 2. Immediate Database Reflection (GitHub-style instant update)
            await prisma.hashRecord.upsert({
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
                }
            });

            results.push({ hash, status: 'success', tx, pdaAddress });
        } catch (e) {
            console.error(`Failed to register hash ${hash}`, e.message);
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