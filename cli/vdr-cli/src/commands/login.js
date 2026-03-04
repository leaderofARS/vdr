/**
 * @file login.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/commands/login.js
 * @description CLI command modules deployed via Commander.js.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Command } = require('commander');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { loadConfig, saveConfig } = require('../utils/configManager');

const { createWallet } = require('./wallet');

async function performLogin(config) {
    const spinner = ora('Initializing authentication session...').start();

    try {
        const initRes = await axios.post(`${config.apiUrl}/auth/cli/init`);
        const { code, verificationUrl, expiresIn } = initRes.data;

        spinner.stop();
        console.log('\n' + chalk.blue.bold('=== SipHeron VDR Web Login ==='));
        console.log(chalk.white('1. Open this URL in your browser:'));
        console.log(chalk.cyan.underline(verificationUrl));
        console.log(chalk.white('\n2. Verify that the code below is shown on the dashboard:'));
        console.log(chalk.white.bgBlue.bold(`  ${code}  `));
        console.log('\n' + chalk.gray(`This session will expire in ${expiresIn / 60} minutes.`));

        const pollSpinner = ora('Waiting for authorization...').start();

        return new Promise((resolve, reject) => {
            const pollInterval = setInterval(async () => {
                try {
                    const pollRes = await axios.get(`${config.apiUrl}/auth/cli/poll/${code}`);
                    const { status, apiKey, organizationId } = pollRes.data;

                    if (status === 'AUTHORIZED') {
                        clearInterval(pollInterval);
                        pollSpinner.succeed(chalk.green('Successfully authenticated!'));

                        const newConfig = { ...config, apiKey, organizationId };
                        saveConfig(newConfig);
                        resolve(newConfig);
                    } else if (status === 'EXPIRED') {
                        clearInterval(pollInterval);
                        pollSpinner.fail(chalk.red('Authentication session expired. Please try again.'));
                        reject(new Error('EXPIRED'));
                    }
                } catch (err) { }
            }, 3000);

            setTimeout(() => {
                clearInterval(pollInterval);
                pollSpinner.fail(chalk.red('Authentication timed out.'));
                reject(new Error('TIMEOUT'));
            }, expiresIn * 1000);
        });

    } catch (err) {
        spinner.fail(chalk.red('Failed to connect to SipHeron API.'));
        console.error(chalk.gray(err.message));
        throw err;
    }
}

function createLoginCommand() {
    return new Command('login')
        .description('Authenticate CLI with your SipHeron VDR account')
        .action(async () => {
            const config = loadConfig();
            try {
                const newConfig = await performLogin(config);
                console.log('\n' + chalk.cyan('Institutional context has been updated.'));

                // Auto-create wallet if missing
                if (!newConfig.defaultWallet) {
                    console.log(chalk.yellow('\nNo local wallet found. Let\'s set up your cryptographic identity.'));
                    await createWallet('default');
                }

                console.log(chalk.white('\nSetup complete! You can now use ') + chalk.bold('sipheron-vdr anchor') + chalk.white(' to submit hashes.'));
                process.exit(0);
            } catch (err) {
                process.exit(1);
            }
        });
}

module.exports = { createLoginCommand, performLogin };
