const PDFDocument = require('pdfkit')
const QRCode = require('qrcode')
const crypto = require('crypto')
const https = require('https')
const http = require('http')

/**
 * Generate a formal blockchain notarization certificate PDF
 *
 * @param {object} record - HashRecord with organization included
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generateCertificate(record) {
  // Pre-generate QR code before starting PDF stream
  const verifyUrl = `https://app.sipheron.com/verify/${record.hash}`
  const qrBuffer = await QRCode.toBuffer(verifyUrl, {
    type: 'png',
    width: 120,
    margin: 1,
    color: {
      dark: '#6C63FF',   // purple dots
      light: '#FFFFFF',  // white background
    },
    errorCorrectionLevel: 'M',
  }).catch(() =>
    // Fallback — plain black QR if color fails
    QRCode.toBuffer(verifyUrl, { type: 'png', width: 120, margin: 1 })
  )

  // Fetch org logo if available
  let logoBuffer = null
  if (record.organization?.logoUrl) {
    logoBuffer = await fetchImageBuffer(record.organization.logoUrl)
      .catch(() => null) // non-fatal
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 55, right: 55 },
        info: {
          Title: 'Blockchain Notarization Certificate — SipHeron VDR',
          Author: record.organization?.name || 'SipHeron VDR',
          Subject: `Blockchain Notarization: ${record.metadata || record.hash.slice(0, 16)}`,
          Keywords: 'blockchain, notarization, solana, document, verification',
          Creator: 'SipHeron VDR — app.sipheron.com',
          CreationDate: new Date(),
        }
      })

      const chunks = []
      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // ── Page dimensions ──
      const PW = doc.page.width    // 595.28 (A4)
      const PH = doc.page.height   // 841.89 (A4)
      const ML = 55                // left margin
      const MR = 55                // right margin
      const CW = PW - ML - MR     // content width = 485.28

      // ── Color palette ──
      const C = {
        PURPLE:      '#6C63FF',
        PURPLE_DARK: '#4A45B8',
        PURPLE_LIGHT:'#F0EFFF',
        PURPLE_MID:  '#E8E6FF',
        DARK:        '#1A1A2E',
        GRAY:        '#6B7280',
        LIGHT_GRAY:  '#F8F8FC',
        BORDER:      '#E2E0F8',
        WHITE:       '#FFFFFF',
        GREEN:       '#00D97E',
        RED:         '#FF4757',
        YELLOW:      '#FFD93D',
        GOLD:        '#D4A017',
      }

      // ══════════════════════════════════════════════
      // OUTER FORMAL BORDER
      // ══════════════════════════════════════════════
      // Outer border
      doc.rect(15, 15, PW - 30, PH - 30)
        .lineWidth(2)
        .strokeColor(C.PURPLE)
        .stroke()

      // Inner border (double border effect)
      doc.rect(22, 22, PW - 44, PH - 44)
        .lineWidth(0.5)
        .strokeColor(C.PURPLE + '60')
        .stroke()

      // Corner decorations — small filled squares at corners
      const cornerSize = 8
      const corners = [
        [12, 12], [PW - 20, 12],
        [12, PH - 20], [PW - 20, PH - 20]
      ]
      corners.forEach(([x, y]) => {
        doc.rect(x, y, cornerSize, cornerSize)
          .fillColor(C.PURPLE)
          .fill()
      })

      // Top decorative rule (full width colored bar)
      doc.rect(0, 0, PW, 7).fillColor(C.PURPLE).fill()
      doc.rect(0, PH - 7, PW, 7).fillColor(C.PURPLE).fill()

      // ══════════════════════════════════════════════
      // HEADER SECTION
      // ══════════════════════════════════════════════
      let y = 38

      // SipHeron logo — shield shape
      const shieldX = ML
      const shieldY = y
      const shieldW = 38
      const shieldH = 38

      // Shield background circle
      doc.circle(shieldX + shieldW / 2, shieldY + shieldH / 2, shieldW / 2)
        .fillColor(C.PURPLE)
        .fill()

      // Checkmark in shield
      doc.moveTo(shieldX + 11, shieldY + 20)
        .lineTo(shieldX + 17, shieldY + 26)
        .lineTo(shieldX + 27, shieldY + 14)
        .lineWidth(3)
        .strokeColor(C.WHITE)
        .stroke()

      // Org logo — right side (if available)
      if (logoBuffer) {
        try {
          const logoX = PW - MR - 60
          const logoY = shieldY
          doc.image(logoBuffer, logoX, logoY, {
            fit: [60, 38],
            align: 'right',
            valign: 'center',
          })
        } catch { /* logo render failed — skip */ }
      }

      // SipHeron wordmark
      doc.font('Helvetica-Bold')
        .fontSize(20)
        .fillColor(C.DARK)
        .text('SipHeron', shieldX + shieldW + 10, shieldY + 4)

      doc.font('Helvetica')
        .fontSize(9)
        .fillColor(C.PURPLE)
        .text(
          'VERIFIED DOCUMENT REGISTRY  ·  POWERED BY SOLANA',
          shieldX + shieldW + 10,
          shieldY + 24
        )

      // Issue date — top right
      doc.font('Helvetica')
        .fontSize(8)
        .fillColor(C.GRAY)
        .text(
          `Issued: ${formatDate(new Date())}`,
          ML, shieldY + 10,
          { width: CW, align: 'right' }
        )

      // ── Header separator ──
      y = 88
      doc.moveTo(ML, y)
        .lineTo(ML + CW, y)
        .lineWidth(1.5)
        .strokeColor(C.PURPLE)
        .stroke()

      // Secondary thin line
      doc.moveTo(ML, y + 3)
        .lineTo(ML + CW, y + 3)
        .lineWidth(0.3)
        .strokeColor(C.PURPLE + '40')
        .stroke()

      // ══════════════════════════════════════════════
      // MAIN TITLE
      // ══════════════════════════════════════════════
      y = 102

      doc.font('Helvetica-Bold')
        .fontSize(22)
        .fillColor(C.DARK)
        .text('BLOCKCHAIN NOTARIZATION CERTIFICATE', ML, y, {
          width: CW,
          align: 'center',
          characterSpacing: 1.5,
        })

      y += 32

      // Subtitle
      doc.font('Helvetica')
        .fontSize(10)
        .fillColor(C.GRAY)
        .text(
          'Issued by SipHeron Verified Document Registry in accordance with cryptographic anchoring standards',
          ML, y,
          { width: CW, align: 'center' }
        )

      y += 22

      // Status badge
      const statusText = record.status === 'CONFIRMED' ? 'BLOCKCHAIN VERIFIED'
                       : record.status === 'REVOKED'   ? 'REVOKED'
                       : 'PENDING CONFIRMATION'
      const statusColor = record.status === 'CONFIRMED' ? C.GREEN
                        : record.status === 'REVOKED'   ? C.RED
                        : C.YELLOW
      const statusBg = record.status === 'CONFIRMED' ? '#E8FFF5'
                     : record.status === 'REVOKED'   ? '#FFF0F0'
                     : '#FFFBEA'
      const statusIcon = record.status === 'CONFIRMED' ? '✓' : '⚠'

      const badgeW = 220
      const badgeX = (PW - badgeW) / 2
      doc.roundedRect(badgeX, y, badgeW, 26, 13)
        .fillAndStroke(statusBg, statusColor)

      doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(statusColor)
        .text(
          `${statusIcon}  ${statusText}`,
          badgeX, y + 8,
          { width: badgeW, align: 'center' }
        )

      y += 42

      // ══════════════════════════════════════════════
      // DOCUMENT INFORMATION SECTION
      // ══════════════════════════════════════════════

      // Section title
      sectionTitle(doc, 'DOCUMENT INFORMATION', ML, y, CW, C)
      y += 20

      // Document info box
      doc.roundedRect(ML, y, CW, 90, 6)
        .fillAndStroke(C.LIGHT_GRAY, C.BORDER)

      const col1x = ML + 14
      const col2x = ML + 140
      const col3x = ML + 310

      let iy = y + 14

      // Row 1
      field(doc, 'Document Name', record.metadata || 'Untitled Document',
        col1x, iy, 120, CW - 28, C)

      iy += 18

      // Row 2
      field(doc, 'File Type', record.mimeType
        ? formatMimeType(record.mimeType) : '—',
        col1x, iy, 120, 150, C)

      field(doc, 'File Size', record.fileSize
        ? formatFileSize(Number(record.fileSize)) : '—',
        col2x, iy, 120, 120, C)

      field(doc, 'Status', record.status,
        col3x, iy, 80, 150, C)

      iy += 18

      // Row 3
      field(doc, 'Tags',
        record.tags?.length > 0 ? record.tags.join(', ') : '—',
        col1x, iy, 120, CW - 28, C)

      iy += 18

      // Row 4
      field(doc, 'Anchored By',
        record.organization?.name || 'Unknown Organization',
        col1x, iy, 120, CW - 28, C)

      y += 106

      // ══════════════════════════════════════════════
      // CRYPTOGRAPHIC HASH SECTION (most prominent)
      // ══════════════════════════════════════════════

      sectionTitle(doc, 'SHA-256 CRYPTOGRAPHIC FINGERPRINT', ML, y, CW, C)
      y += 20

      // Hash box — prominent purple
      doc.roundedRect(ML, y, CW, 54, 6)
        .fillAndStroke(C.PURPLE_LIGHT, C.PURPLE + '60')

      doc.font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(C.GRAY)
        .text('DOCUMENT HASH', ML + 14, y + 10)

      // Hash in two equal lines
      const h1 = record.hash.slice(0, 32)
      const h2 = record.hash.slice(32)

      doc.font('Courier-Bold')
        .fontSize(9.5)
        .fillColor(C.PURPLE_DARK)
        .text(h1, ML + 14, y + 22)

      doc.font('Courier-Bold')
        .fontSize(9.5)
        .fillColor(C.PURPLE_DARK)
        .text(h2, ML + 14, y + 35)

      y += 70

      // ══════════════════════════════════════════════
      // BLOCKCHAIN RECORD + QR CODE (side by side)
      // ══════════════════════════════════════════════

      sectionTitle(doc, 'BLOCKCHAIN RECORD', ML, y, CW, C)
      y += 20

      const qrSize = 90
      const blockchainBoxH = 110
      const blockchainBoxW = CW - qrSize - 16

      // Blockchain data box (left)
      doc.roundedRect(ML, y, blockchainBoxW, blockchainBoxH, 6)
        .fillAndStroke(C.LIGHT_GRAY, C.BORDER)

      let by = y + 12

      field(doc, 'Network', 'Solana Devnet',
        ML + 14, by, 110, blockchainBoxW - 28, C)
      by += 16

      field(doc, 'Smart Contract',
        '6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo',
        ML + 14, by, 110, blockchainBoxW - 28, C, true)
      by += 16

      field(doc, 'Transaction ID',
        record.txSignature || 'Pending confirmation',
        ML + 14, by, 110, blockchainBoxW - 28, C, true)
      by += 16

      field(doc, 'Block (Slot)',
        record.blockNumber ? record.blockNumber.toString() : 'Pending',
        ML + 14, by, 110, blockchainBoxW - 28, C)
      by += 16

      field(doc, 'Block Timestamp',
        record.blockTimestamp
          ? formatDateISO(record.blockTimestamp)
          : 'Pending confirmation',
        ML + 14, by, 110, blockchainBoxW - 28, C)

      // QR Code box (right)
      const qrBoxX = ML + blockchainBoxW + 16
      const qrBoxSize = qrSize + 20

      doc.roundedRect(qrBoxX, y, qrBoxSize, blockchainBoxH, 6)
        .fillAndStroke(C.LIGHT_GRAY, C.BORDER)

      // QR label above
      doc.font('Helvetica')
        .fontSize(7)
        .fillColor(C.GRAY)
        .text('SCAN TO VERIFY', qrBoxX, y + 8, {
          width: qrBoxSize,
          align: 'center',
        })

      // Embed QR code PNG
      try {
        doc.image(qrBuffer, qrBoxX + 10, y + 18, {
          width: qrSize,
          height: qrSize,
        })
      } catch (qrErr) {
        // QR render failed — show placeholder text
        doc.font('Helvetica')
          .fontSize(7)
          .fillColor(C.GRAY)
          .text('QR code unavailable', qrBoxX, y + 50, {
            width: qrBoxSize, align: 'center'
          })
      }

      y += blockchainBoxH + 16

      // ══════════════════════════════════════════════
      // TIMESTAMPS SECTION
      // ══════════════════════════════════════════════

      sectionTitle(doc, 'TIMESTAMPS', ML, y, CW, C)
      y += 20

      doc.roundedRect(ML, y, CW, 58, 6)
        .fillAndStroke(C.LIGHT_GRAY, C.BORDER)

      let ty = y + 12

      field(doc, 'Server Timestamp',
        formatDateISO(record.createdAt),
        ML + 14, ty, 130, CW - 28, C)
      ty += 16

      field(doc, 'Blockchain Timestamp',
        record.blockTimestamp
          ? formatDateISO(record.blockTimestamp)
          : 'Pending Solana confirmation',
        ML + 14, ty, 130, CW - 28, C)
      ty += 16

      field(doc, 'Certificate Issued',
        formatDateISO(new Date()),
        ML + 14, ty, 130, CW - 28, C)

      y += 74

      // ══════════════════════════════════════════════
      // WHAT THIS PROVES — formal legal paragraph
      // ══════════════════════════════════════════════

      sectionTitle(doc, 'WHAT THIS CERTIFICATE PROVES', ML, y, CW, C)
      y += 20

      doc.roundedRect(ML, y, CW, 85, 6)
        .fillAndStroke('#FAFAFE', C.BORDER)

      const proofText = `This certificate confirms that the document identified by the SHA-256 hash above was cryptographically anchored to the Solana blockchain at the timestamp stated herein. The anchoring was performed by ${record.organization?.name || 'the issuing organization'} using the SipHeron Verified Document Registry.\n\nThe existence of this blockchain record proves that: (1) the anchoring party possessed a document producing this exact SHA-256 hash at the recorded timestamp; (2) the hash — and therefore the underlying document — has not been altered since anchoring, as any modification would produce a completely different hash.\n\nThis certificate does not constitute legal notarization and does not imply authorship, accuracy of content, or legal validity of the underlying document.`
      doc.font('Helvetica')
        .fontSize(7.8)
        .fillColor(C.DARK)
        .text(proofText, ML + 14, y + 10, {
          width: CW - 28,
          align: 'justify',
          lineGap: 2,
        })

      y += 101

      // ══════════════════════════════════════════════
      // INDEPENDENT VERIFICATION SECTION
      // ══════════════════════════════════════════════

      sectionTitle(doc, 'INDEPENDENT VERIFICATION', ML, y, CW, C)
      y += 20

      doc.roundedRect(ML, y, CW, 72, 6)
        .fillAndStroke(C.PURPLE_LIGHT, C.PURPLE + '30')

      doc.font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(C.GRAY)
        .text('VERIFICATION URL', ML + 14, y + 10)

      doc.font('Courier')
        .fontSize(8.5)
        .fillColor(C.PURPLE_DARK)
        .text(verifyUrl, ML + 14, y + 21, {
          width: CW - 28,
          link: verifyUrl,
          underline: true,
        })

      doc.font('Helvetica')
        .fontSize(7.5)
        .fillColor(C.GRAY)
        .text(
          'To independently verify without SipHeron: (1) Compute SHA-256 of the original document using ' +
          'sha256sum (Linux/macOS), Get-FileHash -Algorithm SHA256 (Windows), or any standard SHA-256 tool. ' +
          '(2) Compare against the hash above — any difference indicates document modification. ' +
          '(3) Look up the transaction directly on any Solana block explorer to confirm the blockchain record ' +
          'exists independently of SipHeron\'s infrastructure.',
          ML + 14, y + 34,
          { width: CW - 28, lineGap: 1.5 }
        )

      y += 88

      // ══════════════════════════════════════════════
      // ORGANIZATION FOOTER
      // ══════════════════════════════════════════════

      const org = record.organization
      if (org?.name) {
        doc.roundedRect(ML, y, CW, 40, 6)
          .fillAndStroke(C.LIGHT_GRAY, C.BORDER)

        doc.font('Helvetica-Bold')
          .fontSize(9)
          .fillColor(C.DARK)
          .text(org.name, ML + 14, y + 10)

        const orgDetails = [
          org.website && `Website: ${org.website}`,
          org.address && `Address: ${org.address}`,
        ].filter(Boolean).join('   ·   ')

        if (orgDetails) {
          doc.font('Helvetica')
            .fontSize(7.5)
            .fillColor(C.GRAY)
            .text(orgDetails, ML + 14, y + 24)
        }

        y += 56
      }

      // ══════════════════════════════════════════════
      // CERTIFICATE ID + BOTTOM SEPARATOR
      // ══════════════════════════════════════════════

      const certId = `CERT-${crypto
        .createHash('sha256')
        .update(record.hash + record.createdAt)
        .digest('hex')
        .slice(0, 16)
        .toUpperCase()}`

      // Bottom separator
      const footerY = PH - 50
      doc.moveTo(ML, footerY)
        .lineTo(ML + CW, footerY)
        .lineWidth(1.5)
        .strokeColor(C.PURPLE)
        .stroke()

      doc.moveTo(ML, footerY + 3)
        .lineTo(ML + CW, footerY + 3)
        .lineWidth(0.3)
        .strokeColor(C.PURPLE + '40')
        .stroke()

      // Footer text
      doc.font('Helvetica')
        .fontSize(7)
        .fillColor(C.GRAY)
        .text(
          `Certificate ID: ${certId}`,
          ML, footerY + 10,
          { width: CW / 2, align: 'left' }
        )

      doc.font('Helvetica')
        .fontSize(7)
        .fillColor(C.GRAY)
        .text(
          'SipHeron VDR · app.sipheron.com · Built on Solana',
          ML, footerY + 10,
          { width: CW, align: 'right' }
        )

      doc.font('Helvetica')
        .fontSize(6.5)
        .fillColor(C.GRAY + '80')
        .text(
          'This certificate was generated automatically. It does not constitute legal notarization.',
          ML, footerY + 22,
          { width: CW, align: 'center' }
        )

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

// ── Helper: section title with decorative rule ──
function sectionTitle(doc, text, x, y, width, C) {
  doc.font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(C.PURPLE)
    .text(text, x, y, { characterSpacing: 1 })
  const textWidth = text.length * 5.2 // approximate
  doc.moveTo(x + textWidth + 8, y + 5)
    .lineTo(x + width, y + 5)
    .lineWidth(0.5)
    .strokeColor(C.PURPLE + '40')
    .stroke()
}

// ── Helper: key-value field ──
function field(doc, label, value, x, y, labelWidth, maxWidth, C, mono = false) {
  doc.font('Helvetica-Bold')
    .fontSize(7.5)
    .fillColor(C.GRAY)
    .text(label, x, y, { lineBreak: false })
  const valueX = x + labelWidth + 4
  const valueWidth = maxWidth - labelWidth - 4
  const displayValue = truncate(String(value || '—'), mono ? 52 : 80)
  doc.font(mono ? 'Courier' : 'Helvetica')
    .fontSize(7.5)
    .fillColor(C.DARK)
    .text(displayValue, valueX, y, {
      lineBreak: false,
    })
}

// ── Helper: fetch remote image as buffer ──
async function fetchImageBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, { timeout: 5000 }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject).on('timeout', () => reject(new Error('timeout')))
  })
}

// ── Date formatters ──
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatDateISO(date) {
  const d = new Date(date)
  return d.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, ' UTC')
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

function formatMimeType(mime) {
  if (!mime) return '—'
  const map = {
    'application/pdf': 'PDF Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
    'image/png': 'PNG Image',
    'image/jpeg': 'JPEG Image',
    'text/plain': 'Plain Text',
    'application/zip': 'ZIP Archive',
    'application/json': 'JSON File',
  }
  return map[mime] || mime
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str
  const half = Math.floor((maxLen - 3) / 2)
  return str.slice(0, half) + '...' + str.slice(-half)
}

module.exports = { generateCertificate }
