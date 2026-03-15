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
const { createFormatter } = require("../utils/formatter");

function createLinkCommand() {
    const linkCmd = new Command("link")
        .description("Link your CLI to an organization using an API Key")
        .argument("<apiKey>", "Institutional API Key from the SipHeron Dashboard")
        .option("-f, --format <format>", "Output format: human (default), json, quiet", "human")
        .action(async (apiKey, options) => {
            const config = loadConfig();
            const apiUrl = config.apiUrl || "https://api.sipheron.com";
            
            const fmt = createFormatter(options.format || 'human');

            const spinner = fmt.format === 'human' ? ora("Verifying Institutional API Key...").start() : null;

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
                const plan = org.plan || "free";

                // Update local config
                config.apiKey = apiKey;
                config.organizationId = org.id || null;
                config.organizationName = org.name || null;

                saveConfig(config);

                if (spinner) spinner.stop();

                fmt.success('Linked successfully', {
                  organization: orgName,
                  plan: plan,
                  apiKey: `${apiKey.slice(0, 8)}...`,
                  id: orgId,
                  solanaPDA: solanaPDA,
                  admin: userEmail,
                });
                fmt.exit(0);

            } catch (error) {
                if (spinner) spinner.stop();
                if (error.response) {
                    fmt.fail("Failed to link", { details: error.response.data.error || "Invalid API Key" });
                } else {
                    fmt.fail("Failed to link", { details: error.message, tip: `Ensure your API server is running at ${apiUrl}` });
                }
            }
        });

    return linkCmd;
}

module.exports = createLinkCommand;
