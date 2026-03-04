/**
 * @file indexer.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/services/indexer.js
 * @description Core business logic and external service integrations.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const anchor = require('@coral-xyz/anchor');
const { PrismaClient } = require('@prisma/client');
const solanaService = require('./solana');

const prisma = new PrismaClient();

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
        console.log(`Indexer: Background sync service started. Target: ${process.env.SOLANA_RPC_URL}`);

        // Lazy initialization — solanaService.program may not be ready at import time
        try {
            if (solanaService.program && solanaService.program.provider) {
                this.connection = solanaService.program.provider.connection;
                this.program = solanaService.program;
            } else {
                console.warn('Indexer: Solana program not initialized yet. Will retry on next sync cycle.');
            }
        } catch (err) {
            console.warn('Indexer: Failed to connect to Solana service:', err.message);
        }

        this.subscriptionId = setInterval(async () => {
            await this.syncDatabase();
        }, 60000); // 1 minute interval

        await this.syncDatabase(); // Initial sync
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

