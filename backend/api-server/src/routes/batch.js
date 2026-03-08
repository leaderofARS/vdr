/**
 * @file batch.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/routes/batch.js
 * @description Express API route handlers.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const express = require('express');
const authenticate = require('../middleware/auth');
const { hashQueue } = require('../workers/batchQueue');
const { sanitizeMetadata } = require('../utils/sanitizer');

const router = express.Router();

router.post('/batch-register', authenticate, async (req, res, next) => {
    try {
        const { hashes, metadata, expiry } = req.body;

        if (!Array.isArray(hashes) || hashes.length === 0) {
            return res.status(400).json({ error: 'hashes array is required' });
        }

        if (hashes.length > 100) {
            return res.status(400).json({ error: 'Maximum batch size is 100' });
        }

        const hexRegex = /^[a-fA-F0-9]{64}$/;
        for (const hash of hashes) {
            if (!hexRegex.test(hash)) {
                return res.status(400).json({ error: `Invalid SHA-256 hash provided in batch: ${hash}` });
            }
        }

        const organizationId = req.organization ? req.organization.id : null;

        if (!organizationId) {
            return res.status(403).json({ error: 'Institutional Context Required. Please link your organization or provide a valid API Key.' });
        }

        // Add job to BullMQ queue
        const job = await hashQueue.add('registerBatch', {
            hashes,
            metadata: sanitizeMetadata(metadata || "Batch API Hash"),
            expiry: expiry || 0, // Keep original default logic for expiry
            organizationId // Add organizationId
        }, {
            removeOnComplete: true,
            removeOnFail: 1000 // Keep last 1000 failed jobs for debugging
        });

        res.status(202).json({
            message: 'Batch registration queued',
            jobId: job.id,
            count: hashes.length
        });
    } catch (error) {
        next(error);
    }
});

router.get('/batch-status/:jobId', authenticate, async (req, res, next) => {
    try {
        const job = await hashQueue.getJob(req.params.jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // VULN-01 FIX: Enforce organization isolation
        if (job.data.organizationId !== req.organization.id) {
            return res.status(403).json({ error: 'Unauthorized: This job does not belong to your organization.' });
        }

        const state = await job.getState();
        const result = job.returnvalue;
        const progress = job.progress;

        res.json({ jobId: job.id, state, progress, result });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
