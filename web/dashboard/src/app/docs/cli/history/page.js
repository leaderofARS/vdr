
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "sipheron-vdr history" };

export default function Page() {
    return (
        <div>
            
<h1>sipheron-vdr history</h1>
<p>Description: Executes the history workflow locally without mutating upstream variables.</p>
<h2>Usage Syntax</h2>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr history [options]</CodeBlock>
<h2>Options</h2>
<ParamTable>
    <ParamRow name="--dry-run" type="boolean" required={false}>Evaluates payload safely without broadcasting to RPC nodes.</ParamRow>
    <ParamRow name="--force" type="boolean" required={false}>Ignores localized permission warnings.</ParamRow>
</ParamTable>
<h2>Output Format</h2>
<CodeBlock language="json" filename="Terminal">{`{
  "status": "success",
  "command": "history"
}`}</CodeBlock>
        
            <DocsPrevNext prev={{ title: 'sipheron-vdr status', href: '/docs/cli/status' }} next={{ title: 'sipheron-vdr revoke', href: '/docs/cli/revoke' }} />
        </div>
    );
}
    