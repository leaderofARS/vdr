'use strict'
const { Command } = require('commander')
const axios = require('axios')
const chalk = require('chalk')
const ora = require('ora')
const { loadConfig } = require('../utils/configManager')
const { createFormatter } = require('../utils/formatter')

function createHistoryCommand() {
    return new Command('history')
        .alias('list')
        .description('Show last anchored hashes from the registry')
        .option('-n, --limit <number>', 'Number of records to show', '10')
        .option('--status <status>', 'Filter by status: active, revoked')
        .option('--json', 'Output as JSON')
        .option('-f, --format <format>', 'Output format: human (default), json, quiet', 'human')
        .action(async (options) => {
            const format = options.json ? 'json' : (options.format || 'human')
            const fmt = createFormatter(format)

            const config = loadConfig()
            const apiKey = config.apiKey || process.env.SIPHERON_API_KEY
            const apiUrl = config.apiUrl || 'https://api.sipheron.com'

            if (!apiKey) {
                fmt.fail('Not linked. Run: sipheron-vdr link <apiKey>')
            }

            const spinner = fmt.format === 'human' ? ora('Fetching history...').start() : null

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

                if (spinner) spinner.stop()

                let records = data.data || data.hashes || data || []
                
                // For fmt.list, we rename some properties to match standard expectations
                // if they correspond to what the backend returns. The backend currently returns
                // status and metadata, we can map registeredAt to createdAt to match the example
                records = records.map(r => ({
                    ...r,
                    createdAt: r.registeredAt || r.createdAt,
                    status: (r.status || 'CONFIRMED').toUpperCase()
                }))

                if (options.json || fmt.format === 'json') {
                    console.log(JSON.stringify(records, null, 2))
                    fmt.exit(0)
                }

                if (records.length === 0) {
                    if (fmt.format === 'human') console.log(chalk.yellow('\nNo hashes found in registry.'))
                    fmt.exit(0)
                }

                // Use the new fmt.list method
                fmt.list(records, [
                    { key: 'hash', label: 'HASH', minWidth: 12,
                      color: s => chalk.cyan(s) },
                    { key: 'metadata', label: 'DOCUMENT', minWidth: 20 },
                    { key: 'status', label: 'STATUS', minWidth: 9,
                      color: s => s === 'CONFIRMED' || s === 'ACTIVE' ? chalk.green(s)
                                  : s === 'PENDING' ? chalk.yellow(s)
                                  : chalk.red(s) },
                    { key: 'createdAt', label: 'ANCHORED', minWidth: 20,
                      color: s => chalk.dim(new Date(s).toLocaleString()) },
                ])

                if (fmt.format === 'human') {
                    console.log(chalk.gray(`Total in registry: ${data.total ?? records.length}`))
                }
                
                fmt.exit(0)
            } catch (err) {
                if (spinner) spinner.stop()
                fmt.fail('Failed to fetch history', { details: err.response?.data?.error || err.message })
            }
        })
}

module.exports = createHistoryCommand
