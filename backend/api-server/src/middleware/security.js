const { z } = require('zod');
const helmet = require('helmet');
const sanitizeHtml = require('sanitize-html');

// 2. Input Validation (Zod)
const validateInput = (schema) => (req, res, next) => {
    try {
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            req.body = schema.parse(req.body);
        } else if (req.query && Object.keys(req.query).length > 0) {
            req.query = schema.parse(req.query);
        }
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.errors
        });
    }
};

// 8. Sanitize Output (Strip sensitive fields)
const sanitizeOutput = (fieldsToStrip) => (req, res, next) => {
    const originalJson = res.json;
    res.json = function (obj) {
        if (obj && typeof obj === 'object') {
            fieldsToStrip.forEach(field => {
                delete obj[field];
                if (obj.user) delete obj.user[field];
                if (obj.organization) delete obj.organization[field];
            });
        }
        return originalJson.call(this, obj);
    };
    next();
};

// Require HTTPS
const requireHttps = (req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
        return res.redirect(`https://${req.get('host')}${req.url}`);
    }
    next();
};

// Detect Suspicious
const detectSuspicious = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const path = req.path;
    const bodyString = JSON.stringify(req.body || {});
    const queryString = JSON.stringify(req.query || {});

    // SQL Injection patterns (basic, Prisma handles the rest)
    const sqlRegex = /(\$where|\$ne|\$gt|\$lt|\$gte|\$lte|\$in|\$nin|\$regex|union\s+select|insert\s+into|drop\s+table|delete\s+from)/gi;

    // Path traversal
    const pathRegex = /(\.\.\/|\.\.\\)/g;

    let flag = false;
    let event = '';

    if (sqlRegex.test(bodyString) || sqlRegex.test(queryString)) {
        flag = true;
        event = 'SUSPICIOUS_SQLI_PATTERN';
    } else if (pathRegex.test(path) || pathRegex.test(bodyString) || pathRegex.test(queryString)) {
        flag = true;
        event = 'SUSPICIOUS_PATH_TRAVERSAL';
    }

    if (flag) {
        console.log(JSON.stringify({
            type: 'SECURITY_EVENT',
            event,
            timestamp: new Date().toISOString(),
            ip, path
        }));
        return res.status(403).json({ error: 'Suspicious request pattern detected' });
    }

    next();
};

// 3. Security Headers (Helmet)
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https:", "http:", "https://api.devnet.solana.com"],
            fontSrc: ["'self'", "data:", "https:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", "https:", "http:"],
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: false, // Allow embedding for the viewer
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
});

// Validate API Key format
const validateApiKeyFormat = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
        const keyRegex = /^svdr_[a-f0-9]{64}$/;
        if (!keyRegex.test(apiKey)) {
            console.log(JSON.stringify({
                type: 'SECURITY_EVENT',
                event: 'INVALID_API_KEY_FORMAT',
                timestamp: new Date().toISOString(),
                ip: req.ip || req.connection.remoteAddress
            }));
            return res.status(401).json({ error: 'Invalid API Key' });
        }
    }
    next();
};

module.exports = {
    validateInput,
    sanitizeOutput,
    requireHttps,
    detectSuspicious,
    securityHeaders,
    validateApiKeyFormat
};
