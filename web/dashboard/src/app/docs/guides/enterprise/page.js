import DocLayout from '../../components/DocLayout';
import { Building2, Shield, Key, Users, Globe, Zap, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'org-structure', title: 'Organization Structure', level: 2 },
    { id: 'custom-rpc', title: 'Custom RPC Nodes', level: 2 },
    { id: 'key-management', title: 'Key Management Strategies', level: 2 },
    { id: 'iam-integration', title: 'SSO & IAM Integration', level: 2 },
    { id: 'high-availability', title: 'High Availability (HA)', level: 2 },
    { id: 'onboarding-checklist', title: 'Onboarding Checklist', level: 2 },
];

export default function GuideEnterprisePage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Guide: Enterprise Setup & Governance</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    A comprehensive blueprint for deploying SipHeron VDR at scale within large organizations.
                </p>

                <h2 id="org-structure" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Organization Structure
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    SipHeron supports multi-tenant organization structures. For larger firms, we recommend creating separate SipHeron Organizations for different departments (e.g., Legal, Finance, R&D) to ensure clear budget tracking and access control.
                </p>

                <h2 id="custom-rpc" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Custom RPC Nodes
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    Enterprise customers can bypass SipHeron's shared Solana infrastructure and use their own private RPC nodes (e.g., from Triton, Helius, or QuickNode). This ensures maximum uptime and eliminates rate-limiting during high-volume anchoring events.
                </p>

                <h2 id="key-management" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Key Management Strategies
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                        <Users className="text-blue-400 mb-4" size={24} />
                        <h4 className="text-white font-bold mb-2">Team-Based Keys</h4>
                        <p className="text-xs text-gray-400">Issue separate API keys for each automated service. If one server is compromised, you only need to revoke one key.</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                        <Shield className="text-green-400 mb-4" size={24} />
                        <h4 className="text-white font-bold mb-2">Scoped Permissions</h4>
                        <p className="text-xs text-gray-400">Use "Anchor-Only" keys for CI/CD workers and "Read-Only" keys for dashboards.</p>
                    </div>
                </div>

                <h2 id="iam-integration" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    SSO & IAM Integration
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    SipHeron Enterprise supports SAML 2.0 and OIDC (Okta, Azure AD, Google Workspace). Contact your account manager to enable SSO for your organization to ensure user lifecycle management is centralized.
                </p>

                <h2 id="high-availability" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    High Availability (HA)
                </h2>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-12 flex gap-4">
                    <Zap className="text-purple-400 shrink-0 mt-1" />
                    <div>
                        <p className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Batch Queues</p>
                        <p className="text-xs text-purple-200/80 leading-5">
                            For systems generating 1,000+ documents per hour, integrate our <strong>Batch Queue API</strong>. This handles retries and transaction coalescing, ensuring your application doesn't block while waiting for blockchain confirmation.
                        </p>
                    </div>
                </div>

                <h2 id="onboarding-checklist" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Onboarding Checklist
                </h2>
                <div className="space-y-3 mb-24">
                    {[
                        "Create Department-specific Organizations",
                        "Assign Admin roles to Security and IT Leads",
                        "Set up scoped API keys for CI/CD pipelines",
                        "Configure Webhook endpoints for internal audit logs",
                        "Integrate Verification URLs into Client Portals",
                        "Perform an initial vulnerability scan of local CLI environments"
                    ].map((item, i) => (
                        <div key={i} className="flex gap-3 items-center p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                            <div className="w-5 h-5 rounded-full border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-400">{i + 1}</div>
                            <span className="text-sm text-gray-300">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </DocLayout>
    );
}
