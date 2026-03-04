/**
 * HashiCorp Vault Integration Service
 * Fix 1.3 & 1.4: Secure Key Management
 * 
 * This service provides secure secret retrieval from HashiCorp Vault
 * instead of storing sensitive keys in plaintext .env files.
 */

const axios = require('axios');

class VaultService {
    constructor() {
        this.vaultAddr = process.env.VAULT_ADDR || 'http://127.0.0.1:8200';
        this.vaultToken = process.env.VAULT_TOKEN;
        this.vaultNamespace = process.env.VAULT_NAMESPACE || '';
        this.secretPath = process.env.VAULT_SECRET_PATH || 'secret/data/sipheron/prod';
        
        // Cache for secrets to reduce Vault API calls
        this.secretCache = {};
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.lastFetch = null;

        if (!this.vaultToken) {
            console.warn('[Vault] VAULT_TOKEN not set. Falling back to .env file.');
        }
    }

    /**
     * Get secret from Vault with caching
     * @param {string} key - Secret key to retrieve
     * @returns {Promise<string>} Secret value
     */
    async getSecret(key) {
        // If Vault is not configured, fall back to environment variables
        if (!this.vaultToken) {
            return process.env[key];
        }

        // Check cache first
        const now = Date.now();
        if (this.secretCache[key] && this.lastFetch && (now - this.lastFetch < this.cacheExpiry)) {
            return this.secretCache[key];
        }

        try {
            // Fetch all secrets from Vault
            const headers = {
                'X-Vault-Token': this.vaultToken
            };

            if (this.vaultNamespace) {
                headers['X-Vault-Namespace'] = this.vaultNamespace;
            }

            const response = await axios.get(
                `${this.vaultAddr}/v1/${this.secretPath}`,
                { headers }
            );

            // Vault KV v2 stores data under 'data.data'
            const secrets = response.data.data.data;

            // Update cache
            this.secretCache = secrets;
            this.lastFetch = now;

            return secrets[key];
        } catch (error) {
            console.error(`[Vault] Error fetching secret '${key}':`, error.message);
            
            // Fallback to environment variable
            console.warn(`[Vault] Falling back to environment variable for '${key}'`);
            return process.env[key];
        }
    }

    /**
     * Get multiple secrets at once
     * @param {string[]} keys - Array of secret keys
     * @returns {Promise<Object>} Object with key-value pairs
     */
    async getSecrets(keys) {
        const secrets = {};
        
        for (const key of keys) {
            secrets[key] = await this.getSecret(key);
        }
        
        return secrets;
    }

    /**
     * Store secret in Vault (for key rotation)
     * @param {string} key - Secret key
     * @param {string} value - Secret value
     * @returns {Promise<boolean>} Success status
     */
    async setSecret(key, value) {
        if (!this.vaultToken) {
            throw new Error('Vault token not configured. Cannot store secrets.');
        }

        try {
            const headers = {
                'X-Vault-Token': this.vaultToken,
                'Content-Type': 'application/json'
            };

            if (this.vaultNamespace) {
                headers['X-Vault-Namespace'] = this.vaultNamespace;
            }

            // Get existing secrets first
            const existingSecrets = await this.getAllSecrets();

            // Merge with new secret
            const updatedSecrets = {
                ...existingSecrets,
                [key]: value
            };

            // Write back to Vault
            await axios.post(
                `${this.vaultAddr}/v1/${this.secretPath}`,
                { data: updatedSecrets },
                { headers }
            );

            // Invalidate cache
            this.secretCache = {};
            this.lastFetch = null;

            console.log(`[Vault] Successfully stored secret '${key}'`);
            return true;
        } catch (error) {
            console.error(`[Vault] Error storing secret '${key}':`, error.message);
            return false;
        }
    }

    /**
     * Get all secrets from Vault
     * @returns {Promise<Object>} All secrets
     */
    async getAllSecrets() {
        if (!this.vaultToken) {
            return {};
        }

        try {
            const headers = {
                'X-Vault-Token': this.vaultToken
            };

            if (this.vaultNamespace) {
                headers['X-Vault-Namespace'] = this.vaultNamespace;
            }

            const response = await axios.get(
                `${this.vaultAddr}/v1/${this.secretPath}`,
                { headers }
            );

            return response.data.data.data;
        } catch (error) {
            console.error('[Vault] Error fetching all secrets:', error.message);
            return {};
        }
    }

    /**
     * Clear secret cache (useful for testing or forced refresh)
     */
    clearCache() {
        this.secretCache = {};
        this.lastFetch = null;
    }

    /**
     * Health check for Vault connection
     * @returns {Promise<boolean>} Vault health status
     */
    async healthCheck() {
        if (!this.vaultToken) {
            return false;
        }

        try {
            const response = await axios.get(`${this.vaultAddr}/v1/sys/health`);
            return response.status === 200;
        } catch (error) {
            console.error('[Vault] Health check failed:', error.message);
            return false;
        }
    }
}

// Singleton instance
const vaultService = new VaultService();

module.exports = vaultService;
