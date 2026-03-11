/**
 * @file configManager.js
 * @module cli/vdr-cli/src/utils/configManager.js
 * @description CLI utilities for encryption, formatting, and file management.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const PermissionValidator = require('./permissionValidator');

const CONFIG_DIR = path.join(os.homedir(), '.vdr');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Derive a machine-specific encryption key using scrypt.
 * The salt is derived from hostname + username, binding the key to this machine.
 */
function deriveKey() {
    const salt = `vdr:${os.hostname()}:${os.userInfo().username}`;
    return crypto.scryptSync(salt, 'sipheron-vdr-cli', 32);
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns a colon-separated string: iv:authTag:ciphertext (all hex-encoded).
 */
function encryptToken(plaintext) {
    if (!plaintext) return null;
    const key = deriveKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt a token previously encrypted with encryptToken.
 * Expects the colon-separated format: iv:authTag:ciphertext.
 */
function decryptToken(encryptedString) {
    if (!encryptedString) return null;

    // Handle legacy plaintext tokens (not in iv:tag:data format)
    if (!encryptedString.includes(':')) {
        return encryptedString;
    }

    const parts = encryptedString.split(':');
    if (parts.length !== 3) {
        return encryptedString;
    }

    try {
        const key = deriveKey();
        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch {
        // If decryption fails (e.g. machine changed), return null to force re-auth
        return null;
    }
}

function loadConfig() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { mode: 0o700 });
    }

    if (!fs.existsSync(CONFIG_FILE)) {
        const defaultConfig = {
            apiUrl: 'https://api.sipheron.com',
            network: 'localnet',
            apiKey: null,
            defaultWallet: null
        };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), { mode: 0o600 });
    }

    // Validate permissions before loading
    if (process.platform !== 'win32') {
        const validator = new PermissionValidator();

        // Validate directory permissions
        const dirValidation = validator.validateDirectoryPermissions(CONFIG_DIR, { strict: true });
        if (!dirValidation.isValid) {
            console.warn(`Warning: ${dirValidation.message}`);
            // Attempt to fix permissions
            const dirEnforcement = validator.enforceSecureAccess(CONFIG_DIR, { isDirectory: true, strict: true });
            if (!dirEnforcement.success) {
                throw new Error(`Failed to secure config directory: ${dirEnforcement.message}`);
            }
        }

        // Validate file permissions
        const fileValidation = validator.validateFilePermissions(CONFIG_FILE, { strict: true });
        if (!fileValidation.isValid) {
            console.warn(`Warning: ${fileValidation.message}`);
            // Attempt to fix permissions
            const fileEnforcement = validator.enforceSecureAccess(CONFIG_FILE, { isDirectory: false, strict: true });
            if (!fileEnforcement.success) {
                throw new Error(`Failed to secure config file: ${fileEnforcement.message}`);
            }
        }
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));

    // Decrypt apiKey if present
    if (config.apiKey) {
        config.apiKey = decryptToken(config.apiKey);
    }

    // Prioritize Environment Variables for security in CI/CD
    if (process.env.SIPHERON_API_KEY) {
        config.apiKey = process.env.SIPHERON_API_KEY;
    }

    return config;
}

function saveConfig(config) {

    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { mode: 0o700 });
    }

    if (config.apiUrl
        && config.apiUrl.startsWith('http://')
        && !config.apiUrl.includes('localhost')
        && !config.apiUrl.includes('127.0.0.1')) {
        const chalk = require('chalk');
        console.warn(chalk.yellow('⚠ Warning: API URL is not HTTPS. Your API key will be transmitted in plaintext.'));
        console.warn(chalk.yellow('  Use: sipheron-vdr config set apiUrl https://...'));
    }

    // Validate permissions before saving
    if (process.platform !== 'win32') {
        const validator = new PermissionValidator();

        // Validate directory permissions
        const dirValidation = validator.validateDirectoryPermissions(CONFIG_DIR, { strict: true });
        if (!dirValidation.isValid) {
            console.warn(`Warning: ${dirValidation.message}`);
            // Attempt to fix permissions
            const dirEnforcement = validator.enforceSecureAccess(CONFIG_DIR, { isDirectory: true, strict: true });
            if (!dirEnforcement.success) {
                throw new Error(`Failed to secure config directory: ${dirEnforcement.message}`);
            }
        }
    }

    // Encrypt apiKey before writing to disk
    const configToWrite = { ...config };
    if (configToWrite.apiKey) {
        configToWrite.apiKey = encryptToken(configToWrite.apiKey);
    }

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(configToWrite, null, 2), { mode: 0o600 });

    // Validate file permissions after saving
    if (process.platform !== 'win32') {
        const validator = new PermissionValidator();
        const fileValidation = validator.validateFilePermissions(CONFIG_FILE, { strict: true });
        if (!fileValidation.isValid) {
            console.warn(`Warning: ${fileValidation.message}`);
            // Attempt to fix permissions
            const fileEnforcement = validator.enforceSecureAccess(CONFIG_FILE, { isDirectory: false, strict: true });
            if (!fileEnforcement.success) {
                throw new Error(`Failed to secure config file: ${fileEnforcement.message}`);
            }
        }
    }
}

function getWalletPath(name) {
    return path.join(CONFIG_DIR, `wallet_${name}.json`);
}

module.exports = {
    loadConfig,
    saveConfig,
    getWalletPath,
    CONFIG_DIR
};
