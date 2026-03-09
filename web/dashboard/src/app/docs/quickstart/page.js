import Breadcrumb from '../components/Breadcrumb';
import Callout from '../components/Callout';
import CodeBlock from '../components/CodeBlock';
import DocsPrevNext from '../components/DocsPrevNext';
import Link from 'next/link';

export default function QuickStart() {
    return (
        <div>
            <Breadcrumb items={[{ label: 'Quick Start', href: '/docs/quickstart' }]} />
            <div className="flex items-center justify-between mb-8">
                <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
            </div>

            <h1 id="quick-start">Quick Start</h1>
            <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
                Learn how to get up and running with SipHeron VDR in minutes. This guide covers installation, authentication, and your first anchored proof.
            </p>

            <h2 id="prerequisites">Prerequisites</h2>
            <p>Before you begin, ensure you have the following installed on your machine:</p>
            <ul className="list-disc pl-5 mb-8 text-[#888]">
                <li>Node.js 18.x or higher</li>
                <li>npm or yarn package manager</li>
                <li>A free SipHeron VDR account</li>
                <li>Optional: A Solana wallet (Phantom, Solflare) for advanced features</li>
            </ul>

            <h2 id="installation">1. Install the CLI</h2>
            <p>The SipHeron VDR CLI is the primary way to interact with our platform. Install it globally via npm:</p>
            <CodeBlock language="bash">
                npm install -g @sipheron/vdr-cli
            </CodeBlock>
            <p>Verify the installation by checking the version:</p>
            <CodeBlock language="bash">
                vdr --version
                # Output: SipHeron VDR CLI v0.9.4
            </CodeBlock>

            <h2 id="auth">2. Authenticate</h2>
            <p>Login to your account to authorize your machine. This will open a browser window for secure authentication.</p>
            <CodeBlock language="bash">
                vdr login
            </CodeBlock>
            <Callout type="info">
                If you are on a headless server, use <code>vdr login --headless</code> to authenticate via an API key manually.
            </Callout>

            <h2 id="link">3. Initialize Project</h2>
            <p>Navigate to the directory containing your documents and initialize it for VDR tracking.</p>
            <CodeBlock language="bash">
                cd ~/documents/reports
                vdr link .
            </CodeBlock>
            <p>This creates a hidden <code>.vdr</code> directory that stores your local hash state and configuration.</p>

            <h2 id="stage">4. Stage Your Files</h2>
            <p>Staging computes the SHA-256 hash of your files locally. Your file content is never sent to our servers.</p>
            <CodeBlock language="bash">
                vdr stage q1-financials.pdf
            </CodeBlock>
            <p>Expected output:</p>
            <CodeBlock language="text">
                {`✔ Hash computed for q1-financials.pdf
✔ Staged for anchoring [1/1 files]
SHA-256: 7f83b1...3a9c42`}
            </CodeBlock>

            <h2 id="anchor">5. Anchor to Blockchain</h2>
            <p>The final step is to push your staged hashes to the Solana blockchain. This creates the immutable proof.</p>
            <CodeBlock language="bash">
                vdr anchor
            </CodeBlock>
            <p>You will receive a transaction signature and a link to the Solana Explorer.</p>
            <CodeBlock language="text">
                {`🚀 Anchoring to Solana Mainnet...
✔ Transaction confirmed!
Signature: 3mZ5...8zY2
Explorer: https://explorer.solana.com/tx/3mZ5...`}
            </CodeBlock>

            <h2 id="verify">6. Verify Your Document</h2>
            <p>Anyone with access to the file can now verify its integrity against the blockchain record.</p>
            <CodeBlock language="bash">
                vdr verify q1-financials.pdf
            </CodeBlock>
            <p>Result:</p>
            <CodeBlock language="text">
                {`✔ INTEGRITY VERIFIED
Anchor Date: Mar 10, 2026, 09:30 AM
Status: Valid & Immutable`}
            </CodeBlock>

            <h2 id="troubleshooting">Troubleshooting</h2>
            <div className="space-y-4 my-8">
                <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111]">
                    <h4 className="text-[14px] font-semibold mb-2">Error: Command not found</h4>
                    <p className="text-[13px] text-[#888]">Ensure that your npm global binaries directory is in your system PATH.</p>
                </div>
                <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111]">
                    <h4 className="text-[14px] font-semibold mb-2">Error: Insufficient Funds</h4>
                    <p className="text-[13px] text-[#888]">If using your own wallet, ensure you have at least 0.002 SOL for transaction fees.</p>
                </div>
            </div>

            <div className="min-h-[100vh]" />

            <h2 id="next">Next Steps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                <Link href="/docs/cli/anchor" className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111] hover:border-[#9B6EFF] transition-colors">
                    <h4 className="text-[14px] font-semibold mb-1">Anchor Deep Dive</h4>
                    <span className="text-[12px] text-[#555]">Learn about all the flags and options for anchoring.</span>
                </Link>
                <Link href="/docs/api" className="p-4 rounded-lg border border-[#2A2A2A] bg-[#111] hover:border-[#9B6EFF] transition-colors">
                    <h4 className="text-[14px] font-semibold mb-1">API Integration</h4>
                    <span className="text-[12px] text-[#555]">Build custom verification logic into your app.</span>
                </Link>
            </div>

            <DocsPrevNext
                prev={{ label: 'Introduction', href: '/docs' }}
                next={{ label: 'Installation', href: '/docs/getting-started/installation' }}
            />
        </div>
    );
}
