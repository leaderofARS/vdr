import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

export const metadata = {
    title: 'CLI Security Model | SipHeron VDR',
    description: 'Learn about the encryption, authentication, and security protocols protecting your local SipHeron VDR environment.',
};

export default function SecurityModelPage() {
    return (
        <>
            <h1>CLI Security Model</h1>
            <p className="lead text-xl text-gray-300">
                Security is a foundational pillar of SipHeron VDR. The CLI tool is built to handle sensitive organizational data and cryptographic keys in a secure manner. This page details the multi-layered security protocols applied to local storage, communications, and execution.
            </p>

            <Callout type="warning">
                <strong>Security Responsibilities:</strong> While SipHeron provides robust defaults, the security of your local machine and your master passphrase remains your responsibility. Ensure you use unique, high-entropy passphrases and maintain strict access control on your <code>~/.sipheron</code> directory.
            </Callout>

            <h2>Local At-Rest Encryption (AES-256-GCM)</h2>
            <p>
                The CLI does not store API keys or session tokens in plain text. Instead, it utilizes <strong>AES-256-GCM</strong> (Advanced Encryption Standard with Galois/Counter Mode) to encrypt sensitive data at rest. This is an authenticated encryption scheme that provides both confidentiality and integrity protection.
            </p>

            <h3>Encryption Key Derivation</h3>
            <p>
                Your master passphrase is never stored directly. Instead, it is passed through a memory-hard key derivation function, <strong>Argon2id</strong>, with a randomly generated salt. The resulting 256-bit key is then used for the AES-GCM encryption step. This makes brute-force attacks significantly more computationally expensive and time-consuming.
            </p>

            <div className="bg-[#1a1b20] p-6 rounded-lg my-6 border border-gray-800 font-mono text-sm overflow-x-auto text-[#4285F4]">
                <pre>{`
  Security Flow:
  Passphrase -> [Argon2id KDF] -> 256-bit Key
  Key + Nonce -> [AES-GCM-256] -> Encrypted keys.enc
  Encrypted Data + Auth Tag -> Verified Integrity
        `}</pre>
            </div>

            <h2>Mutually Authenticated Communication (TLS)</h2>
            <p>
                All communications between the CLI and the SipHeron API (<code>https://api.sipheron.com</code>) are protected using <strong>TLS 1.3</strong>. This ensures that your registration requests cannot be intercepted or tampered with by man-in-the-middle (MITM) attacks.
            </p>

            <ul className="list-disc ml-6 my-6 space-y-3 text-gray-300">
                <li><strong>HTTPS Enforcement:</strong> The CLI rejects any non-encrypted HTTP endpoints.</li>
                <li><strong>Certificate Pinning:</strong> In high-security environments, you can configure the CLI to pin the SipHeron API's root certificate to prevent spoofing by internal transparent proxies.</li>
                <li><strong>Bearer Token Rotation:</strong> Session tokens (JWTs) have a limited lifespan and are automatically refreshed by the CLI using an encrypted refresh token stored in the local vault.</li>
            </ul>

            <h2>FileSystem and Symlink Protection</h2>
            <p>
                When staging files, the CLI must interact directly with your file system. To prevent <strong>Symlink Attack</strong> vulnerabilities (where an attacker might use a symbolic link to point the CLI to a system-sensitive file like <code>/etc/shadow</code>), SipHeron implements strict path verification.
            </p>

            <CodeBlock
                language="javascript"
                code={`// Example of internal path resolution check
import fs from 'fs';
import path from 'path';

function securePathResolve(targetPath) {
  const resolved = path.resolve(targetPath);
  const lstat = fs.lstatSync(resolved);
  if (lstat.isSymbolicLink()) {
    throw new Error('Security Error: Symbolic links are blocked by default for security.');
  }
  return resolved;
}`}
            />

            <Callout type="info">
                <strong>Overriding Symlink Protection:</strong> If your workflow strictly requires symbolic links, you can enable them with the <code>--allow-symlinks</code> flag, though this is not recommended for production environments.
            </Callout>

            <h2>Process and Permission Model</h2>
            <p>
                The CLI is designed to run with the minimum privilege necessary:
            </p>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-left border-collapse border border-gray-800">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#1a1b20]">
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Category</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Security Control</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-200">Outcome</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#131418]">
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300">Memory Management</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Zeroing memory after cryptographic operations.</td>
                            <td className="py-3 px-4 text-sm font-medium text-green-400">Prevents side-channel memory leaks.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300">File Permissions</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Enforcing <code>chmod 600</code> on <code>~/.sipheron</code> folders.</td>
                            <td className="py-3 px-4 text-sm font-medium text-green-400">Prevents other users on the system from reading keys.</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-sm text-gray-300">CI Integration</td>
                            <td className="py-3 px-4 text-sm text-gray-400">Support for short-lived ephermal API keys.</td>
                            <td className="py-3 px-4 text-sm font-medium text-green-400">Limits blast radius if a CI runner is compromised.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Environment Variables and Secret Masking</h2>
            <p>
                When running in automated environments, the CLI can ingest sensitive credentials via environment variables like <code>SIPHERON_API_KEY</code>. To prevent accidental leaks in log files, the CLI automatically masks these values in its <code>--verbose</code> output.
            </p>

            <CodeBlock
                language="bash"
                code={`# Secure usage in CI script
export SIPHERON_API_KEY="sh_live_8921..."
sipheron-vdr anchor ./production-package.zip --wait`}
            />

            <h3>Anti-Tamper Registry</h3>
            <p>
                The local registry (<code>registry.sqlite</code>) uses an internal checksumming mechanism. If an attacker manually modifies the local database entries to point a hash to a different local file, the CLI will detect the integrity mismatch during the <code>status</code> or <code>verify</code> commands and alert the user immediately.
            </p>

            <Callout type="tip">
                <strong>Best Practice:</strong> Use an OS-level hardened environment (like a dedicated service account with limited filesystem access) for production anchoring servers to minimize the potential attack surface.
            </Callout>

            <h2>Audit Logging</h2>
            <p>
                Every authoritative command executed by the CLI (init, link, anchor, revoke) is logged both locally and on the SipHeron API server. This creates an immutable audit trail for organizational compliance. These logs include the timestamp, the user identity, the command executed, and the resulting transaction hash.
            </p>

            <p>
                For further information on our platform's security architecture, including the Solana smart contract security, navigate to the <a href="/docs/contract/security">Contract Security</a> section.
            </p>
        </>
    );
}
