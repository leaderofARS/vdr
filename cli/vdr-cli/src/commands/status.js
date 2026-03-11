'use strict'
const { Command } = require('commander')
const axios = require('axios')
const chalk = require('chalk')
const ora = require('ora')
const { loadConfig } = require('../utils/configManager')
const { getStagedItems } = require('../utils/stagingManager')

function createStatusCommand() {
    return new Command('status')
        .description('Show account info, wallet balance, staged files, and last anchor')
        .option('--json', 'Output as JSON')
        .action(async (options) => {
            const config = loadConfig()

            if (!config.apiKey && !process.env.SIPHERON_API_KEY) {
                console.log(chalk.red('Not linked. Run: sipheron-vdr link <apiKey>'))
                process.exit(1)
            }

            const apiKey = config.apiKey || process.env.SIPHERON_API_KEY
            const apiUrl = config.apiUrl || 'https://api.sipheron.com'
            const staged = getStagedItems()

            const spinner = ora('Fetching status...').start()

            try {
                const { data } = await axios.get(`${apiUrl}/api/org/stats`, {
                    headers: { 'x-api-key': apiKey }
                })

                spinner.stop()

                if (options.json) {
                    console.log(JSON.stringify({ ...data, staged }, null, 2))
                    return
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
            } catch (err) {
                spinner.fail(chalk.red('Failed to fetch status'))
                console.error(chalk.red(err.response?.data?.error || err.message))
                process.exit(1)
            }
        })
}

module.exports = createStatusCommand
