import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export const metadata = {
    title: 'Smart Contract Overview | SipHeron VDR',
    description: 'Understand the on-chain architecture of the SipHeron VDR Solana program, including PDAs and account structures.',
};

export default function ContractOverviewPage() {
    return (
        <>
            <h1>Smart Contract Architecture</h1>
            <p className="lead text-xl text-gray-300">
                The SipHeron VDR Smart Contract is the ultimate source of truth for all document registrations. Deployed on the Solana blockchain, it provides the logic for anchoring cryptographic hashes, managing organization identities, and ensuring the immutability of recorded data.
            </p>

            <Callout type="info">
                <strong>Program ID:</strong> The SipHeron VDR program is deployed on both Mainnet and Devnet at the following address: <code>6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo</code>.
            </Callout>

            <h2>On-Chain Identity and Organizations</h2>
            <p>
                Documents in SipHeron VDR are not just "floating" hashes; they are tied to a specific <strong>Organization Identity</strong>. An organization is represented by a Solana account that acts as the authority for a specific set of document records.
            </p>

            <h3>The Organization Account</h3>
            <p>
                Before an organization can register hashes, an <code>OrganizationConfig</code> account must be initialized. This account stores the organization's name, its primary authority public key, and administrative settings like the fee-payer configuration.
            </p>

            <div className="bg-[#1a1b20] p-6 rounded-lg my-6 border border-gray-800 font-mono text-sm overflow-x-auto text-[#4285F4]">
                <pre>{`
  OrganizationConfig Account Structure:
  - Authority: Pubkey (Owner of the organization)
  - Name: String (max 32 chars)
  - CreatedAt: i64 (Unix timestamp)
  - Active: bool
  - RegistrationCount: u64
        `}</pre>
            </div>

            <h2>Document Records and PDAs</h2>
            <p>
                As discussed in the <a href="/docs/concepts">Core Concepts</a>, each registered document is stored in its own unique account, which is a <strong>Program Derived Address (PDA)</strong>. This architecture ensures that data access is optimized for the Solana network's "Sealevel" parallel execution engine.
            </p>

            <h3>VdrRecord Account Data</h3>
            <p>
                A <code>VdrRecord</code> account is created once per unique hash per organization. If the same hash is registered by two different organizations, two separate PDA accounts are created, ensuring namespace isolation.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Field</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Size (Bytes)</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm font-mono text-[#4285F4]">hash</td><td className="py-3 px-4 text-sm text-gray-300">32</td><td className="py-3 px-4 text-sm text-gray-400">The 32-byte raw binary representation of the SHA-256 hash.</td></tr>
                        <tr><td className="py-3 px-4 text-sm font-mono text-[#4285F4]">organization</td><td className="py-3 px-4 text-sm text-gray-300">32</td><td className="py-3 px-4 text-sm text-gray-400">The Pubkey of the issuer organization.</td></tr>
                        <tr><td className="py-3 px-4 text-sm font-mono text-[#4285F4]">timestamp</td><td className="py-3 px-4 text-sm text-gray-300">8</td><td className="py-3 px-4 text-sm text-gray-400">Unix timestamp provided by the network's clock.</td></tr>
                        <tr><td className="py-3 px-4 text-sm font-mono text-[#4285F4]">status</td><td className="py-3 px-4 text-sm text-gray-300">1</td><td className="py-3 px-4 text-sm text-gray-400">Enum (0: Active, 1: Revoked, 2: Superseded).</td></tr>
                        <tr><td className="py-3 px-4 text-sm font-mono text-[#4285F4]">bump</td><td className="py-3 px-4 text-sm text-gray-300">1</td><td className="py-3 px-4 text-sm text-gray-400">The nonce used to derive the PDA.</td></tr>
                    </tbody>
                </table>
            </div>

            <h2>Fees and Rent</h2>
            <p>
                Consistent with the Solana state model, creating a <code>VdrRecord</code> account requires "Rent" to be paid in SOL. This rent ensures the data remains on the ledger permanently.
            </p>

            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Rent Exemption:</strong> SipHeron VDR accounts are created with enough SOL to be Rent-Exempt, meaning they will никогда be garbage-collected by the network.</li>
                <li><strong>Relayer Model:</strong> When using the SipHeron API, the rent and transaction fees are paid by SipHeron's treasury and covered by your subscription credits. If you interface directly with the contract, you must provide the SOL from your own wallet.</li>
            </ul>

            <CodeBlock
                language="rust"
                code={`// Snippet from the Anchor program defining the Record account
#[account]
pub struct VdrRecord {
    pub hash: [u8; 32],
    pub organization: Pubkey,
    pub timestamp: i64,
    pub status: u8,
    pub bump: u8,
}`}
            />

            <h2>Integration Patterns</h2>
            <p>
                Developers interacting with the contract directly should use the <strong>Anchor Framework</strong> definitions. We provide a TypeScript IDL (Interface Definition Language) file that can be used with <code>@coral-xyz/anchor</code> to generate a type-safe client in seconds.
            </p>

            <CodeBlock
                language="typescript"
                code={`import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SipheronVdr } from "../target/types/sipheron_vdr";

const program = anchor.workspace.SipheronVdr as Program<SipheronVdr>;
// The IDL handles all the PDA derivation and account serialization logic.`}
            />

            <Callout type="warning">
                <strong>Direct Interaction:</strong> Bypassing the SipHeron API means you are responsible for managing your own Solana wallet, handling RPC endpoint rate limits, and securing your private keys.
            </Callout>

            <h2>Next Steps</h2>
            <p>
                To learn how to execute specific functions like <code>registerHash</code> or <code>revokeHash</code>, proceed to the <a href="/docs/contract/instructions">Instructions Reference</a>. For a deep dive into the security audits and administrative controls of the program, see <a href="/docs/contract/security">Contract Security</a>.
            </p>
        </>
    );
}
