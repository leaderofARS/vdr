export async function generateMetadata({ params }) {
    const hash = params?.hash || '';
    return {
        title: 'Verify Document — SipHeron VDR',
        description: `Verify document hash ${hash.slice(0, 16)}... on the Solana blockchain`,
        openGraph: {
            title: 'Document Verification — SipHeron VDR',
            description: 'Blockchain-verified document authenticity check',
        },
    };
}

export default function VerifyLayout({ children }) {
    return (
        <>
            <style>{`.global-navbar-wrapper { display: none !important; }`}</style>
            <div style={{ margin: 0, padding: 0 }}>
                {children}
            </div>
        </>
    );
}
