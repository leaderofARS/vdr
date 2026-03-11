/**
 * @file link.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/commands/link.js
 * @description CLI command modules deployed via Commander.js.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Command } = require("commander");
const axios = require("axios");
const ora = require("ora");
const chalk = require("chalk");
const { loadConfig, saveConfig } = require("../utils/configManager");

function createLinkCommand() {
    const linkCmd = new Command("link")
        .description("Link your CLI to an organization using an API Key")
        .argument("<apiKey>", "Institutional API Key from the SipHeron Dashboard")
        .action(async (apiKey) => {
            const config = loadConfig();
            const apiUrl = config.apiUrl || "https://api.sipheron.com";

            const spinner = ora("Verifying Institutional API Key...").start();

            try {
                const response = await axios.get(`${apiUrl}/auth/verify-key`, {
                    headers: { 'x-api-key': apiKey }
                });

                // FIX: Support different response formats and provide fallbacks
                const org = response.data.organization || response.data.org || {};
                const user = response.data.user || {};

                const orgName = org.name || "N/A";
                const orgId = org.id || "N/A";
                const solanaPDA = org.solanaPubkey || "N/A";
                const userEmail = user.email || "N/A";

                // Update local config
                config.apiKey = apiKey;
                config.organizationId = org.id || null;
                config.organizationName = org.name || null;

                saveConfig(config);

                spinner.succeed(chalk.green("CLI Linked Successfully!"));

                console.log("\n" + chalk.bold("--- Institutional Context ---"));
                console.log(`${chalk.cyan("Organization:")} ${orgName}`);
                console.log(`${chalk.cyan("ID:")}           ${orgId}`);
                console.log(`${chalk.cyan("Admin:")}        ${userEmail}`);
                console.log(`${chalk.cyan("Solana PDA:")}   ${solanaPDA}`);
                console.log("\n" + chalk.gray("Your CLI is now authorized to anchor proofs to this institution's registry."));

            } catch (error) {
                spinner.fail(chalk.red("Institutional Linking Failed"));
                if (error.response) {
                    console.error(chalk.red(`Error: ${error.response.data.error || "Invalid API Key"}`));
                } else {
                    console.error(chalk.red(`Error: ${error.message}`));
                    console.log(chalk.yellow(`\nTip: Ensure your API server is running at ${apiUrl}`));
                    console.log(chalk.yellow("Use 'sipheron-vdr config set apiUrl <url>' to change it."));
                }
            }
        });

    return linkCmd;
}

module.exports = createLinkCommand;
