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
            console.log('\n--- Current VDR Configuration ---');
            console.log(JSON.stringify(config, null, 2));
            console.log('');
        });

    return configCmd;
}

module.exports = createConfigCommand;
