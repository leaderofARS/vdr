'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ language, filename, children }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(children?.toString() || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const highlight = (code) => {
        if (typeof code !== 'string') return code;

        const lines = code.split('\n');
        return lines.map((line, i) => {
            let formattedLine = line;

            // Handles Comments
            if (formattedLine.includes('//') || formattedLine.includes('#')) {
                const commentChar = formattedLine.includes('//') ? '//' : '#';
                const parts = formattedLine.split(commentChar);
                const beforeComment = parts[0];
                const comment = parts.slice(1).join(commentChar);

                // Still highlight the part before comment
                let highlightedBefore = beforeComment
                    .replace(/(['"`].*?['"`])/g, '<span style="color:#10B981">\$1</span>')
                    .replace(/\b(npm|install|export|const|let|var|return|function|if|else|import|from|async|await|true|false)\b/g, '<span style="color:#9B6EFF">\$1</span>')
                    .replace(/\b(\d+)\b/g, '<span style="color:#F59E0B">\$1</span>')
                    .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span style="color:#4F6EF7">\$1</span>');

                return (
                    <div key={i} className="table-row">
                        <span className="table-cell text-right pr-4 select-none opacity-30 text-xs border-r border-[#151525] mr-4 whitespace-nowrap w-8">{i + 1}</span>
                        <span className="table-cell pl-4 whitespace-pre">
                            <span dangerouslySetInnerHTML={{ __html: highlightedBefore }} />
                            <span className="text-[#5B5380]">{commentChar}{comment}</span>
                        </span>
                    </div>
                );
            }

            let highlighted = formattedLine
                .replace(/(['"`].*?['"`])/g, '<span style="color:#10B981">\$1</span>')
                .replace(/\b(npm|install|export|const|let|var|return|function|if|else|import|from|async|await|true|false)\b/g, '<span style="color:#9B6EFF">\$1</span>')
                .replace(/\b(\d+)\b/g, '<span style="color:#F59E0B">\$1</span>')
                .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span style="color:#4F6EF7">\$1</span>');

            return (
                <div key={i} className="table-row">
                    <span className="table-cell text-right pr-4 select-none opacity-30 text-xs border-r border-[#151525] whitespace-nowrap w-8">{i + 1}</span>
                    <span className="table-cell pl-4 whitespace-pre" dangerouslySetInnerHTML={{ __html: highlighted }} />
                </div>
            );
        });
    };

    return (
        <div className="my-6 rounded-xl overflow-hidden bg-[#08080F] border border-[#151525] group relative shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-[#0F0F1A] border-b border-[#151525]">
                <span className="text-xs font-mono text-[#9B8EC4] tracking-wide">
                    {filename || language || 'terminal'}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#151525] border border-transparent text-[#9B8EC4] hover:text-[#F0EEFF] hover:bg-[#08080F] hover:border-[#5B5380] transition-all opacity-0 group-hover:opacity-100 text-xs font-bold"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'COPIED' : 'COPY'}
                </button>
            </div>
            <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed relative">
                <div className="table text-[#F0EEFF] min-w-full">
                    {highlight(children)}
                </div>
            </div>
        </div>
    );
}
