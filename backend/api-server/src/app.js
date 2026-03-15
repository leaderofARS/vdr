/**
 * @file app.js
 * @module backend/api-server/src/app.js
 * @description Core component of the SipHeron VDR platform.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const { globalLimiter, authLimiter, batchRegisterLimiter, keyCreationLimiter, globalRateLimiter } = require("./middleware/rateLimiter");
const { requireHttps, detectSuspicious, securityHeaders } = require("./middleware/security");

dotenv.config();

// Environment variable validation on startup
const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'WALLET_PRIVATE_KEY',
    'PROGRAM_ID',
    'REDIS_URL',
    'RESEND_API_KEY'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`[FATAL] Missing required environment variable: ${envVar}`);
    }
}

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sslmode=require')) {
    console.warn('[WARNING] DATABASE_URL should enforce SSL in production mode with ?sslmode=require appended.');
}

const registerRoute = require("./routes/register");
const verifyRoute = require("./routes/verify");
const recordRoute = require("./routes/record");

// API v1 Router
const v1Router = require('./routes/v1/index');

// New SipHeron Routes
const authRoute = require("./routes/auth");
const batchRoute = require("./routes/batch");
const analyticsRoute = require("./routes/analytics");
const organizationRoute = require("./routes/organization");
const hashesRoute = require("./routes/hashes");
const orgRoute = require("./routes/org");
const notificationsRoute = require("./routes/notifications");
const webhooksRoute = require("./routes/webhooks");
const usageRoute = require("./routes/usage");
const keysRoute = require("./routes/keys");
const membersRouter = require('./routes/members');
const rolesRouter = require('./routes/roles');
const auditRouter = require('./routes/audit');
const statsRouter = require('./routes/stats');
const usageLogger = require("./middleware/usageLogger");

const authenticate = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// Core Indexer Service
const indexer = require("./services/indexer");
const walletMonitor = require("./services/walletMonitor");

const app = express();

// Trust Railway/Vercel proxy (required for rate limiting behind load balancers)
app.set('trust proxy', 1);

// Require HTTPS in production
app.use(requireHttps);

// Apply Security Headers
app.use(securityHeaders);

// Enable cookie parsing for HttpOnly JWT cookies and CSRF
app.use(cookieParser());

// Strict CORS
const allowedOrigins = [
    'https://sipheron.com',
    'https://app.sipheron.com',
    'https://www.sipheron.com'
];

if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000');
    allowedOrigins.push('http://localhost:3001');
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (CLI, curl, mobile)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS policy violation: ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'X-CSRF-Token', 'x-csrf-token'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400
}));

// Wide-open CORS for public widget endpoints only
// These endpoints are designed to be called from any domain
const widgetCors = require('cors')({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key', 'x-widget-id'],
  exposedHeaders: ['X-Badge-Status', 'X-Widget-Version'],
})

// Apply to specific public routes only:
app.use('/api/hashes/badge', widgetCors)
app.use('/api/hashes/public', widgetCors)  // only if not already CORS-open
app.use('/api/verify', widgetCors)
app.use('/widget', widgetCors)             // new widget endpoint
app.use('/api/widget', widgetCors)         // widget analytics endpoint

// Implicit preflight is handled directly by app.use() declarations above

// Specific body-parser limits for batch registrations
app.use('/api/batch-register', express.json({ limit: '10mb' }));

// Global body-parser and global rate limiting
app.use(express.json({ limit: '100kb' }));
app.use(hpp()); // HTTP Parameter Pollution prevention
app.use(detectSuspicious); // Suspicious pattern detection
app.use(globalLimiter);
app.use(usageLogger); // Log all requests that have an API key (non-blocking)

// API version headers — added to every response
app.use((req, res, next) => {
  res.setHeader('X-API-Version', 'v1')
  res.setHeader('X-API-Deprecated', 'false')
  next()
})

// Double Submit Cookie CSRF logic
// API key auth assumes no cookies and no CSRF token check (stateless)
const timingSafeComparePath = require('crypto');
function timingSafeCompareCSRF(a, b) {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeComparePath.timingSafeEqual(bufA, bufB);
}

app.use((req, res, next) => {
    if (req.headers['x-api-key']) return next(); // Exclude API key requests from CSRF

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        // some routes such as generic register might not be api keys but handle exceptions where needed, or enforce on all non-api-key routes.
        // wait: login also is a POST, but maybe it doesn't need CSRF token since you get the CSRF token ON login?
        // Actually, on login: set CSRF token in cookie + return in response. 
        // Wait, if login is a POST, it won't have the CSRF token yet before login!
        // So if the path contains auth/login or auth/register we bypass.
        if (
            req.path.startsWith('/api/hashes/public') ||
            req.path.includes('/auth/login') ||
            req.path.includes('/auth/register') ||
            req.path.includes('/auth/forgot-password') ||
            req.path.includes('/auth/reset-password') ||
            req.path === '/register' ||
            req.path.startsWith('/v1/') ||
            req.path === '/api/webhooks' ||
            req.path.startsWith('/api/keys') ||
            req.path.startsWith('/api/hashes') ||
            req.path.startsWith('/api/org') ||
            req.path.startsWith('/api/notifications') ||
            req.path.startsWith('/api/usage') ||
            req.path.startsWith('/api/batch') ||
            req.path.startsWith('/api/members') ||
            req.path.startsWith('/api/audit') ||
            req.path.startsWith('/api/stats')
        ) {
            return next();
        }

        const headerToken = req.headers['x-csrf-token'];
        const cookieToken = req.cookies['csrf_token'];
        if (!headerToken || !cookieToken || !timingSafeCompareCSRF(headerToken, cookieToken)) {
            console.log(JSON.stringify({
                type: 'SECURITY_EVENT',
                event: 'CSRF_VIOLATION',
                timestamp: new Date().toISOString(),
                ip: req.ip || req.connection.remoteAddress,
                path: req.path
            }));
            return res.status(403).json({ error: 'Invalid CSRF token' });
        }
    }
    next();
});

app.use('/api', globalRateLimiter)
app.use('/v1', globalRateLimiter)

// Routes
// Apply authLimiter to root /register endpoint and auth routes
app.post("/register", authLimiter, registerRoute);
app.use("/api/verify", verifyRoute);
app.get("/record/:hash", authenticate, recordRoute);

// Auth routes — apply authLimiter to /auth/*
app.use("/auth", authLimiter, authRoute);

// Batch and Hashes routes — apply specific limiters
app.post("/api/batch-register", batchRegisterLimiter); // Apply limiter specifically to this POST
app.use("/api", batchRoute);
app.use("/api/hashes", hashesRoute);

// API Keys — list and manage
app.post("/api/keys", keyCreationLimiter);
app.use("/api/keys", keysRoute);

app.use("/analytics", analyticsRoute);
app.use("/api/org", orgRoute); // Full org management & stats
app.use("/api/notifications", notificationsRoute);
app.use("/api/webhooks", webhooksRoute);
app.use('/api/usage', usageRoute);
app.use('/api/members', membersRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/audit', auditRouter);
app.use('/api/stats', statsRouter);
// app.use("/api", usageLogger); // Removed from here and moved before routes

app.use("/organizations", organizationRoute);

// Mount v1 router
app.use('/v1', v1Router);

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        name: "SipHeron VDR (Verifiable Data Registry) API",
        version: process.env.npm_package_version || "0.9.0-beta",
        description: "Cryptographic anchoring and verification layer for the SipHeron platform on Solana.",
        network: process.env.SOLANA_NETWORK || "devnet",
        status: "operational",
        documentation: "https://docs.sipheron.com",
        endpoints: {
            health: "/health",
            auth: "/auth",
            register: "/register",
            verify: "/verify",
            batch: "/api/batch",
            analytics: "/analytics",
            organizations: "/organizations"
        },
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        version: process.env.npm_package_version,
        network: process.env.SOLANA_NETWORK,
        timestamp: new Date().toISOString()
    });
});

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Only bind to port if not running in test mode — server.js handles this in production
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`VDR Backend API running on port ${PORT}`);
        indexer.start();
        walletMonitor.start();
    });
}

module.exports = app;

const { cleanupExpiredRecords } = require('./middleware/idempotency')
// Run cleanup every hour
setInterval(cleanupExpiredRecords, 60 * 60 * 1000)
// Also run on startup
cleanupExpiredRecords().catch(console.error)

const { processPendingRetries } = require('./services/webhookService')
// Start webhook retry processor — run every 60 seconds
setInterval(processPendingRetries, 60 * 1000)
processPendingRetries().catch(console.error) // run on startup