import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'Contract Security Model | SipHeron VDR',
    description: 'Deep dive into the security architecture of the SipHeron VDR Solana program, including audit status and authority models.',
};

export default function ContractSecurityPage() {
    return (
        <>
            <h1>Contract Security and Trust</h1>
            <p className="lead text-xl text-gray-300">
                The integrity of the SipHeron VDR platform rests on the security of its on-chain smart contract. Any vulnerability in the program could compromise the validity of millions of documents. This page details the defensive programming practices, authority models, and audit measures implemented to protect the registry.
            </p>

            <Callout type="info">
                <strong>Open Source & Verifiable:</strong> The SipHeron VDR program source code is public and can be verified against the on-chain BPF (Berkeley Packet Filter) bytecode using the <code>solana program dump</code> command.
            </Callout>

            <h2>PDA Ownership and Isolation</h2>
            <p>
                SipHeron VDR utilizes <strong>Program Derived Addresses (PDAs)</strong> not just for organization but for security. In the Solana model, only the program that "owns" an account can modify its data.
            </p>

            <h3>Namespace Protection</h3>
            <p>
                Because every <code>VdrRecord</code> PDA is seeded with the organization's public key, it is mathematically impossible for Organization A to register a hash under Organization B's namespace. The program strictly validates that the <code>authority</code> signer of the transaction matches the <code>authority</code> stored in the <code>OrganizationConfig</code> account.
            </p>

            <CodeBlock
                language="rust"
                code={`// Example of authority check in Anchor
#[derive(Accounts)]
pub struct RegisterHash<'info> {
    #[account(
        init, 
        payer = authority, 
        space = 8 + 32 + 32 + 8 + 1 + 1,
        seeds = [b"vdr-record", org_config.key().as_ref(), hash.as_ref()],
        bump
    )]
    pub record: Account<'info, VdrRecord>,
    
    #[account(has_one = authority)] // Strict authority check
    pub org_config: Account<'info, OrganizationConfig>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}`}
            />

            <h2>Authority and Upgradeability</h2>
            <p>
                Transparency regarding who can change the program logic is essential for institutional trust. SipHeron VDR follows a phased decentralization path for program upgrades.
            </p>

            <h3>Upgrade Authority</h3>
            <p>
                Currently, the upgrade authority for the program is held by a <strong>Multisig Wallet</strong> (Gnosis Safe on Solana). Any change to the program code requires 3-of-5 signatures from independent security officers within the SipHeron ecosystem. This prevents any single compromised key from altering the protocol logic.
            </p>

            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Role</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Authority Level</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Capabilities</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300">SipHeron Multisig</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Program Manager</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Deploy updates, adjust global fees, pause/unpause protocol.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300">Org Authority</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Data Owner</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Register new hashes, revoke existing documents.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300">Public Verifier</td>
                            <td className="py-3 px-4 text-sm text-gray-400">View Only</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Query account state, verify integrity (cannot modify).</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Audit and Formal Verification</h2>
            <p>
                The SipHeron VDR program has undergone multiple rigorous security audits by leading third-party firms specializing in Solana and Rust-based smart contracts.
            </p>

            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>Static Analysis:</strong> We perform continuous automated scans using <code>anchor-lint</code> and <code>clippy</code> to catch common logic errors and memory leaks.</li>
                <li><strong>Fuzz Testing:</strong> Our CI pipeline runs millions of randomized transactions against the program to identify edge cases and potential overflow vulnerabilities.</li>
                <li><strong>External Audit:</strong> A comprehensive audit of the v1.2 codebase was completed by <em>Quantstamp</em> in Q4 2023. No critical vulnerabilities were identified.</li>
            </ul>

            <Callout type="warning">
                <strong>Emergency Kill-Switch:</strong> In the event of an unidentified critical exploit, the multisig authority has the power to "Pause" the <code>registerHash</code> and <code>revokeHash</code> instructions. Existing data remains readable and verifiable, but new modifications are blocked until a patch is deployed.
            </Callout>

            <h2>Fee Distribution and Treasury</h2>
            <p>
                When a document is registered, a small fee is collected. This fee is used to subsidize the Solana "Rent" (which is quite high for millions of accounts) and to fund the ongoing infrastructure and security maintenance of the protocol.
            </p>
            <p>
                The fee distribution logic is encoded directly into the <code>register_hash</code> instruction, ensuring that rewards are distributed fairly and transparently to the protocol's operators.
            </p>

            <h2>Securing Your Identity</h2>
            <p>
                Because the smart contract relies on the <code>authority</code> signature for all modifications, the security of your organization is only as strong as your <strong>private key management</strong>.
            </p>
            <ol className="list-decimal space-y-4 ml-6 my-6 text-gray-300">
                <li><strong>Use Hardware Wallets:</strong> For high-value document registries, always use a Ledger or Trezor device as the organizational authority.</li>
                <li><strong>Granular Roles:</strong> Use SipHeron's IAM (Identity and Access Management) to delegate "Issuer" roles to your employees, keeping your primary master authority key offline.</li>
                <li><strong>Monitoring:</strong> Subscribe to our real-time <a href="/docs/api/webhooks">Webhooks</a> to be notified of any changes to your document registry instantly.</li>
            </ol>

            <Callout type="tip">
                <strong>Verification Tip:</strong> You can use <code>solana-verify</code> (the tool from Ottersec) to ensure that the code running on mainnet perfectly matches the code in our public GitHub repository.
            </Callout>

            <CodeBlock
                language="bash"
                code={`# Example of verifying on-chain program
solana-verify -p 6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo \\
  --git-url https://github.com/SipHeron/solana-vdr-program`}
            />
        </>
    );
}
