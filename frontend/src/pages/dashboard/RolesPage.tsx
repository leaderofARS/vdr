'use client'

import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'

interface Permission {
  key: string
  value: string
  label: string
  category: string
}

interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
  builtIn?: boolean
  preset?: boolean
  memberCount?: number
}

const CATEGORY_COLORS: Record<string, string> = {
  hash:     'text-purple-400 bg-purple-400/10 border-purple-400/20',
  key:      'text-blue-400 bg-blue-400/10 border-blue-400/20',
  member:   'text-green-400 bg-green-400/10 border-green-400/20',
  webhook:  'text-orange-400 bg-orange-400/10 border-orange-400/20',
  org:      'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  audit:    'text-gray-400 bg-gray-400/10 border-gray-400/20',
  analytics:'text-teal-400 bg-teal-400/10 border-teal-400/20',
}

export default function RolesPage() {
  const { user } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // New role form state
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDesc, setNewRoleDesc] = useState('')
  const [newRolePerms, setNewRolePerms] = useState<Set<string>>(new Set())

  const isOwner = user?.orgRole === 'owner'

  useEffect(() => {
    api.get('/api/roles')
      .then(res => {
        setRoles(res.data.roles || [])
        setPermissions(res.data.availablePermissions || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const groupedPermissions = permissions.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {} as Record<string, Permission[]>)

  const handleCreateRole = async () => {
    if (!newRoleName.trim() || newRolePerms.size === 0) return
    try {
      const res = await api.post('/api/roles', {
        name: newRoleName,
        description: newRoleDesc,
        permissions: Array.from(newRolePerms),
      })
      setRoles(prev => [...prev, res.data.role])
      setCreating(false)
      setNewRoleName('')
      setNewRoleDesc('')
      setNewRolePerms(new Set())
    } catch (err) {
      console.error('Failed to create role:', err)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm('Delete this role?')) return
    try {
      await api.delete(`/api/roles/${roleId}`)
      setRoles(prev => prev.filter(r => r.id !== roleId))
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      alert(e.response?.data?.error || 'Failed to delete role')
    }
  }

  const togglePerm = (perm: string) => {
    setNewRolePerms(prev => {
      const next = new Set(prev)
      if (next.has(perm)) next.delete(perm)
      else next.add(perm)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-sipheron-purple
                        border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-sipheron-text-primary">
            Roles & Permissions
          </h1>
          <p className="text-sipheron-text-muted text-sm mt-1">
            Manage built-in roles and create custom permission sets
          </p>
        </div>
        {isOwner && !creating && (
          <button
            onClick={() => setCreating(true)}
            className="btn-primary flex items-center gap-2"
          >
            + Create Custom Role
          </button>
        )}
      </div>

      {/* Create role form */}
      {creating && (
        <div className="bg-sipheron-surface border border-white/[0.06]
                        rounded-xl p-6 space-y-5">
          <p className="text-sm font-semibold text-sipheron-text-primary">
            New Custom Role
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-sipheron-text-muted mb-1.5 block">
                Role Name *
              </label>
              <input
                type="text"
                value={newRoleName}
                onChange={e => setNewRoleName(e.target.value)}
                placeholder="e.g. Compliance Officer"
                className="w-full bg-sipheron-base border border-white/[0.06]
                           rounded-lg px-3 py-2 text-sm text-sipheron-text-primary
                           focus:outline-none focus:border-sipheron-purple"
              />
            </div>
            <div>
              <label className="text-xs text-sipheron-text-muted mb-1.5 block">
                Description
              </label>
              <input
                type="text"
                value={newRoleDesc}
                onChange={e => setNewRoleDesc(e.target.value)}
                placeholder="Brief description of this role"
                className="w-full bg-sipheron-base border border-white/[0.06]
                           rounded-lg px-3 py-2 text-sm text-sipheron-text-primary
                           focus:outline-none focus:border-sipheron-purple"
              />
            </div>
          </div>

          {/* Permission selector by category */}
          <div>
            <label className="text-xs text-sipheron-text-muted mb-3 block">
              Permissions ({newRolePerms.size} selected)
            </label>
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest
                                  mb-2 px-2 py-0.5 rounded border w-fit
                                  ${CATEGORY_COLORS[category] || CATEGORY_COLORS.org}`}>
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {perms.map(perm => (
                      <button
                        key={perm.value}
                        onClick={() => togglePerm(perm.value)}
                        className={`text-xs px-3 py-1.5 rounded-lg border
                                    transition-all ${
                          newRolePerms.has(perm.value)
                            ? 'bg-sipheron-purple border-sipheron-purple text-white'
                            : 'border-white/[0.06] text-sipheron-text-muted hover:text-sipheron-text-primary hover:border-white/20'
                        }`}
                      >
                        {perm.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preset buttons */}
          <div>
            <p className="text-xs text-sipheron-text-muted mb-2">
              Or start from a preset:
            </p>
            <div className="flex flex-wrap gap-2">
              {['admin', 'member', 'compliance', 'viewer'].map(preset => (
                <button
                  key={preset}
                  onClick={async () => {
                    const res = await api.get('/api/roles')
                    const presetRole = res.data.roles.find(
                      (r: Role) => r.id === preset
                    )
                    if (presetRole) {
                      setNewRolePerms(new Set(presetRole.permissions))
                    }
                  }}
                  className="text-xs px-3 py-1 border border-white/[0.06]
                             rounded text-sipheron-text-muted hover:text-sipheron-text-primary
                             transition-colors capitalize"
                >
                  Load {preset} preset
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCreateRole}
              disabled={!newRoleName.trim() || newRolePerms.size === 0}
              className="btn-primary disabled:opacity-40"
            >
              Create Role
            </button>
            <button
              onClick={() => setCreating(false)}
              className="px-5 py-2 border border-white/[0.06] text-sipheron-text-muted
                         hover:text-sipheron-text-primary text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Roles list */}
      <div className="space-y-3">
        {roles.map(role => (
          <div
            key={role.id}
            className="bg-sipheron-surface border border-white/[0.06]
                       rounded-xl p-5 hover:border-sipheron-purple/20
                       transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-sipheron-text-primary">
                    {role.name}
                  </p>
                  {role.builtIn && (
                    <span className="text-[10px] bg-white/5 text-sipheron-text-muted
                                      border border-white/10 rounded px-1.5 py-0.5">
                      Built-in
                    </span>
                  )}
                  {role.preset && (
                    <span className="text-[10px] bg-sipheron-purple/10
                                      text-sipheron-purple border border-sipheron-purple/20
                                      rounded px-1.5 py-0.5">
                      Preset
                    </span>
                  )}
                </div>
                {role.description && (
                  <p className="text-xs text-sipheron-text-muted mt-1">
                    {role.description}
                  </p>
                )}

                {/* Permissions display */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {role.permissions.slice(0, 12).map(perm => {
                    const category = perm.split(':')[0]
                    return (
                      <span
                        key={perm}
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[category] || CATEGORY_COLORS.org}`}
                      >
                        {perm}
                      </span>
                    )
                  })}
                  {role.permissions.length > 12 && (
                    <span className="text-[10px] text-sipheron-text-muted px-2 py-0.5">
                      +{role.permissions.length - 12} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions — only for custom roles, only for owners */}
              {!role.builtIn && isOwner && (
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-xs text-sipheron-red hover:text-red-400
                             transition-colors flex-shrink-0 px-2 py-1"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
