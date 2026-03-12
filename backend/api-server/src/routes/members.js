/**
 * @file members.js
 * @description Multi-user org membership and invite routes
 * Routes:
 *   GET    /api/members              — list all members of caller's org
 *   POST   /api/members/invite       — invite user by email
 *   DELETE /api/members/:memberId    — remove a member (admin/owner only)
 *   PATCH  /api/members/:memberId/role — change member role (owner only)
 *   GET    /api/members/invites      — list pending invites for org
 *   DELETE /api/members/invites/:inviteId — cancel an invite (admin/owner only)
 *   GET    /api/members/accept/:token — accept invite (public, no auth required)
 *   POST   /api/members/accept/:token — accept invite when logged in
 */

const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const authenticate = require('../middleware/auth');
const { sendOrgInviteEmail } = require('../services/emailService');
const { validateInput } = require('../middleware/security');
const { requireRole, requireOwner } = require('../middleware/rbac');

// ─── GET /api/members/me/role ────────────────────────────────────────────────
router.get('/me/role', authenticate, async (req, res) => {
    try {
        res.json({
            role: req.user.orgRole || 'member',
            organizationId: req.organization?.id
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get role' });
    }
});

// ─── GET /api/members ─────────────────────────────────────────────────────────
router.get('/', authenticate, async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        if (!organizationId) return res.status(400).json({ error: 'No organization linked' });

        const org = await prisma.organization.findUnique({
            where: { id: organizationId },
            include: {
                owner: { select: { id: true, email: true, name: true, createdAt: true } },
                members: {
                    include: {
                        user: { select: { id: true, email: true, name: true, createdAt: true } }
                    },
                    orderBy: { joinedAt: 'asc' }
                }
            }
        });

        if (!org) return res.status(404).json({ error: 'Organization not found' });

        const ownerEntry = {
            id: org.owner.id,
            email: org.owner.email,
            name: org.owner.name || org.owner.email,
            role: 'owner',
            joinedAt: org.owner.createdAt,
            isOwner: true
        };

        const memberList = org.members
            .filter(m => m.userId !== org.ownerId)
            .map(m => ({
                id: m.id,
                userId: m.userId,
                email: m.user.email,
                name: m.user.name || m.user.email,
                role: m.role,
                joinedAt: m.joinedAt,
                isOwner: false
            }));

        res.json({
            members: [ownerEntry, ...memberList],
            total: 1 + memberList.length
        });
    } catch (err) {
        console.error('[MEMBERS] list error:', err);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

// ─── POST /api/members/invite ─────────────────────────────────────────────────
router.post('/invite', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        const userId = req.user?.id;
        if (!organizationId) return res.status(400).json({ error: 'No organization linked' });

        const { email, role: inviteRole = 'member' } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });
        if (!['admin', 'member'].includes(inviteRole)) {
            return res.status(400).json({ error: 'Role must be admin or member' });
        }

        // Check org member limit (soft cap: 20 members)
        const memberCount = await prisma.orgMember.count({ where: { organizationId } });
        if (memberCount >= 19) {
            return res.status(400).json({ error: 'Organization member limit reached (20)' });
        }

        // Check if already a member
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const [alreadyMember, orgData] = await Promise.all([
                prisma.orgMember.findUnique({
                    where: { organizationId_userId: { organizationId, userId: existingUser.id } }
                }),
                prisma.organization.findUnique({
                    where: { id: organizationId }, select: { ownerId: true }
                })
            ]);
            const isOwner = orgData?.ownerId === existingUser.id;
            if (alreadyMember || isOwner) {
                return res.status(409).json({ error: 'This user is already a member of the organization' });
            }
        }

        // Cancel any existing pending invite for this email
        await prisma.orgInvite.updateMany({
            where: { organizationId, email, status: 'pending' },
            data: { status: 'cancelled' }
        });

        // Create invite — expires in 7 days
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const invite = await prisma.orgInvite.create({
            data: {
                organizationId,
                email,
                role: inviteRole,
                invitedBy: userId,
                expiresAt
            }
        });

        // Get org and inviter details for email
        const [org, inviter] = await Promise.all([
            prisma.organization.findUnique({ where: { id: organizationId }, select: { name: true } }),
            prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
        ]);

        const inviteUrl = `${process.env.FRONTEND_URL || 'https://app.sipheron.com'}/invite/accept/${invite.token}`;

        console.log('[MEMBERS] Sending invite email to:', email, 'inviteUrl:', inviteUrl);

        // Send email — wrapped in try/catch so invite succeeds even if email fails
        try {
            await sendOrgInviteEmail({
                toEmail: email,
                inviterName: inviter?.name || inviter?.email || 'A team member',
                orgName: org?.name || 'your organization',
                role: inviteRole,
                inviteUrl,
                expiresAt
            });
            console.log('[MEMBERS] Invite email sent successfully to:', email);
        } catch (emailErr) {
            console.error('[MEMBERS] Invite email failed:', emailErr.message, emailErr.stack);
            // Continue — invite was created in DB, email failure is non-fatal
        }

        res.status(201).json({
            message: `Invitation sent to ${email}`,
            invite: {
                id: invite.id,
                email: invite.email,
                role: invite.role,
                expiresAt: invite.expiresAt,
                status: invite.status
            }
        });
    } catch (err) {
        console.error('[MEMBERS] invite error:', err);
        res.status(500).json({ error: 'Failed to send invitation' });
    }
});

// ─── GET /api/members/invites ─────────────────────────────────────────────────
router.get('/invites', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        if (!organizationId) return res.status(400).json({ error: 'No organization linked' });

        // Auto-expire old invites
        await prisma.orgInvite.updateMany({
            where: { organizationId, status: 'pending', expiresAt: { lt: new Date() } },
            data: { status: 'expired' }
        });

        const invites = await prisma.orgInvite.findMany({
            where: { organizationId, status: 'pending' },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ invites, total: invites.length });
    } catch (err) {
        console.error('[MEMBERS] list invites error:', err);
        res.status(500).json({ error: 'Failed to fetch invites' });
    }
});

// ─── DELETE /api/members/invites/:inviteId ────────────────────────────────────
router.delete('/invites/:inviteId', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        const { inviteId } = req.params;

        const invite = await prisma.orgInvite.findFirst({
            where: { id: inviteId, organizationId }
        });
        if (!invite) return res.status(404).json({ error: 'Invite not found' });
        if (invite.status !== 'pending') {
            return res.status(400).json({ error: `Invite is already ${invite.status}` });
        }

        await prisma.orgInvite.update({
            where: { id: inviteId },
            data: { status: 'cancelled' }
        });

        res.json({ message: 'Invitation cancelled' });
    } catch (err) {
        console.error('[MEMBERS] cancel invite error:', err);
        res.status(500).json({ error: 'Failed to cancel invitation' });
    }
});

// ─── GET /api/members/accept/:token ──────────────────────────────────────────
// Public route — no auth required
router.get('/accept/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const invite = await prisma.orgInvite.findUnique({
            where: { token },
            include: { organization: { select: { name: true } } }
        });

        if (!invite) return res.status(404).json({ error: 'Invitation not found or already used' });
        if (invite.status !== 'pending') return res.status(400).json({ error: `Invitation is ${invite.status}` });
        if (new Date() > invite.expiresAt) {
            await prisma.orgInvite.update({ where: { token }, data: { status: 'expired' } });
            return res.status(400).json({ error: 'Invitation has expired' });
        }

        res.json({
            valid: true,
            invite: {
                email: invite.email,
                role: invite.role,
                orgName: invite.organization.name,
                expiresAt: invite.expiresAt
            }
        });
    } catch (err) {
        console.error('[MEMBERS] validate token error:', err);
        res.status(500).json({ error: 'Failed to validate invitation' });
    }
});

// ─── POST /api/members/accept/:token ─────────────────────────────────────────
router.post('/accept/:token', authenticate, async (req, res) => {
    try {
        const { token } = req.params;
        const { id: userId, email: userEmail } = req.user;

        const invite = await prisma.orgInvite.findUnique({
            where: { token },
            include: { organization: { select: { id: true, name: true } } }
        });

        if (!invite) return res.status(404).json({ error: 'Invitation not found' });
        if (invite.status !== 'pending') return res.status(400).json({ error: `Invitation is ${invite.status}` });
        if (new Date() > invite.expiresAt) {
            await prisma.orgInvite.update({ where: { token }, data: { status: 'expired' } });
            return res.status(400).json({ error: 'Invitation has expired' });
        }
        if (invite.email.toLowerCase() !== userEmail.toLowerCase()) {
            return res.status(403).json({ error: 'This invitation was sent to a different email address' });
        }

        // Check not already a member
        const existing = await prisma.orgMember.findUnique({
            where: { organizationId_userId: { organizationId: invite.organizationId, userId } }
        });
        if (existing) return res.status(409).json({ error: 'You are already a member of this organization' });

        // Accept invite + create membership in transaction
        await prisma.$transaction([
            prisma.orgInvite.update({
                where: { token },
                data: { status: 'accepted', acceptedAt: new Date() }
            }),
            prisma.orgMember.create({
                data: {
                    organizationId: invite.organizationId,
                    userId,
                    role: invite.role
                }
            })
        ]);

        res.json({
            message: `You have joined ${invite.organization.name} as ${invite.role}`,
            organizationId: invite.organizationId,
            orgName: invite.organization.name,
            role: invite.role
        });
    } catch (err) {
        console.error('[MEMBERS] accept invite error:', err);
        res.status(500).json({ error: 'Failed to accept invitation' });
    }
});

// ─── DELETE /api/members/:memberId ───────────────────────────────────────────
router.delete('/:memberId', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        const { memberId } = req.params;
        const callerRole = req.user.orgRole;

        const member = await prisma.orgMember.findFirst({
            where: { id: memberId, organizationId }
        });
        if (!member) return res.status(404).json({ error: 'Member not found' });

        const org = await prisma.organization.findUnique({
            where: { id: organizationId }, select: { ownerId: true }
        });
        if (member.userId === org.ownerId) {
            return res.status(403).json({ error: 'Cannot remove the organization owner' });
        }
        if (callerRole === 'admin' && member.role === 'admin') {
            return res.status(403).json({ error: 'Admins cannot remove other admins' });
        }

        await prisma.orgMember.delete({ where: { id: memberId } });
        res.json({ message: 'Member removed successfully' });
    } catch (err) {
        console.error('[MEMBERS] remove member error:', err);
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

// ─── PATCH /api/members/:memberId/role ───────────────────────────────────────
router.patch('/:memberId/role', authenticate, requireOwner, async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        const { memberId } = req.params;
        const { role: newRole } = req.body;

        if (!['admin', 'member'].includes(newRole)) {
            return res.status(400).json({ error: 'Role must be admin or member' });
        }

        const member = await prisma.orgMember.findFirst({
            where: { id: memberId, organizationId }
        });
        if (!member) return res.status(404).json({ error: 'Member not found' });

        const updated = await prisma.orgMember.update({
            where: { id: memberId },
            data: { role: newRole }
        });

        res.json({ message: 'Role updated', member: updated });
    } catch (err) {
        console.error('[MEMBERS] update role error:', err);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

module.exports = router;