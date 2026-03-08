import TopBar from './components/TopBar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';

export const metadata = {
    title: 'SipHeron VDR Documentation',
    description: 'Enterprise-grade blockchain document verification platform built on Solana.',
};

export default function DocsLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#131418] text-gray-300 font-sans selection:bg-[#4285F4] selection:text-white flex flex-col">
            <TopBar />
            <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row pt-16">
                <aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-gray-800 bg-[#131418] pt-8 pb-24 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
                    <LeftSidebar />
                </aside>
                <main className="flex-1 min-w-0 px-4 sm:px-8 md:px-12 lg:px-16 pt-8 pb-24 docs-content">
                    <div className="max-w-4xl mx-auto prose prose-invert prose-headings:text-white prose-a:text-[#4285F4] hover:prose-a:text-blue-400 prose-code:text-[#4285F4] prose-code:bg-[#1e1e24] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-[#1a1b20] prose-pre:border prose-pre:border-gray-800">
                        {children}
                    </div>
                </main>
                <aside className="hidden xl:block w-64 shrink-0 pt-8 pb-24 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
                    <RightSidebar />
                </aside>
            </div>
        </div>
    );
}
