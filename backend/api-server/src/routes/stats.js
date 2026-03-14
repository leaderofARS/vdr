const express = require('express')
const router = express.Router()
const prisma = require('../config/database')

// GET /api/stats — public global platform stats, no auth required
router.get('/', async (req, res) => {
  try {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
      totalHashes,
      confirmedHashes,
      totalOrgs,
      recentAnchors,
      hashesThisMonth,
      hashesLastMonth,
    ] = await Promise.all([
      prisma.hashRecord.count(),
      prisma.hashRecord.count({ where: { status: 'CONFIRMED' } }),
      prisma.organization.count(),
      prisma.hashRecord.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          hash: true,
          status: true,
          createdAt: true,
          metadata: true,
        }
      }),
      prisma.hashRecord.count({
        where: { createdAt: { gte: thisMonthStart } }
      }),
      prisma.hashRecord.count({
        where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } }
      }),
    ])

    res.json({
      totalHashes,
      confirmedHashes,
      confirmationRate: totalHashes > 0
        ? ((confirmedHashes / totalHashes) * 100).toFixed(1)
        : '0',
      totalOrganizations: totalOrgs,
      hashesThisMonth,
      hashesLastMonth,
      monthlyGrowth: hashesLastMonth > 0
        ? (((hashesThisMonth - hashesLastMonth) / hashesLastMonth) * 100).toFixed(1)
        : null,
      recentAnchors,
      contractAddress: '6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo',
      network: 'Solana Devnet',
      avgConfirmationMs: 421,
      uptime: '99.9',
    })
  } catch (err) {
    console.error('[STATS] error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// GET /api/stats/timeseries — last 30 days anchor volume, public
router.get('/timeseries', async (req, res) => {
  try {
    const days = 30
    const results = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const end = new Date(start.getTime() + 86400000)
      const count = await prisma.hashRecord.count({
        where: { createdAt: { gte: start, lt: end } }
      })
      results.push({
        date: start.toISOString().split('T')[0],
        count
      })
    }
    res.json({ timeseries: results })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timeseries' })
  }
})

module.exports = router
