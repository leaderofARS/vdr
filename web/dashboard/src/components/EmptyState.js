import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Clean, GCP-inspired Empty State component for dashboard tables and views
 */
const EmptyState = ({
    icon: Icon,
    title,
    subtitle,
    action,
    actionLabel
}) => {
    return (
        <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-[#1A1D24] border border-[#2C3038] flex items-center justify-center mb-6 relative">
                {Icon && <Icon className="w-8 h-8 text-[#5F6368]" strokeWidth={1.5} />}
                <div className="absolute inset-0 rounded-full border border-[#3C4043] animate-ping scale-150 opacity-10"></div>
            </div>

            <h3 className="text-white text-lg font-medium mb-2 tracking-tight">
                {title}
            </h3>

            <p className="text-[#9AA0A6] text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                {subtitle}
            </p>

            {action && (
                <button
                    onClick={action}
                    className="inline-flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#4285F4]/20 active:scale-95"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
