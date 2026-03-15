/**
 * SipHeron VDR — Embeddable Verification Widget
 * Version: 1.0.0
 *
 * Usage:
 *   <div id="sipheron-widget" data-hash="<SHA256_HASH>"></div>
 *   <script src="https://app.sipheron.com/widget.js"></script>
 *
 * Options via data attributes:
 *   data-hash       = SHA-256 hash to verify against
 *   data-theme      = dark (default) | light
 *   data-lang       = en (default) — for future i18n
 *   data-api        = API base URL (default: https://api.sipheron.com)
 *   data-widget-id  = optional identifier for analytics
 */

;(function (window, document) {
  'use strict'

  const WIDGET_VERSION = '1.0.0'
  const DEFAULT_API = 'https://api.sipheron.com'
  const DEFAULT_APP = 'https://app.sipheron.com'

  // ── CSS injected into the page ──
  const STYLES = `
    .svdr-widget {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                   Roboto, sans-serif;
      box-sizing: border-box;
    }
    .svdr-widget * { box-sizing: border-box; }

    .svdr-container {
      border-radius: 12px;
      padding: 20px;
      max-width: 480px;
      width: 100%;
    }
    .svdr-dark {
      background: #0D0D1A;
      border: 1px solid rgba(255,255,255,0.08);
      color: #F0F0FF;
    }
    .svdr-light {
      background: #FFFFFF;
      border: 1px solid #E0E0E0;
      color: #1A1A2E;
    }

    .svdr-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .svdr-logo {
      width: 24px; height: 24px;
      background: #6C63FF;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 900; font-size: 12px;
    }
    .svdr-title { font-size: 13px; font-weight: 600; }
    .svdr-subtitle-dark { color: #8888AA; }
    .svdr-subtitle-light { color: #666; }
    .svdr-powered {
      margin-left: auto;
      font-size: 10px;
      opacity: 0.5;
    }
    .svdr-powered a { color: inherit; text-decoration: none; }

    .svdr-dropzone {
      border: 2px dashed rgba(108,99,255,0.3);
      border-radius: 10px;
      padding: 24px 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .svdr-dropzone:hover,
    .svdr-dropzone.svdr-dragging {
      border-color: #6C63FF;
      background: rgba(108,99,255,0.08);
    }
    .svdr-dropzone-text {
      font-size: 13px;
      margin-bottom: 4px;
    }
    .svdr-dropzone-sub {
      font-size: 11px;
      opacity: 0.5;
    }
    .svdr-file-input {
      position: absolute; inset: 0;
      opacity: 0; cursor: pointer; width: 100%;
    }

    .svdr-hashing {
      display: flex; flex-direction: column;
      align-items: center; gap: 8px;
      padding: 16px;
    }
    .svdr-spinner {
      width: 28px; height: 28px;
      border: 3px solid rgba(108,99,255,0.2);
      border-top-color: #6C63FF;
      border-radius: 50%;
      animation: svdr-spin 0.8s linear infinite;
    }
    @keyframes svdr-spin {
      to { transform: rotate(360deg); }
    }
    .svdr-hashing-text { font-size: 12px; opacity: 0.7; }

    .svdr-result {
      border-radius: 10px;
      padding: 16px;
      text-align: center;
    }
    .svdr-result-authentic {
      background: rgba(0,217,126,0.1);
      border: 1px solid rgba(0,217,126,0.3);
    }
    .svdr-result-mismatch {
      background: rgba(255,71,87,0.1);
      border: 1px solid rgba(255,71,87,0.3);
    }
    .svdr-result-notfound {
      background: rgba(136,136,170,0.1);
      border: 1px solid rgba(136,136,170,0.2);
    }
    .svdr-result-revoked {
      background: rgba(255,107,53,0.1);
      border: 1px solid rgba(255,107,53,0.3);
    }

    .svdr-result-icon {
      font-size: 28px;
      margin-bottom: 6px;
    }
    .svdr-result-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .svdr-authentic-title { color: #00D97E; }
    .svdr-mismatch-title { color: #FF4757; }
    .svdr-notfound-title { color: #8888AA; }
    .svdr-revoked-title { color: #FF6B35; }

    .svdr-result-sub { font-size: 11px; opacity: 0.7; margin-bottom: 12px; }

    .svdr-meta {
      font-size: 10px;
      opacity: 0.6;
      text-align: left;
      margin-top: 8px;
    }
    .svdr-meta-row { margin-bottom: 2px; }

    .svdr-actions {
      display: flex; gap: 8px; justify-content: center;
      margin-top: 12px; flex-wrap: wrap;
    }
    .svdr-btn {
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s;
      text-decoration: none;
      display: inline-block;
    }
    .svdr-btn:hover { opacity: 0.85; }
    .svdr-btn-primary {
      background: #6C63FF;
      color: white;
    }
    .svdr-btn-ghost {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.15);
      color: inherit;
    }
    .svdr-btn-reset {
      background: transparent;
      border: none;
      font-size: 11px;
      opacity: 0.5;
      cursor: pointer;
      color: inherit;
      padding: 4px 8px;
      margin-top: 8px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  `

  // ── Inject styles once ──
  function injectStyles() {
    if (document.getElementById('svdr-styles')) return
    const style = document.createElement('style')
    style.id = 'svdr-styles'
    style.textContent = STYLES
    document.head.appendChild(style)
  }

  // ── SHA-256 via Web Crypto API ──
  async function sha256File(file) {
    const CHUNK = 2 * 1024 * 1024 // 2MB chunks
    if (file.size <= 50 * 1024 * 1024) {
      // Small file — single read
      const buf = await file.arrayBuffer()
      const hashBuf = await crypto.subtle.digest('SHA-256', buf)
      return Array.from(new Uint8Array(hashBuf))
        .map(b => b.toString(16).padStart(2, '0')).join('')
    }
    // Large file — chunked
    const chunks = []
    let offset = 0
    while (offset < file.size) {
      const slice = file.slice(offset, Math.min(offset + CHUNK, file.size))
      chunks.push(new Uint8Array(await slice.arrayBuffer()))
      offset += CHUNK
      if ((offset / CHUNK) % 10 === 0) {
        await new Promise(r => setTimeout(r, 0)) // yield to event loop
      }
    }
    const total = chunks.reduce((s, c) => s + c.length, 0)
    const combined = new Uint8Array(total)
    let pos = 0
    for (const c of chunks) { combined.set(c, pos); pos += c.length }
    const hashBuf = await crypto.subtle.digest('SHA-256', combined)
    return Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // ── API call to verify hash ──
  async function verifyHash(hash, apiBase) {
    const res = await fetch(`${apiBase}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash }),
    })
    if (!res.ok && res.status !== 404) {
      throw new Error(`API error: ${res.status}`)
    }
    return res.json()
  }

  // ── Track analytics ──
  function trackEvent(hash, event, data, apiBase) {
    fetch(`${apiBase}/api/hashes/${hash}/widget-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        authentic: data.authentic ?? null,
        referrer: window.location.href,
        widgetId: data.widgetId || null,
      }),
    }).catch(() => {}) // never throw — analytics are non-critical
  }

  // ── Format date ──
  function fmtDate(iso) {
    if (!iso) return null
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    } catch { return iso }
  }

  // ── Build and mount widget ──
  function mountWidget(container) {
    const hash = container.dataset.hash?.trim().toLowerCase()
    const theme = container.dataset.theme || 'dark'
    const apiBase = container.dataset.api || DEFAULT_API
    const appBase = container.dataset.app || DEFAULT_APP
    const widgetId = container.dataset.widgetId || null

    if (!hash || !/^[a-f0-9]{64}$/.test(hash)) {
      container.innerHTML = `
        <div class="svdr-widget svdr-container svdr-${theme}">
          <p style="font-size:12px;opacity:0.5;text-align:center;">
            SipHeron Widget: invalid or missing data-hash attribute
          </p>
        </div>`
      return
    }

    // State
    let state = 'idle' // idle | hashing | result
    let result = null

    // Track initial view
    trackEvent(hash, 'view', { widgetId }, apiBase)

    function render() {
      container.innerHTML = ''
      container.className = 'svdr-widget'

      const wrap = document.createElement('div')
      wrap.className = `svdr-container svdr-${theme}`

      // Header
      const header = document.createElement('div')
      header.className = 'svdr-header'
      header.innerHTML = `
        <div class="svdr-logo">S</div>
        <div>
          <div class="svdr-title">Document Verification</div>
        </div>
        <div class="svdr-powered">
          <a href="${appBase}" target="_blank" rel="noopener">
            Powered by SipHeron VDR
          </a>
        </div>`
      wrap.appendChild(header)

      if (state === 'idle') {
        // Drop zone
        const zone = document.createElement('div')
        zone.className = 'svdr-dropzone'
        zone.innerHTML = `
          <div class="svdr-dropzone-text">
            Drop document here to verify
          </div>
          <div class="svdr-dropzone-sub">
            or click to select · file never leaves your device
          </div>
          <input type="file" class="svdr-file-input" />`

        // Drag events
        zone.addEventListener('dragover', e => {
          e.preventDefault()
          zone.classList.add('svdr-dragging')
        })
        zone.addEventListener('dragleave', () => {
          zone.classList.remove('svdr-dragging')
        })
        zone.addEventListener('drop', e => {
          e.preventDefault()
          zone.classList.remove('svdr-dragging')
          const file = e.dataTransfer.files[0]
          if (file) processFile(file)
        })

        // File input
        const input = zone.querySelector('.svdr-file-input')
        input.addEventListener('change', e => {
          if (e.target.files[0]) processFile(e.target.files[0])
        })

        wrap.appendChild(zone)

      } else if (state === 'hashing') {
        const hashing = document.createElement('div')
        hashing.className = 'svdr-hashing'
        hashing.innerHTML = `
          <div class="svdr-spinner"></div>
          <div class="svdr-hashing-text">
            Computing SHA-256 fingerprint...
          </div>`
        wrap.appendChild(hashing)

      } else if (state === 'result' && result) {
        const isAuthentic = result.authentic === true
        const isRevoked = result.status === 'REVOKED'
        const isNotFound = result.error === 'NOT_FOUND'

        const resultClass = isAuthentic ? 'authentic'
                          : isRevoked   ? 'revoked'
                          : isNotFound  ? 'notfound'
                          : 'mismatch'

        const icon = isAuthentic ? '✓' : isRevoked ? '⚠' : isNotFound ? '○' : '✗'
        const title = isAuthentic ? 'AUTHENTIC'
                    : isRevoked   ? 'REVOKED'
                    : isNotFound  ? 'NOT FOUND'
                    : 'MISMATCH'
        const sub = isAuthentic
          ? 'This document is identical to the anchored version.'
          : isRevoked
            ? 'This document\'s verification has been revoked.'
            : isNotFound
              ? 'No anchor record found for this document.'
              : 'This document does not match the anchored version.'

        const anchor = result.anchor || {}
        const blockchain = result.blockchain || {}

        const resultDiv = document.createElement('div')
        resultDiv.className = `svdr-result svdr-result-${resultClass}`
        resultDiv.innerHTML = `
          <div class="svdr-result-icon">${icon}</div>
          <div class="svdr-result-title svdr-${resultClass}-title">
            ${title}
          </div>
          <div class="svdr-result-sub">${sub}</div>
          ${anchor.metadata ? `
            <div class="svdr-meta">
              ${anchor.metadata ? `<div class="svdr-meta-row">
                Document: ${anchor.metadata}
              </div>` : ''}
              ${anchor.blockTimestamp || anchor.createdAt ? `
                <div class="svdr-meta-row">
                  Anchored: ${fmtDate(anchor.blockTimestamp || anchor.createdAt)}
                </div>` : ''}
              ${anchor.organizationName ? `
                <div class="svdr-meta-row">
                  By: ${anchor.organizationName}
                </div>` : ''}
            </div>` : ''}
          <div class="svdr-actions">
            <a href="${appBase}/verify/${hash}"
               target="_blank" rel="noopener"
               class="svdr-btn svdr-btn-primary">
              View Full Details ↗
            </a>
            ${blockchain.explorerUrl ? `
              <a href="${blockchain.explorerUrl}"
                 target="_blank" rel="noopener"
                 class="svdr-btn svdr-btn-ghost">
                Blockchain ↗
              </a>` : ''}
          </div>
          <button class="svdr-btn-reset" id="svdr-reset">
            Verify another document
          </button>`

        wrap.appendChild(resultDiv)

        // Reset button
        setTimeout(() => {
          const resetBtn = container.querySelector('#svdr-reset')
          if (resetBtn) {
            resetBtn.addEventListener('click', () => {
              state = 'idle'
              result = null
              render()
            })
          }
        }, 0)
      }

      container.appendChild(wrap)
    }

    async function processFile(file) {
      state = 'hashing'
      render()

      // Track attempt
      trackEvent(hash, 'verify_attempt', { widgetId }, apiBase)

      try {
        const fileHash = await sha256File(file)

        // Compare hashes
        if (fileHash !== hash) {
          // Hashes don't match — check if hash exists at all
          let apiResult
          try {
            apiResult = await verifyHash(hash, apiBase)
          } catch {
            apiResult = { authentic: false, error: 'API_ERROR' }
          }
          result = {
            ...apiResult,
            authentic: false,
            computedHash: fileHash,
            // Override if the file hash simply doesn't match the target hash
            status: apiResult.status || 'MISMATCH',
          }
        } else {
          // Hashes match — verify with API to get full record
          try {
            result = await verifyHash(hash, apiBase)
          } catch {
            // API error — hashes match, show as authentic with warning
            result = { authentic: true, status: 'CONFIRMED' }
          }
        }

        // Track completion
        trackEvent(hash, 'verify_complete', {
          widgetId,
          authentic: result.authentic
        }, apiBase)

        state = 'result'
        render()
      } catch (err) {
        result = {
          authentic: false,
          error: 'HASH_ERROR',
          status: 'ERROR',
          message: err.message,
        }
        state = 'result'
        render()
      }
    }

    render()
  }

  // ── Auto-initialize all widgets on page ──
  function init() {
    injectStyles()
    const containers = document.querySelectorAll('[data-sipheron-widget], #sipheron-widget')
    containers.forEach(mountWidget)
  }

  // ── Public API ──
  window.SipHeronVDR = {
    version: WIDGET_VERSION,
    init,
    mount: mountWidget,
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

})(window, document)
