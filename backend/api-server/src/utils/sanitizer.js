/**
 * Input Sanitization Utility
 * Fix 1.11: Metadata Sanitization for Injection Prevention
 * 
 * Sanitizes user input to prevent:
 * - SQL Injection
 * - NoSQL Injection
 * - XSS attacks
 * - Command Injection
 */

/**
 * Sanitize metadata string for safe storage
 * @param {string} input - Raw metadata input
 * @returns {string} Sanitized metadata
 */
function sanitizeMetadata(input) {
    if (typeof input !== 'string') {
        return '';
    }
    
    // Remove null bytes (can cause issues in C-based systems)
    let sanitized = input.replace(/\0/g, '');
    
    // Remove control characters except newline, carriage return, and tab
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Escape HTML special characters to prevent XSS
    sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    
    // Remove potential SQL/NoSQL injection patterns
    // This is defense-in-depth; parameterized queries are primary defense
    const dangerousPatterns = [
        /(\$where|\$ne|\$gt|\$lt|\$gte|\$lte|\$in|\$nin|\$regex)/gi,  // NoSQL operators
        /(union\s+select|insert\s+into|drop\s+table|delete\s+from)/gi, // SQL keywords
        /(javascript:|data:|vbscript:)/gi,                              // Protocol handlers
        /(<script|<iframe|<object|<embed)/gi                            // HTML tags
    ];
    
    dangerousPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    // Enforce maximum length (200 chars as per smart contract)
    if (sanitized.length > 200) {
        sanitized = sanitized.substring(0, 200);
    }
    
    return sanitized;
}

/**
 * Sanitize email address
 * @param {string} email - Raw email input
 * @returns {string} Sanitized email
 */
function sanitizeEmail(email) {
    if (typeof email !== 'string') {
        return '';
    }
    
    // Convert to lowercase and trim
    let sanitized = email.toLowerCase().trim();
    
    // Remove any characters that aren't valid in email addresses
    sanitized = sanitized.replace(/[^a-z0-9@._+-]/g, '');
    
    // Basic email format validation
    const emailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(sanitized)) {
        return '';
    }
    
    return sanitized;
}

/**
 * Sanitize hash string (SHA-256 hex)
 * @param {string} hash - Raw hash input
 * @returns {string} Sanitized hash or empty string if invalid
 */
function sanitizeHash(hash) {
    if (typeof hash !== 'string') {
        return '';
    }
    
    // Remove whitespace
    let sanitized = hash.trim().toLowerCase();
    
    // SHA-256 hash should be exactly 64 hex characters
    const hashRegex = /^[a-f0-9]{64}$/;
    if (!hashRegex.test(sanitized)) {
        return '';
    }
    
    return sanitized;
}

/**
 * Sanitize organization name
 * @param {string} name - Raw organization name
 * @returns {string} Sanitized name
 */
function sanitizeOrganizationName(name) {
    if (typeof name !== 'string') {
        return '';
    }
    
    // Remove control characters and trim
    let sanitized = name.replace(/[\x00-\x1F\x7F]/g, '').trim();
    
    // Allow alphanumeric, spaces, hyphens, underscores, and periods
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_.]/g, '');
    
    // Collapse multiple spaces
    sanitized = sanitized.replace(/\s+/g, ' ');
    
    // Enforce reasonable length (max 100 chars)
    if (sanitized.length > 100) {
        sanitized = sanitized.substring(0, 100);
    }
    
    return sanitized;
}

module.exports = {
    sanitizeMetadata,
    sanitizeEmail,
    sanitizeHash,
    sanitizeOrganizationName
};
