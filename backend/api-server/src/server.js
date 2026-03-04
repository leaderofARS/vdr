/**
 * Production Server Entry Point
 *
 * This file wraps the Express app with:
 * - Graceful shutdown (drains connections before exit)
 * - SIGTERM / SIGINT signal handling
 * - Cluster-ready (works with PM2 cluster mode)
 * - Connection tracking for zero-downtime deploys
 */
const app = require('./app');
const indexer = require('./services/indexer');

const PORT = process.env.PORT || 3001;
const connections = new Set();

const server = app.listen(PORT, () => {
    console.log(`[PID ${process.pid}] VDR API running on port ${PORT}`);
    indexer.start();
});

// Track open connections for graceful shutdown
server.on('connection', (conn) => {
    connections.add(conn);
    conn.on('close', () => connections.delete(conn));
});

// Keep-alive timeout (important for load balancers)
server.keepAliveTimeout = 65000;       // Slightly above typical ALB 60s timeout
server.headersTimeout = 66000;

function shutdown(signal) {
    console.log(`[PID ${process.pid}] ${signal} received. Starting graceful shutdown...`);

    // Stop accepting new connections
    server.close(() => {
        console.log(`[PID ${process.pid}] HTTP server closed.`);
        indexer.stop();
        process.exit(0);
    });

    // Force-close connections that haven't finished after 10s
    setTimeout(() => {
        console.warn(`[PID ${process.pid}] Forcing shutdown after timeout.`);
        connections.forEach((conn) => conn.destroy());
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Prevent unhandled rejections from crashing the process
process.on('unhandledRejection', (reason) => {
    console.error('[FATAL] Unhandled Rejection:', reason);
});
