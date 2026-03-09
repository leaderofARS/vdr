import Breadcrumb from '../../../components/Breadcrumb';
import Callout from '../../../components/Callout';
import CodeBlock from '../../../components/CodeBlock';
import Endpoint from '../../../components/Endpoint';
import ParamTable, { ParamRow } from '../../../components/ParamTable';
import ResponseTabs from '../../../components/ResponseTabs';
import DocsPrevNext from '../../../components/DocsPrevNext';

export default function RegisterHashPage() {
    const successResponse = \`{
  "status": "success",
  "data": {
    "hash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    "signature": "3mZ5z9y8Y2PqR1xN7hV4jwLqT",
    "timestamp": "1710059400",
    "onChain": true
  }
}\`;

  const errorResponse = \`{
  "status": "error",
  "error": {
    "code": "DUPLICATE_HASH",
    "message": "This hash has already been registered on the blockchain."
  }
}\`;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'API Reference', href: '/docs/api' },
        { label: 'Hashes', href: '/docs/api/hashes' },
        { label: 'Register Hash' }
      ]} />
      <div className="flex items-center justify-between mb-8">
        <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
      </div>

      <h1 id="register-hash">Register Hash</h1>
      <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
        Programmatically anchor a document hash to the Solana blockchain. This endpoint is ideal for custom application integrations.
      </p>

      <h2 id="overview">Overview</h2>
      <p>
        The <code>/api/v1/hashes/register</code> endpoint allows developers to register a single SHA-256 hash. 
        It handles the blockchain transaction orchestration, ensuring the hash is stored in a SipHeron VDR account.
      </p>

      <Endpoint 
        method="POST" 
        path="/api/v1/hashes/register" 
        description="Records a unique document hash on the Solana blockchain."
      />

      <h2 id="parameters">Parameters</h2>
      <ParamTable>
        <ParamRow name="hash" type="string" required={true} description="The SHA-256 hash of the document (64 characters)." />
        <ParamRow name="metadata" type="object" required={false} description="Custom key-value pairs to store alongside the hash (off-chain)." />
        <ParamRow name="priority" type="string" required={false} description="Processing priority: 'low', 'medium', 'high'." />
      </ParamTable>

      <h2 id="authentication">Authentication</h2>
      <p>This endpoint requires a valid API Key in the request header.</p>
      <CodeBlock language="bash">
x-api-key: your_api_key_here
      </CodeBlock>

      <h2 id="response">Response Format</h2>
      <ResponseTabs success={successResponse} error={errorResponse} />

      <h2 id="examples">Examples</h2>
      
      <h3 id="curl">cURL</h3>
      <CodeBlock language="bash">
{`curl - X POST https://api.sipheron.vdr/v1/hashes/register \\
    -H "x-api-key: $VDR_API_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{"hash": "7f83b1...3a9c42"}'`}
      </CodeBlock>
      
      <h3 id="javascript">JavaScript (Fetch)</h3>
      <CodeBlock language="javascript">
{`const response = await fetch('https://api.sipheron.vdr/v1/hashes/register', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.VDR_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hash: '7f83b1...3a9c42'
        })
    });

    const data = await response.json();
    console.log(data.signature); `}
      </CodeBlock>

      <h2 id="rate-limits">Rate Limits</h2>
      <p>
        Standard accounts are limited to **50 registrations per minute**. 
        If you exceed this, the API will return a <code>429 Too Many Requests</code> error.
      </p>

      <h2 id="best-practices">Best Practices</h2>
      <Callout type="tip">
        To reduce latency, use the <code>batch</code> registration endpoint if you have more than 5 hashes to register at once.
      </Callout>

      <div className="min-h-[150vh]" />

      <h2 id="faq">FAQ</h2>
      <div className="space-y-6 my-8">
        <div>
          <h4 className="text-[15px] font-medium text-[#EDEDED] mb-2">Can I register the same hash twice?</h4>
          <p className="text-[14px] text-[#888]">No. The system will return a <code>DUPLICATE_HASH</code> error. Each record on-chain must be unique per organization.</p>
        </div>
      </div>

      <DocsPrevNext 
        prev={{ label: 'Authentication', href: '/docs/api/auth' }}
        next={{ label: 'Get Hash Details', href: '/docs/api/hashes/get' }}
      />
    </div>
  );
}
