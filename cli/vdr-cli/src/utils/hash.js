/**
 * @file hash.js
 * @module cli/vdr-cli/src/utils/hash.js
 * @description CLI utilities for encryption, formatting, and file management.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const crypto = require("crypto");
const fs = require("fs");

/**
 * Computes the SHA-256 hash of a file using streaming.
 * The raw file never leaves the user's local machine.
 *
 * loading the entire file into memory. This prevents OOM crashes on large files
 * (e.g., 4GB video files) and removes the Denial of Service vector for the
 * batch command which recursively scans directories.
 *
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} The hex string of the SHA-256 hash
 */
function computeFileHash(filePath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error(`File not found: ${filePath}`));
        }

        const hash = crypto.createHash("sha256");
        const stream = fs.createReadStream(filePath, { highWaterMark: 2 * 1024 * 1024 });

        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", (err) => reject(err));
    });
}

module.exports = { computeFileHash };
