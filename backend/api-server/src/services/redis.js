/**
 * @file redis.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/services/redis.js
 * @description Centralized Redis client for SipHeron VDR.
 */

const Redis = require('ioredis');

// Use REDIS_URL from environment — falls back to localhost for local dev
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableOfflineQueue: true
});

redisClient.on('connect', () => {
    console.log('[Redis] Connected successfully');
});

redisClient.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
});

module.exports = redisClient;
