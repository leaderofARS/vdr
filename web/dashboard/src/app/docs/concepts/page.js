import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export const metadata = {
    title: 'Core Concepts | SipHeron VDR Documentation',
    description: 'Deep dive into hashing, Solana Program Derived Addresses (PDAs), and the zero-knowledge privacy model of SipHeron VDR.',
};

export default function ConceptsPage() {
    return (
        <>
            <h1>Core Concepts and Architecture</h1>
            <p className="lead text-xl text-gray-300">
                To effectively integrate SipHeron VDR into your enterprise workflows, it is essential to understand the underlying cryptographic and blockchain principles that ensure document integrity and privacy. This resonance between robust hashing, decentralized consensus, and specialized account models creates the foundation of our trust-less registry.
            </p>

            <Callout type="info">
                <strong>Privacy at Scale:</strong> Our architecture is built on the principle that your documents are your own. SipHeron never sees, stores, or transmits the content of your files. We only deal with the cryptographic proofs of their existence.
            </Callout>

            <h2>Cryptographic Hashing (SHA-256)</h2>
            <p>
                The foundation of all verifiable registries is the cryptographic hash function. SipHeron VDR utilizes <strong>SHA-256</strong> (Secure Hash Algorithm 256-bit), a standard of the National Institute of Standards and Technology (NIST). This algorithm is considered computationally infeasible to reverse or "collide," making it the ideal choice for document integrity.
            </p>

            <h3>The Deterministic Property</h3>
            <p>
                A hash function takes an input of any size (from a 1KB text file to a 10GB video archive) and produces a fixed-length string of 64 hexadecimal characters. This "fingerprint" is completely unique to the file. Even a single bit change in the input file will result in a completely different hash—a phenomenon known as the <em>avalanche effect</em>.
            </p>

            <CodeBlock
                language="bash"
                code={`# Example of the avalanche effect in SHA-256
echo "SipHeron VDR" | shasum -a 256
# Result: 4b29f43f8e5f...

echo "SipHeron VDS" | shasum -a 256
# Result: 9d1a8e2f0a1c... (totally different)`}
            />

            <h3>One-Way Transformation</h3>
            <p>
                Hashing is not encryption. Unlike encryption, which can be decrypted with a key, hashing is a one-way street. You can never take a SHA-256 hash and "decode" it back into its original document. This ensures that even if our blockchain records are public, your sensitive content remains hidden.
            </p>

            <h2>Solana Program Derived Addresses (PDAs)</h2>
            <p>
                In the Solana ecosystem, data is stored in "accounts." To manage millions of unique document hashes efficiently, SipHeron VDR utilizes <strong>Program Derived Addresses (PDAs)</strong>. PDAs are special addresses that do not have their own private keys but are programmatically derived from a set of "seeds" and the Program ID.
            </p>

            <h3>The PDA Derivation Logic</h3>
            <p>
                Each document's on-chain record is stored at a PDA derived specifically from its hash and the organization's public key. This allows our protocol to look up a document's status instantly, without searching through a global list. The derivation logic ensures that no two documents can ever occupy the same on-chain storage slot.
            </p>

            <div className="bg-[#1a1b20] p-6 rounded-lg my-6 border border-gray-800 font-mono text-sm overflow-x-auto text-[#4285F4]">
                <pre>{`
  PDA Calculation Logic:
  Seeds = [ 
    "vdr-record",                         // Hardcoded prefix
    Organization_PublicKey.toBuffer(),    // Your Org's Identity
    File_Hash_Bytes                       // The Document Hash
  ]
  
  PDA = findProgramAddress(Seeds, SIPHERON_PROGRAM_ID)
        `}</pre>
            </div>

            <p>
                Because the PDA is deterministic, any verifier who possesses the original file and knows the issuer's public key can calculate the exact storage location on the Solana blockchain to confirm its authenticity.
            </p>

            <h2>Zero-Knowledge File Privacy Model</h2>
            <p>
                SipHeron VDR operates on a <strong>Zero-Knowledge</strong> privacy model. Unlike traditional "cloud notarization" services that require you to upload your sensitive PDFs to their servers, SipHeron only requires the hash.
            </p>
            <p>
                This means that even if SipHeron's infrastructure were completely compromised, your document remains secure. An attacker would find a database full of hashes that cannot be reversed to reveal the original documents. This is the cornerstone of <strong>Enterprise Data Sovereignty</strong>.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Feature</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Traditional VDR</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">SipHeron VDR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300 pointer-events-none">File Storage</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Stores full copy on company servers.</td>
                            <td className="py-3 px-4 text-sm text-green-400 font-medium">Files never leave your infrastructure.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300 pointer-events-none">Security Risk</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Centralized point of failure and data leak.</td>
                            <td className="py-3 px-4 text-sm text-green-400 font-medium">Decentralized proof of integrity.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300 pointer-events-none">Trust Model</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Trust the provider's database and staff.</td>
                            <td className="py-3 px-4 text-sm text-green-400 font-medium">Trust only unbreakable cryptography.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Immutability and Solana Finality</h2>
            <p>
                The value of our registry stems from <strong>immutability</strong>. Once a transaction is finalized on Solana, it cannot be deleted, altered, or overwritten. Solana's Proof-of-History (PoH) provides a verifiable clock for the entire network, ensuring that every anchoring event has a definite, timestamped position in history.
            </p>

            <h3>Solana's Proof-of-History (PoH)</h3>
            <p>
                Unlike other blockchains that rely on block times alone, Solana uses PoH to create a cryptographically secure sequence of events. This means that a SipHeron timestamp is not just an estimate—it is a proof that the document existed at that specific point in the ledger's sequence.
            </p>

            <Callout type="warning">
                <strong>Revocation Mechanics:</strong> While a hash can never be "removed" from the blockchain (due to the ledger's permanent nature), SipHeron allows an issuer to mark a hash as "Revoked" or "Expired." This instruction update is also permanently recorded, providing a complete lifecycle for the document.
            </Callout>

            <h3>Sub-Second Confirmations</h3>
            <p>
                Solana achieves finality in less than 400 milliseconds. This enables real-time document anchoring for high-velocity environments like financial trading or automated supply chain workflows.
            </p>

            <h2>Chain of Custody and Identity</h2>
            <p>
                Integrity is only one half of the equation; <strong>Attribution</strong> is the other. SipHeron VDR links every registered hash to a verified Organization Public Key. This creates a cryptographically proven chain of custody. You can prove not only that a file existed, but that it was specifically issued by your organization.
            </p>

            <h3>Public Key Infrastructure (PKI)</h3>
            <p>
                Each organization owns a Solana wallet, and only transactions signed by this wallet can register hashes under that organization's namespace. This prevents unauthorized entities from spoofing document registration. In an enterprise setting, this wallet is often controlled by a Multisig or a Hardware Security Module (HSM).
            </p>

            <h2>Detailed Verification Logic</h2>
            <p>
                The verification process is deterministic and requires no interaction with SipHeron's database if the client chooses to go direct-to-chain. The loop follows these steps:
            </p>

            <ol className="list-decimal space-y-4 ml-6 my-6 text-gray-300">
                <li><strong>Recompute Hash:</strong> The verifier hashes their copy of the file via SHA-256 using an industry-standard library.</li>
                <li><strong>Identify Issuer:</strong> The verifier identifies the expected organization public key (usually provided via metadata or document footer).</li>
                <li><strong>Derive PDA:</strong> The verifier derives the unique PDA address using the prefix "vdr-record", the Org's Key, and the Computed Hash.</li>
                <li><strong>Query Solana:</strong> The verifier queries the Solana RPC node (e.g., via <code>getAccountInfo</code>) for the data at that PDA.</li>
                <li><strong>Validate State:</strong> The verifier deserializes the account data and confirms that the hash matches, the organization matches, and the status is "Active."</li>
            </ol>

            <Callout type="tip">
                To see this in action, explore the <a href="/docs/guides/verification">Verification Guide</a>, which covers both CLI-based and web-based verification methods.
            </Callout>

            <h2>High-Level Architecture</h2>
            <p>
                The SipHeron VDR ecosystem is designed for modularity. You can interact with the registry through the high-level Dashboard, the intermediate API, or the low-level Smart Contract.
            </p>

            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Client Tier:</strong> Handles hashing and local storage of registration records.</li>
                <li><strong>Relay Tier:</strong> The SipHeron API acts as a transaction relayer, subsidizing gas and ensuring high availability.</li>
                <li><strong>On-Chain Tier:</strong> The Solana smart contract manages state, validation, and immutability.</li>
            </ul>

            <p className="text-sm text-gray-500 italic mt-12 pb-8 border-t border-gray-800 pt-8">
                For more technical implementation details, please refer to the <a href="/docs/api">API Reference</a> or the <a href="/docs/contract">Smart Contract</a> documentation.
            </p>
        </>
    );
}
