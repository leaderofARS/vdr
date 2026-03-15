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
const { createFormatter } = require("../utils/formatter");

function createAnchorCommand() {
    const pushCmd = new Command("anchor")
        .description("Commit all locally staged hashes to the SipHeron Solana Registry. (Like git push)")
        .option("-f, --format <format>", "Output format: human (default), json, quiet", "human")
        .action(async (options) => {
            const fmt = createFormatter(options.format || 'human');
            const items = getStagedItems();

            if (items.length === 0) {
                fmt.warn("No hashes staged. Nothing to push.");
                fmt.exit(0);
            }

            const config = loadConfig();
            const apiKey = config.apiKey || process.env.SIPHERON_API_KEY;
            const apiUrl = config.apiUrl || 'https://api.sipheron.com';

            if (!apiKey) {
                fmt.fail('No API key found. Run: sipheron-vdr link <apiKey>');
            }

            if (fmt.format === 'human') console.log(chalk.bold(`Preparing to push ${items.length} hashes to SipHeron Registry...\n`));

            const spinner = fmt.format === 'human' ? ora("Submitting batch to backend queue...").start() : null;
            
            fmt.info('Broadcasting to Solana...');

            try {
                const results = [];
                // Post each hash individually to support per-file metadata
                for (const staged of items) {
                    if (spinner) spinner.text = `Anchoring ${staged.file}...`;
                    const res = await axios.post(`${apiUrl}/api/hashes`, {
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
                    
                    results.push(res.data);
                }

                if (spinner) spinner.succeed(chalk.green(`Successfully dispatched ${items.length} hashes to the blockchain!`));
                
                // Clear the local queue
                clearStagedItems();
                
                if (items.length === 1 && results[0]) {
                    const r = results[0];
                    fmt.success('Hash anchored to Solana', {
                      hash: r.hash || items[0].hash,
                      txSignature: r.txSignature,
                      blockNumber: r.blockNumber,
                      status: r.status || 'CONFIRMED',
                      verifyUrl: `https://app.sipheron.com/verify/${r.hash || items[0].hash}`,
                      explorerUrl: r.txSignature ? `https://explorer.solana.com/tx/${r.txSignature}?cluster=devnet` : undefined,
                    });
                } else if (fmt.format === 'json') {
                    console.log(JSON.stringify(results, null, 2));
                } else if (fmt.format === 'quiet') {
                    results.forEach(r => console.log(r.hash || ''));
                } else {
                    console.log(chalk.gray(`The SipHeron Indexer is currently mapping these PDAs to the Smart Contract in the background.`));
                    console.log(chalk.green("\nLocal staging queue cleared."));
                }
                
                fmt.exit(0);

            } catch (error) {
                if (spinner) spinner.stop();
                fmt.fail('Anchoring failed', { details: error.response ? `${error.response.status}: ${JSON.stringify(error.response.data)}` : error.message });
            }
        });

    return pushCmd;
}

module.exports = createAnchorCommand;
