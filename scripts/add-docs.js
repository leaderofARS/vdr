const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
    'backend/api-server/src',
    'cli/vdr-cli/src',
    'web/dashboard/src',
    'programs/vdr_contract/src'
];

const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.rs'];

const MODULE_DESCRIPTIONS = {
    'backend/api-server/src/routes': 'Express API route handlers.',
    'backend/api-server/src/services': 'Core business logic and external service integrations.',
    'backend/api-server/src/middleware': 'Express middleware for security, authentication, and error handling.',
    'backend/api-server/src/config': 'Database and environment configurations.',
    'backend/api-server/src/utils': 'Utility functions and helpers.',
    'backend/api-server/src/workers': 'Background job queue processors.',
    'cli/vdr-cli/src/commands': 'CLI command modules deployed via Commander.js.',
    'cli/vdr-cli/src/utils': 'CLI utilities for encryption, formatting, and file management.',
    'web/dashboard/src/app': 'Next.js App Router pages and layouts.',
    'web/dashboard/src/components': 'Reusable React UI components.',
    'web/dashboard/src/utils': 'Frontend utility functions and API clients.',
    'programs/vdr_contract/src/instructions': 'Solana Anchor instruction handlers (smart contract endpoints).',
    'programs/vdr_contract/src/state': 'Solana Anchor account structures and state definitions.',
};

function getModuleDescription(filePath) {
    for (const [dir, desc] of Object.entries(MODULE_DESCRIPTIONS)) {
        if (filePath.includes(dir)) return desc;
    }
    return 'Core component of the SipHeron VDR platform.';
}

function processFile(filePath) {
    const ext = path.extname(filePath);
    if (!EXTENSIONS.includes(ext)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already documented
    if (content.trim().startsWith('/**') || content.trim().startsWith('//!')) {
        console.log(`Skipping (already documented): ${filePath}`);
        return;
    }

    const desc = getModuleDescription(filePath);
    const fileName = path.basename(filePath);
    const modulePath = filePath.replace(/\\/g, '/');

    let header = '';

    if (ext === '.rs') {
        // Rustdoc module-level attribute
        header = `//! @file ${fileName}
//! @module ${modulePath}
//! @description ${desc}
//! This file is part of the SipHeron VDR smart contract.
//! @author SipHeron Platform

`;
    } else {
        // JSDoc
        header = `/**
 * @file ${fileName}
 * @module ${modulePath}
 * @description ${desc}
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

`;
    }

    // Handle "use client" or generic directives at the very top of JS/TS files
    if (content.trim().startsWith('"use client"') || content.trim().startsWith("'use client'")) {
        const lines = content.split('\n');
        const firstLine = lines.shift();
        content = `${firstLine}\n\n${header}${lines.join('\n')}`;
    } else {
        content = header + content;
    }

    fs.writeFileSync(filePath, content);
    console.log(`Added docs to: ${filePath}`);
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

console.log('--- Starting Codebase Documentation Injection ---');
TARGET_DIRS.forEach(dir => walkDir(path.resolve(__dirname, '..', dir)));
console.log('--- Done ---');
