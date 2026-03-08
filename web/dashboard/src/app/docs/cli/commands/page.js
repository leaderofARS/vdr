import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Command Reference | sipheron-vdr CLI',
    description: 'Detailed documentation for every sipheron-vdr CLI command, including stage, anchor, verify, and more.',
};

export default function CommandsPage() {
    return (
        <>
            <h1>CLI Command Reference</h1>
            <p className="lead text-xl text-gray-300">
                This comprehensive reference provides a detailed breakdown of every command available in the <code>sipheron-vdr</code> CLI tool. Our CLI is designed for speed, security, and scriptability, making it the ideal choice for integrating SipHeron VDR into your local development environment or enterprise CI/CD pipelines.
            </p>

            <Callout type="info">
                <strong>Command Format:</strong> The CLI uses the <code>sipheron-vdr &lt;command&gt; [options] [arguments]</code> format. You can use <code>--help</code> with any command to see its specific options and sub-commands.
            </Callout>

            <h2 id="init">init</h2>
            <p>
                Initializes the local <code>sipheron-vdr</code> environment. This command creates the necessary configuration files and local databases used by the tool to track your document registrations and local wallet state.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr init [--path <dir>] [--force] [--quiet]"
            />
            <h3>Options</h3>
            <ul className="list-disc ml-6 my-4 space-y-2 text-sm text-gray-400">
                <li><code>--path, -p</code>: Specify a custom directory for configuration (Defaults to <code>~/.sipheron</code>).</li>
                <li><code>--force, -f</code>: Overwrite existing configuration files without prompting. Use with caution.</li>
                <li><code>--quiet, -q</code>: Suppress all output except for critical errors.</li>
            </ul>
            <CodeBlock
                language="bash"
                code={`# Initialize in a custom location for a service account
sipheron-vdr init --path /opt/sipheron-worker --force`}
            />

            <h2 id="link">link</h2>
            <p>
                Authenticates the CLI with your SipHeron VDR account. This command captures an API key from the dashboard and securely encrypts it into your local configuration vault.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr link [api_key] [--environment <env>]"
            />
            <h3>Options</h3>
            <ul className="list-disc ml-6 my-4 space-y-2 text-sm text-gray-400">
                <li><code>api_key</code>: If not provided, the CLI will enter an interactive prompt mode.</li>
                <li><code>--environment, -e</code>: Set the target environment (<code>production</code>, <code>development</code>).</li>
            </ul>
            <CodeBlock
                language="bash"
                code={`# Link using an environment variable (best for CI/CD)
export SIPHERON_API_KEY=sh_live_...
sipheron-vdr link $SIPHERON_API_KEY`}
            />

            <h2 id="stage">stage</h2>
            <p>
                Computes the SHA-256 hash of a file or directory and stores the fingerprint in the local registry. This command is "write-local, read-only-file"—it does not transmit any file content.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr stage <path> [--recursive] [--meta <json>] [--exclude <glob>]"
            />
            <h3>Options</h3>
            <ul className="list-disc ml-6 my-4 space-y-2 text-sm text-gray-400">
                <li><code>--recursive, -r</code>: If the path is a directory, process all files within including subdirectories.</li>
                <li><code>--meta, -m</code>: Attach optional metadata in JSON format. This metadata is stored in your local registry.</li>
                <li><code>--exclude</code>: A glob pattern of files to ignore during a recursive stage operation.</li>
            </ul>
            <CodeBlock
                language="bash"
                code={`# Stage all PDFs but exclude temporary files
sipheron-vdr stage ./contracts --recursive --exclude "*.tmp" --meta '{"dept": "Legal"}'`}
            />

            <h2 id="anchor">anchor</h2>
            <p>
                Commits a staged document's hash to the Solana blockchain. This command communicates with the SipHeron API to wrap your hash in a signed transation and broadcast it to the network.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr anchor <path> [--batch] [--wait] [--priority <level>]"
            />
            <h3>Options</h3>
            <ul className="list-disc ml-6 my-4 space-y-2 text-sm text-gray-400">
                <li><code>--batch</code>: Automatically group multiple staged files in the path into a single registration request.</li>
                <li><code>--wait, -w</code>: Block the terminal until the transaction reaches full <em>finalized</em> confirmation on Solana.</li>
                <li><code>--priority</code>: Adjust transaction priority fees (<code>low</code>, <code>medium</code>, <code>high</code>).</li>
            </ul>
            <CodeBlock
                language="bash"
                code={`# Anchor and wait for finalized status with high priority
sipheron-vdr anchor ./production_build.zip --wait --priority high`}
            />

            <h2 id="verify">verify</h2>
            <p>
                Checks the integrity of a local file against the on-chain registry. It re-computes the hash of the local file and queries the Solana network for the proof associated with that hash and your organization.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr verify <path> [--remote-only] [--json]"
            />
            <h3>Options</h3>
            <ul className="list-disc ml-6 my-4 space-y-2 text-sm text-gray-400">
                <li><code>--remote-only</code>: Skip local registry checks and force a query to the Solana RPC and SipHeron API.</li>
                <li><code>--json, -j</code>: Return the verification report in structured JSON format for parsing by other tools.</li>
            </ul>
            <CodeBlock
                language="bash"
                code={`# Verify an audit report and extract the timestamp via jq
sipheron-vdr verify report.pdf --json | jq '.timestamp'`}
            />

            <h2 id="revoke">revoke</h2>
            <p>
                Marks an existing document hash as "Revoked" on the blockchain. This is used when a document is superseded, invalidated, or contains an error.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr revoke <hash_or_path> [--reason <text>]"
            />
            <Callout type="warning">
                <strong>Irreversibility:</strong> Revocation is a permanent, non-reversible blockchain action. All future verifications for this hash will return a "Revoked" status with the provided reason. You cannot "un-revoke" a hash.
            </Callout>

            <h2 id="status">status</h2>
            <p>
                Displays the current synchronization status between your local file system and the SipHeron registry. This is helpful for identifying files that have been modified locally since being anchored.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr status [path] [--filter <status>]"
            />
            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Status</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Meaning</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm text-yellow-500 font-mono">staged</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Hash computed locally, not yet anchored to the blockchain.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-green-500 font-mono">anchored</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Hash and metadata successfully committed to the Solana ledger.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-blue-500 font-mono">modified</td>
                            <td className="py-3 px-4 text-sm text-gray-400">The local file has been changed since it was anchored. Verification will fail.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-red-500 font-mono">failed</td>
                            <td className="py-3 px-4 text-sm text-gray-400">An error occurred during the anchoring transaction.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="config">config</h2>
            <p>
                Manages the CLI's internal configuration settings. Use this command to switch between Solana networks (Mainnet/Devnet) or update your default organization.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr config [get|set|list] <key> [value]"
            />
            <CodeBlock
                language="bash"
                code={`# List all current configuration settings
sipheron-vdr config list

# Set the Solana RPC endpoint to a private node
sipheron-vdr config set rpc_url https://solana-mainnet.g.alchemy.com/v2/YOUR-KEY`}
            />

            <h2 id="diag">diag</h2>
            <p>
                Runs a suite of automated diagnostic tests to identify connectivity issues with the SipHeron API, Solana RPC nodes, or local file system permission issues.
            </p>
            <CodeBlock
                language="bash"
                code="sipheron-vdr diag [--full] [--network] [--auth]"
            />

            <Callout type="tip">
                <strong>Piping and Unix Philosophy:</strong> All CLI commands are designed to follow the Unix philosophy. Combine commands for complex workflows: <code>sipheron-vdr status --json | grep "modified" | awk '&#123;print $2&#125;' | xargs sipheron-vdr anchor</code>.
            </Callout>

            <h2>Global Flags</h2>
            <p>These flags are available on all commands and sub-commands.</p>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><code>--verbose, -v</code>: Enable detailed debug logging. Helpful for troubleshooting network issues.</li>
                <li><code>--json, -j</code>: Format all output as structured JSON.</li>
                <li><code>--network, -n</code>: Overwrite the configured network (<code>mainnet</code>, <code>devnet</code>) for the current command.</li>
            </ul>

            <p className="text-sm text-gray-500 italic mt-12 pb-8 border-t border-gray-800 pt-8">
                If you encounter an issue that isn't resolved by the <code>diag</code> command, please reach out to our engineering support team on Slack or via email at support@sipheron.com.
            </p>
        </>
    );
}
