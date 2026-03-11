'use strict'
const { Command } = require('commander')
const axios = require('axios')
const chalk = require('chalk')
const ora = require('ora')
const { loadConfig } = require('../utils/configManager')

function createHistoryCommand() {
    return new Command('history')
        .description('Show last anchored hashes from the registry')
        .option('-n, --limit <number>', 'Number of records to show', '10')
        .option('--status <status>', 'Filter by status: active, revoked')
        .option('--json', 'Output as JSON')
        .action(async (options) => {
            const config = loadConfig()
            const apiKey = config.apiKey || process.env.SIPHERON_API_KEY
            const apiUrl = config.apiUrl || 'https://api.sipheron.com'

            if (!apiKey) {
                console.log(chalk.red('Not linked. Run: sipheron-vdr link <apiKey>'))
                process.exit(1)
            }

            const spinner = ora('Fetching history...').start()

            try {
                const params = new URLSearchParams({
                    page: '1',
                    limit: options.limit || '10',
                    sortBy: 'registeredAt',
                    sortOrder: 'desc'
                })
                if (options.status) params.append('status', options.status)

                const { data } = await axios.get(`${apiUrl}/api/hashes?${params}`, {
                    headers: { 'x-api-key': apiKey }
                })

                spinner.stop()

                const records = data.data || data.hashes || data || []

                if (options.json) {
                    console.log(JSON.stringify(records, null, 2))
                    return
                }

                if (records.length === 0) {
                    console.log(chalk.yellow('\nNo hashes found in registry.'))
                    return
                }

                console.log('\n' + chalk.bold(`── Last ${records.length} Anchored Hashes ─────────────`))
                records.forEach((r, i) => {
                    const statusColor = r.status === 'active' ? chalk.green
                        : r.status === 'revoked' ? chalk.red : chalk.yellow
                    console.log(
                        chalk.gray(`[${String(i + 1).padStart(2, '0')}] `) +
                        chalk.cyan(r.hash?.slice(0, 20)) + chalk.gray('...') +
                        '  ' + statusColor(r.status?.padEnd(8)) +
                        '  ' + chalk.gray(r.metadata?.slice(0, 24) || '—') +
                        '  ' + chalk.gray(r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : '—')
                    )
                    if (r.explorerUrl) {
                        console.log(chalk.gray('       ↗ ' + r.explorerUrl))
                    }
                })
                console.log('')
                console.log(chalk.gray(`Total in registry: ${data.total ?? records.length}`))
                console.log('')
            } catch (err) {
                spinner.fail(chalk.red('Failed to fetch history'))
                console.error(chalk.red(err.response?.data?.error || err.message))
                process.exit(1)
            }
        })
}

module.exports = createHistoryCommand
