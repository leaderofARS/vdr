import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DocsPrevNext({ prev, next }) {
    return (
        <div className="mt-16 pt-6 border-t border-[#1F1F1F] grid grid-cols-2 gap-4">
            {prev ? (
                <Link
                    href={prev.href}
                    className="flex flex-col gap-1 p-4 rounded-lg border border-[#2A2A2A] hover:border-[#444] transition-colors group"
                >
                    <span className="text-[12px] text-[#555] flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
                        Previous
                    </span>
                    <span className="text-[14px] text-[#EDEDED] font-medium">{prev.label}</span>
                </Link>
            ) : <div />}

            {next ? (
                <Link
                    href={next.href}
                    className="flex flex-col gap-1 p-4 rounded-lg border border-[#2A2A2A] hover:border-[#444] transition-colors group text-right items-end"
                >
                    <span className="text-[12px] text-[#555] flex items-center gap-1">
                        Next
                        <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="text-[14px] text-[#EDEDED] font-medium">{next.label}</span>
                </Link>
            ) : <div />}
        </div>
    );
}
