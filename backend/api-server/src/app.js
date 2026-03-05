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
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const helmetConfig = require("./middleware/helmet-config");

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

app.use(express.json());

// Apply High-Level Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: { error: 'Too many requests from this IP, please try again after a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(apiLimiter);

// Specific limiter for Auth (Login/Register)
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: { error: 'Too many auth attempts, please try again in 1 minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Specific limiter for Hash Registration (Treasury Protection)
const registrationLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: { error: 'Registration limit reached. Please wait a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// CSRF token endpoint — returns null since API uses stateless JWT auth
// csurf removed: incompatible with Express 5
app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: null });
});

// Routes
app.post("/register", registrationLimiter, registerRoute);
app.post("/verify", verifyRoute);
app.get("/record/:hash", authenticate, recordRoute);

// Auth routes
app.use("/auth", authLimiter, authRoute);
app.use("/api", registrationLimiter, batchRoute);
app.use("/analytics", analyticsRoute);
app.use("/organizations", organizationRoute);

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        name: "SipHeron VDR API",
        version: "0.9.0-beta",
        network: process.env.SOLANA_NETWORK || "devnet",
        status: "operational"
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        solana: "connected",
        cluster: process.env.SOLANA_NETWORK || "devnet",
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
    });
}

module.exports = app;