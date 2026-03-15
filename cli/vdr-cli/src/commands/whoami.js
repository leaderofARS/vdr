const { createFormatter } = require('../utils/formatter')

/**
 * sipheron-vdr whoami
 *
 * Displays the currently authenticated organization, plan,
 * API key details, and current quota usage.
 */
module.exports = function registerWhoamiCommand(program, { getConfig, makeRequest }) {
  program
    .command('whoami')
    .description('Show current authentication and organization details')
    .option(
      '-f, --format <format>',
      'Output format: human (default), json, quiet',
      'human'
    )
    .action(async (options) => {
      const fmt = createFormatter(options.format || 'human')

      const config = getConfig()
      if (!config.apiKey) {
        fmt.fail('Not linked. Run: sipheron-vdr link <apiKey>')
      }

      fmt.info('Fetching organization details...')

      try {
        // Fetch org details + usage in parallel
        const [orgRes, usageRes] = await Promise.allSettled([
          makeRequest('GET', '/api/org'),
          makeRequest('GET', '/api/usage'),
        ])

        const org = orgRes.status === 'fulfilled'
          ? (orgRes.value.data?.organization || orgRes.value.data)
          : null

        const usage = usageRes.status === 'fulfilled'
          ? (usageRes.value.data)
          : null

        if (!org) {
          fmt.fail('Failed to fetch organization details')
        }

        if (fmt.format === 'json') {
          console.log(JSON.stringify({
            success: true,
            organization: {
              id: org.id,
              name: org.name,
              plan: org.plan || 'free',
              website: org.website || null,
            },
            quota: usage?.quota || null,
            apiKey: `${config.apiKey.slice(0, 12)}...`,
            apiUrl: config.apiUrl || 'https://api.sipheron.com',
          }, null, 2))
          process.exit(0)
        }

        if (fmt.format === 'quiet') {
          console.log(org.name)
          process.exit(0)
        }

        // Human format — full display
        const { chalk } = require('../utils/formatter')

        console.log()
        console.log(chalk.bold.white('  ' + (org.name || 'Unknown Organization')))
        console.log(
          chalk.dim('  ') +
          chalk.cyan(
            (org.plan || 'free').toUpperCase() + ' PLAN'
          )
        )
        console.log()

        fmt.table({
          'Organization ID': org.id,
          'Plan': (org.plan || 'free').charAt(0).toUpperCase() +
                  (org.plan || 'free').slice(1),
          'Website': org.website || '—',
          'API Key': `${config.apiKey.slice(0, 12)}...`,
          'API URL': config.apiUrl || 'https://api.sipheron.com',
        })

        // Quota section
        if (usage?.quota) {
          const { limit, used, remaining, percentUsed, resetAt } = usage.quota
          const pct = parseFloat(percentUsed || 0)
          const barWidth = 30
          const filled = Math.round((pct / 100) * barWidth)
          const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled)
          const barColor = pct >= 95 ? chalk.red
                         : pct >= 80 ? chalk.yellow
                         : chalk.green

          console.log(chalk.dim('  Monthly Quota'))
          console.log(
            '  ' + barColor(bar) +
            chalk.dim(` ${used}/${limit} (${percentUsed}%)`)
          )
          console.log(
            chalk.dim(`  Resets: ${new Date(resetAt).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}`)
          )
          console.log()

          if (pct >= 80) {
            fmt.warn(
              `You've used ${percentUsed}% of your monthly anchor quota.`,
              { upgradeUrl: 'https://app.sipheron.com/dashboard/billing' }
            )
          }
        }

        process.exit(0)
      } catch (err) {
        fmt.fail(`Failed to fetch details: ${err.message}`)
      }
    })
}
