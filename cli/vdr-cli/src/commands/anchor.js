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
            console.log(chalk.bold(`Preparing to push ${items.length} hashes to SipHeron Registry...\n`));

            // If we have less than 5, we can do them sequentially via standard register.
            // If more, we should use the batch API. For simplicity and robustness, 
            // we will use the batch API by default arrays.

            const spinner = ora("Submitting batch to backend queue...").start();

            try {
                // Formatting payload for batch endpoint
                const hashesOnly = items.map(i => i.hash);

                // Use the first item's metadata/expiry for the batch (in a mature version, batch API would accept arrays of objects)
                // We'll pass a generic metadata string to the batch queue representing this push
                const metadata = `Push Commit: ${items.length} files`;

                const response = await axios.post(`${config.apiUrl}/api/batch-register`, {
                    hashes: hashesOnly,
                    metadata: metadata,
                    expiry: 0 // Default batch expiry
                }, {
                    headers: { 'x-api-key': config.apiKey || '' }
                });

                spinner.succeed(chalk.green(`Successfully dispatched ${items.length} hashes to the blockchain!`));
                console.log(`\nJob ID: ${chalk.cyan(response.data.jobId)}`);
                console.log(chalk.gray(`The SipHeron Indexer is currently mapping these PDAs to the Smart Contract in the background.`));

                // Clear the local queue
                clearStagedItems();
                console.log(chalk.green("\nLocal staging queue cleared."));

            } catch (error) {
                spinner.fail(chalk.red("Failed to push hashes to registry"));
                console.error(chalk.red(error.response?.data?.error || error.message));
            }
        });

    return pushCmd;
}

module.exports = createAnchorCommand;
