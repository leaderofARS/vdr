const express = require('express');
const authenticate = require('../middleware/auth');
const { hashQueue } = require('../workers/batchQueue');

const router = express.Router();

router.post('/batch-register', authenticate, async (req, res, next) => {
    try {
        const { hashes, metadata, expiry } = req.body;

        if (!Array.isArray(hashes) || hashes.length === 0) {
            return res.status(400).json({ error: 'hashes array is required' });
        }

        if (hashes.length > 500) {
            return res.status(400).json({ error: 'Maximum batch size is 500' });
        }

        // Add job to BullMQ queue
        const job = await hashQueue.add('registerBatch', {
            hashes,
            metadata: metadata || "Batch API Hash", // Keep original default logic for metadata
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

        const state = await job.getState();
        const result = job.returnvalue;
        const progress = job.progress;

        res.json({ jobId: job.id, state, progress, result });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
