import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Migration Guide | SipHeron VDR',
    description: 'Learn how to migrate your existing document notarization and integrity workflows to SipHeron VDR and the Solana blockchain.',
};

export default function MigrationPage() {
    return (
        <>
            <h1>Migration Guide</h1>
            <p className="lead text-xl text-gray-300">
                Transitioning from traditional notarization methods or centralized document integrity systems to a blockchain-based registry can seem daunting. This guide provides a strategic framework for migrating your legacy workflows to SipHeron VDR, ensuring a smooth transition with zero data loss.
            </p>

            <Callout type="info">
                <strong>Why Migrate?</strong> Moving to SipHeron VDR reduces verification costs by up to 90%, eliminates reliance on slow manual notaries, and provides a technically superior, immutable audit trail that satisfies modern compliance standards.
            </Callout>

            <h2>Phase 1: Assessing Current Workflows</h2>
            <p>
                Before writing any code, identify the "High-Integrity Assets" in your organization. These are the documents where tampering or fraud would have the highest business impact (e.g., Board Resolutions, Financial Reports, Patent Applications).
            </p>
            <p>Analyze your current method of "proving" these documents:</p>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Physical Notarization:</strong> Relying on embossed seals and physical signatures.</li>
                <li><strong>Centralized Database Logs:</strong> Relying on internal SQL logs that "prove" when a file was uploaded.</li>
                <li><strong>Email Trails:</strong> Using "sent" timestamps as a weak form of Proof of Existence.</li>
            </ul>

            <h2>Phase 2: Legacy Archive Ingestion</h2>
            <p>
                Most organizations have a large backlog of historical documents that need to be "grandfathered" into the new VDR. We recommend a batch ingestion process.
            </p>

            <h3>Bulk Hashing Strategy</h3>
            <p>
                Do not move your files. Instead, run the SipHeron CLI locally against your existing file storage (S3, NAS, etc.) to generate hashes. This ensures that you maintain your existing storage architecture while layering the VDR on top.
            </p>

            <CodeBlock
                language="bash"
                code={`# Ingest 5 years of historical contracts from a local NAS
sipheron-vdr stage /mnt/nas/archives/2019-2023 --recursive
sipheron-vdr anchor /mnt/nas/archives/2019-2023 --batch --wait`}
            />

            <h3>Handling Backdating</h3>
            <p>
                A common question during migration is: <em>"Can I set the registration date to the original document creation date?"</em>
            </p>
            <p>
                <strong>No.</strong> The Solana blockchain records the exact time the transaction reaches finality. To preserve the original context, you should store the original creation date in the **Registration Metadata**.
            </p>

            <CodeBlock
                language="json"
                code={`// Proper migration metadata mapping
{
    "hash": "8d969...",
    "metadata": {
        "legacy_system": "SharePoint-v1",
        "original_created_at": "2021-05-12T14:30:00Z",
        "migration_batch": "MIG-2024-03"
    }
}`}
            />

            <h2>Phase 3: Integration and Automation</h2>
            <p>
                Once legacy data is ingested, update your software stack to use SipHeron VDR for all new documents moving forward.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">System Category</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Integration Point</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Benefit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Document Mgmt (DMS)</td><td className="py-3 px-4 text-sm text-gray-400">Trigger on "Status: Published" event.</td><td className="py-3 px-4 text-sm text-green-400">Automatic proof for every new asset.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">HR / Payroll</td><td className="py-3 px-4 text-sm text-gray-400">Anchor monthly payslip manifests.</td><td className="py-3 px-4 text-sm text-green-400">Prevents payroll tampering and fraud.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">CI / CD Pipeline</td><td className="py-3 px-4 text-sm text-gray-400">Anchor build/deployment artifacts.</td><td className="py-3 px-4 text-sm text-green-400">Immutable supply chain security.</td></tr>
                    </tbody>
                </table>
            </div>

            <Callout type="warning">
                <strong>Parallel Operations:</strong> During the first 30 days of migration, we recommend running SipHeron VDR in parallel with your legacy notarization system. This allows your team to gain confidence in the blockchain-based verification results before fully decommissioning legacy processes.
            </Callout>

            <h2>Phase 4: Training and Stakeholder Buy-in</h2>
            <p>
                Technical migration is only half the battle. You must educate your stakeholders (Legal, Customers, Vendors) on how to use the new system.
            </p>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Educate Customers:</strong> Update your document footers to include instructions for verification via <code>explorer.sipheron.com</code>.</li>
                <li><strong>Inform Legal Counsel:</strong> Provide your legal team with the SipHeron whitepapers explaining the cryptographic validity of SHA-256 and Solana finality.</li>
                <li><strong>Internal Dashboards:</strong> Give executive stakeholders view-only access to the SipHeron Dashboard so they can see the "Global Integrity Score" of the organization's assets.</li>
            </ul>

            <Callout type="tip">
                <strong>Migration Workshops:</strong> SipHeron offers dedicated workshops for enterprise customers to help design custom migration paths for complex legacy architectures.
            </Callout>

            <h2>Conclusion</h2>
            <p>
                Migrating to SipHeron VDR is a strategic upgrade that future-proofs your organization's document governance. By following this phased approach, you can move from ancient, brittle trust models to a modern, scalable, and mathematically proven integrity system.
            </p>
        </>
    );
}
