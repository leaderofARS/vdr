/**
 * @file database.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/config/database.js
 * @description Database and environment configurations.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const { PrismaClient } = require('@prisma/client');

/**
 * Validate database configuration for production readiness.
 * SQLite is allowed for development but rejected in production.
 */
function validateDatabaseConfig() {
    const isProduction = process.env.NODE_ENV === 'production';
    const databaseUrl = process.env.DATABASE_URL || '';

    if (isProduction && databaseUrl.includes('sqlite')) {
        throw new Error(
            'SECURITY: SQLite is not allowed in production. ' +
            'Configure PostgreSQL via DATABASE_URL.'
        );
    }

    if (isProduction && !databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
        throw new Error(
            'SECURITY: Production requires PostgreSQL. ' +
            'DATABASE_URL must start with postgresql:// or postgres://'
        );
    }
}

validateDatabaseConfig();

const prisma = new PrismaClient();

module.exports = prisma;
