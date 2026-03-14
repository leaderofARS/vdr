/**
 * @file rbac.js
 * @description Role-based access control middleware for org routes
 * Usage:
 *   router.delete('/something', authenticate, requireRole('admin'), handler)
 *   router.post('/something', authenticate, requireRole('owner'), handler)
 */

const ROLE_HIERARCHY = { owner: 3, admin: 2, member: 1 };

/**
 * Middleware — requires caller to have at least the specified role
 * @param {'owner'|'admin'|'member'} minRole
 */
function requireRole(minRole) {
    return (req, res, next) => {
        const callerRole = req.user?.orgRole || 'member';
        const callerLevel = ROLE_HIERARCHY[callerRole] || 0;
        const requiredLevel = ROLE_HIERARCHY[minRole] || 0;

        console.log('[RBAC] Role check:', { callerRole, callerLevel, requiredRole: minRole, requiredLevel, userId: req.user?.id });

        if (callerLevel < requiredLevel) {
            return res.status(403).json({
                error: `Access denied. Requires ${minRole} role, you are ${callerRole}.`,
                debug: { userId: req.user?.id, orgId: req.organization?.id, role: callerRole }
            });
        }
        next();
    };
}

/**
 * Middleware — requires caller to own the org (ownerId === userId)
 */
function requireOwner(req, res, next) {
    if (req.user?.orgRole !== 'owner') {
        return res.status(403).json({
            error: 'Only the organization owner can perform this action.'
        });
    }
    next();
}

/**
 * Utility — check role level without middleware (for use inside route handlers)
 */
function hasRole(userRole, minRole) {
    return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[minRole] || 0);
}

module.exports = { requireRole, requireOwner, hasRole };
