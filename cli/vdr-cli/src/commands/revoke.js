'use strict'
const { Command } = require('commander')
const axios = require('axios')
const chalk = require('chalk')
const ora = require('ora')
const { computeFileHash } = require('../utils/hash')
const { loadConfig } = require('../utils/configManager')
const fs = require('fs')
const path = require('path')
const { createFormatter } = require('../utils/formatter')

function createRevokeCommand() {
    return new Command('revoke')
        .description('Revoke a document proof on the Solana blockchain')
        .argument('[file]', 'Path to the file to revoke — OR pass --hash directly')
        .option('--hash <hash>', 'Revoke by raw SHA-256 hash instead of file path')
        .option('--reason <reason>', 'Reason for revocation (stored in metadata)', '')
        .option('-y, --yes', 'Skip confirmation prompt')
        .option('-f, --format <format>', 'Output format: human (default), json, quiet', 'human')
        .action(async (file, options) => {
            const format = options.format || 'human'
            const fmt = createFormatter(format)

            const config = loadConfig()
            const apiKey = config.apiKey || process.env.SIPHERON_API_KEY
            const apiUrl = config.apiUrl || 'https://api.sipheron.com'

            if (!apiKey) {
                fmt.fail('Not linked. Run: sipheron-vdr link <apiKey>')
            }

            let hexHash = options.hash || null

            // If no --hash flag, compute from file
            if (!hexHash) {
                if (!file) {
                    fmt.fail('Provide a file path or use --hash')
                }
                const absolutePath = path.resolve(process.cwd(), file)
                if (!fs.existsSync(absolutePath)) {
                    fmt.fail(`File not found at '${file}'`)
                }
                const spinner = fmt.format === 'human' ? ora('Computing file hash...').start() : null
                try {
                    hexHash = await computeFileHash(absolutePath)
                    if (spinner) spinner.succeed(`Hash: ${chalk.cyan(hexHash)}`)
                } catch (err) {
                    if (spinner) spinner.stop()
                    fmt.fail('Failed to hash file')
                }
            }

            // Confirm unless --yes or non-human format
            if (!options.yes && fmt.format === 'human') {
                const { createInterface } = require('readline')
                const rl = createInterface({ input: process.stdin, output: process.stdout })
                await new Promise((resolve) => {
                    rl.question(
                        chalk.yellow(`\n⚠ Revocation is permanent and cannot be undone.\nRevoke hash ${hexHash.slice(0, 16)}...? (yes/no): `),
                        (answer) => {
                            rl.close()
                            if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
                                console.log(chalk.gray('Revocation cancelled.'))
                                process.exit(0)
                            }
                            resolve()
                        }
                    )
                })
            }

            const spinner = fmt.format === 'human' ? ora('Revoking on Solana blockchain...').start() : null

            try {
                // Determine whether it's GET /api/hashes/revoke or specific payload
                const { data } = await axios.post(
                    `${apiUrl}/api/hashes/revoke`,
                    { hash: hexHash, reason: options.reason || undefined },
                    { headers: { 'x-api-key': apiKey } }
                )

                if (spinner) spinner.stop()

                fmt.success('Hash revoked', {
                    hash: hexHash,
                    revokedAt: new Date().toISOString(),
                    note: options.reason || null,
                    txSignature: data.txSignature,
                    message: data.message
                })
                fmt.exit(0)
            } catch (err) {
                if (spinner) spinner.stop()
                fmt.fail('Failed to revoke hash', { details: err.response?.data?.error || err.message })
            }
        })
}

module.exports = createRevokeCommand
