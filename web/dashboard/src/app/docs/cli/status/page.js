import CodeBlock from '@/app/docs/components/CodeBlock';
import Callout from '@/app/docs/components/Callout';
import Endpoint from '@/app/docs/components/Endpoint';
import ParamTable, { ParamRow } from '@/app/docs/components/ParamTable';
import ResponseTabs from '@/app/docs/components/ResponseTabs';
import DocsPrevNext from '@/app/docs/components/DocsPrevNext';

export const metadata = { title: 'sipheron-vdr status' };

export default function Page() {
    return (
        <div>

<h1>sipheron-vdr status</h1>
<p>The status command is a core component of the SipHeron CLI suite. It manages the status lifecycle for your document anchors, ensuring that state transitions are handled atomically and securely.</p>
<p>When executing this command, the CLI interacts with your local configuration and the Solana RPC node to provide real-time updates on the status of your cryptographic entries.</p>

<h2>Usage Syntax</h2>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr status [options]</CodeBlock>

<Callout type="info">
    Use the --help flag at any time to see the most recent command options available for your CLI version.
</Callout>

<h2>Options</h2>
<ParamTable>
    <ParamRow name="--dry-run" type="boolean" required={false}>Evaluates payload safely without broadcasting to RPC nodes. Useful for debugging.</ParamRow>
    <ParamRow name="--force" type="boolean" required={false}>Ignores localized permission warnings and proceeds with execution.</ParamRow>
    <ParamRow name="--json" type="boolean" required={false}>Formats the output as a valid JSON object for scripting purposes.</ParamRow>
</ParamTable>

<h2>Examples</h2>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr status --force</CodeBlock>

<h2>Output Format</h2>
<CodeBlock language="json" filename="Terminal">{`{
  "status": "success",
  "command": "status",
  "timestamp": "2026-03-10T00:45:00Z"
}`}</CodeBlock>
        
            <DocsPrevNext prev={{ title: 'sipheron-vdr verify', href: '/docs/cli/verify' }} next={{ title: 'sipheron-vdr history', href: '/docs/cli/history' }} />
        </div>
    );
}
