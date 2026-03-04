/**
 * @file wallet.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/commands/wallet.js
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
    const algorithm = 'aes-256-cbc';

    // Create encryption key from password with a random salt
    const salt = crypto.randomBytes(32);
    const key = crypto.scryptSync(answers.password, salt, 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(secret), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const payload = {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
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

module.exports = { createWalletCommand, createWallet };
