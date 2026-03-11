'use strict'
const { Command } = require('commander')
const axios = require('axios')
const chalk = require('chalk')
const ora = require('ora')
const { computeFileHash } = require('../utils/hash')
const { loadConfig } = require('../utils/configManager')
const fs = require('fs')
const path = require('path')

function createRevokeCommand() {
    return new Command('revoke')
        .description('Revoke a document proof on the Solana blockchain')
        .argument('<file>', 'Path to the file to revoke — OR pass --hash directly')
        .option('--hash <hash>', 'Revoke by raw SHA-256 hash instead of file path')
        .option('--reason <reason>', 'Reason for revocation (stored in metadata)', '')
        .option('-y, --yes', 'Skip confirmation prompt')
        .action(async (file, options) => {
            const config = loadConfig()
            const apiKey = config.apiKey || process.env.SIPHERON_API_KEY
            const apiUrl = config.apiUrl || 'https://api.sipheron.com'

            if (!apiKey) {
                console.log(chalk.red('Not linked. Run: sipheron-vdr link <apiKey>'))
                process.exit(1)
            }

            let hexHash = options.hash || null

            // If no --hash flag, compute from file
            if (!hexHash) {
                const absolutePath = path.resolve(process.cwd(), file)
                if (!fs.existsSync(absolutePath)) {
                    console.error(chalk.red(`Error: File not found at '${file}'`))
                    process.exit(1)
                }
                const spinner = ora('Computing file hash...').start()
                try {
                    hexHash = await computeFileHash(absolutePath)
                    spinner.succeed(`Hash: ${chalk.cyan(hexHash)}`)
                } catch (err) {
                    spinner.fail('Failed to hash file')
                    process.exit(1)
                }
            }

            // Confirm unless --yes
            if (!options.yes) {
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

            const spinner = ora('Revoking on Solana blockchain...').start()

            try {
                const { data } = await axios.post(
                    `${apiUrl}/api/hashes/revoke`,
                    { hash: hexHash },
                    { headers: { 'x-api-key': apiKey } }
                )

                spinner.succeed(chalk.green('Hash proof revoked successfully'))
                console.log('')
                console.log(chalk.cyan('TX Signature: ') + data.txSignature)
                console.log(chalk.cyan('Message:      ') + data.message)
                console.log(chalk.gray('\nThis hash will now show as REVOKED on all verification checks.'))
                console.log('')
            } catch (err) {
                spinner.fail(chalk.red('Revocation failed'))
                console.error(chalk.red(err.response?.data?.error || err.message))
                process.exit(1)
            }
        })
}

module.exports = createRevokeCommand
