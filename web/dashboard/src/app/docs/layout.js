import DocsHeader from './components/DocsHeader';
import DocsSidebar from './components/DocsSidebar';
import DocsTOC from './components/DocsTOC';

export const metadata = {
    title: {
        template: '%s | SipHeron VDR Docs',
        default: 'SipHeron VDR Documentation'
    },
    description: 'Enterprise-grade blockchain document verification platform built on Solana. Learn how to anchor, verify, and integrate.',
};

export default function DocsLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#08080F] text-[#9B8EC4] font-sans selection:bg-[#4F6EF7]/30 selection:text-[#F0EEFF] flex flex-col">
            <DocsHeader />
            <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row pt-12 lg:pt-16">
                {/* Left Sidebar (Desktop) */}
                <DocsSidebar />

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 px-4 sm:px-8 md:px-12 lg:px-16 pt-0 pb-24 scroll-smooth">
                    <div className="max-w-3xl mx-auto prose prose-invert 
                        prose-headings:text-[#F0EEFF] prose-headings:font-bold 
                        prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:tracking-tight prose-h1:mb-8 prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-[#F0EEFF] prose-h1:to-[#9B8EC4]
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-[#151525] prose-h2:pb-2
                        prose-h3:text-lg prose-h3:text-[#B794FF] prose-h3:mt-8
                        prose-p:text-base prose-p:leading-relaxed prose-p:text-[#9B8EC4]
                        prose-a:text-[#4F6EF7] hover:prose-a:text-[#B794FF] prose-a:transition-colors prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-[#F0EEFF] prose-strong:font-bold
                        prose-ul:list-disc prose-ul:pl-6 prose-li:text-[#9B8EC4] prose-li:marker:text-[#5B5380]
                        prose-code:text-[#B794FF] prose-code:bg-[#151525] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[0.85em]
                        prose-code:before:content-none prose-code:after:content-none
                        max-w-none">
                        {children}
                    </div>
                </main>

                {/* Right TOC (Desktop) */}
                <DocsTOC />
            </div>
        </div>
    );
}
