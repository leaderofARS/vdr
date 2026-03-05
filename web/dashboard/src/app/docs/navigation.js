/**
 * Documentation Navigation Configuration
 * The single source of truth for the Docs sidebar.
 */
export const navigation = [
    {
        title: "Getting Started",
        links: [
            { title: "Introduction", href: "/docs" },
            { title: "Quickstart", href: "/docs/quickstart" },
            { title: "Installation", href: "/docs/installation" },
        ],
    },
    {
        title: "The CLI",
        links: [
            { title: "Staging Assets", href: "/docs/cli-stage" },
            { title: "Anchoring to Solana", href: "/docs/cli-anchor" },
            { title: "Verifying Integrity", href: "/docs/cli-verify" },
        ],
    },
    {
        title: "API Reference",
        links: [
            { title: "Overview", href: "/docs/api-overview" },
            { title: "Authentication", href: "/docs/api-auth" },
            { title: "Endpoints", href: "/docs/api-endpoints" },
        ],
    },
    {
        title: "Protocol Architecture",
        links: [
            { title: "Zero-Knowledge Proofs", href: "/docs/protocol-zkp" },
            { title: "Solana Infrastructure", href: "/docs/protocol-solana" },
            { title: "Security Model", href: "/docs/protocol-security" },
        ],
    },
];
