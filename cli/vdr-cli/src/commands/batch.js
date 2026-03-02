const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { loadConfig } = require('../utils/configManager');
const { computeFileHash } = require('../utils/hash');

function createBatchCommand() {
    return new Command('batch')
        .description('Recursively hash a directory and submit to the SipHeron Batch Queue')
        .argument('<directory>', 'Directory path to scan')
        .option('-m, --metadata <metadata>', 'Custom metadata tagging for the entire batch')
        .option('-e, --expiry <seconds>', 'Unix expiration time for hashes', '0')
        .action(async (directory, options) => {
            const config = loadConfig();

            const spinner = ora('Scanning directory...').start();

            try {
                const absolutePath = path.resolve(process.cwd(), directory);
                if (!fs.existsSync(absolutePath)) throw new Error('Directory not found');

                // Simple recursive scan
                const filesToHash = [];
                const scanDir = (dir) => {
                    const files = fs.readdirSync(dir);
                    for (const file of files) {
                        const fullPath = path.join(dir, file);
                        if (fs.statSync(fullPath).isDirectory()) {
                            scanDir(fullPath);
                        } else {
                            filesToHash.push(fullPath);
                        }
                    }
                };

                scanDir(absolutePath);

                spinner.text = `Hashing ${filesToHash.length} files...`;

                const hashes = [];
                for (const file of filesToHash) {
                    hashes.push(computeFileHash(file));
                }

                spinner.text = 'Submitting hash batch to VDR Queue...';

                const response = await axios.post(`${config.apiUrl}/api/batch-register`, {
                    hashes,
                    metadata: options.metadata || `Batch ${path.basename(absolutePath)}`,
                    expiry: parseInt(options.expiry)
                }, {
                    headers: {
                        'x-api-key': config.apiKey || ''
                    }
                });

                spinner.succeed(chalk.green(`Batch processing queued! Job ID: ${response.data.jobId}`));
                console.log(`Track progress via network API`);

            } catch (e) {
                spinner.fail(chalk.red('Batch failed'));
                console.error(e.response?.data?.error || e.message);
            }
        });
}

module.exports = createBatchCommand;
