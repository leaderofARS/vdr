export const metadata = {
    title: 'Terms of Service — SipHeron VDR',
    description: 'Terms of Service for SipHeron VDR blockchain document verification platform.',
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12">
                    <a href="https://app.sipheron.com" className="text-purple-400 text-sm hover:text-purple-300 mb-8 inline-block">
                        ← Back to SipHeron
                    </a>
                    <h1 className="text-4xl font-bold text-white mt-4">Terms of Service</h1>
                    <p className="text-gray-400 mt-2 text-sm">Effective: March 1, 2026 · Last updated: March 1, 2026</p>
                </div>

                <div className="space-y-10 text-gray-300 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing or using SipHeron VDR ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. These terms apply to all users including organizations and their members.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
                        <p>SipHeron VDR is a blockchain-based document verification platform that allows organizations to anchor SHA-256 cryptographic hashes of documents to the Solana blockchain. The Service provides:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                            <li>Document hash anchoring to the Solana blockchain</li>
                            <li>Public verification of document authenticity</li>
                            <li>API access for programmatic integration</li>
                            <li>Organization and team management</li>
                            <li>Document registry and audit trail</li>
                        </ul>
                        <p className="mt-3 text-yellow-400/80 text-sm border border-yellow-400/20 bg-yellow-400/5 rounded-lg p-3">
                            ⚠️ SipHeron VDR is currently deployed on Solana Devnet. Mainnet deployment is planned for a future release. Devnet data may be reset at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Account Registration</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>You must provide accurate and complete information when creating an account</li>
                            <li>You are responsible for maintaining the security of your account credentials and API keys</li>
                            <li>You must notify us immediately of any unauthorized use of your account</li>
                            <li>One person or legal entity may not maintain more than one free account</li>
                            <li>You must be at least 16 years of age to use this Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Acceptable Use</h2>
                        <p>You agree not to use SipHeron VDR to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                            <li>Anchor hashes of illegal, fraudulent, or harmful content</li>
                            <li>Impersonate another person or organization</li>
                            <li>Attempt to circumvent rate limits or security measures</li>
                            <li>Perform automated attacks or denial-of-service attacks</li>
                            <li>Reverse engineer or attempt to extract the source code of the Service</li>
                            <li>Resell or sublicense access to the Service without written permission</li>
                            <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Blockchain and Immutability</h2>
                        <p>You acknowledge and understand that:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                            <li>Document hashes anchored to the Solana blockchain are <span className="text-white font-medium">permanent and cannot be deleted</span></li>
                            <li>Blockchain transactions are public and visible to anyone</li>
                            <li>SipHeron VDR does not store the actual contents of your documents — only cryptographic hashes</li>
                            <li>You are solely responsible for ensuring you have the right to anchor any document hash</li>
                            <li>Revoking a hash in SipHeron VDR marks it as revoked in our registry but does not remove it from the blockchain</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. API Usage</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>API keys are provided for programmatic access to the Service</li>
                            <li>You are responsible for all activity that occurs under your API keys</li>
                            <li>API keys must not be shared publicly or committed to version control</li>
                            <li>We reserve the right to rate limit or revoke API keys that violate these terms</li>
                            <li>API rate limits are enforced per organization and are subject to change</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Intellectual Property</h2>
                        <p>The SipHeron VDR platform, including its design, code, and branding, is owned by SipHeron and protected by intellectual property laws. You retain all rights to your own documents and data. By using the Service, you grant us a limited license to process your data solely to provide the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Disclaimer of Warranties</h2>
                        <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                        <p className="mt-3">We do not warrant that the Service will be uninterrupted, error-free, or that defects will be corrected. The Solana network is operated by third parties and we have no control over its availability or performance.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">9. Limitation of Liability</h2>
                        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, SIPHERON VDR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.</p>
                        <p className="mt-3">Our total liability to you for any claims arising from these Terms or your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">10. Termination</h2>
                        <p>We reserve the right to suspend or terminate your account at any time for violation of these Terms. You may terminate your account at any time by contacting us. Upon termination:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                            <li>Your access to the Service will be revoked immediately</li>
                            <li>Your API keys will be permanently disabled</li>
                            <li>Your personal data will be deleted per our Privacy Policy</li>
                            <li>Blockchain data remains permanently on-chain</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">11. Changes to Terms</h2>
                        <p>We reserve the right to modify these Terms at any time. We will notify users by email of material changes at least 14 days before they take effect. Continued use of the Service after changes take effect constitutes acceptance of the new Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">12. Governing Law</h2>
                        <p>These Terms are governed by and construed in accordance with applicable law. Any disputes arising from these Terms shall be resolved through binding arbitration or in courts of competent jurisdiction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">13. Contact</h2>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-white font-medium">SipHeron VDR</p>
                            <p className="mt-1">Email: <a href="mailto:legal@sipheron.com" className="text-purple-400 hover:text-purple-300">legal@sipheron.com</a></p>
                            <p className="mt-1">Website: <a href="https://sipheron.com" className="text-purple-400 hover:text-purple-300">sipheron.com</a></p>
                        </div>
                    </section>

                </div>

                {/* Footer links */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                    <a href="/legal/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
                    <a href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</a>
                    <a href="https://app.sipheron.com" className="hover:text-purple-400 transition-colors">sipheron.com</a>
                </div>
            </div>
        </div>
    );
}
