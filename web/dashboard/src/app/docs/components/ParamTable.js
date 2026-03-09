export default function ParamTable({ children }) {
    return (
        <div className="my-6 overflow-x-auto rounded-xl border border-[#151525] bg-[#0F0F1A] shadow-lg">
            <table className="w-full text-left text-sm text-[#9B8EC4] border-collapse min-w-[600px]">
                <thead>
                    <tr className="bg-[#08080F] border-b border-[#151525] uppercase tracking-widest text-[10px] font-bold text-[#5B5380]">
                        <th className="px-6 py-4 font-bold text-left">Parameter</th>
                        <th className="px-6 py-4 font-bold text-left">Type</th>
                        <th className="px-6 py-4 font-bold text-center">Required</th>
                        <th className="px-6 py-4 font-bold text-left w-1/2">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#151525]">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export function ParamRow({ name, type, required, children }) {
    return (
        <tr className="hover:bg-[#151525]/30 transition-colors">
            <td className="px-6 py-5 font-mono text-xs text-[#F0EEFF]">{name}</td>
            <td className="px-6 py-5 text-xs font-mono text-[#9B6EFF]">{type}</td>
            <td className="px-6 py-5 text-center">
                {required ? (
                    <span className="inline-flex text-[#10B981] mx-auto opacity-80">✓</span>
                ) : (
                    <span className="text-[#5B5380] text-xs font-mono">Optional</span>
                )}
            </td>
            <td className="px-6 py-5 leading-relaxed text-[#9B8EC4]">{children}</td>
        </tr>
    );
}
