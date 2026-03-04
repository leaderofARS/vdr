/**
 * @file hash.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/utils/hash.js
 * @description CLI utilities for encryption, formatting, and file management.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const crypto = require("crypto");
const fs = require("fs");

/**
 * Computes the SHA-256 hash of a file.
 * The raw file never leaves the user's local machine.
 * @param {string} filePath - Path to the file
 * @returns {string} The hex string of the SHA-256 hash
 */
function computeFileHash(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

module.exports = { computeFileHash };
