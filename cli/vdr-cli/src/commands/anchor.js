/**
 * @file anchor.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/commands/anchor.js
 * @description CLI command modules deployed via Commander.js.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Command } = require("commander");
const axios = require("axios");
const ora = require("ora");
const chalk = require("chalk");
const { getStagedItems, clearStagedItems } = require("../utils/stagingManager");
const { loadConfig } = require("../utils/configManager");
const { formatSignature } = require("../utils/format");

function createAnchorCommand() {
    const pushCmd = new Command("anchor")
        .description("Commit all locally staged hashes to the SipHeron Solana Registry. (Like git push)")
        .action(async () => {
            const items = getStagedItems();

            if (items.length === 0) {
                console.log(chalk.yellow("No hashes staged. Nothing to push."));
                return;
            }

            const config = loadConfig();
            const apiKey = config.apiKey || process.env.SIPHERON_API_KEY;
            const apiUrl = config.apiUrl || 'https://api.sipheron.com';

            if (!apiKey) {
                console.error(chalk.red('No API key found. Run: sipheron-vdr link <apiKey>'));
                process.exit(1);
            }

            console.log(chalk.bold(`Preparing to push ${items.length} hashes to SipHeron Registry...\n`));

            const spinner = ora("Submitting batch to backend queue...").start();

            try {
                // Post each hash individually to support per-file metadata
                for (const staged of items) {
                    spinner.text = `Anchoring ${staged.file}...`;
                    await axios.post(`${apiUrl}/api/hashes`, {
                        hash: staged.hash,
                        metadata: staged.metadata || require('path').basename(staged.file),
                        fileSize: staged.fileSize || null,
                        mimeType: staged.mimeType || null,
                    }, {
                        headers: { 
                            'x-api-key': apiKey,
                            'Content-Type': 'application/json'
                        }
                    });
                }

                spinner.succeed(chalk.green(`Successfully dispatched ${items.length} hashes to the blockchain!`));
                console.log(chalk.gray(`The SipHeron Indexer is currently mapping these PDAs to the Smart Contract in the background.`));

                // Clear the local queue
                clearStagedItems();
                console.log(chalk.green("\nLocal staging queue cleared."));

            } catch (error) {
                spinner.fail(chalk.red("Failed to push hashes to registry"));

                if (error.response) {
                    console.error(chalk.red(`Status: ${error.response.status}`));
                    console.error(chalk.red(`Error:  ${JSON.stringify(error.response.data)}`));

                    if (error.response.status === 401 || error.response.status === 403) {
                        console.log(chalk.yellow('\nTip: Authentication failed. Re-link your CLI with: sipheron-vdr link <apiKey>'));
                    }
                } else {
                    console.error(chalk.red(`Error:  ${error.message}`));
                }
                process.exit(1);
            }
        });

    return pushCmd;
}

module.exports = createAnchorCommand;
