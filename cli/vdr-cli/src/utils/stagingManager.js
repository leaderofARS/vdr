/**
 * @file stagingManager.js
 * @module cli/vdr-cli/src/utils/stagingManager.js
 * @description CLI utilities for encryption, formatting, and file management.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.vdr');
const STAGED_FILE = path.join(CONFIG_DIR, 'staged.json');

function getStagedItems() {
    if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
    if (!fs.existsSync(STAGED_FILE)) return [];

    try {
        return JSON.parse(fs.readFileSync(STAGED_FILE, 'utf-8'));
    } catch (e) {
        return [];
    }
}

function saveStagedItems(items) {
    // FIX M-1: Create directory and file with restrictive permissions
    if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
    fs.writeFileSync(STAGED_FILE, JSON.stringify(items, null, 2), { mode: 0o600 });
}

function addStagedItem(item) {
    const items = getStagedItems();
    // Check if hash already staged
    if (!items.find(i => i.hash === item.hash)) {
        items.push({
            ...item,
            stagedAt: new Date().toISOString()
        });
        saveStagedItems(items);
        return true;
    }
    return false;
}

function clearStagedItems() {
    saveStagedItems([]);
}

module.exports = {
    getStagedItems,
    saveStagedItems,
    addStagedItem,
    clearStagedItems,
    STAGED_FILE
};
