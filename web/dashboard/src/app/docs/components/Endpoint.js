export default function Endpoint({ method, path, children }) {
    const colors = {
        GET: 'text-[#4F6EF7] bg-[#4F6EF7]/10 border-[#4F6EF7]/20',
        POST: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20',
        PUT: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20',
        DELETE: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20'
    };

    const methodColor = colors[method] || colors.GET;

    return (
        <div className="my-8 rounded-2xl border border-[#151525] bg-[#0F0F1A] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-4 px-6 py-4 border-b border-[#151525] bg-[#08080F]">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-widest border ${methodColor}`}>
                    {method}
                </span>
                <span className="font-mono text-sm text-[#F0EEFF] tracking-tight">{path}</span>
            </div>
            <div className="px-6 py-5 text-sm text-[#9B8EC4] leading-relaxed">
                {children}
            </div>
        </div>
    );
}
