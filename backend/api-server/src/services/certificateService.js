const PDFDocument = require('pdfkit')
const crypto = require('crypto')

/**
 * Generate a notarization certificate PDF for an anchored document
 *
 * @param {object} record - HashRecord from database with organization included
 * @returns {Buffer} - PDF file as buffer
 */
async function generateCertificate(record) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
        info: {
          Title: 'SipHeron VDR — Document Verification Certificate',
          Author: 'SipHeron VDR',
          Subject: `Certificate of Blockchain Anchoring — ${record.metadata || record.hash.slice(0, 16)}`,
          Keywords: 'blockchain, verification, solana, document integrity',
          CreationDate: new Date(),
        }
      })

      const chunks = []
      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // ── Page dimensions ──
      const pageWidth = doc.page.width
      const pageHeight = doc.page.height
      const margin = 60
      const contentWidth = pageWidth - margin * 2

      // ── Color palette ──
      const PURPLE = '#6C63FF'
      const DARK = '#0D0D1A'
      const GRAY = '#8888AA'
      const LIGHT_GRAY = '#F5F5F8'
      const GREEN = '#00D97E'
      const WHITE = '#FFFFFF'
      const BORDER = '#E0E0F0'

      // ── BACKGROUND ──
      doc.rect(0, 0, pageWidth, pageHeight).fill(WHITE)

      // Top color bar
      doc.rect(0, 0, pageWidth, 8).fill(PURPLE)

      // ── HEADER SECTION ──
      let y = 35

      // SipHeron shield logo (drawn as SVG-like shapes)
      const logoX = margin
      const logoY = y
      const logoSize = 36

      // Shield background
      doc.save()
      doc.roundedRect(logoX, logoY, logoSize, logoSize, 8).fill(PURPLE)

      // Shield check mark
      doc.moveTo(logoX + 10, logoY + 18)
        .lineTo(logoX + 16, logoY + 24)
        .lineTo(logoX + 26, logoY + 13)
        .lineWidth(3)
        .strokeColor(WHITE)
        .stroke()
      doc.restore()

      // SipHeron wordmark
      doc.font('Helvetica-Bold')
        .fontSize(18)
        .fillColor(DARK)
        .text('SipHeron', logoX + logoSize + 10, logoY + 5)

      doc.font('Helvetica')
        .fontSize(9)
        .fillColor(PURPLE)
        .text('VDR — VERIFIED DOCUMENT REGISTRY', logoX + logoSize + 10, logoY + 24)

      // Certificate label top-right
      doc.font('Helvetica')
        .fontSize(9)
        .fillColor(GRAY)
        .text('CERTIFICATE OF BLOCKCHAIN ANCHORING',
          margin, y + 8,
          { width: contentWidth, align: 'right' })

      doc.font('Helvetica')
        .fontSize(8)
        .fillColor(GRAY)
        .text(`Issued: ${new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}`,
          margin, y + 22,
          { width: contentWidth, align: 'right' })

      // Header separator line
      y = 88
      doc.moveTo(margin, y).lineTo(pageWidth - margin, y)
        .lineWidth(1).strokeColor(BORDER).stroke()

      // ── TITLE SECTION ──
      y = 105

      doc.font('Helvetica-Bold')
        .fontSize(26)
        .fillColor(DARK)
        .text('Document Verification Certificate', margin, y, {
          width: contentWidth,
          align: 'center'
        })

      y += 40

      // Status badge
      const badgeText = record.status === 'CONFIRMED'
        ? '✓  AUTHENTIC — BLOCKCHAIN VERIFIED'
        : record.status === 'REVOKED'
          ? '✗  REVOKED'
          : '⏳  PENDING CONFIRMATION'

      const badgeColor = record.status === 'CONFIRMED'
        ? GREEN
        : record.status === 'REVOKED'
          ? '#FF4757'
          : '#FFD93D'

      const badgeBg = record.status === 'CONFIRMED'
        ? '#E8FFF5'
        : record.status === 'REVOKED'
          ? '#FFF0F0'
          : '#FFFBEA'

      // Badge background
      const badgeWidth = 280
      const badgeX = (pageWidth - badgeWidth) / 2
      doc.roundedRect(badgeX, y, badgeWidth, 34, 17)
        .fillAndStroke(badgeBg, badgeColor)

      doc.font('Helvetica-Bold')
        .fontSize(11)
        .fillColor(badgeColor)
        .text(badgeText, badgeX, y + 11, {
          width: badgeWidth,
          align: 'center'
        })

      // ── DOCUMENT INFORMATION SECTION ──
      y += 55

      // Section box
      doc.roundedRect(margin, y, contentWidth, 130, 8)
        .fillAndStroke(LIGHT_GRAY, BORDER)

      y += 20

      doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(PURPLE)
        .text('DOCUMENT INFORMATION', margin + 20, y)

      y += 20

      const field = (label, value, yPos, truncate = false) => {
        doc.font('Helvetica-Bold')
          .fontSize(9)
          .fillColor(GRAY)
          .text(label, margin + 20, yPos)

        const displayValue = truncate && value && value.length > 60
          ? value.slice(0, 28) + '...' + value.slice(-28)
          : (value || '—')

        doc.font('Helvetica')
          .fontSize(9)
          .fillColor(DARK)
          .text(displayValue, margin + 140, yPos, {
            width: contentWidth - 160,
            lineBreak: false,
          })
      }

      field('Document Name', record.metadata || 'Untitled Document', y)
      y += 18
      field('File Size',
        record.fileSize
          ? formatFileSize(Number(record.fileSize))
          : 'Not recorded',
        y)
      y += 18
      field('MIME Type', record.mimeType || 'Not recorded', y)
      y += 18
      field('Tags',
        record.tags && record.tags.length > 0
          ? record.tags.join(', ')
          : 'None',
        y)

      // ── CRYPTOGRAPHIC PROOF SECTION ──
      y += 38

      doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(PURPLE)
        .text('CRYPTOGRAPHIC PROOF', margin, y)

      y += 16

      // SHA-256 hash box
      doc.roundedRect(margin, y, contentWidth, 52, 6)
        .fillAndStroke('#F0EFFF', PURPLE + '40')

      doc.font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(GRAY)
        .text('SHA-256 DOCUMENT HASH', margin + 16, y + 10)

      // Hash split into two lines for readability
      const hash = record.hash || ''
      const hashLine1 = hash.slice(0, 32)
      const hashLine2 = hash.slice(32)

      doc.font('Courier-Bold')
        .fontSize(9)
        .fillColor(PURPLE)
        .text(hashLine1, margin + 16, y + 23)

      doc.font('Courier-Bold')
        .fontSize(9)
        .fillColor(PURPLE)
        .text(hashLine2, margin + 16, y + 35)

      // ── BLOCKCHAIN RECORD SECTION ──
      y += 68

      doc.roundedRect(margin, y, contentWidth, 115, 8)
        .fillAndStroke(LIGHT_GRAY, BORDER)

      y += 20

      doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(PURPLE)
        .text('BLOCKCHAIN RECORD — SOLANA', margin + 20, y)

      y += 20

      field('Network', 'Solana Devnet', y)
      y += 18
      field('Smart Contract',
        '6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo',
        y, true)
      y += 18
      field('Transaction ID',
        record.txSignature || 'Pending confirmation',
        y, true)
      y += 18
      field('Block Number',
        record.blockNumber ? record.blockNumber.toString() : 'Pending',
        y)
      y += 18
      field('Block Timestamp',
        record.blockTimestamp
          ? formatDate(record.blockTimestamp)
          : 'Pending')

      // ── TIMESTAMPS SECTION ──
      y += 38

      doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(PURPLE)
        .text('TIMESTAMPS', margin, y)

      y += 16

      doc.roundedRect(margin, y, contentWidth, 70, 8)
        .fillAndStroke(LIGHT_GRAY, BORDER)

      y += 16

      field('Anchored (Server)',
        record.createdAt ? formatDate(record.createdAt) : '—',
        y + 4)
      y += 20
      field('Confirmed (Blockchain)',
        record.blockTimestamp
          ? formatDate(record.blockTimestamp)
          : 'Pending',
        y + 4)
      y += 20
      field('Certificate Issued',
        formatDate(new Date()),
        y + 4)

      // ── ORGANIZATION SECTION ──
      y += 55

      doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(PURPLE)
        .text('ISSUED BY', margin, y)

      y += 16

      doc.roundedRect(margin, y, contentWidth, 60, 8)
        .fillAndStroke(LIGHT_GRAY, BORDER)

      const org = record.organization

      y += 14
      field('Organization', org?.name || 'Unknown', y)
      y += 18
      field('Website', org?.website || 'app.sipheron.com', y)
      y += 18
      field('Verified via', 'SipHeron VDR · app.sipheron.com', y)

      // ── VERIFICATION QR / LINK SECTION ──
      y += 55

      const verifyUrl =
        `https://app.sipheron.com/verify/${record.hash}`

      doc.roundedRect(margin, y, contentWidth, 55, 8)
        .fillAndStroke('#F0EFFF', PURPLE + '30')

      y += 14

      doc.font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(PURPLE)
        .text('INDEPENDENT VERIFICATION URL', margin + 20, y)

      y += 14

      doc.font('Courier')
        .fontSize(9)
        .fillColor(DARK)
        .text(verifyUrl, margin + 20, y, {
          width: contentWidth - 40,
          link: verifyUrl,
          underline: true,
        })

      // ── INDEPENDENT VERIFICATION INSTRUCTIONS ──
      y += 40

      doc.font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(GRAY)
        .text('HOW TO INDEPENDENTLY VERIFY THIS DOCUMENT', margin, y)

      y += 14

      const instructions = [
        '1. Compute the SHA-256 hash of the original document using any standard tool:',
        '   macOS/Linux: sha256sum <filename>',
        '   Windows:     Get-FileHash <filename> -Algorithm SHA256',
        '   Node.js:     crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")',
        '2. Compare the computed hash against the SHA-256 hash shown above.',
        '   Any difference — even a single character — indicates the document was modified.',
        `3. Verify the blockchain record at: ${record.txSignature
          ? 'https://explorer.solana.com/tx/' + record.txSignature + '?cluster=devnet'
          : 'Transaction pending confirmation'
        }`,
      ]

      doc.font('Courier')
        .fontSize(7.5)
        .fillColor(DARK)

      instructions.forEach(line => {
        doc.text(line, margin, y, { width: contentWidth })
        y += 11
      })

      // ── CERTIFICATE ID AND FOOTER ──
      const certId = `CERT-${crypto
        .createHash('sha256')
        .update(record.hash + record.createdAt)
        .digest('hex')
        .slice(0, 16)
        .toUpperCase()}`

      // Bottom separator
      const footerY = pageHeight - 55
      doc.moveTo(margin, footerY)
        .lineTo(pageWidth - margin, footerY)
        .lineWidth(1)
        .strokeColor(BORDER)
        .stroke()

      // Bottom color bar
      doc.rect(0, pageHeight - 8, pageWidth, 8).fill(PURPLE)

      // Footer text
      doc.font('Helvetica')
        .fontSize(7.5)
        .fillColor(GRAY)
        .text(
          `Certificate ID: ${certId}  ·  Generated by SipHeron VDR  ·  app.sipheron.com  ·  This certificate constitutes proof of blockchain anchoring. It does not imply legal notarization.`,
          margin,
          footerY + 10,
          { width: contentWidth, align: 'center' }
        )

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

function formatDate(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

module.exports = { generateCertificate }
