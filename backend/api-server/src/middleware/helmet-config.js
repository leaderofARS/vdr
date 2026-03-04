/**
 * Helmet Security Middleware Configuration
 * Fix 1.8: Security Headers for Institutional-Grade API
 * 
 * Implements comprehensive security headers to protect against:
 * - XSS attacks
 * - Clickjacking
 * - MIME-type sniffing
 * - Information disclosure
 */

// Note: Install helmet with: npm install helmet --save
// For now, we'll provide a manual implementation until helmet is installed

const helmetConfig = (req, res, next) => {
    // Strict-Transport-Security: Force HTTPS
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // X-Content-Type-Options: Prevent MIME-type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // X-Frame-Options: Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // X-XSS-Protection: Enable XSS filter (legacy browsers)
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer-Policy: Control referrer information
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Content-Security-Policy: Restrict resource loading
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self'; " +
        "connect-src 'self' https://api.devnet.solana.com https://api.mainnet-beta.solana.com; " +
        "frame-ancestors 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'"
    );
    
    // Permissions-Policy: Restrict browser features
    res.setHeader(
        'Permissions-Policy',
        'geolocation=(), microphone=(), camera=(), payment=()'
    );
    
    // X-Powered-By: Remove (information disclosure)
    res.removeHeader('X-Powered-By');
    
    next();
};

module.exports = helmetConfig;
