/**
 * @file walletMonitor.js
 * @description Background service to monitor the backend treasury wallet balance and alert on low funds.
 */

const solanaService = require('./solana');
const { sendWalletAlertEmail } = require('./emailService');
const prisma = require('../config/database');
const notificationService = require('./notificationService');

const CRITICAL_THRESHOLD = 0.01; // SOL — stop registrations
const WARNING_THRESHOLD = 0.05;  // SOL — send alert
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

let walletDrained = false;
let currentBalance = 0;
let currentStatus = 'healthy';
let lastAlertSent = null; // Track last alert level sent to prevent email spam

/**
 * Checks wallet balance from Solana devnet RPC.
 */
async function checkBalance() {
    try {
        const connection = solanaService.getConnection();
        const wallet = solanaService.getWallet();

        // Safety check if Solana service isn't ready
        if (!connection || !wallet) {
            console.warn('[WalletMonitor] Solana service not initialized. Waiting...');
            return;
        }

        const balanceLamports = await connection.getBalance(wallet.publicKey);
        const balanceSol = balanceLamports / 1e9;
        currentBalance = balanceSol;

        console.log(`[WalletMonitor] Balance: ◎${balanceSol.toFixed(5)} SOL`);

        if (balanceSol < WARNING_THRESHOLD) {
            const isCritical = balanceSol < CRITICAL_THRESHOLD;
            currentStatus = isCritical ? 'critical' : 'warning';
            walletDrained = isCritical;

            // Threshold change or first alert
            if (lastAlertSent !== currentStatus) {
                console.warn(`[WalletMonitor] ${currentStatus.toUpperCase()}: Wallet balance ◎${balanceSol.toFixed(5)} SOL.`);
                await sendWalletAlertEmail(currentStatus, balanceSol);

                // Create In-App Notification for Organization(s)
                // Use first org as 'admin' org if not specified, or all orgs for collective alerts?
                // For simplicity as requested, we notify the primary organization context
                const orgs = await prisma.organization.findMany({ take: 1 });
                if (orgs.length > 0) {
                    await notificationService.createNotification(
                        orgs[0].id,
                        'low_balance',
                        `Wallet balance ${currentStatus}`,
                        `The backend treasury wallet balance has dropped to ◎${balanceSol.toFixed(5)} SOL. ${isCritical ? 'Registrations are paused.' : 'Please top up soon.'}`,
                        { balance: balanceSol }
                    ).catch(err => console.error('[WalletMonitor] Notification failed:', err.message));
                }

                lastAlertSent = currentStatus;
            }
        } else {
            currentStatus = 'healthy';
            walletDrained = false;
            lastAlertSent = null; // Reset when healthy
        }

    } catch (error) {
        console.error('[WalletMonitor] Balance check failed:', error.message);
    }
}

/**
 * Starts the periodic monitor.
 */
function start() {
    console.log('[WalletMonitor] Monitoring treasury wallet...');
    checkBalance(); // Initial check
    setInterval(checkBalance, CHECK_INTERVAL);
}

module.exports = {
    start,
    isDrained: () => walletDrained,
    getBalance: () => currentBalance,
    getStatus: () => currentStatus
};
