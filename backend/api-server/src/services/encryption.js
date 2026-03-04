/**
 * @file encryption.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/services/encryption.js
 * @description Core business logic and external service integrations.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const crypto = require('crypto');

class FieldEncryption {
    constructor() {
        this.algorithm = 'aes-256-gcm';

        const keyHex = process.env.ENCRYPTION_KEY;
        if (keyHex) {
            this.key = Buffer.from(keyHex, 'hex');
        } else {
            this.key = null;
            console.warn('[Encryption] ENCRYPTION_KEY not set. Field-level encryption disabled.');
        }
    }

    /**
     * Check if encryption is available.
     */
    isEnabled() {
        return this.key !== null;
    }

    /**
     * Encrypt a plaintext string.
     * Returns an object with encrypted data, IV, and authentication tag.
     */
    encrypt(text) {
        if (!this.key) return { encrypted: text, iv: null, authTag: null };

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    /**
     * Decrypt ciphertext using the stored IV and auth tag.
     */
    decrypt(encrypted, iv, authTag) {
        if (!this.key || !iv || !authTag) return encrypted;

        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.key,
            Buffer.from(iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

module.exports = new FieldEncryption();
