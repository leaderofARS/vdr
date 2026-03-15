'use strict'
const { Command } = require('commander')
const axios = require('axios')
const chalk = require('chalk')
const ora = require('ora')
const { loadConfig } = require('../utils/configManager')
const { getStagedItems } = require('../utils/stagingManager')
const { createFormatter } = require('../utils/formatter')

function createStatusCommand() {
    return new Command('status')
        .description('Show account info, wallet balance, staged files, or specific hash status')
        .argument('[hash]', 'Optional SHA-256 hash to check specific status')
        .option('--json', 'Output as JSON')
        .option('-f, --format <format>', 'Output format: human (default), json, quiet', 'human')
        .action(async (hashArg, options) => {
            const format = options.json ? 'json' : (options.format || 'human')
            const fmt = createFormatter(format)

            const config = loadConfig()

            if (!config.apiKey && !process.env.SIPHERON_API_KEY) {
                fmt.fail('Not linked. Run: sipheron-vdr link <apiKey>')
            }

            const apiKey = config.apiKey || process.env.SIPHERON_API_KEY
            const apiUrl = config.apiUrl || 'https://api.sipheron.com'
            
            if (hashArg) {
                // Feature requested by prompt: Hash Status
                if (!/^[a-fA-F0-9]{64}$/.test(hashArg)) {
                    fmt.fail('Invalid SHA-256 hash format')
                }

                const spinner = fmt.format === 'human' ? ora('Fetching anchor status...').start() : null
                try {
                    const { data } = await axios.get(`${apiUrl}/api/hashes/${hashArg.toLowerCase()}`, {
                        headers: { 'x-api-key': apiKey }
                    })
                    if (spinner) spinner.stop()
                    
                    const record = data
                    
                    fmt.success('Anchor status', {
                        hash: record.hash,
                        status: record.status,
                        confirmed: record.status === 'CONFIRMED' ? 'Yes' : 'No',
                        txSignature: record.txSignature || 'Pending',
                        blockNumber: record.blockNumber || 'Pending',
                        blockTimestamp: record.blockTimestamp
                            ? new Date(record.blockTimestamp).toLocaleString()
                            : 'Pending',
                        explorerUrl: record.txSignature
                            ? `https://explorer.solana.com/tx/${record.txSignature}?cluster=devnet`
                            : undefined,
                    })
                    fmt.exit(record.status === 'CONFIRMED' ? 0 : 1)
                } catch (err) {
                    if (spinner) spinner.stop()
                    if (err.response?.status === 404) {
                        fmt.notFound(hashArg)
                        fmt.exit(1)
                    }
                    fmt.fail('Failed to fetch status', { details: err.response?.data?.error || err.message })
                }
                return;
            }

            // Original status output (Org Stats)
            const staged = getStagedItems()
            const spinner = fmt.format === 'human' ? ora('Fetching status...').start() : null

            try {
                const { data } = await axios.get(`${apiUrl}/api/org/stats`, {
                    headers: { 'x-api-key': apiKey }
                })

                if (spinner) spinner.stop()

                if (options.json || fmt.format === 'json') {
                    console.log(JSON.stringify({ ...data, staged }, null, 2))
                    fmt.exit(0)
                }

                if (fmt.format === 'quiet') {
                    console.log(data.org?.name || '')
                    fmt.exit(0)
                }

                console.log('\n' + chalk.bold('── SipHeron VDR Status ──────────────────'))
                console.log(chalk.cyan('Organization:  ') + (data.org?.name || '—'))
                console.log(chalk.cyan('Org ID:        ') + (data.org?.id || '—'))
                console.log(chalk.cyan('Network:       ') + (data.wallet?.network || 'devnet'))
                console.log(chalk.cyan('Wallet:        ') + (data.wallet?.address || '—'))
                console.log(chalk.cyan('SOL Balance:   ') + chalk.yellow((data.wallet?.balanceSol ?? 0).toFixed(4) + ' SOL'))
                console.log('')
                console.log(chalk.bold('── Registry Stats ───────────────────────'))
                console.log(chalk.cyan('Total Anchors: ') + (data.stats?.totalAnchors ?? '—'))
                console.log(chalk.cyan('Active:        ') + (data.stats?.activeAnchors ?? '—'))
                console.log(chalk.cyan('Revoked:       ') + (data.stats?.revokedAnchors ?? '—'))
                console.log(chalk.cyan('Active Keys:   ') + (data.stats?.activeApiKeys ?? '—'))
                console.log('')
                console.log(chalk.bold('── Local Staging Queue ──────────────────'))
                if (staged.length === 0) {
                    console.log(chalk.gray('  No files staged. Run: sipheron-vdr stage <file>'))
                } else {
                    staged.forEach((item, i) => {
                        console.log(chalk.green(`  [${i + 1}] `) + item.file + chalk.gray(` (${item.hash.slice(0, 12)}...)`))
                    })
                    console.log(chalk.yellow(`\n  Run 'sipheron-vdr anchor' to commit ${staged.length} staged file(s).`))
                }

                if (data.recentActivity?.length > 0) {
                    console.log('')
                    console.log(chalk.bold('── Last Anchor ──────────────────────────'))
                    const last = data.recentActivity[0]
                    console.log(chalk.cyan('Hash:    ') + last.hash?.slice(0, 20) + '...')
                    console.log(chalk.cyan('Status:  ') + last.status)
                    console.log(chalk.cyan('Date:    ') + new Date(last.registeredAt).toLocaleString())
                    if (last.explorerUrl) {
                        console.log(chalk.cyan('Explorer: ') + last.explorerUrl)
                    }
                }

                console.log('')
                fmt.exit(0)
            } catch (err) {
                if (spinner) spinner.stop()
                fmt.fail('Failed to fetch status', { details: err.response?.data?.error || err.message })
            }
        })
}

module.exports = createStatusCommand
