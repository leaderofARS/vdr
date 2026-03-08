import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Enterprise Use Cases | SipHeron VDR',
    description: 'Learn how enterprises use SipHeron VDR for document control, compliance auditing, and secure internal reporting.',
};

export default function EnterprisePage() {
    return (
        <>
            <h1>Enterprise Document Control and Audit</h1>
            <p className="lead text-xl text-gray-300">
                In the enterprise environment, maintaining a rigid <strong>Audit Trail</strong> and ensuring <strong>Document Integrity</strong> is not just a best practice—it is a regulatory requirement. SipHeron VDR provides the infrastructure for large organizations to anchor internal policies, financial reports, and build manifests to a decentralized global ledger.
            </p>

            <Callout type="info">
                <strong>Governance at Scale:</strong> SipHeron VDR is designed to integrate with established Enterprise Resource Planning (ERP) and Document Management Systems (DMS), adding an immutable trust layer to existing corporate infrastructure.
            </Callout>

            <h2>Aligning with SOC2 and ISO 27001</h2>
            <p>
                Security frameworks like <strong>SOC2 Type II</strong> and <strong>ISO 27001</strong> require companies to prove that their internal controls are effective and that audit logs cannot be retroactively modified. Traditionally, companies rely on "Write Once, Read Many" (WORM) storage or trust the integrity of their cloud provider's database.
            </p>
            <p>
                SipHeron VDR offers a technically superior alternative. By anchoring the hash of every critical audit log or policy update to the Solana blockchain, you create an <strong>Indisputable Proof of Integrity</strong>. Even a privileged system administrator with full database access cannot "clean up" or modify an anchored log without breaking the cryptographic proof.
            </p>

            <h3>Internal Policy Management</h3>
            <p>
                When a new corporate policy (e.g., Code of Conduct, Information Security Policy) is approved, its hash is anchored. If a dispute arises regarding what policy was in effect on a specific date, the organization can provide the original PDF and the Solana transaction as a final, non-repudiable timestamp.
            </p>

            <CodeBlock
                language="bash"
                code={`# Typical workflow for a Compliance Officer
sipheron-vdr anchor ./policies/INF_SEC_2024_v1.2.pdf --meta '{"reviewer": "CTO", "version": "1.2"}'
# Policy is now permanently timestamped on Solana.`}
            />

            <h2>Software Supply Chain Security</h2>
            <p>
                Modern enterprises are vulnerable to "Software Supply Chain" attacks, where a malicious actor injects code into build artifacts or Docker images. SipHeron VDR provides a solution by anchoring the <strong>Software Bill of Materials (SBOM)</strong> and final build hashes during the CI/CD pipeline.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Asset Type</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">What is Anchored</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Security Benefit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Docker Image</td><td className="py-3 px-4 text-sm text-gray-400">Layer SHA-256 Digest</td><td className="py-3 px-4 text-sm text-green-400">Ensures the deployed image exactly matches the audited build.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">Build Artifact</td><td className="py-3 px-4 text-sm text-gray-400">.tar.gz / .zip Binary Hash</td><td className="py-3 px-4 text-sm text-green-400">Prevents late-stage injection of malicious binaries.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-300">SBOM</td><td className="py-3 px-4 text-sm text-gray-400">CycloneDX / SPDX JSON Hash</td><td className="py-3 px-4 text-sm text-green-400">Proves the dependency list was checked at a specific time.</td></tr>
                    </tbody>
                </table>
            </div>

            <Callout type="warning">
                <strong>Registry Integrity:</strong> While the VDR proves a file has not changed, it does not "scan" the file for malware. Enterprises should combine SipHeron VDR with existing static analysis and vulnerability scanning tools.
            </Callout>

            <h2>Global Financial Reporting</h2>
            <p>
                Publicly traded companies must provide periodic financial statements. Anchoring the final 10-Q or 10-K filing hash before public release ensures that the data presented to regulators and investors remains unchanged. This build incredible trust with external stakeholders and reduces the potential for accounting manipulation.
            </p>

            <CodeBlock
                language="json"
                code={`// Example of a financial report registration
{
    "report_type": "10-Q",
    "fiscal_year": 2024,
    "quarter": 1,
    "hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    "audit_firm": "Verified By Internal Audit"
}`}
            />

            <h2>Automation via SipHeron API</h2>
            <p>
                Enterprises don't manually anchor files; they automate it. By integrating the SipHeron API into internal Document Management Systems, every time a document is marked as "Approved," the system automatically hashes the file and submits it to the VDR.
            </p>
            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Low Latency:</strong> Sub-second anchoring on Solana ensures no delays in business processes.</li>
                <li><strong>High Throughput:</strong> Process thousands of audit logs per minute using the SipHeron API relay.</li>
                <li><strong>Detailed Reporting:</strong> Use the SipHeron Dashboard to export organization-wide registration reports for annual compliance reviews.</li>
            </ul>

            <Callout type="tip">
                <strong>Organization Management:</strong> Enterprise customers can create "Child Organizations" to isolate document registries for different departments (HR, Engineering, Legal) while maintaining global oversight.
            </Callout>

            <h2>Conclusion</h2>
            <p>
                Building an enterprise on SipHeron VDR turns "Trust" into "Math." It provides a foundational layer for modern document governance, ensuring that critical corporate knowledge remains authentic, verifiable, and permanent.
            </p>
        </>
    );
}
