/**
 * SipHeron VDR CLI — Output Formatter
 *
 * Supports three output formats:
 *   human (default) — colored, formatted, human-readable
 *   json            — pure JSON, machine-readable, pipeable
 *   quiet           — minimal output, exit code only
 *
 * Usage in commands:
 *   const { createFormatter } = require('../utils/formatter')
 *   const fmt = createFormatter(options.format)
 *   fmt.success('Hash anchored', { hash, txSignature })
 *   fmt.exit(0)
 */

// Detect chalk version and import correctly
let chalk
try {
  chalk = require('chalk')
  // chalk v4 is commonjs, chalk v5 is ESM
  // If chalk.green exists we're good
  if (!chalk.green) throw new Error('chalk not usable')
} catch {
  // Fallback — no colors
  chalk = {
    green: s => s, red: s => s, yellow: s => s,
    blue: s => s, cyan: s => s, gray: s => s,
    white: s => s, bold: { white: s => s },
    dim: s => s,
  }
}

const VALID_FORMATS = ['human', 'json', 'quiet']

function createFormatter(format = 'human') {
  // Normalize and validate format
  const fmt = VALID_FORMATS.includes(format) ? format : 'human'

  return {
    format: fmt,

    // ── Print a success result ──
    success(message, data = {}) {
      if (fmt === 'json') {
        console.log(JSON.stringify({ success: true, message, ...data }, null, 2))
        return
      }
      if (fmt === 'quiet') {
        if (data.result) console.log(data.result)
        return
      }
      // human
      console.log(chalk.green('✓') + ' ' + chalk.bold.white(message))
      if (Object.keys(data).length > 0) {
        this.table(data)
      }
    },

    // ── Print an error ──
    error(message, data = {}) {
      if (fmt === 'json') {
        console.log(JSON.stringify({ success: false, error: message, ...data }, null, 2))
        return
      }
      if (fmt === 'quiet') {
        console.error(message)
        return
      }
      // human
      console.error(chalk.red('✗') + ' ' + chalk.bold.white(message))
      if (data.details) console.error(chalk.dim(data.details))
    },

    // ── Print a warning ──
    warn(message, data = {}) {
      if (fmt === 'json') {
        console.log(JSON.stringify({ warning: true, message, ...data }, null, 2))
        return
      }
      if (fmt === 'quiet') return
      console.log(chalk.yellow('⚠') + ' ' + message)
    },

    // ── Print info line ──
    info(message) {
      if (fmt === 'json' || fmt === 'quiet') return
      console.log(chalk.cyan('ℹ') + ' ' + chalk.dim(message))
    },

    // ── Print a key-value table ──
    table(data) {
      if (fmt === 'json' || fmt === 'quiet') return
      const entries = Object.entries(data).filter(([, v]) => v !== undefined && v !== null)
      if (entries.length === 0) return
      const maxKeyLen = Math.max(...entries.map(([k]) => k.length))
      console.log()
      for (const [key, value] of entries) {
        const paddedKey = key.padEnd(maxKeyLen)
        console.log(
          '  ' + chalk.dim(paddedKey) + '  ' + chalk.white(String(value))
        )
      }
      console.log()
    },

    // ── Print AUTHENTIC result ──
    authentic(anchorData = {}) {
      if (fmt === 'json') {
        console.log(JSON.stringify({
          authentic: true,
          result: 'AUTHENTIC',
          ...anchorData,
        }, null, 2))
        return
      }
      if (fmt === 'quiet') {
        console.log('AUTHENTIC')
        return
      }
      // human — large green banner
      console.log()
      console.log(chalk.green('┌─────────────────────────────┐'))
      console.log(chalk.green('│  ✓  AUTHENTIC               │'))
      console.log(chalk.green('└─────────────────────────────┘'))
      console.log(chalk.green('  Document is identical to anchored version.'))
      console.log(chalk.green('  It has not been modified.'))
      if (anchorData && Object.keys(anchorData).length > 0) {
        this.table(anchorData)
      }
    },

    // ── Print MISMATCH result ──
    mismatch(computedHash, anchoredHash) {
      if (fmt === 'json') {
        console.log(JSON.stringify({
          authentic: false,
          result: 'MISMATCH',
          computedHash,
          anchoredHash,
        }, null, 2))
        return
      }
      if (fmt === 'quiet') {
        console.log('MISMATCH')
        return
      }
      // human — large red banner
      console.log()
      console.log(chalk.red('┌─────────────────────────────┐'))
      console.log(chalk.red('│  ✗  MISMATCH                │'))
      console.log(chalk.red('└─────────────────────────────┘'))
      console.log(chalk.red('  Document does not match the anchored version.'))
      console.log(chalk.red('  It may have been modified.'))
      console.log()
      console.log('  ' + chalk.dim('Your file hash:  ') + chalk.red(computedHash || '—'))
      console.log('  ' + chalk.dim('Anchored hash:   ') + chalk.dim(anchoredHash || '—'))
      console.log()
    },

    // ── Print NOT FOUND result ──
    notFound(hash) {
      if (fmt === 'json') {
        console.log(JSON.stringify({
          authentic: false,
          result: 'NOT_FOUND',
          hash,
          message: 'No anchor record found for this hash',
        }, null, 2))
        return
      }
      if (fmt === 'quiet') {
        console.log('NOT_FOUND')
        return
      }
      console.log()
      console.log(chalk.yellow('  ○  NOT FOUND'))
      console.log(chalk.dim('  No anchor record found for this hash.'))
      console.log()
    },

    // ── Print REVOKED result ──
    revoked(anchorData = {}) {
      if (fmt === 'json') {
        console.log(JSON.stringify({
          authentic: false,
          result: 'REVOKED',
          ...anchorData,
        }, null, 2))
        return
      }
      if (fmt === 'quiet') {
        console.log('REVOKED')
        return
      }
      console.log()
      console.log(chalk.yellow('  ⚠  REVOKED'))
      console.log(chalk.dim('  This document\'s verification has been revoked.'))
      if (anchorData.revokedAt) {
        console.log(chalk.dim(`  Revoked: ${new Date(anchorData.revokedAt).toLocaleString()}`))
      }
      console.log()
    },

    // ── Print a list/table of records ──
    list(records, columns) {
      if (fmt === 'json') {
        console.log(JSON.stringify({ records, count: records.length }, null, 2))
        return
      }
      if (fmt === 'quiet') {
        records.forEach(r => console.log(r[columns[0].key] || ''))
        return
      }
      // human — formatted table
      if (records.length === 0) {
        console.log(chalk.dim('  No records found.'))
        return
      }

      // Calculate column widths
      const widths = columns.map(col => {
        const maxData = Math.max(...records.map(r => {
          const val = getNestedValue(r, col.key)
          return String(val || '').length
        }))
        return Math.max(col.label.length, maxData, col.minWidth || 0)
      })

      // Header
      console.log()
      const header = columns.map((col, i) =>
        chalk.dim(col.label.padEnd(widths[i]))
      ).join('  ')
      console.log('  ' + header)
      console.log('  ' + chalk.dim('─'.repeat(
        widths.reduce((a, b) => a + b, 0) + (columns.length - 1) * 2
      )))

      // Rows
      for (const record of records) {
        const row = columns.map((col, i) => {
          const val = String(getNestedValue(record, col.key) || '—')
          const truncated = val.length > widths[i]
            ? val.slice(0, widths[i] - 3) + '...'
            : val.padEnd(widths[i])
          return col.color ? col.color(truncated) : chalk.white(truncated)
        }).join('  ')
        console.log('  ' + row)
      }
      console.log()
    },

    // ── Exit with code ──
    exit(code = 0) {
      process.exit(code)
    },

    // ── Exit success (0) ──
    done(message, data) {
      this.success(message, data)
      process.exit(0)
    },

    // ── Exit failure (1) ──
    fail(message, data) {
      this.error(message, data)
      process.exit(1)
    },
  }
}

function getNestedValue(obj, key) {
  return key.split('.').reduce((o, k) => o?.[k], obj)
}

module.exports = { createFormatter, chalk }
