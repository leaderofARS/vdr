const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const solanaService = require('../services/solana');

// Assume Redis is running locally on default port
const connection = new Redis({ maxRetriesPerRequest: null });

const hashQueue = new Queue('HashRegistration', { connection });

// Define the background worker
const worker = new Worker('HashRegistration', async job => {
    const { hashes, metadata, expiry, ownerSecret } = job.data;

    console.log(`Processing batch of ${hashes.length} hashes`);

    const results = [];

    for (const hash of hashes) {
        try {
            // In a real env, signing is done securely or via raw tx forwarding.
            // Here we assume the server holds the treasury/payer wallet via solanaService
            const tx = await solanaService.registerHash(hash, metadata, expiry);
            results.push({ hash, status: 'success', tx });
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
