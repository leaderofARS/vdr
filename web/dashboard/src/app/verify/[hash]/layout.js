export async function generateMetadata({ params }) {
    const { hash } = params;
    return {
        title: `Verify Document — SipHeron VDR`,
        description: `Verify the authenticity of document hash ${hash.slice(0, 16)}... on the Solana blockchain`,
        openGraph: {
            title: 'Document Verification — SipHeron VDR',
            description: 'Blockchain-verified document authenticity check',
            images: ['/og-verify.png'],
        },
    };
}

export default function VerifyLayout({ children }) {
    return children;
}
