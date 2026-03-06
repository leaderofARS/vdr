/**
 * @file stage.js
 * @module cli/vdr-cli/src/commands/stage.js
 * @description CLI command modules deployed via Commander.js.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Command } = require("commander");
const ora = require("ora");
const chalk = require("chalk");
const { computeFileHash } = require("../utils/hash");
const fs = require("fs");
const path = require("path");
const { addStagedItem } = require("../utils/stagingManager");

function createStageCommand() {
    const registerCmd = new Command("stage")
        .description("Cryptographically hash a file locally and stage it for pushing to the SipHeron registry. (Like git commit)")
        .argument("<file>", "Path to the file you wish to stage")
        .option("-m, --metadata <metadata>", "Optional metadata to store with the hash", "")
        .option("-e, --expiry <seconds>", "Unix expiration time for hashes (0 for infinite)", "0")
        .action(async (file, options) => {
            const absolutePath = path.resolve(process.cwd(), file);
            if (!fs.existsSync(absolutePath)) {
                console.error(chalk.red(`Error: File not found at path '${file}'`));
                process.exit(1);
            }

            const spinner = ora("Computing local SHA-256 hash...").start();

            try {
                const hexHash = await computeFileHash(absolutePath);
                const stats = fs.statSync(absolutePath);

                spinner.succeed(`Hash computed locally: ${chalk.cyan(hexHash)}`);
                console.log(chalk.gray("Privacy check: Raw file data never leaves your machine."));

                const stagedItem = {
                    file: file,
                    hash: hexHash,
                    metadata: options.metadata || path.basename(absolutePath),
                    expiry: parseInt(options.expiry),
                    fileSize: stats.size,
                    lastModified: stats.mtime.toISOString(),
                };

                const added = addStagedItem(stagedItem);

                if (added) {
                    console.log("");
                    console.log(chalk.green(`✓ Staged 1 file successfully.`));
                    console.log(chalk.yellow(`Run 'sipheron-vdr anchor' to commit this hash to the Solana network.`));
                } else {
                    console.log("");
                    console.log(chalk.yellow(`⚠ This file's hash is already in the staging queue.`));
                }

            } catch (error) {
                spinner.fail(chalk.red("Failed to stage hash"));
                console.error(chalk.red(error.message));
            }
        });

    return registerCmd;
}

module.exports = createStageCommand;
