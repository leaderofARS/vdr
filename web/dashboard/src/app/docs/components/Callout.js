import { Info, AlertTriangle, XOctagon, CheckCircle2 } from 'lucide-react';

export default function Callout({ type = 'info', children }) {
    const config = {
        info: {
            border: 'border-[#4F6EF7]',
            bg: 'bg-[#4F6EF7]/5',
            icon: <Info className="w-5 h-5 text-[#4F6EF7]" />,
            title: 'Note'
        },
        warning: {
            border: 'border-[#F59E0B]',
            bg: 'bg-[#F59E0B]/5',
            icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
            title: 'Warning'
        },
        danger: {
            border: 'border-[#EF4444]',
            bg: 'bg-[#EF4444]/5',
            icon: <XOctagon className="w-5 h-5 text-[#EF4444]" />,
            title: 'Danger'
        },
        tip: {
            border: 'border-[#10B981]',
            bg: 'bg-[#10B981]/5',
            icon: <CheckCircle2 className="w-5 h-5 text-[#10B981]" />,
            title: 'Tip'
        }
    };

    const style = config[type] || config.info;

    return (
        <div className={`my-6 flex gap-4 p-5 rounded-r-xl border-l-[3px] border-y border-r border-y-[#151525] border-r-[#151525] ${style.border} ${style.bg} shadow-lg`}>
            <div className="shrink-0 mt-0.5">{style.icon}</div>
            <div className="text-[#9B8EC4] text-sm leading-relaxed w-full">
                <span className="block font-bold mb-1 uppercase tracking-widest text-[10px] opacity-70">
                    {style.title}
                </span>
                {children}
            </div>
        </div>
    );
}
