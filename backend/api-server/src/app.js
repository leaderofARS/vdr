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
const helmetConfig = require("./middleware/helmet-config");
const { globalLimiter, authLimiter, batchRegisterLimiter, keyCreationLimiter } = require("./middleware/rateLimiter");

dotenv.config();

const registerRoute = require("./routes/register");
const verifyRoute = require("./routes/verify");
const recordRoute = require("./routes/record");

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
const usageLogger = require("./middleware/usageLogger");

const authenticate = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// Core Indexer Service
const indexer = require("./services/indexer");
const walletMonitor = require("./services/walletMonitor");

const app = express();

// Trust Railway/Vercel proxy (required for rate limiting behind load balancers)
app.set('trust proxy', 1);

// Apply Security Headers
app.use(helmetConfig);

// Enable cookie parsing for HttpOnly JWT cookies
app.use(cookieParser());

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
            : [process.env.FRONTEND_URL || 'http://localhost:3000'];

        // Allow requests with no origin (server-to-server, CLI, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'X-CSRF-Token']
}));

// Specific body-parser limits for batch registrations
app.use('/api/batch-register', express.json({ limit: '10mb' }));

// Global body-parser and global rate limiting
app.use(express.json({ limit: '1mb' }));
app.use(globalLimiter);

// CSRF token endpoint — returns null since API uses stateless JWT auth
// csurf removed: incompatible with Express 5
app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: null });
});

// Routes
// Apply authLimiter to root /register endpoint and auth routes
app.post("/register", authLimiter, registerRoute);
app.post("/verify", verifyRoute);
app.get("/record/:hash", authenticate, recordRoute);

// Auth routes — apply authLimiter to /auth/*
app.use("/auth", authLimiter, authRoute);

// Batch and Hashes routes — apply specific limiters
app.post("/api/batch-register", batchRegisterLimiter); // Apply limiter specifically to this POST
app.use("/api", batchRoute);
app.use("/api/hashes", hashesRoute);

// API Keys — list and manage
app.use("/api/keys", keysRoute);
app.post("/api/keys", keyCreationLimiter); // This still needs a handler if used here, or handled inside keysRoute

app.use("/analytics", analyticsRoute);
app.use("/api/org", orgRoute); // Full org management & stats
app.use("/api/notifications", notificationsRoute);
app.use("/api/webhooks", webhooksRoute);
app.use("/api/usage", usageRoute);
app.use("/api", usageLogger); // Log all /api requests (non-blocking)
app.use("/organizations", organizationRoute);

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