const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'SipHeron VDR <noreply@sipheron.com>';

/**
 * Send a professional password reset email.
 */
async function sendPasswordResetEmail(email, resetToken) {
    try {
        const resetUrl = `${process.env.FRONTEND_URL || 'https://app.sipheron.com'}/auth/reset-password?token=${resetToken}`;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Reset your SipHeron password',
            html: `
                <div style="background-color: #0A0A0F; color: #F8F8FF; font-family: sans-serif; padding: 40px; border-radius: 8px; max-width: 600px; margin: auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4F6EF7; margin: 0;">SipHeron VDR</h1>
                    </div>
                    <div style="background-color: #111118; padding: 30px; border: 1px solid #1E1E2E; border-radius: 12px;">
                        <h2 style="margin-top: 0;">Password Reset Request</h2>
                        <p style="color: #6B7280; line-height: 1.6;">You requested a password reset for your SipHeron VDR institutional account. Use the button below to establish a new master key.</p>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${resetUrl}" style="background-color: #4F6EF7; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold;">Reset Password</a>
                        </div>
                        
                        <p style="color: #6B7280; font-size: 13px; line-height: 1.6;">
                            This link expires in 1 hour. If you didn't request this, please ignore this email or contact security if you suspect unauthorized access.
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
                        <p>SipHeron VDR · Built on Solana · Immutable Registry</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email Service] Failed to send password reset email:', error.message);
    }
}

/**
 * Send notification for new API key creation.
 */
async function sendApiKeyCreatedEmail(email, keyName) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'New API key created — SipHeron VDR',
            html: `
                <div style="background-color: #0A0A0F; color: #F8F8FF; font-family: sans-serif; padding: 40px; border-radius: 8px; max-width: 600px; margin: auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4F6EF7; margin: 0;">SipHeron VDR</h1>
                    </div>
                    <div style="background-color: #111118; padding: 30px; border: 1px solid #1E1E2E; border-radius: 12px;">
                        <h2 style="margin-top: 0; color: #10B981;">Security Notification</h2>
                        <p style="color: #F8F8FF;">A new API key <strong>${keyName}</strong> was created for your account.</p>
                        <p style="color: #6B7280; font-size: 14px;">Timestamp: ${new Date().toUTCString()}</p>
                        
                        <p style="color: #6B7280; line-height: 1.6; margin-top: 20px;">
                            If this wasn't you, revoke it immediately from your <a href="https://app.sipheron.com/dashboard/keys" style="color: #4F6EF7;">dashboard</a> to prevent unauthorized data anchoring.
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
                        <p>SipHeron VDR · Built on Solana</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email Service] Failed to send API key creation email:', error.message);
    }
}

/**
 * Send notification for successful hash anchoring.
 */
async function sendHashAnchoredEmail(email, hash, txSignature, metadata) {
    try {
        const explorerUrl = `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Document anchored on Solana — SipHeron VDR',
            html: `
                <div style="background-color: #0A0A0F; color: #F8F8FF; font-family: sans-serif; padding: 40px; border-radius: 8px; max-width: 600px; margin: auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4F6EF7; margin: 0;">SipHeron VDR</h1>
                    </div>
                    <div style="background-color: #111118; padding: 30px; border: 1px solid #1E1E2E; border-radius: 12px;">
                        <h2 style="margin-top: 0; color: #10B981;">Proof Successfully Anchored</h2>
                        <p style="color: #6B7280;">Your document is now permanently recorded on the Solana blockchain.</p>
                        
                        <div style="background-color: #0A0A0F; padding: 15px; border-radius: 6px; margin: 20px 0; font-family: monospace; font-size: 12px; color: #4F6EF7; word-break: break-all;">
                            HASH: ${hash}
                        </div>
                        
                        <p style="margin: 0; font-size: 14px;">Metadata: <span style="color: #6B7280;">${metadata || 'N/A'}</span></p>
                        <p style="margin: 5px 0 20px 0; font-size: 14px;">Timestamp: <span style="color: #6B7280;">${new Date().toUTCString()}</span></p>
                        
                        <div style="text-align: center;">
                            <a href="${explorerUrl}" style="color: #4F6EF7; text-decoration: none; font-size: 14px; font-weight: bold;">View on Solana Explorer &rarr;</a>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
                        <p>SipHeron VDR · Verifiable Document Registry</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email Service] Failed to send hash anchored email:', error.message);
    }
}

/**
 * Send welcome email on registration.
 */
async function sendWelcomeEmail(email, orgName) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Welcome to SipHeron VDR',
            html: `
                <div style="background-color: #0A0A0F; color: #F8F8FF; font-family: sans-serif; padding: 40px; border-radius: 8px; max-width: 600px; margin: auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4F6EF7; margin: 0;">SipHeron VDR</h1>
                    </div>
                    <div style="background-color: #111118; padding: 30px; border: 1px solid #1E1E2E; border-radius: 12px;">
                        <h2 style="margin-top: 0;">Welcome to the Registry</h2>
                        <p style="color: #6B7280; line-height: 1.6;">
                            Welcome to SipHeron VDR. Your organization portal is ready to anchor immutable proofs on the Solana blockchain.
                        </p>
                        
                        <h3 style="color: #F8F8FF; font-size: 16px; margin-top: 30px;">Quick Start Steps:</h3>
                        <ol style="color: #6B7280; line-height: 1.8; font-size: 14px;">
                            <li>Generate your first <strong>API Key</strong> in the dashboard</li>
                            <li>Install the <strong>CLI Tool</strong>: <code>npm install -g @sipheron/vdr-cli</code></li>
                            <li>Anchor your first document: <code>sipheron-vdr anchor ./document.pdf</code></li>
                        </ol>
                        
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="https://app.sipheron.com/dashboard" style="background-color: #4F6EF7; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
                        <p>Need help? Read our <a href="https://app.sipheron.com/docs" style="color: #4F6EF7;">documentation</a></p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email Service] Failed to send welcome email:', error.message);
    }
}

/**
 * Send alert email for low wallet balance.
 */
async function sendWalletAlertEmail(type, balance) {
    try {
        const recipient = process.env.SUPPORT_EMAIL || 'noreply@sipheron.com';
        const color = type === 'critical' ? '#EF4444' : '#F59E0B';
        const subject = `[WALLET ALERT] ${type.toUpperCase()} — SipHeron VDR Treasury`;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: recipient,
            subject: subject,
            html: `
                <div style="background-color: #0A0A0F; color: #F8F8FF; font-family: sans-serif; padding: 40px; border-radius: 8px; max-width: 600px; margin: auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4F6EF7; margin: 0;">SipHeron VDR</h1>
                    </div>
                    <div style="background-color: #111118; padding: 30px; border: 1px solid ${color}; border-radius: 12px;">
                        <h2 style="margin-top: 0; color: ${color};">${type.toUpperCase()} ALERT</h2>
                        <p style="color: #F8F8FF;">The backend treasury wallet for hash registrations is running low.</p>
                        
                        <div style="background-color: #0A0A0F; padding: 25px; border-radius: 6px; margin: 20px 0; text-align: center;">
                            <span style="font-size: 24px; font-weight: bold; color: ${color};">◎ ${balance.toFixed(5)} SOL</span>
                        </div>
                        
                        <p style="color: #6B7280; font-size: 14px;"><strong>Address:</strong> FxNzogprmve9aubt4B6VT21DKBbERz47cYYQnuF9Xgi5</p>
                        <p style="color: #6B7280; font-size: 14px; margin-top: 10px;">
                            ${type === 'critical' ? '<strong>CRITICAL:</strong> All new registrations are paused until the wallet is topped up.' : 'Please top up this wallet soon to ensure uninterrupted registration services.'}
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
                        <p>SipHeron VDR · Infrastructure Alerts</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email Service] Failed to send wallet alert email:', error.message);
    }
}

/**
 * Send a test email (Resend onboarding example).
 */
async function sendTestEmail(toEmail = 'noreply@sipheron.com') {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: toEmail,
            subject: 'Hello World',
            html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        });
        console.log('[Email Service] Test email sent successfully to:', toEmail);
    } catch (error) {
        console.error('[Email Service] Failed to send test email:', error.message);
    }
}

module.exports = {
    sendPasswordResetEmail,
    sendApiKeyCreatedEmail,
    sendHashAnchoredEmail,
    sendWelcomeEmail,
    sendWalletAlertEmail,
    sendTestEmail
};
