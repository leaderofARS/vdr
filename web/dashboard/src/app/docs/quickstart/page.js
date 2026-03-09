
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Quick Start" };

export default function Page() {
    return (
        <div>
            
<h1>Quick Start Guide</h1>
<p className="text-xl mb-8">Get up and running with the SipHeron CLI in less than 2 minutes.</p>
<h2>1. Install CLI</h2>
<CodeBlock language="bash" filename="Terminal">npm install -g sipheron-vdr</CodeBlock>
<h2>2. Link your account</h2>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr link</CodeBlock>
<h2>3. Stage a file</h2>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr stage contract.pdf</CodeBlock>
<h2>4. Anchor to blockchain</h2>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr anchor</CodeBlock>
<h2>5. Verify authenticity</h2>
<CodeBlock language="bash" filename="Terminal">{`sipheron-vdr verify contract.pdf
// ✔ FILE IS AUTHENTIC
// Anchored: 2024-01-15T10:30:00Z
// TX: 3uYxQb...`}</CodeBlock>
        
            <DocsPrevNext prev={{ title: 'Introduction', href: '/docs' }} next={{ title: 'Installation', href: '/docs/installation' }} />
        </div>
    );
}
    