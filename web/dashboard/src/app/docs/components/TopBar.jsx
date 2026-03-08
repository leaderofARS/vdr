import Link from 'next/link';

export default function TopBar() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#131418]/90 backdrop-blur-md border-b border-gray-800 z-50 flex items-center px-4 sm:px-6">
            <div className="flex items-center gap-6 flex-1">
                <Link href="/docs" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded bg-[#4285F4] flex items-center justify-center text-white font-bold group-hover:bg-blue-400 transition-colors">
                        SH
                    </div>
                    <span className="text-white font-semibold text-lg tracking-tight">SipHeron VDR</span>
                </Link>
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        className="w-full bg-[#1a1b20] border border-gray-700 rounded-md py-1.5 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 flex gap-1">
                        <span className="text-xs bg-[#24252a] px-1.5 py-0.5 rounded border border-gray-700">Ctrl</span>
                        <span className="text-xs bg-[#24252a] px-1.5 py-0.5 rounded border border-gray-700">K</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <a href="https://github.com/SipHeron/solana-vdr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                </a>
                <Link href="/dashboard" className="px-4 py-1.5 bg-[#4285F4] text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors shadow-[0_0_10px_rgba(66,133,244,0.3)]">
                    Get Started
                </Link>
            </div>
        </header>
    );
}
