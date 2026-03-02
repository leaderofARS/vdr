#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");

// Commands
const createStageCommand = require("./commands/stage");
const createAnchorCommand = require("./commands/anchor");
const createStatusCommand = require("./commands/status");
const { verifyCmd, verifyHashCmd } = require("./commands/verify");
const createWalletCommand = require("./commands/wallet");
const createConfigCommand = require("./commands/config");
const createBatchCommand = require("./commands/batch");

const program = new Command();

program
    .name("sipheron-vdr")
    .description("SipHeron-VDR cli")
    .version("2.0.0");

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

program.parse(process.argv);
