export default function ParamTable({ children }) {
    return (
        <div className="my-6 rounded-lg border border-[#2A2A2A] overflow-hidden text-[13px]">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
                        <th className="text-left px-4 py-2.5 text-[#555] font-medium text-[11px] uppercase tracking-wider">Parameter</th>
                        <th className="text-left px-4 py-2.5 text-[#555] font-medium text-[11px] uppercase tracking-wider">Type</th>
                        <th className="text-left px-4 py-2.5 text-[#555] font-medium text-[11px] uppercase tracking-wider">Required</th>
                        <th className="text-left px-4 py-2.5 text-[#555] font-medium text-[11px] uppercase tracking-wider">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F1F]">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export function ParamRow({ name, type, required, description }) {
    return (
        <tr className="hover:bg-[#111] transition-colors">
            <td className="px-4 py-3 font-mono text-[#EDEDED]">{name}</td>
            <td className="px-4 py-3 text-[#555] font-mono">{type}</td>
            <td className="px-4 py-3 text-[#555]">{required ? 'Yes' : 'No'}</td>
            <td className="px-4 py-3 text-[#888] leading-relaxed">{description}</td>
        </tr>
    );
}
