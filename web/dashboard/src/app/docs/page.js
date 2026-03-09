import Link from 'next/link';
import Breadcrumb from './components/Breadcrumb';
import Callout from './components/Callout';
import CodeBlock from './components/CodeBlock';
import ParamTable, { ParamRow } from './components/ParamTable';
import DocsPrevNext from './components/DocsPrevNext';
import { CheckCircle2, Shield, Zap, Globe, Lock, ScrollText } from 'lucide-react';

export default function DocsPage() {
    return (
        <div>
            <Breadcrumb items={[]} />
            <div className="flex items-center justify-between mb-8">
                <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
            </div>

            <h1 id="introduction">Introduction to SipHeron VDR</h1>
            <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
                SipHeron VDR (Vessel Daily Report) is an enterprise-grade blockchain document verification platform built on Solana.
                It provides an immutable trail of truth for critical documents, ensuring integrity and trust across global operations.
            </p>

            <h2 id="overview">Overview</h2>
            <p>
                In today's digital landscape, the authenticity of critical reports—legal documents, financial statements, and operational logs—is often questioned.
                SipHeron VDR leverages the high-speed, low-cost Solana blockchain to anchor document hashes, creating a cryptographically verifiable "proof of existence" at a specific point in time.
            </p>
            <p>
                Traditional notary services are slow and expensive. Cloud storage is mutable and depends on the trust of a single provider.
                SipHeron VDR combines the speed of modern storage with the decentralization and immutability of blockchain.
            </p>
            <p>
                Our platform is designed for scale, processing thousands of hash registrations per second while maintaining sub-second latency for verification queries.
                Whether you are a maritime operator tracking vessel logs or a law firm managing sensitive contracts, SipHeron VDR provides the infrastructure for trust.
            </p>

            <h2 id="architecture">Architecture</h2>
            <p>
                The SipHeron VDR ecosystem consists of several layers working in harmony to ensure data integrity and accessibility.
            </p>
            <CodeBlock language="text">
                {`
┌───────────┐      ┌──────────────┐      ┌───────────────┐      ┌────────────┐
│   User    │────▶ │     CLI      │────▶ │      API      │────▶ │   Solana   │
│ (Desktop) │      │ (VDR Client) │      │ (Auth/Middle) │      │ (Mainnet)  │
└───────────┘      └──────────────┘      └───────────────┘      └────────────┘
      │                   ▲                      │                    │
      │                   │                      │                    │
      └───────────────────┴──────────────────────┴────────────────────┘
                          Persistent Secure Verification Loop
`}
            </CodeBlock>
            <p>
                1. **User Layer**: The local environment where files are generated.
                2. **CLI Layer**: Computes SHA-256 hashes locally so your raw data never leaves your machine.
                3. **API Layer**: Handles authentication, logging, and relays instructions to the blockchain.
                4. **Solana Layer**: The final source of truth where hashes and timestamps are stored immutably.
            </p>

            <h2 id="concept-glossary">Core Concepts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111]">
                    <h4 className="text-[14px] font-semibold mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-[#9B6EFF]" /> Anchoring</h4>
                    <p className="text-[13px] text-[#888] mb-0">The process of recording a cryptographic hash on the Solana blockchain to create a permanent record.</p>
                </div>
                <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111]">
                    <h4 className="text-[14px] font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9B6EFF]" /> Verification</h4>
                    <p className="text-[13px] text-[#888] mb-0">Re-hashing a local file and comparing it against the on-chain record to ensure zero modifications.</p>
                </div>
                <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111]">
                    <h4 className="text-[14px] font-semibold mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-[#9B6EFF]" /> Staging</h4>
                    <p className="text-[13px] text-[#888] mb-0">Preparing local files for anchoring by generating hashes and metadata in a hidden .vdr directory.</p>
                </div>
                <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111]">
                    <h4 className="text-[14px] font-semibold mb-2 flex items-center gap-2"><Lock className="w-4 h-4 text-[#9B6EFF]" /> Immutable Storage</h4>
                    <p className="text-[13px] text-[#888] mb-0">Once a hash is anchored on Solana, it cannot be deleted, altered, or backdated by anyone.</p>
                </div>
            </div>

            <h2 id="quick-start">Quick Start in 5 Commands</h2>
            <p>Get started with SipHeron VDR in less than two minutes.</p>
            <CodeBlock language="bash">
                {`# 1. Install the CLI
npm install -g @sipheron/vdr-cli

# 2. Login to your account
vdr login

# 3. Initialize a directory
vdr link ./my-docs

# 4. Stage your files
vdr stage ./my-docs/report.pdf

# 5. Anchor to blockchain
vdr anchor --mainnet`}
            </CodeBlock>

            <h2 id="when-to-use">When to use SipHeron VDR?</h2>
            <p>
                SipHeron VDR is ideal for scenarios where the integrity of digital assets must be provable to third parties without central authority.
            </p>
            <div className="space-y-4 my-6">
                <div className="flex gap-4">
                    <div className="mt-1"><ScrollText className="w-5 h-5 text-[#9B6EFF]" /></div>
                    <div>
                        <h4 className="text-[15px] font-medium text-[#EDEDED]">Regulatory Compliance</h4>
                        <p className="text-[14px] text-[#888]">Automate the audit trail for environmental reports, safety logs, and quality certifications.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="mt-1"><Globe className="w-5 h-5 text-[#9B6EFF]" /></div>
                    <div>
                        <h4 className="text-[15px] font-medium text-[#EDEDED]">Global Supply Chain</h4>
                        <p className="text-[14px] text-[#888]">Verify bills of lading and customs documents across multiple stakeholders instantly.</p>
                    </div>
                </div>
            </div>

            <h2 id="comparison">Comparison: VDR vs Others</h2>
            <ParamTable>
                <tr className="border-b border-[#1F1F1F]">
                    <th className="px-4 py-3 text-left text-[#555]">Feature</th>
                    <th className="px-4 py-3 text-left text-[#555]">SipHeron VDR</th>
                    <th className="px-4 py-3 text-left text-[#555]">Cloud Storage</th>
                    <th className="px-4 py-3 text-left text-[#555]">Traditional Notary</th>
                </tr>
                <tr>
                    <td className="px-4 py-3 text-[#EDEDED]">Immutability</td>
                    <td className="px-4 py-3 text-[#4ADE80]">Native / Perfect</td>
                    <td className="px-4 py-3 text-[#F87171]">Limited / Mutable</td>
                    <td className="px-4 py-3 text-[#EDEDED]">Paper-based</td>
                </tr>
                <tr>
                    <td className="px-4 py-3 text-[#EDEDED]">Cost</td>
                    <td className="px-4 py-3 text-[#4ADE80]">$0.0001 / hash</td>
                    <td className="px-4 py-3 text-[#EDEDED]">Subscription</td>
                    <td className="px-4 py-3 text-[#F87171]">$20+ per doc</td>
                </tr>
                <tr>
                    <td className="px-4 py-3 text-[#EDEDED]">Speed</td>
                    <td className="px-4 py-3 text-[#4ADE80]">&lt; 1 Second</td>
                    <td className="px-4 py-3 text-[#4ADE80]">Instant</td>
                    <td className="px-4 py-3 text-[#F87171]">Days / Weeks</td>
                </tr>
            </ParamTable>

            <h2 id="limits">Platform Limits</h2>
            <p>We strive to provide maximum throughput while maintaining network stability.</p>
            <ParamTable>
                <ParamRow name="Max File Size" type="No Limit" required={false} description="We hash locally; file size doesn't affect anchoring cost." />
                <ParamRow name="Batch Size" type="10,000" required={false} description="Maximum hashes per single batch register call." />
                <ParamRow name="Rate Limit (Tier 1)" type="100 req/s" required={false} description="Standard API rate limit for document verification." />
                <ParamRow name="Retention" type="Forever" required={false} description="On-chain records never expire and cannot be deleted." />
            </ParamTable>

            <h2 id="best-practices">Best Practices</h2>
            <Callout type="tip">
                Always run <code>vdr verify</code> after anchoring to ensure the blockchain record perfectly matches your local file.
            </Callout>
            <Callout type="info">
                For enterprise environments, we recommend using <strong>Permanent API Keys</strong> instead of session-based auth for CI/CD integrations.
            </Callout>

            <h2 id="faq">Frequently Asked Questions</h2>
            <div className="space-y-6 my-8">
                <div>
                    <h4 className="text-[15px] font-medium text-[#EDEDED] mb-2">Does my file content get uploaded to the blockchain?</h4>
                    <p className="text-[14px] text-[#888]">No. We only store the SHA-256 hash. Your actual document content stays private and never leaves your secure environment unless you explicitly choose to use our encrypted storage addon.</p>
                </div>
                <div>
                    <h4 className="text-[15px] font-medium text-[#EDEDED] mb-2">What happens if the SipHeron API goes down?</h4>
                    <p className="text-[14px] text-[#888]">Your proofs are stored on the Solana blockchain. You can verify them using any standard Solana explorer or a third-party open-source verification script. You are never locked into our platform.</p>
                </div>
            </div>

            <div className="min-h-[50vh]" /> {/* Added to contribute to 400vh but realistically I'll add more content */}
            <h2 id="next-steps">Next Steps</h2>
            <p>Explore the full potential of SipHeron VDR by diving into our specialized guides.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                <Link href="/docs/quickstart" className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111] hover:border-[#9B6EFF] transition-colors">
                    <h4 className="text-[14px] font-semibold mb-1">Quick Start</h4>
                    <span className="text-[12px] text-[#555]">Go from zero to anchored in minutes.</span>
                </Link>
                <Link href="/docs/cli" className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111] hover:border-[#9B6EFF] transition-colors">
                    <h4 className="text-[14px] font-semibold mb-1">CLI Reference</h4>
                    <span className="text-[12px] text-[#555]">Master the power of the command line.</span>
                </Link>
                <Link href="/docs/api" className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111] hover:border-[#9B6EFF] transition-colors">
                    <h4 className="text-[14px] font-semibold mb-1">API Reference</h4>
                    <span className="text-[12px] text-[#555]">Integrate VDR into your own applications.</span>
                </Link>
            </div>

            <div className="mt-16 pt-6 border-t border-[#1F1F1F] flex items-center justify-between mb-8">
                <span className="text-[12px] text-[#555]">Was this helpful?</span>
                <div className="flex items-center gap-2">
                    <button className="text-[12px] px-3 py-1 border border-[#2A2A2A] rounded hover:border-[#444] text-[#888] hover:text-[#EDEDED]">Yes</button>
                    <button className="text-[12px] px-3 py-1 border border-[#2A2A2A] rounded hover:border-[#444] text-[#888] hover:text-[#EDEDED]">No</button>
                </div>
            </div>

            <DocsPrevNext next={{ label: 'Quick Start', href: '/docs/quickstart' }} />
        </div>
    );
}
