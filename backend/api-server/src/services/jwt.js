/**
 * @file jwt.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/services/jwt.js
 * @description Core business logic and external service integrations.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const redisClient = require('./redis');

const KEYS_DIR = path.join(__dirname, '../../keys');
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'private.pem');
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'public.pem');

let privateKey = null;
let publicKey = null;

/**
 * Load RSA keys from disk. Falls back to HS256 with JWT_SECRET if key files
 * are not present (development / migration period).
 */
function loadKeys() {
    try {
        if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
            privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
            publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
            console.log('[JWT] Loaded RS256 key pair');
        } else {
            console.warn('[JWT] RSA key pair not found at', KEYS_DIR);
            console.warn('[JWT] Falling back to HS256 with JWT_SECRET');
        }
    } catch (err) {
        console.error('[JWT] Failed to load RSA keys:', err.message);
    }
}

loadKeys();

function getAlgorithm() {
    return privateKey ? 'RS256' : 'HS256';
}

function getSigningKey() {
    return privateKey || process.env.JWT_SECRET;
}

function getVerifyKey() {
    return publicKey || process.env.JWT_SECRET;
}

// Enforce strong JWT secret (minimum 256 bytes hex ≈ 32 chars check, or minimum 32 bytes)
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.warn('[JWT] Warning: JWT_SECRET is weak or missing. Generating 256-bit ephemeral secret.');
    // Keep it constant during runtime
    process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a short-lived access token.
 */
function generateToken(userId, email) {
    const jti = crypto.randomUUID();
    return jwt.sign(
        { userId, email, jti },
        getSigningKey(),
        {
            algorithm: getAlgorithm(),
            expiresIn: '15m',
            issuer: 'sipheron-vdr',
            audience: 'sipheron-api'
        }
    );
}

/**
 * Generate a long-lived refresh token.
 */
function generateRefreshToken(userId) {
    const jti = crypto.randomUUID();
    return jwt.sign(
        { userId, type: 'refresh', jti },
        getSigningKey(),
        {
            algorithm: getAlgorithm(),
            expiresIn: '7d',
            issuer: 'sipheron-vdr',
            audience: 'sipheron-api'
        }
    );
}

/**
 * Verify a token (access or refresh).
 */
async function verifyToken(token) {
    const decoded = jwt.verify(token, getVerifyKey(), {
        algorithms: [getAlgorithm()],
        issuer: 'sipheron-vdr',
        audience: 'sipheron-api'
    });

    if (decoded.jti) {
        const isRevoked = await redisClient.get(`revoked_jti:${decoded.jti}`);
        if (isRevoked) {
            throw new Error('Token has been revoked');
        }
    }
    return decoded;
}

async function revokeToken(decodedToken) {
    if (!decodedToken.jti) return;
    const now = Math.floor(Date.now() / 1000);
    const ttl = decodedToken.exp - now;
    if (ttl > 0) {
        await redisClient.set(`revoked_jti:${decodedToken.jti}`, 'true', 'EX', ttl);
    }
}

module.exports = { generateToken, generateRefreshToken, verifyToken, revokeToken, getAlgorithm };
