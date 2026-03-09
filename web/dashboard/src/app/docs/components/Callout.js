import { Info, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';

const variants = {
    info: { border: '#3B82F6', bg: 'rgba(59,130,246,0.05)', icon: Info, text: '#60A5FA' },
    warning: { border: '#F59E0B', bg: 'rgba(245,158,11,0.05)', icon: AlertTriangle, text: '#FCD34D' },
    danger: { border: '#EF4444', bg: 'rgba(239,68,68,0.05)', icon: AlertCircle, text: '#FCA5A5' },
    tip: { border: '#10B981', bg: 'rgba(16,185,129,0.05)', icon: Lightbulb, text: '#6EE7B7' },
};

export default function Callout({ type = 'info', children }) {
    const v = variants[type] || variants.info;
    const Icon = v.icon;

    return (
        <div className={`my-6 pl-4 border-l-2 py-3 pr-4 rounded-r-md text-[13px] leading-relaxed flex gap-3`}
            style={{ borderColor: v.border, background: v.bg }}>
            <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: v.border }} />
            <div className="text-[#888]">
                {children}
            </div>
        </div>
    );
}
