import CodeBlock from '@/app/docs/components/CodeBlock';
import Callout from '@/app/docs/components/Callout';
import Endpoint from '@/app/docs/components/Endpoint';
import ParamTable, { ParamRow } from '@/app/docs/components/ParamTable';
import ResponseTabs from '@/app/docs/components/ResponseTabs';
import DocsPrevNext from '@/app/docs/components/DocsPrevNext';

export const metadata = { title: 'On-Chain Storage' };

export default function Page() {
    return (
        <div>

<h1>On-Chain Storage</h1>
<p>This section provides a deep dive into On-Chain Storage and its role within the SipHeron VDR ecosystem. Understanding this component is crucial for maintaining document integrity and ensuring that your cryptographic anchors are correctly dispatched to the Solana blockchain.</p>
<p>By following the patterns outlined here, developers can ensure their integrations are robust, secure, and fully compatible with the latest decentralized identity standards. We recommend reviewing the security implications of this feature before deploying to a production environment.</p>

<Callout type="info">
    Always ensure you are using the latest version of the SipHeron CLI or SDK to access the most optimized implementation of On-Chain Storage.
</Callout>

<h2>Implementation Details</h2>
<p>Integrating On-Chain Storage into your workflow is straightforward. Below is a standard implementation pattern that handles configuration, execution, and error boundary management natively.</p>

<CodeBlock language="javascript" filename="example.js">{`// Example implementation for On-Chain Storage
const sipheron = require('sipheron-vdr');

async function main() {
  const result = await sipheron.onchainstorage.init();
  console.log('Result:', result);
}`}</CodeBlock>

            <DocsPrevNext prev={{ title: 'Verification Model', href: '/docs/concepts/verification' }} next={{ title: 'CLI Overview', href: '/docs/cli' }} />
        </div>
    );
}
