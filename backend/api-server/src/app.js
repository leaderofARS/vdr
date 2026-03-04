/**
 * @file app.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/backend/api-server/src/app.js
 * @description Core component of the SipHeron VDR platform.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const helmetConfig = require("./middleware/helmet-config");
const csrfProtection = require("./middleware/csrf");

dotenv.config();

const registerRoute = require("./routes/register");
const verifyRoute = require("./routes/verify");
const recordRoute = require("./routes/record");

// New SipHeron Routes
const authRoute = require("./routes/auth");
const batchRoute = require("./routes/batch");
const analyticsRoute = require("./routes/analytics");
const organizationRoute = require("./routes/organization");

const authenticate = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// Core Indexer Service
const indexer = require("./services/indexer");

const app = express();

// Fix 1.8: Apply Security Headers (Helmet Configuration)
// Provides institutional-grade security headers for production deployment
app.use(helmetConfig);

// Fix 1.16: Enable cookie parsing for HttpOnly JWT cookies
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
app.use(express.json());

// Apply High-Level Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 60, // Limit each IP to 60 requests per window (1/sec avg)
    message: { error: 'Too many requests from this IP, please try again after a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(apiLimiter);

// Specific limiter for Auth (Login/Register)
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window for dev
    max: 50, // 50 attempts
    message: { error: 'Too many auth attempts, please try again in 1 minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Specific limiter for Hash Registration (Treasury Protection)
const registrationLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 registrations per minute
    message: { error: 'Registration limit reached. Please wait a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// CSRF token endpoint — clients fetch this before making state-changing requests
app.get("/api/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Routes with CSRF protection on state-changing endpoints
app.post("/register", csrfProtection, registrationLimiter, registerRoute);
app.post("/verify", verifyRoute);
app.get("/record/:hash", authenticate, recordRoute);

// Auth routes do not use CSRF (login/register need to work without prior token)
app.use("/auth", authLimiter, authRoute);
app.use("/api", csrfProtection, registrationLimiter, batchRoute);
app.use("/analytics", analyticsRoute);
app.use("/organizations", csrfProtection, organizationRoute);

app.get("/", (req, res) => {
    res.status(200).json({
        name: "SipHeron VDR API",
        version: "0.9.0-beta",
        network: process.env.SOLANA_NETWORK || "devnet",
        status: "operational"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        solana: "connected",
        cluster: process.env.SOLANA_NETWORK || "devnet",
        timestamp: new Date().toISOString()
    });
});

// Setup Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Only bind to port if not running in test mode
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`VDR Backend API running on port ${PORT}`);
        indexer.start(); // Start Database syncing
    });
}

module.exports = app;
