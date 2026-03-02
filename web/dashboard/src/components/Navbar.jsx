import Link from "next/link";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

export default function Navbar() {
    return (
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                            VDR
                        </Link>
                        <div className="hidden md:flex space-x-6">
                            <Link href="/" className="text-gray-300 hover:text-white transition-colors">Register</Link>
                            <Link href="/verify" className="text-gray-300 hover:text-white transition-colors">Verify</Link>
                            <Link href="/explorer" className="text-gray-300 hover:text-white transition-colors">Explorer</Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <WalletMultiButton className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
