const prisma = require('../config/database');

/**
 * Log an audit event for an organization
 * Call this from any route after a significant action
 */
async function logAudit({
    organizationId,
    userId = null,
    action,
    category,
    metadata = {},
    req = null
}) {
    try {
        await prisma.auditLog.create({
            data: {
                organizationId,
                userId,
                action,
                category,
                metadata,
                ipAddress: req ? (req.ip || req.headers['x-forwarded-for'] || null) : null,
                userAgent: req ? (req.headers['user-agent'] || null) : null
            }
        });
    } catch (err) {
        // Never let audit logging crash the main request
        console.error('[AUDIT] Failed to log:', err.message);
    }
}

// Predefined action constants — import these in routes
const AUDIT_ACTIONS = {
    // Hash actions
    HASH_STAGED: 'HASH_STAGED',
    HASH_ANCHORED: 'HASH_ANCHORED',
    HASH_VERIFIED: 'HASH_VERIFIED',
    HASH_REVOKED: 'HASH_REVOKED',
    HASH_EXPORTED: 'HASH_EXPORTED',
    CERTIFICATE_GENERATED: 'CERTIFICATE_GENERATED',

    // API key actions
    KEY_CREATED: 'KEY_CREATED',
    KEY_DELETED: 'KEY_DELETED',
    KEY_USED: 'KEY_USED',

    // Member actions
    MEMBER_INVITED: 'MEMBER_INVITED',
    MEMBER_JOINED: 'MEMBER_JOINED',
    MEMBER_REMOVED: 'MEMBER_REMOVED',
    MEMBER_ROLE_CHANGED: 'MEMBER_ROLE_CHANGED',
    INVITE_CANCELLED: 'INVITE_CANCELLED',

    // Org actions
    ORG_CREATED: 'ORG_CREATED',
    ORG_UPDATED: 'ORG_UPDATED',

    // Webhook actions
    WEBHOOK_CREATED: 'WEBHOOK_CREATED',
    WEBHOOK_DELETED: 'WEBHOOK_DELETED',

    // Auth actions
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    PASSWORD_RESET: 'PASSWORD_RESET',
    API_KEY_AUTH: 'API_KEY_AUTH'
};

module.exports = { logAudit, AUDIT_ACTIONS };
