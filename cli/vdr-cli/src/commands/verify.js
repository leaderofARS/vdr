'use strict'
const { Command } = require('commander')
const axios = require('axios')
const chalk = require('chalk')
const ora = require('ora')
const { computeFileHash } = require('../utils/hash')
const fs = require('fs')
const path = require('path')
const { loadConfig } = require('../utils/configManager')

const verifyCmd = new Command('verify')
    .description('Verify a file, URL, or hash against the SipHeron registry')
    .argument('[file]', 'Path to the file to verify')
    .option('--url <url>', 'Fetch file from URL and verify its hash')
    .option('--hash <hash>', 'Verify a raw SHA-256 hash directly without a file')
    .option('--json', 'Output result as JSON')
    .action(async (file, options) => {
        const config = loadConfig()
        const apiKey = config.apiKey || process.env.SIPHERON_API_KEY
        const apiUrl = config.apiUrl || 'https://api.sipheron.com'

        let hexHash = null

        // Mode 1: --hash flag
        if (options.hash) {
            if (!/^[a-fA-F0-9]{64}$/.test(options.hash)) {
                console.error(chalk.red('Invalid SHA-256 hash format'))
                process.exit(1)
            }
            hexHash = options.hash
        }
        // Mode 2: --url flag
        else if (options.url) {
            const spinner = ora(`Fetching from ${options.url}...`).start()
            try {
                const https = require('https')
                const http = require('http')
                const { createHash } = require('crypto')
                const client = options.url.startsWith('https') ? https : http

                hexHash = await new Promise((resolve, reject) => {
                    client.get(options.url, (res) => {
                        if (res.statusCode !== 200) {
                            reject(new Error(`Failed to fetch: ${res.statusCode} ${res.statusMessage}`))
                            return
                        }
                        const hash = createHash('sha256')
                        res.on('data', chunk => hash.update(chunk))
                        res.on('end', () => resolve(hash.digest('hex')))
                        res.on('error', reject)
                    }).on('error', reject)
                })
                spinner.succeed(`URL hash: ${chalk.cyan(hexHash)}`)
            } catch (err) {
                spinner.fail(`Failed to fetch URL: ${err.message}`)
                process.exit(1)
            }
        }
        // Mode 3: file path (existing behavior)
        else {
            if (!file) {
                console.error(chalk.red('Error: Please provide a file path, --url, or --hash'))
                process.exit(1)
            }
            if (!fs.existsSync(file)) {
                console.error(chalk.red(`Error: File not found at '${file}'`))
                process.exit(1)
            }
            const spinner = ora('Computing local SHA-256 hash...').start()
            hexHash = await computeFileHash(file)
            spinner.succeed(`Local hash: ${chalk.cyan(hexHash)}`)
        }

        // Query backend — use GET /api/hashes/:hash (requires auth)
        const spinner2 = ora('Querying SipHeron Registry...').start()
        try {
            const { data } = await axios.get(`${apiUrl}/api/hashes/${hexHash}`, {
                headers: { 'x-api-key': apiKey }
            })

            spinner2.stop()

            if (options.json) {
                console.log(JSON.stringify(data, null, 2))
                return
            }

            const isRevoked = data.status === 'revoked' || data.isRevoked
            const statusText = isRevoked ? chalk.red('REVOKED') : chalk.green('AUTHENTIC ✓')

            console.log('')
            console.log(chalk.bold('── Verification Result ──────────────────'))
            console.log(chalk.cyan('Status:    ') + statusText)
            console.log(chalk.cyan('Hash:      ') + data.hash?.slice(0, 20) + '...')
            console.log(chalk.cyan('Metadata:  ') + (data.metadata || '—'))
            console.log(chalk.cyan('Registered:') + ' ' + (data.registeredAt ? new Date(data.registeredAt).toLocaleString() : '—'))
            if (data.explorerUrl) console.log(chalk.cyan('Explorer:  ') + data.explorerUrl)
            if (isRevoked && data.revokedAt) console.log(chalk.red('Revoked:   ') + new Date(data.revokedAt).toLocaleString())
            console.log('')

            // Exit code for CI/CD use
            if (isRevoked) process.exit(2) // revoked
        } catch (err) {
            if (err.response?.status === 404) {
                spinner2.fail(chalk.red('NOT FOUND IN REGISTRY — File may be tampered or not anchored'))
                if (options.json) console.log(JSON.stringify({ verified: false, hash: hexHash }))
                process.exit(3) // not found
            }
            spinner2.fail(chalk.red('Verification failed'))
            console.error(chalk.red(err.response?.data?.error || err.message))
            process.exit(1)
        }
    })

const verifyHashCmd = new Command('verify-hash')
    .description('Verify a raw hex hash directly against the VDR registry (Legacy)')
    .argument('<hash>', 'SHA-256 hex string')
    .action(async (hash) => {
        // Redirect to verify --hash
        await verifyCmd.parseAsync(['node', 'verify', '--hash', hash]);
    })

module.exports = { verifyCmd, verifyHashCmd }
