
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "sipheron-vdr verify" };

export default function Page() {
    return (
        <div>
            
<h1>sipheron-vdr verify</h1>
<p>Description: Executes the verify workflow locally without mutating upstream variables.</p>
<h2>Usage Syntax</h2>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr verify [options]</CodeBlock>
<h2>Options</h2>
<ParamTable>
    <ParamRow name="--dry-run" type="boolean" required={false}>Evaluates payload safely without broadcasting to RPC nodes.</ParamRow>
    <ParamRow name="--force" type="boolean" required={false}>Ignores localized permission warnings.</ParamRow>
</ParamTable>
<h2>Output Format</h2>
<CodeBlock language="json" filename="Terminal">{`{
  "status": "success",
  "command": "verify"
}`}</CodeBlock>
        
            <DocsPrevNext prev={{ title: 'sipheron-vdr anchor', href: '/docs/cli/anchor' }} next={{ title: 'sipheron-vdr status', href: '/docs/cli/status' }} />
        </div>
    );
}
    