/**
 * @file batch.js
 * @module cli/vdr-cli/src/commands/batch.js
 * @description CLI command modules deployed via Commander.js.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

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

                // Uses lstatSync instead of statSync to detect symlinks before following them.
                // Symlinks are skipped to prevent path traversal attacks that could expose
                // sensitive system files (e.g., /etc/, ~/.ssh/) in batch metadata.
                const filesToHash = [];
                const scanDir = (dir) => {
                    const files = fs.readdirSync(dir);
                    for (const file of files) {
                        const fullPath = path.join(dir, file);
                        const stats = fs.lstatSync(fullPath); // lstat, not stat
                        if (stats.isSymbolicLink()) continue; // Skip symlinks
                        if (stats.isDirectory()) {
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
                    hashes.push(await computeFileHash(file));
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
