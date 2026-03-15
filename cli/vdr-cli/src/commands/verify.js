'use strict'
const { Command } = require('commander')
const axios = require('axios')
const chalk = require('chalk')
const ora = require('ora')
const { computeFileHash } = require('../utils/hash')
const fs = require('fs')
const path = require('path')
const { loadConfig } = require('../utils/configManager')
const { createFormatter } = require('../utils/formatter')

const verifyCmd = new Command('verify')
    .description('Verify a file, URL, or hash against the SipHeron registry')
    .argument('[file]', 'Path to the file to verify, or a 64-char hex hash')
    .option('--url <url>', 'Fetch file from URL and verify its hash')
    .option('--hash <hash>', 'Verify a raw SHA-256 hash directly without a file')
    .option('--json', 'Output result as JSON')
    .option('-f, --format <format>', 'Output format: human (default), json, quiet', 'human')
    .action(async (target, options) => {
        const format = options.json ? 'json' : (options.format || 'human')
        const fmt = createFormatter(format)

        const config = loadConfig()
        const apiKey = config.apiKey || process.env.SIPHERON_API_KEY
        const apiUrl = config.apiUrl || 'https://api.sipheron.com'

        let computedHash = null

        // Check if argument is a file path or a 64-char hex hash
        const isHashArg = target && /^[a-f0-9]{64}$/i.test(target)
        const isFile = target && !isHashArg && fs.existsSync(target)

        // Mode 1: --hash flag or hash argument
        if (options.hash || isHashArg) {
            const hashToVerify = options.hash || target
            if (!/^[a-fA-F0-9]{64}$/.test(hashToVerify)) {
                fmt.fail('Invalid SHA-256 hash format')
            }
            computedHash = hashToVerify.toLowerCase()
            fmt.info(`Verifying hash: ${computedHash.slice(0, 16)}...`)
        }
        // Mode 2: --url flag
        else if (options.url) {
            fmt.info(`Fetching from ${options.url}...`)
            try {
                const https = require('https')
                const http = require('http')
                const { createHash } = require('crypto')
                const client = options.url.startsWith('https') ? https : http

                computedHash = await new Promise((resolve, reject) => {
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
                fmt.info(`URL hash: ${computedHash}`)
            } catch (err) {
                fmt.fail(`Failed to fetch URL: ${err.message}`)
            }
        }
        // Mode 3: file path
        else if (isFile || target) {
            if (!fs.existsSync(target)) {
                fmt.fail(`File not found: ${target}`)
            }
            fmt.info(`Hashing file: ${target}`)
            computedHash = await computeFileHash(target)
            fmt.info(`SHA-256: ${computedHash.slice(0, 16)}...`)
        }
        else {
            fmt.fail(`Argument is neither a valid file path nor a 64-character SHA-256 hash`)
        }

        // Query backend
        fmt.info('Querying SipHeron Registry...')
        try {
            const res = await axios.post(`${apiUrl}/api/verify`, { hash: computedHash }, {
                headers: { 'x-api-key': apiKey }
            })

            const data = res.data

            if (data.authentic) {
                fmt.authentic({
                    hash: computedHash,
                    metadata: data.anchor?.metadata,
                    anchoredAt: data.anchor?.blockTimestamp || data.anchor?.createdAt,
                    organization: data.anchor?.organizationName,
                    txSignature: data.blockchain?.txSignature,
                    explorerUrl: data.blockchain?.explorerUrl,
                    verifyUrl: `https://app.sipheron.com/verify/${computedHash}`,
                })
                fmt.exit(0)
            } else if (data.status === 'REVOKED') {
                fmt.revoked({
                    hash: computedHash,
                    revokedAt: data.anchor?.revokedAt,
                    revocationNote: data.anchor?.revocationNote,
                })
                fmt.exit(2)
            } else if (data.error === 'NOT_FOUND' || data.status === 'NOT_FOUND' || res.status === 404) {
                fmt.notFound(computedHash)
                fmt.exit(1)
            } else {
                fmt.mismatch(computedHash, data.anchor?.hash)
                fmt.exit(1)
            }

        } catch (err) {
            if (err.response?.status === 404 || err.response?.data?.error === 'NOT_FOUND') {
                fmt.notFound(computedHash)
                fmt.exit(1)
            }
            fmt.fail('Verification failed', { details: err.response?.data?.error || err.message })
        }
    })

const verifyHashCmd = new Command('verify-hash')
    .description('Verify a raw hex hash directly against the VDR registry (Legacy)')
    .argument('<hash>', 'SHA-256 hex string')
    .option('-f, --format <format>', 'Output format: human (default), json, quiet', 'human')
    .action(async (hash, options) => {
        // Redirect to verify --hash
        const fmtString = options.format || 'human'
        await verifyCmd.parseAsync(['node', 'verify', '--hash', hash, '--format', fmtString]);
    })

module.exports = { verifyCmd, verifyHashCmd }
