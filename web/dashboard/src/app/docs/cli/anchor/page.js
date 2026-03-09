
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "sipheron-vdr anchor" };

export default function Page() {
    return (
        <div>
            
<h1>sipheron-vdr anchor</h1>
<p>Description: Executes the anchor workflow locally without mutating upstream variables.</p>
<h2>Usage Syntax</h2>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr anchor [options]</CodeBlock>
<h2>Options</h2>
<ParamTable>
    <ParamRow name="--dry-run" type="boolean" required={false}>Evaluates payload safely without broadcasting to RPC nodes.</ParamRow>
    <ParamRow name="--force" type="boolean" required={false}>Ignores localized permission warnings.</ParamRow>
</ParamTable>
<h2>Output Format</h2>
<CodeBlock language="json" filename="Terminal">{`{
  "status": "success",
  "command": "anchor"
}`}</CodeBlock>
        
            <DocsPrevNext prev={{ title: 'sipheron-vdr stage', href: '/docs/cli/stage' }} next={{ title: 'sipheron-vdr verify', href: '/docs/cli/verify' }} />
        </div>
    );
}
    