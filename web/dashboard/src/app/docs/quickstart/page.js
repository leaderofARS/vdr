import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export const metadata = {
    title: 'Quickstart Guide | SipHeron VDR',
    description: 'Learn how to install the SipHeron VDR CLI and anchor your first document on Solana in minutes.',
};

export default function QuickstartPage() {
    return (
        <>
            <h1>Quickstart Guide</h1>
            <p className="lead text-xl text-gray-300">
                This guide provides a comprehensive, step-by-step walkthrough for setting up the SipHeron VDR CLI and anchoring your first document on the Solana blockchain. By the end of this tutorial, you will have a cryptographically verifiable proof of existence for a local file.
            </p>

            <Callout type="tip">
                <strong>Prerequisites:</strong> Before proceeding, ensure you have <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js (v16+)</a> and <code>npm</code> installed on your local environment. You will also need a SipHeron account, which you can create via the <a href="/dashboard">Dashboard</a>.
            </Callout>

            <h2>1. Install the CLI Tool</h2>
            <p>
                The <code>sipheron-vdr</code> CLI is the primary interface for developers and system administrators to interact with the Verifiable Document Registry. It handles local file hashing, wallet management, and communication with the SipHeron API.
            </p>
            <p>
                Install the package globally using npm to access the command from any directory on your system:
            </p>
            <CodeBlock
                language="bash"
                code="npm install -g sipheron-vdr"
            />
            <p>
                Once installed, verify the installation by checking the version number. This ensures the binary is correctly mapped to your system's PATH:
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr --version"
            />

            <h2>2. Initialize Your Environment</h2>
            <p>
                Before you can anchor documents, you must initialize your local environment. This process creates a secure configuration directory (typically <code>~/.sipheron</code>) and generates a local workspace.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr init"
            />
            <p>
                During initialization, you will be prompted to set a master passphrase. This passphrase is used to encrypt your local session tokens and any derived cryptographic material using AES-256-GCM. <strong>Do not lose this passphrase;</strong> it is required for all subsequent authoritative commands.
            </p>

            <h2>3. Link Your Account</h2>
            <p>
                To associate your local CLI actions with your SipHeron organization, you need to authenticate using an API key generated from the SipHeron Dashboard.
            </p>
            <ol className="list-decimal space-y-4 ml-6 my-6">
                <li>Navigate to the <strong>Settings &gt; API Keys</strong> section of your Dashboard.</li>
                <li>Generate a new "Provisioning Key" with <code>write</code> permissions.</li>
                <li>Copy the generated key (it will look like <code>sh_live_...</code>).</li>
            </ol>
            <p>
                Run the link command and paste your API key when prompted:
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr link"
            />

            <h2>4. Stage and Anchor Your First Document</h2>
            <p>
                Anchoring a document is a two-step process: <strong>Staging</strong> and <strong>Anchoring</strong>. Staging calculates the hash locally and prepares the metadata, while Anchoring commits that hash to the Solana blockchain.
            </p>

            <h3>Staging the File</h3>
            <p>
                Identify a document you wish to protect. For this example, we will use a file named <code>agreement.pdf</code>. Staging ensures that the file is read and its SHA-256 hash is computed without transmitting the file content.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr stage ./agreement.pdf"
            />
            <p>
                The output will display the unique SHA-256 fingerprint of your document. This is the only information that will ever leave your machine.
            </p>

            <h3>Anchoring to Solana</h3>
            <p>
                Now, commit this fingerprint to the blockchain. This step creates an immutable record on-chain, stamped with the current network time and your identity.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr anchor ./agreement.pdf"
            />

            <Callout type="info">
                <strong>Transaction Finality:</strong> On the Solana network, transactions typically achieve finality in under 400ms. Your document is instantly verifiable across the globe once the transaction is confirmed.
            </Callout>

            <h2>5. Verify Document Integrity</h2>
            <p>
                The most powerful feature of SipHeron VDR is the ability to prove a document's integrity at any time. If even a single bit in <code>agreement.pdf</code> is changed, the verification will fail.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr verify ./agreement.pdf"
            />
            <p>
                A successful verification will return the original registration timestamp, the Solana transaction signature, and the Blockhash of the anchoring event.
            </p>

            <h2>Quick Reference Table</h2>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Command</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Description</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Context</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">init</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Setup local configuration and encryption.</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Run once per machine.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">link</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Authenticate CLI with Dashboard API key.</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Requires SipHeron account.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">anchor</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Hash and commit document to Solana.</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Primary action command.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">status</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Check sync status of local files.</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Monitoring tool.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Troubleshooting Common Issues</h2>
            <h3>API Authentication Errors</h3>
            <p>
                If you receive a <code>401 Unauthorized</code> error, ensure your API key hasn't expired or been revoked in the dashboard. You can re-run <code>sipheron-vdr link</code> to update your credentials.
            </p>

            <h3>Network Connectivity</h3>
            <p>
                Anchoring requires an active internet connection to communicate with <code>api.sipheron.com</code> and the Solana RPC nodes. If you are behind an enterprise firewall, ensure outbound traffic to port 443 is permitted for these domains.
            </p>

            <CodeBlock
                language="bash"
                code={`# Check network status and API reachability
sipheron-vdr diag --network`}
            />

            <h2>Next Steps</h2>
            <p>
                Congratulations! You have successfully anchored and verified your first document using SipHeron VDR. To learn more about the underlying technology, explore the <a href="/docs/concepts">Core Concepts</a> page, or dive into the <a href="/docs/cli/commands">Full Command Reference</a> for advanced automation techniques.
            </p>
        </>
    );
}
