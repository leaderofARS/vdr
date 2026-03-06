/**
 * @file verify.js
 * @module cli/vdr-cli/src/commands/verify.js
 * @description CLI command modules deployed via Commander.js.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { Command } = require("commander");
const axios = require("axios");
const ora = require("ora");
const chalk = require("chalk");
const { computeFileHash } = require("../utils/hash");
const fs = require("fs");
const { loadConfig } = require("../utils/configManager");

const verifyCmd = new Command("verify")
    .description("Verify a local file against the VDR registry")
    .argument("<file>", "Path to the file to verify")
    .action(async (file) => {
        if (!fs.existsSync(file)) {
            console.error(chalk.red(`Error: File not found at path '${file}'`));
            process.exit(1);
        }

        const config = loadConfig();
        const spinner = ora("Computing local SHA-256 hash...").start();

        try {
            const hexHash = await computeFileHash(file);
            spinner.succeed(`Local hash: ${chalk.cyan(hexHash)}`);

            spinner.start("Querying VDR SipHeron Registry...");
            const response = await axios.post(`${config.apiUrl}/verify`, { hash: hexHash }, {
                headers: { 'x-api-key': config.apiKey || '' }
            });

            if (response.data.verified) {
                spinner.succeed(chalk.green("FILE IS AUTHENTIC"));
                console.log("");
                console.log(chalk.bold("Record Details:"));
                console.log(`Registered By: ${chalk.cyan(response.data.record.owner)}`);
                console.log(`Original Date: ${new Date(response.data.record.timestamp * 1000).toLocaleString()}`);
                console.log(`Expiry Date:   ${response.data.record.expiry === 0 ? "Infinite" : new Date(response.data.record.expiry * 1000).toLocaleString()}`);
                console.log(`Revoked:       ${response.data.record.isRevoked ? chalk.red("YES") : "NO"}`);
                if (response.data.record.metadata) console.log(`Metadata:      ${response.data.record.metadata}`);
            } else {
                spinner.fail(chalk.red("FILE NOT FOUND IN REGISTRY / TAMPERED"));
            }
        } catch (error) {
            spinner.fail(chalk.red("Verification Failed"));
            console.error(chalk.red(error.response?.data?.error || error.message));
        }
    });

const verifyHashCmd = new Command("verify-hash")
    .description("Verify a raw hex hash directly against the VDR registry")
    .argument("<hash>", "SHA-256 hex string")
    .action(async (hash) => {
        if (!/^[a-f0-9]{64}$/i.test(hash)) {
            console.error(chalk.red('Error: Invalid SHA-256 hash. Expected 64 lowercase hex characters.'));
            process.exit(1);
        }

        const config = loadConfig();
        const spinner = ora("Querying VDR SipHeron Registry...").start();

        try {
            const response = await axios.post(`${config.apiUrl}/verify`, { hash }, {
                headers: { 'x-api-key': config.apiKey || '' }
            });

            if (response.data.verified) {
                spinner.succeed(chalk.green("HASH IS AUTHENTIC"));
                console.log("");
                console.log(chalk.bold("Record Details:"));
                console.log(`Registered By: ${chalk.cyan(response.data.record.owner)}`);
                console.log(`Original Date: ${new Date(response.data.record.timestamp * 1000).toLocaleString()}`);
                console.log(`Expiry Date:   ${response.data.record.expiry === 0 ? "Infinite" : new Date(response.data.record.expiry * 1000).toLocaleString()}`);
                console.log(`Revoked:       ${response.data.record.isRevoked ? chalk.red("YES") : "NO"}`);
            } else {
                spinner.fail(chalk.red("HASH NOT FOUND IN REGISTRY"));
            }
        } catch (error) {
            spinner.fail(chalk.red("Verification Failed"));
            console.error(chalk.red(error.response?.data?.error || error.message));
        }
    });

module.exports = { verifyCmd, verifyHashCmd };
