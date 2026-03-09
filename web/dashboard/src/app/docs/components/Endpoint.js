const methodColors = {
    GET: { bg: '#0D2B1A', text: '#4ADE80', border: '#166534' },
    POST: { bg: '#0D1B2B', text: '#60A5FA', border: '#1E40AF' },
    PUT: { bg: '#2B1A0D', text: '#FB923C', border: '#92400E' },
    DELETE: { bg: '#2B0D0D', text: '#F87171', border: '#991B1B' },
};

export default function Endpoint({ method, path, description }) {
    const c = methodColors[method] || methodColors.GET;
    return (
        <div className="my-6 rounded-lg border border-[#2A2A2A] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#111] border-b border-[#2A2A2A]">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded border"
                    style={{ color: c.text, background: c.bg, borderColor: c.border }}>
                    {method}
                </span>
                <code className="text-[13px] text-[#EDEDED] font-mono">{path}</code>
            </div>
            {description && <p className="px-4 py-3 text-[13px] text-[#888] leading-relaxed">{description}</p>}
        </div>
    );
}
