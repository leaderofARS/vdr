'use client';
import { useState } from 'react';

export default function CodeBlock({ code, language = 'bash' }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-lg overflow-hidden my-6 bg-[#1a1b20] border border-gray-800 shadow-xl not-prose">
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800 bg-[#131418]">
                <span className="text-xs text-gray-400 font-mono uppercase">{language}</span>
                <button
                    onClick={copyToClipboard}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    title="Copy code"
                >
                    {copied ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm bg-transparent !m-0 !line-clamp-none font-mono text-gray-200">
                <code>{code}</code>
            </pre>
        </div>
    );
}
