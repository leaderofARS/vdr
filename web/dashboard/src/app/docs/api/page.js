import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export const metadata = {
    title: 'API Overview | SipHeron VDR Documentation',
    description: 'Learn how to integrate with the SipHeron VDR API for high-scale document registration and verification.',
};

export default function ApiOverviewPage() {
    return (
        <>
            <h1>API Overview</h1>
            <p className="lead text-xl text-gray-300">
                The SipHeron VDR API provides a RESTful interface for organizations to integrate blockchain document verification directly into their internal engineering stacks. It abstracts the complexities of the Solana network, handling transaction signing, gas fees, and network retries on your behalf.
            </p>

            <Callout type="info">
                <strong>Base URL:</strong> All API requests must be directed to <code>https://api.sipheron.com/v1</code>. We enforce HTTPS on all endpoints for secure data transmission.
            </Callout>

            <h2>Core Principles</h2>
            <p>
                The API is built using standardized REST principles, making it compatible with any modern programming language and environment. Whether you are using Python, Go, Node.js, or Java, integrating with SipHeron VDR is as simple as making an HTTP request.
            </p>

            <h3>Statelessness and IDempotency</h3>
            <p>
                Most "write" operations in our API, such as registering a hash, are <strong>idempotent</strong>. If you submit the same hash for the same organization multiple times, the API will recognize the existing registration and return the original confirmation data, preventing duplicate transaction fees on the Solana network.
            </p>

            <h2>Authentication Model</h2>
            <p>
                SipHeron VDR uses <strong>Bearer Token Authentication</strong>. To interact with the API, you must include your organization's API key in the <code>Authorization</code> header of every request.
            </p>

            <CodeBlock
                language="http"
                code={`GET /v1/health HTTP/1.1
Host: api.sipheron.com
Authorization: Bearer sh_live_....`}
            />

            <p>
                You can generate and manage these keys within the <strong>API Settings</strong> section of your Dashboard. We recommend using unique keys for different environments (Development, Staging, Production) and rotating them regularly according to your internal security policies.
            </p>

            <h2>Rate Limits</h2>
            <p>
                To ensure platform stability and protect against denial-of-service (DoS) attacks, we enforce rate limits on all accounts. Limits are applied per organization and per IP address.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Plan</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Requests per Second (RPS)</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Requests per Minute (RPM)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Free Tier</td><td className="py-3 px-4 text-sm text-gray-400">2 RPS</td><td className="py-3 px-4 text-sm text-gray-400">60 RPM</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Professional</td><td className="py-3 px-4 text-sm text-gray-400">25 RPS</td><td className="py-3 px-4 text-sm text-gray-400">1,000 RPM</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Enterprise</td><td className="py-3 px-4 text-sm text-gray-400">Custom</td><td className="py-3 px-4 text-sm text-gray-400">Unlimited</td></tr>
                    </tbody>
                </table>
            </div>

            <Callout type="warning">
                When a rate limit is exceeded, the API will respond with a <code>429 Too Many Requests</code> status code. Your integration should implement <strong>exponential backoff</strong> to handle these scenarios gracefully.
            </Callout>

            <h2>Error Codes and Responses</h2>
            <p>
                The SipHeron API use standard HTTP response codes to indicate the success or failure of an API request. Errors are accompanied by a JSON body containing a human-readable message and a machine-parseable error code.
            </p>

            <CodeBlock
                language="json"
                code={`{
  "error": {
    "code": "insufficient_credits",
    "message": "Your organization has no remaining registration credits for this month.",
    "doc_url": "https://docs.sipheron.com/errors#insufficient_credits"
  }
}`}
            />

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Code</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Range</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Meaning</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm text-green-500">200-299</td><td className="py-3 px-4 text-sm text-gray-400">Success</td><td className="py-3 px-4 text-sm text-gray-400">The request was successful.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-yellow-500">400-499</td><td className="py-3 px-4 text-sm text-gray-400">Client Error</td><td className="py-3 px-4 text-sm text-gray-400">The request was invalid (e.g., missing parameters).</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-red-500">500-599</td><td className="py-3 px-4 text-sm text-gray-400">Server Error</td><td className="py-3 px-4 text-sm text-gray-400">An internal error occurred on SipHeron's servers.</td></tr>
                    </tbody>
                </table>
            </div>

            <h2>Data Formats</h2>
            <p>
                All request bodies must be sent as <code>application/json</code>. Responses will also be returned as JSON. Timestamps follow the <strong>ISO 8601</strong> standard (e.g., <code>2024-03-08T12:00:00Z</code>).
            </p>

            <h3>Pagination</h3>
            <p>
                Endpoints that return lists of objects (such as your organization's registration history) utilize cursor-based pagination. You can control the number of results using <code>limit</code> and navigate using <code>before</code> and <code>after</code> parameters.
            </p>

            <CodeBlock
                language="bash"
                code={`curl https://api.sipheron.com/v1/registrations?limit=10&after=obj_9921`}
            />

            <h2>Versioning</h2>
            <p>
                When we make backwards-incompatible changes to the API, we release a new version. The current version is <strong>v1</strong>. Breaking changes include renaming fields or changing endpoint URLs. Adding new optional fields or new endpoints is considered a backward-compatible update and will not trigger a version bump.
            </p>

            <Callout type="tip">
                <strong>Direct On-Chain Verification:</strong> While our API provides helper endpoints for verification, you are never locked into our infrastructure. Because the proofs are stored on the public Solana blockchain, you can always build your own verification logic that bypasses our API entirely.
            </Callout>

            <h2>Next Steps</h2>
            <p>
                Ready to start building? Head over to the <a href="/docs/api/endpoints">Endpoints Reference</a> for a complete list of available methods, or check out the <a href="/docs/api/webhooks">Webhooks</a> documentation to learn how to receive real-time updates on transaction status.
            </p>
        </>
    );
}
