const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const { Keypair } = require('@solana/web3.js');
const { saveConfig, loadConfig, getWalletPath } = require('../utils/configManager');

function createWalletCommand() {
    const walletCmd = new Command('wallet').description('Manage local SipHeron keypairs');

    walletCmd
        .command('create <name>')
        .description('Generate a new funded Keypair locally')
        .action((name) => {
            const walletPath = getWalletPath(name);
            if (fs.existsSync(walletPath)) {
                console.log(chalk.red(`Wallet ${name} already exists!`));
                return;
            }

            const keypair = Keypair.generate();
            const secret = Array.from(keypair.secretKey);

            // We need inquirer dynamically since it's ESM in newer versions
            import('inquirer').then(({ default: inquirer }) => {
                inquirer.prompt([
                    {
                        type: 'password',
                        name: 'password',
                        message: 'Enter a strong password to encrypt this wallet:',
                        mask: '*'
                    }
                ]).then((answers) => {
                    const crypto = require('crypto');
                    const algorithm = 'aes-256-cbc';

                    // Create encryption key from password
                    const key = crypto.scryptSync(answers.password, 'salt', 32);
                    const iv = crypto.randomBytes(16);

                    const cipher = crypto.createCipheriv(algorithm, key, iv);
                    let encrypted = cipher.update(JSON.stringify(secret), 'utf8', 'hex');
                    encrypted += cipher.final('hex');

                    const payload = {
                        iv: iv.toString('hex'),
                        data: encrypted
                    };

                    fs.writeFileSync(walletPath, JSON.stringify(payload));

                    const config = loadConfig();
                    if (!config.defaultWallet) {
                        config.defaultWallet = name;
                        saveConfig(config);
                    }

                    console.log(chalk.green(`\nSuccessfully generated new encrypted wallet '${name}'`));
                    console.log(`Public Key: ${chalk.cyan(keypair.publicKey.toBase58())}`);
                    console.log(`Saved locally to: ${walletPath}`);
                });
            });

            const config = loadConfig();
            if (!config.defaultWallet) {
                config.defaultWallet = name;
                saveConfig(config);
            }

            console.log(chalk.green(`Successfully generated new wallet '${name}'`));
            console.log(`Public Key: ${chalk.cyan(keypair.publicKey.toBase58())}`);
            console.log(`Saved locally to: ${walletPath}`);
        });

    walletCmd
        .command('list')
        .description('List configured wallets')
        .action(() => {
            const config = loadConfig();
            const files = fs.readdirSync(require('path').join(require('os').homedir(), '.vdr'));

            const wallets = files.filter(f => f.startsWith('wallet_') && f.endsWith('.json'));
            if (wallets.length === 0) {
                console.log("No wallets found. Run 'sipheron-vdr wallet create <name>'");
                return;
            }

            console.log(chalk.bold('\nConfigured Wallets:'));
            wallets.forEach(w => {
                const name = w.replace('wallet_', '').replace('.json', '');
                const isDefault = config.defaultWallet === name ? chalk.green(' [Default]') : '';
                console.log(`- ${name}${isDefault}`);
            });
            console.log('');
        });

    return walletCmd;
}

module.exports = createWalletCommand;
