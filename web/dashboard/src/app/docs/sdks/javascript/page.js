
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "JavaScript SDK" };

export default function Page() {
    return (
        <div>
            
<h1>JavaScript SDK</h1>
<p>The definitive SipHeron SDK library for Node.js environments.</p>
<CodeBlock language="typescript" filename="index.ts">{`import { SipHeron } from "sipheron-vdr-sdk";`}</CodeBlock>
        
            <DocsPrevNext prev={{ title: 'Webhook Integration', href: '/docs/guides/webhook' }} next={{ title: 'REST API', href: '/docs/api' }} />
        </div>
    );
}
    