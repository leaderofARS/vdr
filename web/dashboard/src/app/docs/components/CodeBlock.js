'use client'
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        // If text is React children, we might need to extract string, but usually it's passed as string in docs
        const content = typeof text === 'string' ? text : text.toString();
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            {copied && <span className="text-[11px] text-[#9B6EFF] animate-in fade-in duration-200">Copied!</span>}
            <button
                onClick={copy}
                className="p-1.5 rounded hover:bg-[#1A1A1A] text-[#555] hover:text-[#EDEDED] transition-colors"
            >
                {copied ? <Check className="w-3.5 h-3.5 text-[#9B6EFF]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
        </div>
    );
}

export default function CodeBlock({ language, filename, children }) {
    return (
        <div className="relative my-6 rounded-lg border border-[#2A2A2A] bg-[#111] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A2A2A] bg-[#0A0A0A]">
                <div className="flex items-center gap-2">
                    {filename && <span className="text-[12px] text-[#888]">{filename}</span>}
                    {!filename && language && <span className="text-[11px] uppercase text-[#555] font-mono tracking-wider">{language}</span>}
                </div>
                <CopyButton text={children} />
            </div>
            <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-[#EDEDED]">
                <code>{children}</code>
            </pre>
        </div>
    );
}
