import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export const metadata = {
    title: 'CLI Overview | SipHeron VDR Documentation',
    description: 'Understand the sipheron-vdr CLI tool, global configuration, and architecture of the local document registry interface.',
};

export default function CliOverviewPage() {
    return (
        <>
            <h1>CLI Overview</h1>
            <p className="lead text-xl text-gray-300">
                The <code>sipheron-vdr</code> CLI is a powerful, lightweight toolkit designed for developers, system administrators, and DevOps engineers. It provides the core functionality needed to hash, stage, anchor, and verify documents directly from your local terminal or CI/CD pipelines.
            </p>

            <Callout type="info">
                <strong>Open Source Core:</strong> The CLI is written in Node.js and is available for Linux, macOS, and Windows. It handles all cryptographic operations locally, ensuring that raw file data never leaves your environment.
            </Callout>

            <h2>Core Functions and Capabilities</h2>
            <p>
                While the SipHeron Dashboard provides a friendly UI for document management, the CLI is built for <strong>scale and automation</strong>. It allows you to process thousands of files synchronously or asynchronously without manual intervention.
            </p>

            <p>Key capabilities include:</p>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Local Hash Generation:</strong> Compute SHA-256 fingerprints of any file size in-memory.</li>
                <li><strong>On-Chain Anchoring:</strong> Direct integration with the Solana blockchain through the SipHeron API relay.</li>
                <li><strong>Deterministic Verification:</strong> Re-verify documents even if the SipHeron API is offline by querying Solana RPCs.</li>
                <li><strong>Workspace Management:</strong> Support for multiple organization profiles and environment configurations.</li>
                <li><strong>Scriptability:</strong> JSON output support (<code>--json</code>) for seamless integration with other UNIX tools.</li>
            </ul>

            <h2>Installation and Requirements</h2>
            <p>
                The CLI requires <strong>Node.js (v16 or higher)</strong>. To install it globally, use the following command:
            </p>
            <CodeBlock
                language="bash"
                code="npm install -g sipheron-vdr"
            />
            <p>
                Ensure that your npm global binaries directory is in your system's PATH. You can verify this by running:
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr --version"
            />

            <h3>Operating System Support</h3>
            <p>
                We provide first-class support for the following environments:
            </p>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">OS</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Requirement</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Recommendation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300">Ubuntu / Debian / RHEL</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Node JS 16+</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Utilize <code>nvm</code> for versioning.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300">macOS (Intel/Apple)</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Homebrew / Node JS 16+</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Full compatibility with M1/M2/M3.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300">Windows 10 / 11</td>
                            <td className="py-3 px-4 text-sm text-gray-400">PowerShell / WSL2</td>
                            <td className="py-3 px-4 text-sm text-gray-400">WSL2 is recommended for CI performance.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Configuration and File Structure</h2>
            <p>
                The CLI stores its configuration, encrypted keys, and local registration logs in the <strong>~/.sipheron</strong> directory. You should treat this directory with the same security as you would your <code>~/.ssh</code> folder.
            </p>
            <p>Important files in the configuration directory include:</p>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>config.json:</strong> Global settings for API base URL, network (Mainnet-beta/Devnet), and default organization.</li>
                <li><strong>keys.enc:</strong> AES-256-GCM encrypted file containing your SipHeron session tokens and secondary keys.</li>
                <li><strong>registry.sqlite:</strong> A local cache of your staged and anchored documents for fast status checks.</li>
            </ul>

            <Callout type="warning">
                <strong>Never share your ~/.sipheron/keys.enc file.</strong> While it is encrypted, a brute-force attack on a weak master passphrase could potentially expose your organizational API keys.
            </Callout>

            <h2>Global Flags</h2>
            <p>
                All <code>sipheron-vdr</code> commands support a set of global flags that modify the tool's behavior, output format, and execution context.
            </p>

            <CodeBlock
                language="bash"
                code={`# Examples of global flag usage
sipheron-vdr anchor ./doc.pdf --network devnet --verbose
sipheron-vdr status --json > output.json`}
            />

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Flag</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Shorthand</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">--network</td>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">-n</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Switch between <code>mainnet</code> and <code>devnet</code>.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">--json</td>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">-j</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Return output in structured JSON format.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">--verbose</td>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">-v</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Enable detailed logging (useful for debugging).</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">--config</td>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">-c</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Specify an alternative configuration file path.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Automation and CI/CD Pipelines</h2>
            <p>
                The CLI is designed to be head-less. When running in environments like GitHub Actions, CircleCI, or GitLab CI, you can provide configuration via environment variables instead of manual <code>link</code> steps.
            </p>

            <CodeBlock
                language="yaml"
                code={`# Example GitHub Actions step
- name: Anchor build artifact
  run: |
    export SIPHERON_API_KEY=\${{ secrets.SIPHERON_API_KEY }}
    sipheron-vdr anchor ./dist/package.tar.gz --network mainnet`}
            />

            <Callout type="tip">
                <strong>Headless Mode:</strong> When the CLI detects that no TTY is available (such as in a CI runner), it will automatically enter headless mode, suppressing interactive prompts and using environment variables exclusively.
            </Callout>

            <h2>Next Step: Command Reference</h2>
            <p>
                For an exhaustive list of every available command and its specific flags, visit the <a href="/docs/cli/commands">Full Command Reference</a>. If you are interested in the security model of the CLI, explore the <a href="/docs/cli/security">Security Model</a> documentation.
            </p>
        </>
    );
}
