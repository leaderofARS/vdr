import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Contract Instructions Reference | SipHeron VDR',
    description: 'Technical reference for Solana smart contract instructions, including PDA derivation and account requirements.',
};

export default function InstructionsPage() {
    return (
        <>
            <h1>Contract Instructions</h1>
            <p className="lead text-xl text-gray-300">
                This document provides the technical requirements for interacting directly with the SipHeron VDR smart contract. Each section details the required accounts, input arguments, and PDA derivation seeds for the primary program instructions.
            </p>

            <Callout type="info">
                <strong>Anchor Framework:</strong> The SipHeron VDR program is built using <a href="https://www.anchor-lang.com/" target="_blank" rel="noopener noreferrer">Anchor</a>. All instructions include an 8-byte discriminator prefixed to the accounts and data during serialization.
            </Callout>

            <h2 id="register-hash">registerHash</h2>
            <p>
                The <code>registerHash</code> instruction creates a new <code>VdrRecord</code> account on-chain. This instruction can only be called by the authority of the specified organization or the global protocol relayer.
            </p>

            <h3>Arguments</h3>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Name</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Type</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm font-mono text-[#4285F4]">hash</td>
                            <td className="py-3 px-4 text-sm text-gray-300">[u8; 32]</td>
                            <td className="py-3 px-4 text-sm text-gray-400">The 32-byte binary SHA-256 digest of the document.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Required Accounts</h3>
            <ol className="list-decimal space-y-4 ml-6 my-6 text-gray-300">
                <li><strong>record:</strong> [Write, Signer: No] The PDA account to be created.
                    <br /><span className="text-xs text-gray-500">Seeds: <code>["vdr-record", org_config.key(), hash]</code></span>
                </li>
                <li><strong>org_config:</strong> [Read, Signer: No] The organization's configuration account.</li>
                <li><strong>authority:</strong> [Read, Signer: Yes] The organization owner or authorized issuer.</li>
                <li><strong>system_program:</strong> [Read, Signer: No] Standard Solana System Program.</li>
            </ol>

            <CodeBlock
                language="rust"
                code={`// Rust implementation signature
pub fn register_hash(ctx: Context<RegisterHash>, hash: [u8; 32]) -> Result<()> {
    let record = &mut ctx.accounts.record;
    record.hash = hash;
    record.organization = ctx.accounts.org_config.key();
    record.timestamp = Clock::get()?.unix_timestamp;
    record.status = 0; // Active
    Ok(())
}`}
            />

            <h2 id="revoke-hash">revokeHash</h2>
            <p>
                Updates the status of an existing <code>VdrRecord</code> account to <code>1</code> (Revoked). This instruction requires the signature of the organization's authority.
            </p>

            <h3>Required Accounts</h3>
            <ol className="list-decimal space-y-4 ml-6 my-6 text-gray-300">
                <li><strong>record:</strong> [Write, Signer: No] The existing <code>VdrRecord</code> PDA.</li>
                <li><strong>authority:</strong> [Read, Signer: Yes] Must match the <code>authority</code> stored in the <code>org_config</code> associated with the record.</li>
            </ol>

            <CodeBlock
                language="bash"
                code={`# Example using Anchor CLI to revoke
anchor-cli call revokeHash \\
  --accounts record=PDA_ADDRESS,authority=YOUR_WALLET \\
  --provider.cluster mainnet`}
            />

            <h2 id="initialize-organization">initOrganization</h2>
            <p>
                Initializes the <code>OrganizationConfig</code> account for a new organization. This is typically handled by the SipHeron administrative interface but can be called directly by enterprise partners.
            </p>

            <h3>Arguments</h3>
            <ul className="list-disc ml-6 my-4 space-y-2 text-sm text-gray-400">
                <li><code>name</code>: String (max 32 bytes).</li>
            </ul>

            <h3>Required Accounts</h3>
            <ol className="list-decimal space-y-4 ml-6 my-6 text-gray-300">
                <li><strong>org_config:</strong> [Write, Signer: No] The new configuration PDA.
                    <br /><span className="text-xs text-gray-500">Seeds: <code>["org-config", authority.key()]</code></span>
                </li>
                <li><strong>authority:</strong> [Write, Signer: Yes] The wallet that will own this organization.</li>
            </ol>

            <Callout type="warning">
                <strong>PDA Collisions:</strong> The Solana runtime ensures that PDA derivation is collision-resistant. However, you must always provide the correct seeds in the correct order to successfully resolve the account address.
            </Callout>

            <h2>Account Derivation (TypeScript)</h2>
            <p>
                For client-side integrations using <code>@solana/web3.js</code>, you can derive the PDA addresses using the following logic:
            </p>

            <CodeBlock
                language="typescript"
                code={`const [recordPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
  [
    Buffer.from("vdr-record"),
    orgConfigPubkey.toBuffer(),
    Buffer.from(fileHashHex, "hex")
  ],
  PROGRAM_ID
);`}
            />

            <h2>Error Codes</h2>
            <p>
                The program defines several custom error codes to handle invalid state transitions.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Error Name</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Hex Code</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr><td className="py-3 px-4 text-sm font-mono text-red-400">Unauthorized</td><td className="py-3 px-4 text-sm text-gray-400">0x1770</td><td className="py-3 px-4 text-sm text-gray-400">The signer is not the authority for this record.</td></tr>
                        <tr><td className="py-3 px-4 text-sm font-mono text-red-400">AccountAlreadyInitialized</td><td className="py-3 px-4 text-sm text-gray-400">0x0</td><td className="py-3 px-4 text-sm text-gray-400">Standard Solana error when re-creating a PDA.</td></tr>
                        <tr><td className="py-3 px-4 text-sm font-mono text-red-400">RecordAlreadyRevoked</td><td className="py-3 px-4 text-sm text-gray-400">0x1771</td><td className="py-3 px-4 text-sm text-gray-400">Cannot revoke a record that is already marked revoked.</td></tr>
                    </tbody>
                </table>
            </div>

            <Callout type="tip">
                <strong>Explaining IDLs:</strong> If you are using the Anchor framework, you do not need to manually manage account ordering or hex codes. Simply load the JSON IDL and the framework will handle the heavy lifting of instruction serialization.
            </Callout>

        </>
    );
}
