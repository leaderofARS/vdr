import Breadcrumb from '../../components/Breadcrumb';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';
import ParamTable, { ParamRow } from '../../components/ParamTable';
import DocsPrevNext from '../../components/DocsPrevNext';

export default function AnchorPage() {
    return (
        <div>
            <Breadcrumb items={[
                { label: 'CLI Reference', href: '/docs/cli' },
                { label: 'sipheron-vdr anchor' }
            ]} />
            <div className="flex items-center justify-between mb-8">
                <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
            </div>

            <h1 id="anchor">sipheron-vdr anchor</h1>
            <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
                The anchor command is the core of the SipHeron VDR ecosystem. it pushes your locally staged SHA-256 hashes to the Solana blockchain.
            </p>

            <h2 id="synopsis">Synopsis</h2>
            <CodeBlock language="text">
                vdr anchor [options] [files...]
            </CodeBlock>
            <p>
                By default, <code>anchor</code> will process all files in the current staged set that have not yet been anchored.
                You can also specify individual files if you only want to anchor a subset.
            </p>

            <h2 id="options">Options</h2>
            <ParamTable>
                <ParamRow name="--mainnet" type="boolean" required={false} description="Anchor to Solana Mainnet (Default)" />
                <ParamRow name="--devnet" type="boolean" required={false} description="Anchor to Solana Devnet for testing" />
                <ParamRow name="--batch" type="number" required={false} description="Max number of files per transaction (Max 50)" />
                <ParamRow name="--force" type="boolean" required={false} description="Re-anchor files that have already been anchored" />
                <ParamRow name="--silent" type="boolean" required={false} description="Do not output progress to terminal" />
                <ParamRow name="--json" type="boolean" required={false} description="Output results in JSON format" />
            </ParamTable>

            <h2 id="how-it-works">How It Works</h2>
            <p>
                When you run the anchor command, SipHeron VDR performs a multi-step handshake:
            </p>
            <CodeBlock language="text">
                {`1. Retrieve Staged Hashes (from .vdr/staged)
2. Connect to Solana RPC (~150ms)
3. Request Batch Registration from API (~300ms)
4. Sign Transaction (using local or VDR-managed key)
5. Submit to Cluster (~400ms)
6. Confirm Finality (~1-2s)`}
            </CodeBlock>

            <h2 id="examples">Examples</h2>

            <h3 id="anchor-all">Anchor all staged files</h3>
            <CodeBlock language="bash">
                vdr anchor
            </CodeBlock>

            <h3 id="anchor-specific">Anchor specific files to Devnet</h3>
            <CodeBlock language="bash">
                vdr anchor --devnet report.pdf invoice.xml
            </CodeBlock>

            <h3 id="anchor-batch">Anchor with custom batch size</h3>
            <CodeBlock language="bash">
                vdr anchor --batch 10
            </CodeBlock>

            <h2 id="expected-output">Expected Output</h2>
            <CodeBlock language="text">
                {`✔ Preparing batch [12 files]
✔ Validating hashes...
✔ Syncing with Solana...
✔ Transaction: 4kL9p...x9A1 (Confirmed)
✔ 12/12 files successfully anchored.

Total Fee: 0.00045 SOL
Timestamp: 1710059400 (Mar 10, 2026)`}
            </CodeBlock>

            <h2 id="error-codes">Error Codes</h2>
            <ParamTable>
                <ParamRow name="VDR_001" type="AUTH_ERROR" required={false} description="Not logged in. Run 'vdr login' first." />
                <ParamRow name="VDR_002" type="EMPTY_STAGE" required={false} description="No files staged. Run 'vdr stage' first." />
                <ParamRow name="VDR_042" type="DUPLICATE_HASH" required={false} description="File hash already exists on-chain." />
                <ParamRow name="VDR_500" type="NETWORK_ERROR" required={false} description="Unable to reach Solana RPC nodes." />
            </ParamTable>

            <h2 id="best-practices">Best Practices</h2>
            <Callout type="warning">
                Avoid using <code>--force</code> unless you have a specific reason to re-anchor. Solana storage costs are permanent; once anchored, you cannot "un-spend" the fee.
            </Callout>
            <Callout type="tip">
                Use <code>--json</code> when integrating <code>vdr anchor</code> into automated CI/CD pipelines to easily parse the transaction signature.
            </Callout>

            <div className="min-h-[150vh]" />

            <h2 id="faq">FAQ</h2>
            <div className="space-y-6 my-8">
                <div>
                    <h4 className="text-[15px] font-medium text-[#EDEDED] mb-2">Can I anchor files larger than 1GB?</h4>
                    <p className="text-[14px] text-[#888]">Yes. Since we only anchor the SHA-256 hash, the file size does not matter. The hash is always a fixed 64 characters.</p>
                </div>
                <div>
                    <h4 className="text-[15px] font-medium text-[#EDEDED] mb-2">How long does my anchor last?</h4>
                    <p className="text-[14px] text-[#888]">Forever. Solana's data storage (via SipHeron's Rent-Exempt accounts) ensures your proofs remain on-chain indefinitely.</p>
                </div>
            </div>

            <DocsPrevNext
                prev={{ label: 'sipheron-vdr stage', href: '/docs/cli/stage' }}
                next={{ label: 'sipheron-vdr verify', href: '/docs/cli/verify' }}
            />
        </div>
    );
}
