export const metadata = {
    title: 'Privacy Policy — SipHeron VDR',
    description: 'Privacy Policy for SipHeron VDR blockchain document verification platform.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12">
                    <a href="https://sipheron.com" className="text-purple-400 text-sm hover:text-purple-300 mb-8 inline-block">
                        ← Back to SipHeron
                    </a>
                    <h1 className="text-4xl font-bold text-white mt-4">Privacy Policy</h1>
                    <p className="text-gray-400 mt-2 text-sm">Effective: March 1, 2026 · Last updated: March 1, 2026</p>
                </div>

                <div className="space-y-10 text-gray-300 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
                        <p>SipHeron VDR ("we", "our", or "us") operates a blockchain-based document verification platform at <a href="https://sipheron.com" className="text-purple-400 hover:text-purple-300">sipheron.com</a> and <a href="https://app.sipheron.com" className="text-purple-400 hover:text-purple-300">app.sipheron.com</a>. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our services.</p>
                        <p className="mt-3">By using SipHeron VDR, you agree to the collection and use of information in accordance with this policy.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
                        <p className="font-medium text-white mb-2">Information you provide directly:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Email address and name when you register</li>
                            <li>Organization name and Solana wallet address</li>
                            <li>Document metadata (file names, descriptions) — we never store the actual file contents</li>
                            <li>Payment information (processed by Stripe — we do not store card details)</li>
                        </ul>
                        <p className="font-medium text-white mb-2 mt-4">Information collected automatically:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>IP address and browser user agent</li>
                            <li>API usage logs and request metadata</li>
                            <li>Authentication tokens (stored as HttpOnly cookies)</li>
                        </ul>
                        <p className="font-medium text-white mb-2 mt-4">Blockchain data:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>SHA-256 document hashes anchored to the Solana blockchain are permanently public and cannot be deleted</li>
                            <li>Solana wallet addresses and transaction signatures are public blockchain data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>To provide and maintain the SipHeron VDR service</li>
                            <li>To authenticate your identity and secure your account</li>
                            <li>To send transactional emails (password resets, anchor confirmations, invitations)</li>
                            <li>To monitor API usage and enforce rate limits</li>
                            <li>To detect and prevent fraud and abuse</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                        <p className="mt-3">We do not sell your personal data to third parties. We do not use your data for advertising purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Data Storage and Security</h2>
                        <p>Your data is stored on secure cloud infrastructure (Railway, PostgreSQL). We implement industry-standard security measures including:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                            <li>Encrypted connections (TLS/HTTPS) for all data in transit</li>
                            <li>HttpOnly, Secure cookies for authentication tokens</li>
                            <li>Hashed API keys (SHA-256) — we never store plaintext API keys</li>
                            <li>Hashed passwords (bcrypt)</li>
                            <li>CSRF protection on all state-changing requests</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Services</h2>
                        <p>We use the following third-party services to operate SipHeron VDR:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                            <li><span className="text-white font-medium">Resend</span> — transactional email delivery</li>
                            <li><span className="text-white font-medium">Railway</span> — cloud infrastructure and database hosting</li>
                            <li><span className="text-white font-medium">Vercel</span> — frontend hosting</li>
                            <li><span className="text-white font-medium">Solana blockchain</span> — immutable on-chain storage of document hashes</li>
                            <li><span className="text-white font-medium">Stripe</span> — payment processing (when billing is enabled)</li>
                        </ul>
                        <p className="mt-3">Each third-party service has its own privacy policy. We encourage you to review them.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Cookies</h2>
                        <p>We use the following cookies:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                            <li><span className="text-white font-medium">vdr_token</span> — HttpOnly authentication cookie, required for login. Expires after 7 days.</li>
                            <li><span className="text-white font-medium">cookie_consent</span> — stores your cookie consent preference. Expires after 1 year.</li>
                        </ul>
                        <p className="mt-3">We do not use tracking cookies, advertising cookies, or third-party analytics cookies.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Your Rights (GDPR)</h2>
                        <p>If you are located in the European Economic Area, you have the following rights:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                            <li><span className="text-white font-medium">Right to access</span> — request a copy of your personal data</li>
                            <li><span className="text-white font-medium">Right to rectification</span> — correct inaccurate personal data</li>
                            <li><span className="text-white font-medium">Right to erasure</span> — request deletion of your personal data (note: blockchain data cannot be deleted)</li>
                            <li><span className="text-white font-medium">Right to data portability</span> — export your data in CSV/JSON format</li>
                            <li><span className="text-white font-medium">Right to object</span> — object to processing of your personal data</li>
                        </ul>
                        <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:legal@sipheron.com" className="text-purple-400 hover:text-purple-300"> legal@sipheron.com</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Data Retention</h2>
                        <p>We retain your personal data for as long as your account is active. If you delete your account:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                            <li>Your email, name, and organization data will be deleted within 30 days</li>
                            <li>API keys will be permanently revoked</li>
                            <li>Document hashes on the Solana blockchain are permanent and cannot be deleted</li>
                            <li>Billing records are retained for 7 years as required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">9. Children's Privacy</h2>
                        <p>SipHeron VDR is not directed at children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us immediately at <a href="mailto:legal@sipheron.com" className="text-purple-400 hover:text-purple-300">legal@sipheron.com</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">10. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify registered users by email of any material changes. Continued use of SipHeron VDR after changes constitutes acceptance of the updated policy.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">11. Contact Us</h2>
                        <p>For privacy-related questions or to exercise your rights:</p>
                        <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-white font-medium">SipHeron VDR</p>
                            <p className="mt-1">Email: <a href="mailto:legal@sipheron.com" className="text-purple-400 hover:text-purple-300">legal@sipheron.com</a></p>
                            <p className="mt-1">Website: <a href="https://sipheron.com" className="text-purple-400 hover:text-purple-300">sipheron.com</a></p>
                        </div>
                    </section>

                </div>

                {/* Footer links */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                    <a href="/legal/terms" className="hover:text-purple-400 transition-colors">Terms of Service</a>
                    <a href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</a>
                    <a href="https://sipheron.com" className="hover:text-purple-400 transition-colors">sipheron.com</a>
                </div>
            </div>
        </div>
    );
}
