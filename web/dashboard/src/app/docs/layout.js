import DocsHeader from './components/DocsHeader';
import DocsSidebar from './components/DocsSidebar';
import DocsTOC from './components/DocsTOC';

export const metadata = {
    title: {
        template: '%s | SipHeron VDR Docs',
        default: 'SipHeron VDR Documentation',
    },
    description: 'Enterprise-grade blockchain document verification platform built on Solana.',
};

export default function DocsLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-[#9B6EFF]/30 selection:text-white">
            <style dangerouslySetInnerHTML={{
                __html: `
        :root {
          --bg-page: #0A0A0A;
          --bg-sidebar: #0A0A0A;
          --bg-surface: #111111;
          --bg-hover: #1A1A1A;
          --bg-active: #1F1F1F;
          --border: #2A2A2A;
          --border-subtle: #1F1F1F;
          --text-primary: #EDEDED;
          --text-secondary: #888888;
          --text-muted: #555555;
          --text-accent: #9B6EFF;
        }

        body {
          background-color: var(--bg-page);
          color: var(--text-primary);
          -webkit-font-smoothing: antialiased;
        }

        /* Vercel Typography Replay */
        h1 { font-size: 28px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 24px; color: var(--text-primary); }
        h2 { font-size: 20px; font-weight: 600; margin-top: 40px; margin-bottom: 16px; border-bottom: 1px solid #1F1F1F; padding-bottom: 8px; color: var(--text-primary); }
        h3 { font-size: 16px; font-weight: 600; margin-top: 28px; margin-bottom: 12px; color: var(--text-primary); }
        p { font-size: 14px; line-height: 1.7; color: var(--text-secondary); margin-bottom: 16px; }
        
        .docs-content strong { color: var(--text-primary); font-weight: 600; }
        .docs-content ul, .docs-content ol { margin-bottom: 16px; padding-left: 20px; color: var(--text-secondary); font-size: 14px; }
        .docs-content li { margin-bottom: 8px; }
        
        .docs-content code:not(pre code) {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.85em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: var(--text-accent);
        }

        /* Transitions */
        a, button { transition: all 150ms ease; }
      `}} />

            <DocsHeader />

            <div className="flex max-w-[1400px] mx-auto min-h-[calc(100vh-48px)]">
                {/* Fixed/Sticky Sidebar Spacer */}
                <div className="w-[240px] shrink-0 hidden md:block" />

                {/* Real Sidebar is fixed in its component */}
                <DocsSidebar />

                {/* Main Content */}
                <main className="flex-1 w-full min-w-0 pt-10 pb-24 px-6 md:px-10 lg:px-16 flex justify-center">
                    <div className="w-full max-w-[680px] docs-content">
                        {children}
                    </div>
                </main>

                {/* Right TOC */}
                <DocsTOC />
            </div>
        </div>
    );
}
