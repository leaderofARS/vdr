import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Organization Setup & Management | SipHeron VDR',
    description: 'Learn how to configure your SipHeron VDR organization, manage issuers, and handle large-scale document registration.',
};

export default function OrganizationsPage() {
    return (
        <>
            <h1>Organization Setup and Management</h1>
            <p className="lead text-xl text-gray-300">
                In the SipHeron VDR ecosystem, an "Organization" is the primary administrative unit. It represents a legal entity, a department, or a project that has the authority to issue and anchor verifiable document proofs. This guide covers the complete lifecycle of organization management.
            </p>

            <Callout type="tip">
                <strong>Multi-Tenancy:</strong> A single SipHeron account can manage multiple organizations. This is ideal for consultancies or conglomerates managing document registries for various clients or subsidiaries.
            </Callout>

            <h2>1. Creating Your Organization</h2>
            <p>
                The first step in your journey is creating an organization profile via the SipHeron Dashboard. This process initializes a unique <strong>Organization Identity</strong> on the Solana blockchain.
            </p>
            <ol className="list-decimal ml-6 my-6 space-y-4 text-gray-300">
                <li><strong>Navigate to Organizations:</strong> Click on the "Organizations" tab in the left sidebar of your dashboard.</li>
                <li><strong>Create New:</strong> Click the "New Organization" button.</li>
                <li><strong>Identity Setup:</strong> Provide a name and optional logo. You will also need to select the "Authority Type"—choose "Managed" if you want SipHeron to handle your Solana keys, or "Self-Custody" if you want to use your own wallet.</li>
                <li><strong>Initialization:</strong> Click "Initialize." This triggers an on-chain transaction that creates your <code>OrganizationConfig</code> account.</li>
            </ol>

            <CodeBlock
                language="bash"
                code={`# If you chose Self-Custody, you'll need the CLI to initialize
sipheron-vdr organization init "Global Logistics Corp"`}
            />

            <h2>2. Managing Issuers (IAM)</h2>
            <p>
                You should not share your primary organizational API key with every employee. Instead, use SipHeron's **Identity and Access Management (IAM)** to create "Issuers."
            </p>

            <h3>Issuer Roles</h3>
            <p>
                An Issuer is a sub-account with limited permissions. You can restrict an issuer to specific environments (e.g., only Devnet) or specific document types (e.g., only "Technical Docs").
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Role Name</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Permissions</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Recommended For</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Admin</td><td className="py-3 px-4 text-sm text-gray-400">Full control: Create Issuers, Revoke, Register.</td><td className="py-3 px-4 text-sm text-gray-400">CTO / Legal Head</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Issuer</td><td className="py-3 px-4 text-sm text-gray-400">Register Hash, Verify. (Cannot Revoke)</td><td className="py-3 px-4 text-sm text-gray-400">Automated CI/CD / Junior Staff</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Auditor</td><td className="py-3 px-4 text-sm text-gray-400">Read-only access to all logs.</td><td className="py-3 px-4 text-sm text-gray-400">Compliance Officers</td></tr>
                    </tbody>
                </table>
            </div>

            <Callout type="warning">
                <strong>Key Rotation:</strong> For security compliance, we strongly recommend rotating Issuer API keys every 90 days. You can automate this process via the Administrative API.
            </Callout>

            <h2>3. Bulk Anchoring Strategy</h2>
            <p>
                When dealing with thousands of legacy documents, anchoring them one by one is inefficient. SipHeron VDR provides <strong>Batch Registration</strong> capabilities both in the CLI and API.
            </p>

            <h3>CLI Batching</h3>
            <p>
                Use the <code>--batch</code> flag to group multiple Hash Registration instructions into a single transaction (up to the Solana limit of ~1KB per transaction).
            </p>
            <CodeBlock
                language="bash"
                code={`# Anchor an entire folder of archive PDFs
sipheron-vdr stage ./archives/2023 --recursive
sipheron-vdr anchor ./archives/2023 --batch --wait`}
            />

            <h3>API Batching</h3>
            <p>
                For even higher scale, use the <code>/v1/registrations/bulk</code> endpoint. This endpoint allows you to submit up to 50 hashes in a single JSON payload. Our backend will handle the optimal partitioning and submission to the Solana network.
            </p>

            <h2>4. Monitoring and Reporting</h2>
            <p>
                As your organization grows, monitoring your "Anchoring Velocity" and "Credit Usage" becomes vital for budget management.
            </p>

            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Dashboard Analytics:</strong> Visualize your registration trends over daily, weekly, and monthly intervals.</li>
                <li><strong>On-Chain Explorer:</strong> Each organization has a unique "Registry Page" on the SipHeron Explorer, which provides a public, verifiable view of all non-revoked documents.</li>
                <li><strong>Audit Exports:</strong> Generate CSV or JSON exports of your entire registry for external auditors or insurance providers.</li>
            </ul>

            <CodeBlock
                language="json"
                code={`// Example of an exported registry entry
{
    "org_id": "org_9921",
    "hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    "status": "anchored",
    "tx": "5mKz...",
    "anchored_at": "2024-03-01T10:00:00Z"
}`}
            />

            <Callout type="info">
                <strong>Billing:</strong> Your organization is billed based on "Registration Credits." Each successful on-chain anchoring event consumes 1 credit. Revocations and Verifications are either free or billed at a lower rate depending on your plan.
            </Callout>

            <h2>Conclusion</h2>
            <p>
                A well-organized registry is the backbone of a successful verifiable document program. By correctly configuring your Issuers and utilizing bulk anchoring tools, your enterprise can achieve high-scale document integrity with minimal administrative overhead.
            </p>
        </>
    );
}
