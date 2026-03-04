/**
 * @file index.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/index.js
 * @description Core component of the SipHeron VDR platform.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");

// Commands
const createStageCommand = require("./commands/stage");
const createAnchorCommand = require("./commands/anchor");
const createStatusCommand = require("./commands/status");
const { verifyCmd, verifyHashCmd } = require("./commands/verify");
const { createWalletCommand } = require("./commands/wallet");
const createConfigCommand = require("./commands/config");
const createBatchCommand = require("./commands/batch");
const createLinkCommand = require("./commands/link");
const { createLoginCommand } = require("./commands/login");

const program = new Command();

program
    .name("sipheron-vdr")
    .description("SipHeron-VDR cli")
    .version("0.9.0-beta");

// Core Execution pipeline (Git-style)
program.addCommand(createStageCommand());
program.addCommand(createStatusCommand());
program.addCommand(createAnchorCommand());

// Verification
program.addCommand(verifyCmd);
program.addCommand(verifyHashCmd);

// New SipHeron V2 Commands
program.addCommand(createWalletCommand());
program.addCommand(createConfigCommand());
program.addCommand(createBatchCommand());
program.addCommand(createLinkCommand());
program.addCommand(createLoginCommand());

const { loadConfig } = require("./utils/configManager");
const { performLogin } = require("./commands/login");
const { createWallet } = require("./commands/wallet");

async function runOnboarding(config) {
    console.log(chalk.yellow('\n' + chalk.bold('! First-time Setup Required')));
    console.log(chalk.gray('To use the SipHeron VDR, you need to authenticate and set up your institutional identity.\n'));

    try {
        const newConfig = await performLogin(config);
        console.log('\n' + chalk.cyan('Institutional context has been updated.'));

        if (!newConfig.defaultWallet) {
            console.log(chalk.yellow('\nNo local wallet found. Let\'s set up your cryptographic identity.'));
            await createWallet('default');
        }

        console.log(chalk.white('\nSetup complete! You can now use ') + chalk.bold('sipheron-vdr anchor') + chalk.white(' to submit hashes.\n'));
        return true;
    } catch (err) {
        console.log(chalk.red('\nOnboarding failed. Please try again with: ') + chalk.bold('sipheron-vdr login'));
        return false;
    }
}

async function start() {
    const config = loadConfig();
    const commandName = process.argv[2];

    // List of commands that are allowed without a login
    const setupCommands = ['login', 'config', 'wallet', '--version', '-V', '--help', '-h', 'help'];

    if (commandName && !setupCommands.includes(commandName) && !config.apiKey && !process.env.SIPHERON_API_KEY) {
        const success = await runOnboarding(config);
        if (!success) process.exit(1);
        // After successful onboarding, we continue to execute the original command
    }

    program.parse(process.argv);
}

start();
