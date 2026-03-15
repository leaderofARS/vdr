const fs = require('fs')
const path = require('path')
const { createFormatter } = require('../utils/formatter')

/**
 * sipheron-vdr certificate <hash> [--output <path>]
 *
 * Downloads the PDF certificate for an anchored document.
 * The certificate is saved to the current directory by default,
 * or to the path specified with --output.
 */
module.exports = function registerCertificateCommand(program, { getConfig, makeRequest }) {
  program
    .command('certificate <hash>')
    .alias('cert')
    .description('Download the PDF certificate for an anchored document')
    .option(
      '-o, --output <path>',
      'Output file path (default: ./sipheron-certificate-<hash>.pdf)'
    )
    .option(
      '-f, --format <format>',
      'Output format: human (default), json, quiet',
      'human'
    )
    .action(async (hash, options) => {
      const fmt = createFormatter(options.format || 'human')

      // Validate hash format
      if (!/^[a-f0-9]{64}$/i.test(hash.trim())) {
        fmt.fail('Invalid hash format — must be 64 hex characters (SHA-256)', {
          provided: hash,
        })
      }

      const config = getConfig()
      if (!config.apiKey) {
        fmt.fail('Not linked. Run: sipheron-vdr link <apiKey>')
      }

      fmt.info(`Fetching certificate for ${hash.slice(0, 16)}...`)

      try {
        // Determine output path
        const outputPath = options.output ||
          path.join(process.cwd(), `sipheron-certificate-${hash.slice(0, 8)}.pdf`)

        // Fetch PDF from API
        const https = require('https')
        const http = require('http')
        const url = new URL(
          `/api/hashes/${hash.trim()}/certificate?download=true`,
          config.apiUrl || 'https://api.sipheron.com'
        )

        const pdfBuffer = await new Promise((resolve, reject) => {
          const protocol = url.protocol === 'https:' ? https : http
          const req = protocol.get(url.href, {
            headers: {
              'x-api-key': config.apiKey,
              'User-Agent': 'sipheron-vdr-cli/' +
                require('../../package.json').version,
            }
          }, (res) => {
            if (res.statusCode === 404) {
              reject(new Error('Hash not found or not yet confirmed'))
              return
            }
            if (res.statusCode !== 200) {
              reject(new Error(`Server returned ${res.statusCode}`))
              return
            }
            const chunks = []
            res.on('data', chunk => chunks.push(chunk))
            res.on('end', () => resolve(Buffer.concat(chunks)))
            res.on('error', reject)
          })
          req.on('error', reject)
          req.setTimeout(30000, () => {
            req.destroy()
            reject(new Error('Request timed out after 30s'))
          })
        })

        // Verify we got a PDF
        if (!pdfBuffer || pdfBuffer.length < 100) {
          fmt.fail('Received empty or invalid PDF response')
        }

        // Write to disk
        fs.writeFileSync(outputPath, pdfBuffer)

        fmt.success('Certificate downloaded', {
          hash: hash.trim(),
          file: path.resolve(outputPath),
          size: formatFileSize(pdfBuffer.length),
          verifyUrl: `https://app.sipheron.com/verify/${hash.trim()}`,
        })
        fmt.exit(0)
      } catch (err) {
        fmt.fail(`Certificate download failed: ${err.message}`)
      }
    })
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}
