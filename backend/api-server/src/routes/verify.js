/**
 * @file verify.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/routes/verify.js
 * @description Express API route handlers.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const express = require('express')
const router = express.Router()
const prisma = require('../config/database')
const crypto = require('crypto')
const multer = require('multer')
const { idempotencyMiddleware } = require('../middleware/idempotency')
const { fireWebhookEvent } = require('../services/webhookService')
const { logAudit, AUDIT_ACTIONS } = require('../utils/auditLogger')

// multer — memory storage, max 100MB, for optional file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
})

// POST /api/verify — verify a hash or uploaded file
// No auth required — public endpoint
router.post('/', idempotencyMiddleware, upload.single('file'), async (req, res) => {
  try {
    let hash = req.body?.hash

    // If file uploaded, compute hash server-side
    if (req.file && !hash) {
      hash = crypto
        .createHash('sha256')
        .update(req.file.buffer)
        .digest('hex')
    }

    if (!hash) {
      return res.status(400).json({
        authentic: false,
        error: 'Provide either a hash string or a file to verify',
        verified_at: new Date().toISOString(),
      })
    }

    // Normalize hash
    hash = hash.trim().toLowerCase()

    if (!/^[a-f0-9]{64}$/.test(hash)) {
      return res.status(400).json({
        authentic: false,
        error: 'Invalid hash format — must be 64 hex characters (SHA-256)',
        verified_at: new Date().toISOString(),
      })
    }

    const record = await prisma.hashRecord.findUnique({
      where: { hash },
      include: {
        organization: { select: { name: true, id: true } }
      }
    })

    const verified_at = new Date().toISOString()

    if (!record) {
      return res.status(404).json({
        authentic: false,
        error: 'NOT_FOUND',
        message: 'No anchor record found for this hash',
        hash,
        verified_at,
      })
    }

    if (record.status === 'REVOKED') {
      if (record && record.organizationId) {
        fireWebhookEvent(record.organizationId, 'verification.performed', {
          hash,
          authentic: false,
          status: record.status,
          verifiedAt: verified_at,
          metadata: record.metadata,
          txSignature: record.txSignature,
        }).catch(console.error)

        checkForAnomaly(record, record.organizationId).catch(console.error)
      }

      logAudit({
        organizationId: record.organizationId,
        action: AUDIT_ACTIONS.HASH_VERIFIED || 'HASH_VERIFIED',
        category: 'hash',
        metadata: {
          hash: record.hash,
          authentic: false,
          status: record.status,
        },
        req,
      }).catch(console.error)

      return res.status(200).json({
        authentic: false,
        status: 'REVOKED',
        message: 'This document has been revoked',
        hash,
        verified_at,
        anchor: {
          id: record.id,
          hash: record.hash,
          metadata: record.metadata,
          status: record.status,
          createdAt: record.createdAt,
          blockTimestamp: record.blockTimestamp,
          organizationName: record.organization?.name,
          revokedAt: record.revokedAt,
          revokedBy: record.revokedBy,
          revocationNote: record.revocationNote,
        },
        blockchain: {
          txSignature: record.txSignature,
          blockNumber: record.blockNumber?.toString(),
          blockTimestamp: record.blockTimestamp,
          explorerUrl: record.txSignature
            ? `https://explorer.solana.com/tx/${record.txSignature}?cluster=devnet`
            : null,
        },
      })
    }

    const authentic = record.status === 'CONFIRMED'

    if (record && record.organizationId) {
      fireWebhookEvent(record.organizationId, 'verification.performed', {
        hash,
        authentic: authentic,
        status: record.status,
        verifiedAt: verified_at,
        metadata: record.metadata,
        txSignature: record.txSignature,
      }).catch(console.error)

      checkForAnomaly(record, record.organizationId).catch(console.error)
    }

    logAudit({
      organizationId: record.organizationId,
      action: AUDIT_ACTIONS.HASH_VERIFIED || 'HASH_VERIFIED',
      category: 'hash',
      metadata: {
        hash: record.hash,
        authentic,
        status: record.status,
      },
      req,
    }).catch(console.error)

    return res.status(200).json({
      authentic,
      status: record.status,
      hash,
      verified_at,
      anchor: {
        id: record.id,
        hash: record.hash,
        metadata: record.metadata,
        status: record.status,
        createdAt: record.createdAt,
        blockTimestamp: record.blockTimestamp,
        fileSize: record.fileSize?.toString() || null,
        mimeType: record.mimeType,
        tags: record.tags,
        organizationName: record.organization?.name,
      },
      blockchain: {
        txSignature: record.txSignature,
        blockNumber: record.blockNumber?.toString(),
        blockTimestamp: record.blockTimestamp,
        explorerUrl: record.txSignature
          ? `https://explorer.solana.com/tx/${record.txSignature}?cluster=devnet`
          : null,
        network: 'Solana Devnet',
        contractAddress: '6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo',
      },
    })
  } catch (err) {
    console.error('[VERIFY] error:', err)
    res.status(500).json({
      authentic: false,
      error: 'INTERNAL_ERROR',
      message: 'Verification failed — please try again',
      verified_at: new Date().toISOString(),
    })
  }
})

async function checkForAnomaly(record, organizationId) {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    // Count recent verifications — use audit log if available
    const recentCount = await prisma.auditLog.count({
      where: {
        organizationId: record.organizationId,
        action: 'HASH_VERIFIED',
        metadata: { path: ['hash'], equals: record.hash },
        createdAt: { gte: oneHourAgo },
      }
    }).catch(() => 0)

    const ANOMALY_THRESHOLD = 10

    if (recentCount >= ANOMALY_THRESHOLD) {
      await fireWebhookEvent(record.organizationId, 'anomaly.detected', {
        hash: record.hash,
        metadata: record.metadata,
        anomalyType: 'high_verification_frequency',
        verificationCount: recentCount,
        windowMinutes: 60,
        threshold: ANOMALY_THRESHOLD,
        detectedAt: new Date().toISOString(),
      })
    }
  } catch (err) {
    // Never throw — anomaly detection is non-critical
    console.error('[ANOMALY] detection error:', err.message)
  }
}

// POST /api/verify/batch — verify up to 500 hashes at once
router.post('/batch', async (req, res) => {
  try {
    const { hashes } = req.body

    if (!Array.isArray(hashes) || hashes.length === 0) {
      return res.status(400).json({
        error: 'hashes must be a non-empty array',
        verified_at: new Date().toISOString(),
      })
    }

    if (hashes.length > 500) {
      return res.status(400).json({
        error: 'Maximum 500 hashes per batch request',
        verified_at: new Date().toISOString(),
      })
    }

    const normalized = hashes.map(h => ({
      raw: h,
      hash: typeof h === 'string' ? h.trim().toLowerCase() : null,
      valid: typeof h === 'string' && /^[a-f0-9]{64}$/i.test(h.trim()),
    }))

    const validHashes = normalized.filter(h => h.valid).map(h => h.hash)

    const records = await prisma.hashRecord.findMany({
      where: { hash: { in: validHashes } },
      select: {
        hash: true,
        status: true,
        metadata: true,
        createdAt: true,
        blockTimestamp: true,
        txSignature: true,
        blockNumber: true,
        revokedAt: true,
        organization: { select: { name: true } },
      }
    })

    const recordMap = Object.fromEntries(records.map(r => [r.hash, r]))
    const verified_at = new Date().toISOString()

    const results = normalized.map(({ raw, hash, valid }) => {
      if (!valid || !hash) {
        return {
          hash: raw,
          authentic: false,
          status: 'INVALID',
          error: 'Invalid hash format',
          verified_at,
        }
      }

      const record = recordMap[hash]

      if (!record) {
        return {
          hash,
          authentic: false,
          status: 'NOT_FOUND',
          verified_at,
        }
      }

      if (record.status === 'REVOKED') {
        return {
          hash,
          authentic: false,
          status: 'REVOKED',
          revokedAt: record.revokedAt,
          verified_at,
          anchor: {
            metadata: record.metadata,
            createdAt: record.createdAt,
            organizationName: record.organization?.name,
          },
        }
      }

      return {
        hash,
        authentic: record.status === 'CONFIRMED',
        status: record.status,
        verified_at,
        anchor: {
          metadata: record.metadata,
          createdAt: record.createdAt,
          blockTimestamp: record.blockTimestamp,
          organizationName: record.organization?.name,
        },
        blockchain: {
          txSignature: record.txSignature,
          blockNumber: record.blockNumber?.toString(),
          explorerUrl: record.txSignature
            ? `https://explorer.solana.com/tx/${record.txSignature}?cluster=devnet`
            : null,
        },
      }
    })

    const summary = {
      total: results.length,
      authentic: results.filter(r => r.authentic).length,
      notFound: results.filter(r => r.status === 'NOT_FOUND').length,
      revoked: results.filter(r => r.status === 'REVOKED').length,
      invalid: results.filter(r => r.status === 'INVALID').length,
      failed: results.filter(r => !r.authentic && r.status === 'CONFIRMED').length,
    }

    res.json({
      results,
      summary,
      verified_at,
      batchSize: results.length,
    })
  } catch (err) {
    console.error('[VERIFY/BATCH] error:', err)
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Batch verification failed',
      verified_at: new Date().toISOString(),
    })
  }
})

// GET /api/verify/:hash — public hash verification
// Matches GET /v1/verify/:hash
router.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const solanaService = require('../services/solana');

    if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
        return res.status(400).json({ error: 'Invalid SHA-256 hash format' });
    }

    // Try DB first
    const record = await prisma.hashRecord.findUnique({
        where: { hash },
        include: { organization: { select: { name: true, id: true } } }
    });

    const network = process.env.SOLANA_NETWORK || 'devnet';

    if (!record) {
        // Try Solana directly
        const solanaData = await solanaService.verifyHash(hash);
        if (solanaData.exists && solanaData.record) {
            return res.json({
                verified: true,
                record: {
                    hash: solanaData.record.hash,
                    metadata: solanaData.record.metadata || '',
                    status: solanaData.record.status || (solanaData.record.isRevoked ? 'revoked' : 'active'),
                    registeredAt: solanaData.record.timestamp
                        ? new Date(solanaData.record.timestamp * 1000).toISOString()
                        : (solanaData.record.createdAt ? solanaData.record.createdAt.toISOString() : new Date().toISOString()),
                    revokedAt: solanaData.record.revokedAt ? solanaData.record.revokedAt.toISOString() : null,
                    expiry: solanaData.record.expiry > 0 ? new Date(solanaData.record.expiry * 1000).toISOString() : null,
                    txSignature: solanaData.record.txSignature,
                    pdaAddress: solanaData.record.pdaAddress,
                    explorerUrl: solanaData.record.txSignature ? `https://explorer.solana.com/tx/${solanaData.record.txSignature}?cluster=${network}` : null,
                    pdaExplorerUrl: `https://explorer.solana.com/address/${solanaData.record.pdaAddress}?cluster=${network}`
                },
                organization: null
            });
        }
        return res.status(404).json({ verified: false, error: 'Hash not found in registry' });
    }

    res.json({
        verified: true,
        record: {
            hash: record.hash,
            metadata: record.metadata || '',
            status: record.status || (record.isRevoked ? 'revoked' : 'active'),
            registeredAt: record.timestamp
                ? new Date(record.timestamp * 1000).toISOString()
                : record.createdAt.toISOString(),
            revokedAt: record.revokedAt ? record.revokedAt.toISOString() : null,
            expiry: record.expiry > 0 ? new Date(record.expiry * 1000).toISOString() : null,
            txSignature: record.txSignature,
            pdaAddress: record.pdaAddress,
            explorerUrl: record.txSignature ? `https://explorer.solana.com/tx/${record.txSignature}?cluster=${network}` : null,
            pdaExplorerUrl: `https://explorer.solana.com/address/${record.pdaAddress}?cluster=${network}`
        },
        organization: record.organization
            ? { name: record.organization.name, id: record.organization.id }
            : null
    });
  } catch (err) {
    console.error('[VERIFY/GET] error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router
