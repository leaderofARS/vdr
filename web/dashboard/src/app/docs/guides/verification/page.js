import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Verification Guide | SipHeron VDR',
    description: 'Learn the different methods for verifying document integrity and authenticity using SipHeron VDR.',
};

export default function VerificationPage() {
    return (
        <>
            <h1>Document Verification Guide</h1>
            <p className="lead text-xl text-gray-300">
                Verification is the most critical part of the SipHeron VDR lifecycle. It is the process by which a party confirms that a digital file is authentic and has not been tampered with. This guide explores the four primary methods for performing verification.
            </p>

            <Callout type="info">
                <strong>What is being verified?</strong> When you verify a document, you are checking: (1) Does this file's hash exist on Solana? (2) Was it registered by the expected organization? (3) Is the current status "Active" (not revoked)?
            </Callout>

            <h2>1. CLI Verification (For Technical Users)</h2>
            <p>
                The CLI is the fastest way for developers and system administrators to verify local files. It re-computes the hash of the file in memory and queries the Solana network directly.
            </p>

            <CodeBlock
                language="bash"
                code={`# Simple verification
sipheron-vdr verify ./evidence.pdf

# Output:
# [SUCCESS] File hash matches on-chain record.
# Issuer: Global Logistics Corp (6ecWPU...)
# Anchored: 2024-03-01 10:45:00 UTC`}
            />

            <h3>Remote-Only Mode</h3>
            <p>
                By default, the CLI may use a local cache for performance. For critical audits, use the <code>--remote-only</code> flag to force a fresh query to the Solana RPC node.
            </p>

            <h2>2. API-Based Verification (For Integration)</h2>
            <p>
                If you are building your own application (e.g., an HR portal or a customer portal), use our REST API. This allows you to integrate verification into your own UI.
            </p>

            <CodeBlock
                language="javascript"
                code={`// Example Node.js verification request
const response = await fetch('https://api.sipheron.com/v1/verifications/' + fileHash, {
    headers: { 'Authorization': 'Bearer sh_live_...' }
});
const result = await response.json();

if (result.is_authentic) {
    console.log("Integrity Verified via Solana!");
}`}
            />

            <h2>3. Dashboard Verification (For Business Users)</h2>
            <p>
                For non-technical staff, the SipHeron Dashboard provides a simple drag-and-drop interface.
            </p>
            <ol className="list-decimal ml-6 my-6 space-y-4 text-gray-300">
                <li>Login to the <strong>SipHeron Dashboard</strong>.</li>
                <li>Navigate to the <strong>Verify</strong> page.</li>
                <li>Drag and drop your file into the verification zone.</li>
                <li>The dashboard computes the hash in your browser and displays the result instantly.</li>
            </ol>

            <div className="bg-[#1a1b20] p-8 rounded-xl border border-gray-800 flex flex-col items-center justify-center my-8 not-prose border-dashed">
                <svg className="w-12 h-12 text-[#4285F4] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span className="text-gray-300 font-medium">Drag file here to verify on-chain</span>
                <span className="text-gray-500 text-xs mt-2">No file data is uploaded to our servers.</span>
            </div>

            <h2>4. Public Explorer Verification (For Counterparties)</h2>
            <p>
                When you share a document with an external party (like a customer or a court), they can verify it using our <strong>Public Explorer</strong> at <code>explorer.sipheron.com</code>.
            </p>

            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>No Account Needed:</strong> The explorer is public. Anyone with the original file can verify it.</li>
                <li><strong>SolScan Integration:</strong> The explorer provides links directly to SolScan or the Solana FM explorer, allowing users to see the raw transaction on the ledger.</li>
                <li><strong>White-Labeling:</strong> Enterprise customers can host their own branded version of the explorer on their own sub-domain (e.g., <code>verify.yourcompany.com</code>).</li>
            </ul>

            <h2>Verification States and Meanings</h2>
            <p>
                A verification request can return one of several states. Understanding these is vital for proper workflow handling.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">State</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Integrity</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Conclusion</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm text-green-400 font-bold">Authentic</td><td className="py-3 px-4 text-sm text-gray-400">100% Match</td><td className="py-3 px-4 text-sm text-gray-400">The file is original and untouched.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-red-500 font-bold">Modified</td><td className="py-3 px-4 text-sm text-gray-400">Mismatch</td><td className="py-3 px-4 text-sm text-gray-400">DO NOT TRUST. The file has been tampered with.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-yellow-500 font-bold">Revoked</td><td className="py-3 px-4 text-sm text-gray-400">100% Match</td><td className="py-3 px-4 text-sm text-gray-400">File is authentic but no longer legally valid.</td></tr>
                        <tr><td className="py-3 px-4 text-sm text-gray-500 font-bold">Not Found</td><td className="py-3 px-4 text-sm text-gray-400">N/A</td><td className="py-3 px-4 text-sm text-gray-400">This file has never been registered in our registry.</td></tr>
                    </tbody>
                </table>
            </div>

            <Callout type="warning">
                <strong>Beware of Collisions:</strong> While SHA-256 is extremely secure, always ensure you are verifying against the correct <strong>Organization Public Key</strong>. A malicious actor could register a modified version of your file under <em>their own</em> organization namespace.
            </Callout>

            <h2>Conclusion</h2>
            <p>
                Effective verification is the ultimate goal of SipHeron VDR. By providing multiple entry points—CLI, API, Dashboard, and Explorer—we ensure that document integrity is accessible to everyone in the value chain, from the DevOps engineer to the end customer.
            </p>
        </>
    );
}
