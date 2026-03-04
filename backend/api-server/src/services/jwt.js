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

/**
 * Generate a short-lived access token.
 */
function generateToken(userId, email) {
    return jwt.sign(
        { userId, email },
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
    return jwt.sign(
        { userId, type: 'refresh' },
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
function verifyToken(token) {
    return jwt.verify(token, getVerifyKey(), {
        algorithms: [getAlgorithm()],
        issuer: 'sipheron-vdr',
        audience: 'sipheron-api'
    });
}

module.exports = { generateToken, generateRefreshToken, verifyToken, getAlgorithm };
