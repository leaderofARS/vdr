/**
 * SipHeron VDR — Permission System
 *
 * Built-in roles map to permission sets.
 * Custom roles define their own permission array.
 * RBAC middleware checks permissions, not just role names.
 */

const PERMISSIONS = {
  // Document permissions
  HASH_ANCHOR:       'hash:anchor',
  HASH_VIEW:         'hash:view',
  HASH_REVOKE:       'hash:revoke',
  HASH_EXPORT:       'hash:export',
  HASH_CERTIFICATE:  'hash:certificate',

  // API key permissions
  KEY_CREATE:        'key:create',
  KEY_DELETE:        'key:delete',
  KEY_VIEW:          'key:view',

  // Team permissions
  MEMBER_INVITE:     'member:invite',
  MEMBER_REMOVE:     'member:remove',
  MEMBER_ROLE:       'member:role',
  MEMBER_VIEW:       'member:view',

  // Webhook permissions
  WEBHOOK_MANAGE:    'webhook:manage',
  WEBHOOK_VIEW:      'webhook:view',

  // Org permissions
  ORG_SETTINGS:      'org:settings',
  ORG_BILLING:       'org:billing',

  // Audit permissions
  AUDIT_VIEW:        'audit:view',
  AUDIT_EXPORT:      'audit:export',

  // Analytics permissions
  ANALYTICS_VIEW:    'analytics:view',
}

// Built-in role permission sets
const ROLE_PERMISSIONS = {
  owner: Object.values(PERMISSIONS), // all permissions

  admin: [
    PERMISSIONS.HASH_ANCHOR,
    PERMISSIONS.HASH_VIEW,
    PERMISSIONS.HASH_REVOKE,
    PERMISSIONS.HASH_EXPORT,
    PERMISSIONS.HASH_CERTIFICATE,
    PERMISSIONS.KEY_CREATE,
    PERMISSIONS.KEY_DELETE,
    PERMISSIONS.KEY_VIEW,
    PERMISSIONS.MEMBER_INVITE,
    PERMISSIONS.MEMBER_REMOVE,
    PERMISSIONS.MEMBER_VIEW,
    PERMISSIONS.WEBHOOK_MANAGE,
    PERMISSIONS.WEBHOOK_VIEW,
    PERMISSIONS.ORG_SETTINGS,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
    PERMISSIONS.ANALYTICS_VIEW,
  ],

  member: [
    PERMISSIONS.HASH_ANCHOR,
    PERMISSIONS.HASH_VIEW,
    PERMISSIONS.HASH_CERTIFICATE,
    PERMISSIONS.KEY_VIEW,
    PERMISSIONS.MEMBER_VIEW,
    PERMISSIONS.WEBHOOK_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],

  // Compliance officer preset — read-only, no anchoring
  compliance: [
    PERMISSIONS.HASH_VIEW,
    PERMISSIONS.HASH_EXPORT,
    PERMISSIONS.HASH_CERTIFICATE,
    PERMISSIONS.KEY_VIEW,
    PERMISSIONS.MEMBER_VIEW,
    PERMISSIONS.WEBHOOK_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
    PERMISSIONS.ANALYTICS_VIEW,
  ],

  // Viewer preset — absolute minimum, view only
  viewer: [
    PERMISSIONS.HASH_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
}

/**
 * Check if a role has a specific permission
 * Works for both built-in roles and custom roles
 */
function hasPermission(role, permission, customPermissions = []) {
  if (role === 'owner') return true // owner always has everything

  // Custom role — check custom permissions array
  if (role === 'custom' && customPermissions.length > 0) {
    return customPermissions.includes(permission)
  }

  // Built-in role
  const rolePerms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.member
  return rolePerms.includes(permission)
}

/**
 * Express middleware — require a specific permission
 * More granular than requireRole — checks the permission directly
 */
function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const role = req.user?.orgRole || 'member'
      const customPermissions = req.user?.customPermissions || []

      if (hasPermission(role, permission, customPermissions)) {
        return next()
      }

      return res.status(403).json({
        error: 'INSUFFICIENT_PERMISSIONS',
        message: `This action requires the '${permission}' permission`,
        required: permission,
        yourRole: role,
      })
    } catch (err) {
      return res.status(500).json({ error: 'Permission check failed' })
    }
  }
}

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  requirePermission,
}
