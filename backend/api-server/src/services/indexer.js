/**
 * @file indexer.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/services/indexer.js
 * @description Core business logic and external service integrations.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const anchor = require('@coral-xyz/anchor');
const prisma = require('../config/database');
const solanaService = require('./solana');

/**
 * SipHeron Blockchain Indexer
 * Connects via WebSocket to Solana to watch for newly registered hashes
 * and synchronizes them to our high-performance PostgreSQL/SQLite database.
 */
class VdrIndexer {
    constructor() {
        this.connection = null;
        this.program = null;
        this.subscriptionId = null;
        this.lastRecordCount = -1;
    }

    async start() {
        console.log(`Indexer: Background sync service starting. Target: ${process.env.SOLANA_RPC_URL}`);

        let initialized = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!initialized && attempts < maxAttempts) {
            attempts++;
            try {
                process.stdout.write(`[Indexer] Waiting for Solana service... attempt ${attempts}/${maxAttempts}\r`);
                await solanaService.initialize();

                const program = solanaService.getProgram();
                if (program) {
                    this.connection = solanaService.getConnection();
                    this.program = program;
                    initialized = true;
                    console.log(`\n[Indexer] Solana service initialized successfully on attempt ${attempts}.`);
                }
            } catch (err) {
                if (attempts >= maxAttempts) {
                    console.error(`\n[Indexer] Fatal: Could not initialize Solana service after ${maxAttempts} attempts.`);
                } else {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }

        if (initialized) {
            this.subscriptionId = setInterval(async () => {
                await this.syncDatabase();
            }, 30000); // 30 second interval

            // 90-day Auto-cleanup for API Usage Logs (Daily at 3am-ish or every 24h)
            setInterval(async () => {
                const ninetyDaysAgo = new Date();
                ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
                try {
                    const deleted = await prisma.apiUsageLog.deleteMany({
                        where: { createdAt: { lt: ninetyDaysAgo } }
                    });
                    if (deleted.count > 0) {
                        console.log(`[Cleanup] Deleted ${deleted.count} API usage logs older than 90 days.`);
                    }
                } catch (err) {
                    console.error('[Cleanup] Daily usage log cleanup failed:', err.message);
                }
            }, 24 * 60 * 60 * 1000); // 24 hour interval

            await this.syncDatabase(); // Initial sync
        }
    }

    async syncDatabase() {
        try {
            // Retry lazy initialization if program wasn't ready at start
            if (!this.program) {
                if (solanaService.program && solanaService.program.provider) {
                    this.connection = solanaService.program.provider.connection;
                    this.program = solanaService.program;
                    console.log('Indexer: Solana connection established.');
                } else {
                    return; // Skip sync cycle — Solana not available
                }
            }

            // Fetch all PDA accounts of type HashRecord
            const records = await this.program.account.hashRecord.all();

            if (records.length !== this.lastRecordCount) {
                this.lastRecordCount = records.length;
            }

            for (const record of records) {
                try {
                    const hashStr = Buffer.from(record.account.hash).toString('hex');
                    const pdaStr = record.publicKey.toBase58();
                    const ownerWallet = record.account.owner.toBase58();

                    const org = await prisma.organization.findUnique({
                        where: { solanaPubkey: ownerWallet }
                    });

                    if (!org) {
                        continue;
                    }

                    await prisma.hashRecord.upsert({
                        where: { pdaAddress: pdaStr },
                        update: {
                            isRevoked: record.account.isRevoked
                        },
                        create: {
                            hash: hashStr,
                            pdaAddress: pdaStr,
                            ownerWallet: ownerWallet,
                            timestamp: record.account.timestamp.toNumber(),
                            expiry: record.account.expiry.toNumber(),
                            isRevoked: record.account.isRevoked,
                            metadata: record.account.metadata,
                            txSignature: "indexed_background",
                            organizationId: org.id
                        }
                    });
                } catch (recordError) {
                    console.error(`[Indexer] Skipping malformed or failed record ${record.publicKey.toBase58()}:`, recordError.message);
                }
            }


        } catch (error) {
            console.error("Indexer Sync Error:", error.message);
        }
    }

    stop() {
        if (this.subscriptionId) clearInterval(this.subscriptionId);
    }
}

module.exports = new VdrIndexer();

