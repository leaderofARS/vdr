import CodeBlock from '@/app/docs/components/CodeBlock';
import Callout from '@/app/docs/components/Callout';
import Endpoint from '@/app/docs/components/Endpoint';
import ParamTable, { ParamRow } from '@/app/docs/components/ParamTable';
import ResponseTabs from '@/app/docs/components/ResponseTabs';
import DocsPrevNext from '@/app/docs/components/DocsPrevNext';

export const metadata = { title: 'sipheron-vdr link' };

export default function Page() {
    return (
        <div>

<h1>sipheron-vdr link</h1>
<p>The link command is a core component of the SipHeron CLI suite. It manages the link lifecycle for your document anchors, ensuring that state transitions are handled atomically and securely.</p>
<p>When executing this command, the CLI interacts with your local configuration and the Solana RPC node to provide real-time updates on the status of your cryptographic entries.</p>

<h2>Usage Syntax</h2>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr link [options]</CodeBlock>

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
<CodeBlock language="bash" filename="Terminal">sipheron-vdr link --force</CodeBlock>

<h2>Output Format</h2>
<CodeBlock language="json" filename="Terminal">{`{
  "status": "success",
  "command": "link",
  "timestamp": "2026-03-10T00:45:00Z"
}`}</CodeBlock>
        
            <DocsPrevNext prev={{ title: 'CLI Overview', href: '/docs/cli' }} next={{ title: 'sipheron-vdr stage', href: '/docs/cli/stage' }} />
        </div>
    );
}
