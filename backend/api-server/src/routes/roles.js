const express = require('express')
const router = express.Router()
const prisma = require('../config/database')
const authenticate = require('../middleware/auth')
const { requireRole } = require('../middleware/rbac')
const { PERMISSIONS, ROLE_PERMISSIONS } = require('../utils/permissions')

// GET /api/roles — list all roles (built-in + custom)
router.get('/', authenticate, async (req, res) => {
  try {
    const organizationId = req.organization?.id

    // Get custom roles for this org
    const customRoles = await prisma.customRole.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    })

    // Return built-in roles + custom roles
    const builtInRoles = [
      {
        id: 'owner',
        name: 'Owner',
        description: 'Full access including billing and team management',
        permissions: ROLE_PERMISSIONS.owner,
        builtIn: true,
        memberCount: null, // fetched separately if needed
      },
      {
        id: 'admin',
        name: 'Admin',
        description: 'Full access except billing',
        permissions: ROLE_PERMISSIONS.admin,
        builtIn: true,
      },
      {
        id: 'member',
        name: 'Member',
        description: 'Can anchor and verify documents, view dashboard',
        permissions: ROLE_PERMISSIONS.member,
        builtIn: true,
      },
      {
        id: 'compliance',
        name: 'Compliance Officer',
        description: 'Read-only access to all documents and audit logs, no anchoring',
        permissions: ROLE_PERMISSIONS.compliance,
        builtIn: true,
        preset: true,
      },
      {
        id: 'viewer',
        name: 'Viewer',
        description: 'View-only access, no actions',
        permissions: ROLE_PERMISSIONS.viewer,
        builtIn: true,
        preset: true,
      },
    ]

    res.json({
      roles: [
        ...builtInRoles,
        ...customRoles.map(r => ({
          ...r,
          builtIn: false,
        })),
      ],
      availablePermissions: Object.entries(PERMISSIONS).map(([key, value]) => ({
        key,
        value,
        label: key.replace(/_/g, ' ').toLowerCase()
          .replace(/^\w/, c => c.toUpperCase()),
        category: value.split(':')[0],
      })),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roles' })
  }
})

// POST /api/roles — create custom role (owner only)
router.post('/', authenticate, requireRole('owner'), async (req, res) => {
  try {
    const organizationId = req.organization?.id
    const { name, description, permissions } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Role name is required' })
    }
    if (!Array.isArray(permissions) || permissions.length === 0) {
      return res.status(400).json({ error: 'At least one permission is required' })
    }

    // Validate permissions
    const validPerms = Object.values(PERMISSIONS)
    const invalidPerms = permissions.filter(p => !validPerms.includes(p))
    if (invalidPerms.length > 0) {
      return res.status(400).json({
        error: 'Invalid permissions',
        invalid: invalidPerms,
        valid: validPerms,
      })
    }

    const role = await prisma.customRole.create({
      data: {
        organizationId,
        name: name.trim(),
        description: description?.trim() || null,
        permissions,
      }
    })

    const { logAudit, AUDIT_ACTIONS } = require('../utils/auditLogger')
    logAudit({
      organizationId,
      userId: req.user?.id,
      action: 'CUSTOM_ROLE_CREATED',
      category: 'org',
      metadata: { roleName: name, permissionCount: permissions.length },
      req,
    }).catch(console.error)

    res.status(201).json({ role })
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'A role with this name already exists'
      })
    }
    res.status(500).json({ error: 'Failed to create role' })
  }
})

// PATCH /api/roles/:id — update custom role
router.patch('/:id', authenticate, requireRole('owner'), async (req, res) => {
  try {
    const organizationId = req.organization?.id
    const { name, description, permissions } = req.body

    const existing = await prisma.customRole.findFirst({
      where: { id: req.params.id, organizationId }
    })
    if (!existing) {
      return res.status(404).json({ error: 'Role not found' })
    }

    if (permissions) {
      const validPerms = Object.values(PERMISSIONS)
      const invalidPerms = permissions.filter(p => !validPerms.includes(p))
      if (invalidPerms.length > 0) {
        return res.status(400).json({
          error: 'Invalid permissions',
          invalid: invalidPerms,
        })
      }
    }

    const updated = await prisma.customRole.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(permissions && { permissions }),
      }
    })

    res.json({ role: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' })
  }
})

// DELETE /api/roles/:id — delete custom role
router.delete('/:id', authenticate, requireRole('owner'), async (req, res) => {
  try {
    const organizationId = req.organization?.id

    const role = await prisma.customRole.findFirst({
      where: { id: req.params.id, organizationId },
      include: { members: { select: { id: true } } }
    })
    if (!role) return res.status(404).json({ error: 'Role not found' })

    if (role.members.length > 0) {
      return res.status(409).json({
        error: `Cannot delete role — ${role.members.length} member(s) are assigned to it. Reassign them first.`,
        memberCount: role.members.length,
      })
    }

    await prisma.customRole.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete role' })
  }
})

// POST /api/roles/:id/assign — assign custom role to member
router.post('/:id/assign', authenticate, requireRole('owner'), async (req, res) => {
  try {
    const organizationId = req.organization?.id
    const { memberId } = req.body

    const [role, member] = await Promise.all([
      prisma.customRole.findFirst({
        where: { id: req.params.id, organizationId }
      }),
      prisma.orgMember.findFirst({
        where: { id: memberId, organizationId }
      }),
    ])

    if (!role) return res.status(404).json({ error: 'Role not found' })
    if (!member) return res.status(404).json({ error: 'Member not found' })
    if (member.role === 'owner') {
      return res.status(403).json({ error: 'Cannot reassign the owner' })
    }

    const updated = await prisma.orgMember.update({
      where: { id: memberId },
      data: {
        role: 'custom',
        customRoleId: role.id,
      }
    })

    res.json({ member: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign role' })
  }
})

module.exports = router
