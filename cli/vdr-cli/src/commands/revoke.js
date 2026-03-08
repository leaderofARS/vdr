/**
 * @file revoke.js
 * @module cli/vdr-cli/src/commands/revoke.js
 * @description CLI command to revoke a document's proof on Solana.
 */

const { Command } = require("commander");
const axios = require("axios");
const ora = require("ora");
const chalk = require("chalk");
const { computeFileHash } = require("../utils/hash");
const fs = require("fs");
const { loadConfig } = require("../utils/configManager");

/**
 * Creates the 'revoke' command for the SipHeron VDR CLI.
 * Usage: sipheron-vdr revoke <file>
 */
function createRevokeCommand() {
    const revokeCmd = new Command("revoke")
        .description("Revoke a document's cryptographic proof on the Solana blockchain.")
        .argument("<file>", "Path to the local file to revoke")
        .action(async (file) => {
            if (!fs.existsSync(file)) {
                console.error(chalk.red(`Error: File not found at path '${file}'`));
                process.exit(1);
            }

            const config = loadConfig();

            // Onboarding check: ensure API key is present
            if (!config.apiKey && !process.env.SIPHERON_API_KEY) {
                console.error(chalk.red('Error: You must be logged in to revoke proofs. Run "sipheron-vdr login" first.'));
                process.exit(1);
            }

            const spinner = ora("Computing local SHA-256 hash...").start();

            try {
                // 1. Compute hash of the file locally
                const hexHash = await computeFileHash(file);
                spinner.succeed(`Local hash computed: ${chalk.cyan(hexHash)}`);

                spinner.start("Submitting revocation request to SipHeron Registry...");

                // 2. Call POST /api/hashes/revoke with { hash }
                const response = await axios.post(`${config.apiUrl}/api/hashes/revoke`, {
                    hash: hexHash
                }, {
                    headers: {
                        'x-api-key': config.apiKey || process.env.SIPHERON_API_KEY || ''
                    }
                });

                if (response.data.success) {
                    spinner.succeed(chalk.green("PROOF SUCCESSFULLY REVOKED"));
                    console.log("");
                    console.log(chalk.bold("Event Details:"));
                    console.log(`Transaction Signature: ${chalk.cyan(response.data.txSignature)}`);
                    console.log(`Explorer Record:       ${chalk.underline.blue(`https://explorer.solana.com/tx/${response.data.txSignature}?cluster=devnet`)}`);
                    console.log(chalk.gray(`\nVerification Status: This document is now marked as 'revoked' globally in the VDR Registry.`));
                }
            } catch (error) {
                spinner.fail(chalk.red("Revocation Failed"));
                const errMsg = error.response?.data?.error || error.message;
                console.error(chalk.red(`\nError Context: ${errMsg}`));

                if (errMsg.includes("already revoked")) {
                    console.log(chalk.yellow("Note: This hash status is already set to 'revoked'. No state change occurred."));
                } else if (errMsg.includes("not found")) {
                    console.log(chalk.yellow("Note: No record of this file exists under your organization's registry."));
                } else {
                    console.log(chalk.gray("\nPlease check your internet connection or try again later."));
                }
                process.exit(1);
            }
        });

    return revokeCmd;
}

module.exports = createRevokeCommand;
