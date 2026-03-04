/**
 * @file status.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/commands/status.js
 * @description CLI command modules deployed via Commander.js.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Command } = require("commander");
const chalk = require("chalk");
const { getStagedItems } = require("../utils/stagingManager");

function createStatusCommand() {
    const statusCmd = new Command("status")
        .description("View files and hashes currently staged for SipHeron registry upload.")
        .action(() => {
            const config = require("../utils/configManager").loadConfig();
            const items = getStagedItems();

            console.log(chalk.bold("\n--- SipHeron CLI Status ---"));

            if (config.apiKey && config.organizationName) {
                console.log(`${chalk.cyan("Linked Institution:")} ${chalk.white(config.organizationName)}`);
                console.log(`${chalk.cyan("Organization ID:")}   ${chalk.gray(config.organizationId)}`);
                console.log(`${chalk.cyan("API Server:")}        ${chalk.gray(config.apiUrl)}`);
            } else {
                console.log(chalk.yellow("Status: Unlinked (Personal/Local Mode)"));
                console.log(chalk.gray("Use 'sipheron-vdr link <apiKey>' to bind to an institution."));
            }

            if (items.length === 0) {
                console.log(`\n${chalk.gray("No hashes are currently staged for commit.")}`);
                console.log(`Use ${chalk.cyan('sipheron-vdr stage <file>')} to stage a file.`);
                return;
            }

            console.log(chalk.bold(`\nStaged Files (${items.length}):`));
            console.log(chalk.gray("These hashes will be submitted to the Solana network on the next push.\n"));

            items.forEach((item, index) => {
                const dateStaged = item.stagedAt ? new Date(item.stagedAt).toLocaleString() : 'Unknown';
                const dateModified = item.lastModified ? new Date(item.lastModified).toLocaleString() : 'Unknown';
                const sizeKb = item.fileSize ? (item.fileSize / 1024).toFixed(2) + ' KB' : 'Unknown';

                console.log(`${chalk.green('+')} ${chalk.white(item.file)}`);
                console.log(`  Hash:     ${chalk.cyan(item.hash)}`);
                console.log(`  Metadata: ${item.metadata}`);
                console.log(`  Size:     ${sizeKb}`);
                console.log(`  Modified: ${dateModified}`);
                console.log(`  Staged:   ${dateStaged}`);
                console.log(`  Expiry:   ${item.expiry === 0 ? "Infinite" : item.expiry + "s"}`);
                console.log("");
            });

            console.log(`Run ${chalk.yellow('sipheron-vdr anchor')} to commit these hashes.`);
            console.log("");
        });

    return statusCmd;
}

module.exports = createStatusCommand;
