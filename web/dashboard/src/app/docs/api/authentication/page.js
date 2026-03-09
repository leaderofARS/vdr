import CodeBlock from '@/app/docs/components/CodeBlock';
import Callout from '@/app/docs/components/Callout';
import Endpoint from '@/app/docs/components/Endpoint';
import ParamTable, { ParamRow } from '@/app/docs/components/ParamTable';
import ResponseTabs from '@/app/docs/components/ResponseTabs';
import DocsPrevNext from '@/app/docs/components/DocsPrevNext';

export const metadata = { title: 'API Authentication' };

export default function Page() {
    return (
        <div>

<h1>API Authentication Reference</h1>
<p>The SipHeron REST API allows for programmatic integration of the VDR protocol into your own applications or backend services. This is ideal for high-volume automated anchoring or building custom verification interfaces.</p>
<p>All endpoints are served over HTTPS and follow RESTful principles, using standard HTTP methods and status codes to communicate success or failure.</p>

<Endpoint method="POST" path="/api/v1/authentication">
    Execute administrative control or resource modification for Authentication.
</Endpoint>

<Callout type="warning">
    Never share your API keys in frontend code. Always use a secure backend proxy to interact with the SipHeron API.
</Callout>

<h2>Authentication</h2>
<p>All API calls require standard Bearer token authorization linked to your API Execution Key generated inside the Operations Dashboard.</p>

<h2>Request Parameters</h2>
<ParamTable>
    <ParamRow name="payload" type="string" required={true}>Deterministically structured parameter array containing the resource data.</ParamRow>
    <ParamRow name="metadata" type="object" required={false}>Optional key-value pairs for internal document organization.</ParamRow>
</ParamTable>

<h2>Response Examples</h2>
<ResponseTabs tabs={[
    { label: "200 Success", content: <CodeBlock language="json" filename="Success Response">{`{
  "success": true,
  "transaction_id": "8xJ...p9q",
  "data": { "status": "indexed" }
}`}</CodeBlock> },
    { label: "401 Unauthorized", content: <CodeBlock language="json" filename="Error Response">{`{
  "error": "Invalid API token.",
  "code": "AUTH_ERROR"
}`}</CodeBlock> },
    { label: "429 Rate Limited", content: <CodeBlock language="json" filename="Rate Limit">{`{
  "error": "Too many requests.",
  "retry_after": 60
}`}</CodeBlock> }
]} />
        
            <DocsPrevNext prev={{ title: 'API Overview', href: '/docs/api' }} next={{ title: 'Hashes', href: '/docs/api/hashes' }} />
        </div>
    );
}
