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
        this.connection = solanaService.program.provider.connection;
        this.program = solanaService.program;
        this.subscriptionId = null;
    }

    async start() {
        console.log("Starting VDR Protocol Indexer...");

        // In a real production system, this would listen to program logs using onLogs
        // For this boilerplate, we'll poll the accounts list every X seconds or use Anchor event listeners if defined.

        // Let's use Anchor Event Listeners if we had `#[event]` macros, but since we rely on plain accounts:
        // We will poll new instances of HashRecord occasionally to sync.
        this.subscriptionId = setInterval(async () => {
            await this.syncDatabase();
        }, 60000); // 1 minute interval

        await this.syncDatabase(); // Initial sync
    }

    async syncDatabase() {
        try {
            // Fetch all PDA accounts of type HashRecord
            const records = await this.program.account.hashRecord.all();

            console.log(`Indexer: Found ${records.length} hash records on-chain. Syncing database...`);

            for (const record of records) {
                const hashStr = Buffer.from(record.account.hash).toString('hex');
                const pdaStr = record.publicKey.toBase58();

                await prisma.hashRecord.upsert({
                    where: { pdaAddress: pdaStr },
                    update: {
                        isRevoked: record.account.isRevoked
                    },
                    create: {
                        hash: hashStr,
                        pdaAddress: pdaStr,
                        ownerWallet: record.account.owner.toBase58(),
                        timestamp: record.account.timestamp.toNumber(),
                        expiry: record.account.expiry.toNumber(),
                        isRevoked: record.account.isRevoked,
                        metadata: record.account.metadata,
                        txSignature: "indexed_background" // Could fetch getSignaturesForAddress
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
