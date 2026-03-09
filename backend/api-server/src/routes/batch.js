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
const { z } = require('zod');
const { validateInput } = require('../middleware/security');

const router = express.Router();

const batchRegisterSchema = z.object({
    hashes: z.array(z.string().length(64).regex(/^[a-fA-F0-9]+$/)).min(1).max(100),
    metadata: z.string().optional().default("Batch API Hash"),
    expiry: z.number().int().nonnegative().optional().default(0)
});

router.post('/batch-register', authenticate, validateInput(batchRegisterSchema), async (req, res, next) => {
    try {
        const { hashes, metadata, expiry } = req.body;

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
