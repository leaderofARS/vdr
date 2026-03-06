/**
 * @file wallet.js
 * @module cli/vdr-cli/src/commands/wallet.js
 * @description CLI command modules deployed via Commander.js.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const { Keypair } = require('@solana/web3.js');
const { saveConfig, loadConfig, getWalletPath, CONFIG_DIR } = require('../utils/configManager');
const PermissionValidator = require('../utils/permissionValidator');

// MIGRATION: Legacy wallets used AES-256-CBC without an auth tag.
// New wallets use AES-256-GCM (authenticated encryption).
// On load, if a wallet file has no `authTag` field, it is detected as legacy CBC,
// decrypted with the old method, re-encrypted with GCM, and saved back to disk.

async function createWallet(name) {
    const walletPath = getWalletPath(name);
    if (fs.existsSync(walletPath)) {
        console.log(chalk.red(`Wallet ${name} already exists!`));
        return false;
    }

    // Validate config directory permissions before creating wallet
    const validator = new PermissionValidator();
    const dirValidation = validator.validateDirectoryPermissions(CONFIG_DIR, { strict: true });
    if (!dirValidation.isValid) {
        console.warn(chalk.yellow(`Warning: ${dirValidation.message}`));
        // Attempt to fix permissions
        const dirEnforcement = validator.enforceSecureAccess(CONFIG_DIR, { isDirectory: true, strict: true });
        if (!dirEnforcement.success) {
            console.error(chalk.red(`Failed to secure config directory: ${dirEnforcement.message}`));
            return false;
        }
    }

    const keypair = Keypair.generate();
    const secret = Array.from(keypair.secretKey);

    // We need inquirer dynamically since it's ESM in newer versions
    const { default: inquirer } = await import('inquirer');

    const answers = await inquirer.prompt([
        {
            type: 'password',
            name: 'password',
            message: 'Enter a strong password to encrypt this wallet:',
            mask: '*'
        }
    ]);

    const crypto = require('crypto');

    const algorithm = 'aes-256-gcm';

    // Create encryption key from password with a random salt
    const salt = crypto.randomBytes(32);
    const key = crypto.scryptSync(answers.password, salt, 32);
    const iv = crypto.randomBytes(12); // GCM uses 12-byte IV

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(secret), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    const payload = {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        authTag,  // GCM integrity proof — absent in legacy CBC wallets
        data: encrypted
    };

    fs.writeFileSync(walletPath, JSON.stringify(payload), { mode: 0o600 });

    // Validate wallet file permissions after creation
    const fileValidation = validator.validateFilePermissions(walletPath, { strict: true });
    if (!fileValidation.isValid) {
        console.warn(chalk.yellow(`Warning: ${fileValidation.message}`));
        // Attempt to fix permissions
        const fileEnforcement = validator.enforceSecureAccess(walletPath, { isDirectory: false, strict: true });
        if (!fileEnforcement.success) {
            console.error(chalk.red(`Failed to secure wallet file: ${fileEnforcement.message}`));
            return false;
        }
    }

    const config = loadConfig();
    if (!config.defaultWallet) {
        config.defaultWallet = name;
        saveConfig(config);
    }

    console.log(chalk.green(`\nSuccessfully generated new encrypted wallet '${name}'`));
    console.log(`Public Key: ${chalk.cyan(keypair.publicKey.toBase58())}`);
    console.log(`Saved locally to: ${walletPath}`);
    return true;
}

/**
 * MIGRATION: Decrypt a legacy AES-256-CBC wallet and re-encrypt with AES-256-GCM.
 * Called automatically when a wallet file is detected without an `authTag` field.
 * @param {string} walletPath - Absolute path to the wallet JSON file
 * @param {string} password - User-provided password for decryption
 * @returns {Array} The decrypted secret key array
 */
function migrateWalletCbcToGcm(walletPath, password) {
    const crypto = require('crypto');
    const payload = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));

    // Step 1: Decrypt with legacy CBC
    const salt = Buffer.from(payload.salt, 'hex');
    const iv = Buffer.from(payload.iv, 'hex');
    const key = crypto.scryptSync(password, salt, 32);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(payload.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const secretArray = JSON.parse(decrypted);

    // Step 2: Re-encrypt with GCM
    const newSalt = crypto.randomBytes(32);
    const newKey = crypto.scryptSync(password, newSalt, 32);
    const newIv = crypto.randomBytes(12); // GCM uses 12-byte IV

    const cipher = crypto.createCipheriv('aes-256-gcm', newKey, newIv);
    let encrypted = cipher.update(JSON.stringify(secretArray), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    const newPayload = {
        iv: newIv.toString('hex'),
        salt: newSalt.toString('hex'),
        authTag,
        data: encrypted
    };

    fs.writeFileSync(walletPath, JSON.stringify(newPayload), { mode: 0o600 });
    console.log(chalk.green('  ✓ Wallet migrated from AES-256-CBC to AES-256-GCM (authenticated encryption).'));

    return secretArray;
}

/**
 * Load and decrypt a wallet file. Handles both legacy CBC and modern GCM formats.
 * @param {string} walletPath - Absolute path to the wallet JSON file
 * @param {string} password - User-provided password
 * @returns {Array} The decrypted secret key array
 */
function loadWallet(walletPath, password) {
    const crypto = require('crypto');
    const payload = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));

    // MIGRATION: Detect legacy CBC wallets (no authTag field)
    if (!payload.authTag) {
        console.log(chalk.yellow('  ⚠ Legacy wallet detected (AES-256-CBC). Migrating to AES-256-GCM...'));
        try {
            return migrateWalletCbcToGcm(walletPath, password);
        } catch (err) {
            console.error(chalk.red(`  ✖ Migration failed: ${err.message}`));
            console.error(chalk.red('    The wallet file may be corrupted or the password is incorrect.'));
            console.error(chalk.red('    If you have the original Solana keypair, recreate the wallet with: sipheron-vdr wallet create <name>'));
            throw new Error('Wallet migration from CBC to GCM failed');
        }
    }

    // Modern GCM decryption
    const salt = Buffer.from(payload.salt, 'hex');
    const iv = Buffer.from(payload.iv, 'hex');
    const authTag = Buffer.from(payload.authTag, 'hex');
    const key = crypto.scryptSync(password, salt, 32);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(payload.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}

function createWalletCommand() {
    const walletCmd = new Command('wallet').description('Manage local SipHeron keypairs');

    walletCmd
        .command('create <name>')
        .description('Generate a new funded Keypair locally')
        .action(async (name) => {
            await createWallet(name);
        });

    walletCmd
        .command('list')
        .description('List configured wallets')
        .action(() => {
            const config = loadConfig();
            const path = require('path');
            const os = require('os');
            const configDir = path.join(os.homedir(), '.vdr');

            // Validate config directory permissions before listing
            const validator = new PermissionValidator();
            const dirValidation = validator.validateDirectoryPermissions(configDir, { strict: true });
            if (!dirValidation.isValid) {
                console.warn(chalk.yellow(`Warning: ${dirValidation.message}`));
                // Attempt to fix permissions
                const dirEnforcement = validator.enforceSecureAccess(configDir, { isDirectory: true, strict: true });
                if (!dirEnforcement.success) {
                    console.error(chalk.red(`Failed to secure config directory: ${dirEnforcement.message}`));
                    return;
                }
            }

            const files = fs.readdirSync(configDir);

            const wallets = files.filter(f => f.startsWith('wallet_') && f.endsWith('.json'));
            if (wallets.length === 0) {
                console.log("No wallets found. Run 'sipheron-vdr wallet create <name>'");
                return;
            }

            console.log(chalk.bold('\nConfigured Wallets:'));
            wallets.forEach(w => {
                const name = w.replace('wallet_', '').replace('.json', '');
                const isDefault = config.defaultWallet === name ? chalk.green(' [Default]') : '';

                // Validate each wallet file permissions
                const walletPath = path.join(configDir, w);
                const fileValidation = validator.validateFilePermissions(walletPath, { strict: true });
                const securityStatus = fileValidation.isValid ? '' : chalk.red(' [INSECURE]');

                console.log(`- ${name}${isDefault}${securityStatus}`);
            });
            console.log('');
        });

    return walletCmd;
}

module.exports = { createWalletCommand, createWallet, loadWallet };
