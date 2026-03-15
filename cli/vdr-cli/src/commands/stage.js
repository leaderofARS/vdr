'use strict'
const { Command } = require('commander')
const ora = require('ora')
const chalk = require('chalk')
const { computeFileHash } = require('../utils/hash')
const fs = require('fs')
const path = require('path')
const { addStagedItem } = require('../utils/stagingManager')
const { createFormatter } = require('../utils/formatter')

// Simple glob expander — no new packages needed
function expandGlob(pattern) {
    const dir = path.resolve(process.cwd(), path.dirname(pattern))
    const base = path.basename(pattern)

    // If no wildcard, return as-is
    if (!base.includes('*') && !base.includes('?')) {
        return [path.resolve(process.cwd(), pattern)]
    }

    // Convert glob to regex
    const regex = new RegExp(
        '^' + base.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    )

    try {
        return fs.readdirSync(dir)
            .filter(f => regex.test(f))
            .map(f => path.join(dir, f))
            .filter(f => fs.statSync(f).isFile())
    } catch {
        return []
    }
}

function createStageCommand() {
    return new Command('stage')
        .description('Hash file(s) locally and stage for anchoring. Supports globs: stage *.pdf')
        .argument('<files...>', 'File path(s) or glob pattern (e.g. *.pdf, reports/*.docx)')
        .option('-m, --metadata <metadata>', 'Metadata to store with the hash', '')
        .option('-e, --expiry <seconds>', 'Unix expiration time (0 = infinite)', '0')
        .option('--json', 'Output as JSON')
        .option('-f, --format <format>', 'Output format: human (default), json, quiet', 'human')
        .action(async (files, options) => {
            const format = options.json ? 'json' : (options.format || 'human')
            const fmt = createFormatter(format)

            // Expand all patterns
            const resolved = []
            for (const pattern of files) {
                const expanded = expandGlob(pattern)
                if (expanded.length === 0) {
                    // Try as literal path
                    const abs = path.resolve(process.cwd(), pattern)
                    if (fs.existsSync(abs)) resolved.push(abs)
                    else fmt.warn(`No files matched: ${pattern}`)
                } else {
                    resolved.push(...expanded)
                }
            }

            if (resolved.length === 0) {
                fmt.fail('No files found to stage.')
            }

            if (fmt.format === 'human') console.log(chalk.bold(`\nStaging ${resolved.length} file(s)...\n`))

            const results = []
            let staged = 0
            let skipped = 0

            for (const absolutePath of resolved) {
                const filename = path.basename(absolutePath)
                const spinner = fmt.format === 'human' ? ora(`Hashing ${filename}...`).start() : null

                try {
                    const hexHash = await computeFileHash(absolutePath)
                    const stats = fs.statSync(absolutePath)

                    const item = {
                        file: path.relative(process.cwd(), absolutePath),
                        hash: hexHash,
                        metadata: options.metadata || filename,
                        expiry: parseInt(options.expiry),
                        fileSize: stats.size,
                        mimeType: path.extname(absolutePath).slice(1) || null,
                        lastModified: stats.mtime.toISOString(),
                        stagedAt: new Date().toISOString(),
                    }

                    const added = addStagedItem(item)
                    if (added) {
                        if (spinner) spinner.succeed(`${filename} ${chalk.gray(hexHash.slice(0, 12) + '...')}`)
                        staged++
                        results.push({ file: item.file, hash: hexHash, status: 'staged' })
                        if (fmt.format === 'quiet') console.log(hexHash)
                    } else {
                        if (spinner) spinner.warn(`${filename} already staged — skipped`)
                        skipped++
                        results.push({ file: item.file, hash: hexHash, status: 'skipped' })
                    }
                } catch (err) {
                    if (spinner) spinner.fail(`${filename} — ${err.message}`)
                    results.push({ file: absolutePath, status: 'error', error: err.message })
                }
            }

            if (options.json || fmt.format === 'json') {
                console.log(JSON.stringify(results, null, 2))
                fmt.exit(0)
            }

            if (fmt.format === 'human') {
                console.log('')
                if (staged > 0) console.log(chalk.green(`✓ Staged ${staged} file(s) successfully.`))
                if (skipped > 0) console.log(chalk.yellow(`⚠ Skipped ${skipped} already-staged file(s).`))
                if (staged > 0) console.log(chalk.yellow(`\nRun 'sipheron-vdr anchor' to commit to the Solana network.`))
            }
            
            fmt.exit(staged > 0 ? 0 : (skipped > 0 ? 0 : 1))
        })
}

module.exports = createStageCommand
