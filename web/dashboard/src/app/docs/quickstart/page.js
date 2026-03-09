import CodeBlock from '@/app/docs/components/CodeBlock';
import Callout from '@/app/docs/components/Callout';
import Endpoint from '@/app/docs/components/Endpoint';
import ParamTable, { ParamRow } from '@/app/docs/components/ParamTable';
import ResponseTabs from '@/app/docs/components/ResponseTabs';
import DocsPrevNext from '@/app/docs/components/DocsPrevNext';

export const metadata = { title: 'Quick Start' };

export default function Page() {
    return (
        <div>

<h1>Quick Start Guide</h1>
<p className="text-xl mb-8">Get up and running with the SipHeron CLI in less than 2 minutes.</p>
<p>The SipHeron CLI is the primary interface for developers to interact with the VDR protocol. It handles the local hashing of files and the secure transmission of these hashes to the Solana network.</p>

<h2>1. Install CLI</h2>
<CodeBlock language="bash" filename="Terminal">npm install -g sipheron-vdr</CodeBlock>

<h2>2. Link your account</h2>
<p>Before you can anchor documents, you must link your local environment to your SipHeron organization using an API key.</p>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr link</CodeBlock>

<h2>3. Stage a file</h2>
<p>Staging calculates the SHA-256 hash of your chosen file locally. No file data is uploaded.</p>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr stage contract.pdf</CodeBlock>

<h2>4. Anchor to blockchain</h2>
<p>This step dispatches the staged hash to the Solana blockchain. This incurs a small transaction fee (lamports).</p>
<CodeBlock language="bash" filename="Terminal">sipheron-vdr anchor</CodeBlock>

<h2>5. Verify authenticity</h2>
<p>Verification re-computes the hash and checks it against the immutable record on Solana.</p>
<CodeBlock language="bash" filename="Terminal">{`sipheron-vdr verify contract.pdf
// ✔ FILE IS AUTHENTIC
// Anchored: 2024-01-15T10:30:00Z
// TX: 3uYxQb...`}</CodeBlock>

<Callout type="tip">
    You can also verify documents visually by dragging them into the Verifier tool on the portal.
</Callout>
        
            <DocsPrevNext prev={{ title: 'Introduction', href: '/docs' }} next={{ title: 'Installation', href: '/docs/installation' }} />
        </div>
    );
}
