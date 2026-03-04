/**
 * @file config.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/commands/config.js
 * @description CLI command modules deployed via Commander.js.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Command } = require('commander');
const chalk = require('chalk');
const { loadConfig, saveConfig } = require('../utils/configManager');

function createConfigCommand() {
    const configCmd = new Command('config').description('Configure VDR API and Network settings');

    configCmd
        .command('set <key> <value>')
        .description('Set a configuration value (e.g., apiUrl, network, apiKey)')
        .action((key, value) => {
            const config = loadConfig();
            config[key] = value;
            saveConfig(config);
            console.log(chalk.green(`Config ${key} updated successfully.`));
        });

    configCmd
        .command('view')
        .description('View current configuration')
        .action(() => {
            const config = loadConfig();

            // Mask sensitive API Key for log security
            const maskedConfig = { ...config };
            if (maskedConfig.apiKey && typeof maskedConfig.apiKey === 'string') {
                const key = maskedConfig.apiKey;
                maskedConfig.apiKey = `${key.slice(0, 6)}...${key.slice(-4)}`;
            }

            console.log('\n--- Current VDR Configuration ---');
            console.log(JSON.stringify(maskedConfig, null, 2));
            console.log('');
        });

    return configCmd;
}

module.exports = createConfigCommand;
