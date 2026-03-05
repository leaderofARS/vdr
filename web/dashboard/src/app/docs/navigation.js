/**
 * Documentation Navigation Configuration
 * The single source of truth for the Docs sidebar.
 */
export const navigation = [
    {
        title: "Getting Started",
        links: [
            {
                title: "Introduction",
                href: "/docs",
                toc: ["Overview", "The Problem", "Core Architecture", "Performance & Scaling", "Next Steps"]
            },
            {
                title: "Quickstart",
                href: "/docs/quickstart",
                toc: ["Overview", "What you'll build", "Step 01: Link Key", "Step 02: Local Entropy", "Step 03: On-Chain Anchor", "Verification Flow"]
            },
            {
                title: "Installation",
                href: "/docs/installation",
                toc: ["Overview", "System Requirements", "CLI Installation", "Verify Installation", "Initialize Identity", "Identity Architecture", "Advanced Deployment"]
            },
        ],
    },
    {
        title: "The CLI",
        links: [
            {
                title: "Staging Assets",
                href: "/docs/cli-stage",
                toc: ["Overview", "Execution Flow", "Buffering & Chunking", "Cryptographic Standard", "Scaling & Concurrency", "Error Handling", "Local Metadata", "Privacy & Sovereignty"]
            },
            {
                title: "Anchoring to Solana",
                href: "/docs/cli-anchor",
                toc: ["Overview", "Execution Mechanism", "Merkle Aggregation", "PDA Derivation", "Sovereignty Audit", "Economic Model & Fees", "Lifecycle States"]
            },
            {
                title: "Verifying Integrity",
                href: "/docs/cli-verify",
                toc: ["Overview", "Forensic Handshake", "Merkle Proofs", "On-Chain Resolution", "Interpreting Results", "Forensic API"]
            },
        ],
    },
    {
        title: "API Reference",
        links: [
            {
                title: "Overview",
                href: "/docs/api-overview",
                toc: ["Introduction", "Base URL", "Rate Limits"]
            },
            {
                title: "Authentication",
                href: "/docs/api-auth",
                toc: ["Bearer Tokens", "API Keys", "Scopes"]
            },
            {
                title: "Endpoints",
                href: "/docs/api-endpoints",
                toc: ["Health", "Register", "Verify"]
            },
        ],
    },
    {
        title: "Protocol Architecture",
        links: [
            {
                title: "Zero-Knowledge Proofs",
                href: "/docs/protocol-zkp",
                toc: ["Theory", "Implementation", "Privacy"]
            },
            {
                title: "Solana Infrastructure",
                href: "/docs/protocol-solana",
                toc: ["Accounts", "Programs", "Rent"]
            },
            {
                title: "Security Model",
                href: "/docs/protocol-security",
                toc: ["Threat Model", "Audits", "Remediation"]
            },
        ],
    },
];
