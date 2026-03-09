const blogPosts = {
    'why-document-authenticity-matters': {
        title: "Why Document Authenticity Matters in 2025",
        content: `In 2025, the digital landscape has fundamentally shifted. With the rise of advanced AI and deepfakes, generating a perfectly forged digital document takes seconds. From employment records to legal contracts, the inability to instantly verify the authenticity of a document is creating a massive crisis of trust.`
    },
    'solana-for-document-registry': {
        title: "Why We Built on Solana Instead of Ethereum",
        content: `When designing a global document registry, the underlying infrastructure must support thousands of registrations per second. Our initial prototypes considered multiple blockchains, but Ethereum's 12-second block times and fluctuating gas fees presented a major hurdle for enterprise adoption.`
    },
    'how-vdr-works-technically': {
        title: "How SipHeron VDR Works Under the Hood",
        content: `SipHeron operates on a simple principle: we never see your file. When you register a document, your local client (CLI or web app) computes the SHA-256 hash of the file. This 64-character string is the only piece of data transmitted to our servers.`
    },
    'cli-workflow-guide': {
        title: "The 3-Command Workflow That Proves Any Document",
        content: `We designed the SipHeron CLI to be instantly familiar to anyone who uses Git. Integrating document verification into your CI/CD pipelines or local workflows is practically effortless.`
    },
    'use-cases-legal-finance': {
        title: "5 Use Cases for Blockchain Document Verification",
        content: `The cornerstone of modern commerce is the contract. By registering signed contracts on-chain, legal firms eliminate the possibility of backdated or secretly modified agreements. The chain of custody is permanently cemented.`
    },
    'devnet-to-mainnet': {
        title: "From Devnet to Mainnet: Our Roadmap",
        content: `SipHeron VDR has been operating successfully on the Solana Devnet, processing thousands of test registrations and allowing developers to integrate our SDK and CLI tools without incurring real-world costs.`
    }
};

export async function generateMetadata({ params }) {
    const slug = params?.slug;
    const post = blogPosts[slug];

    if (!post) {
        return {
            title: 'Post Not Found | SipHeron VDR',
        }
    }

    return {
        title: post.title,
        description: post.content.split('. ')[0] + '.',
    }
}

export default function Layout({ children }) {
    return children;
}
