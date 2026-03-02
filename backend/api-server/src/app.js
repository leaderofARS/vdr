const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const registerRoute = require("./routes/register");
const verifyRoute = require("./routes/verify");
const recordRoute = require("./routes/record");

// New SipHeron Routes
const authRoute = require("./routes/auth");
const batchRoute = require("./routes/batch");
const analyticsRoute = require("./routes/analytics");

const errorHandler = require("./middleware/errorHandler");

// Core Indexer Service
const indexer = require("./services/indexer");

const app = express();

app.use(cors());
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

// Routes
app.post("/register", registerRoute);
app.post("/verify", verifyRoute);
app.get("/record/:hash", recordRoute);

// SipHeron Routes
app.use("/auth", authRoute);
app.use("/api", batchRoute);
app.use("/analytics", analyticsRoute);

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
