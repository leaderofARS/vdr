import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Webhooks (Beta) | SipHeron VDR Documentation',
    description: 'Understand the upcoming webhook infrastructure for real-time document registration events.',
};

export default function WebhooksPage() {
    return (
        <>
            <h1>Webhooks (Coming Soon)</h1>
            <p className="lead text-xl text-gray-300">
                Webhooks allow your application to receive real-time HTTP notifications when specific events occur within the SipHeron VDR ecosystem. Instead of polling our API to check if a Solana transaction has finalized, you can configure SipHeron to push that information to your server immediately.
            </p>

            <Callout type="warning">
                <strong>Beta Notice:</strong> Webhooks are currently in private beta for Enterprise customers. If you require webhook access for your integration, please contact our support team. The documentation below reflects the planned public architecture.
            </Callout>

            <h2>How Webhooks Work</h2>
            <p>
                A webhook is essentially a POST request sent from SipHeron's servers to a URL provided by you. These requests contain a JSON payload with data about the event that triggered the notification.
            </p>

            <h3>Event-Driven Architecture</h3>
            <p>
                The SipHeron VDR platform is built on an asynchronous event bus. When a document hash is submitted for anchoring, several state transitions occur (Processing -&gt; Submitted -&gt; Confirmed). Webhooks allow you to subscribe to these transitions and trigger internal business logic, such as updating a database record or notifying a user via email.
            </p>

            <h2>Planned Event Types</h2>
            <p>
                We are planning to support the following events at launch:
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Event String</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Trigger Conditions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">registration.confirmed</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Sent when a transaction achieves full <em>finalized</em> status on Solana.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">registration.failed</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Sent if a transaction is dropped by the network or fails due to program logic.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">registration.revoked</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Sent when an existing registration is successfully revoked on-chain.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">credits.low</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Sent when your organization's registration credits fall below 10% of your plan.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Webhook Payload Example</h2>
            <p>
                When an event occurs, your endpoint will receive a POST request with a payload similar to the following:
            </p>

            <CodeBlock
                language="json"
                code={`{
  "id": "evt_9918231",
  "type": "registration.confirmed",
  "created_at": "2024-03-08T12:06:45Z",
  "data": {
    "registration_id": "reg_8821903",
    "hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    "transaction_signature": "5mKz72wP...",
    "slot": 251029112
  }
}`}
            />

            <h2>Security and Verification</h2>
            <p>
                To ensure that a webhook request actually originated from SipHeron and not from a malicious third party, we will include a <code>Sipheron-Signature</code> header in every request. This signature is an HMAC-SHA256 hash of the request body, signed with a <strong>Webhook Secret</strong> unique to your endpoint.
            </p>

            <CodeBlock
                language="javascript"
                code={`// Example Node.js verification logic
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expectedSignature;
}`}
            />

            <h3>Best Practices for Webhook Handlers</h3>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Return a 2xx Status Promptly:</strong> Your endpoint should respond with a <code>200 OK</code> immediately upon receiving the payload. Do not perform long-running tasks within the request-response cycle.</li>
                <li><strong>Implement Idempotency:</strong> Occasionally, the same webhook might be delivered more than once. Ensure your backend can handle the same event ID multiple times without side effects.</li>
                <li><strong>Retry Logic:</strong> If your server is down and returns a 5xx error, SipHeron will attempt to redeliver the webhook with exponential backoff for up to 24 hours.</li>
            </ul>

            <Callout type="tip">
                <strong>Testing with Localhost:</strong> During development, we recommend using tools like <a href="https://ngrok.com" target="_blank" rel="noopener noreferrer">ngrok</a> to tunnel webhook traffic to your local development machine.
            </Callout>

            <h2>Configuring Webhooks</h2>
            <p>
                Once the feature is live, you will be able to manage your endpoints in the <strong>Developers &gt; Webhooks</strong> section of the Dashboard. You can define multiple URLs and select exactly which event types each URL should receive.
            </p>

            <p>
                Stay tuned to our <a href="https://twitter.com/SipHeron" target="_blank" rel="noopener noreferrer">official channels</a> for the announcement of the public beta release.
            </p>
        </>
    );
}
