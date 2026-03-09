import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DocsPrevNext({ prev, next }) {
    return (
        <div className="mt-20 pt-10 border-t border-[#151525] grid sm:grid-cols-2 gap-4">
            {prev ? (
                <Link
                    href={prev.href}
                    className="flex flex-col gap-2 p-6 rounded-2xl border border-[#151525] bg-[#0F0F1A] hover:border-[#9B6EFF]/50 hover:bg-[#151525] transition-all group"
                >
                    <span className="text-[10px] font-bold text-[#5B5380] uppercase tracking-widest flex items-center gap-1 group-hover:text-[#9B8EC4] transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" /> PREVIOUS
                    </span>
                    <span className="text-lg font-bold text-[#F0EEFF] group-hover:text-[#B794FF] transition-colors">
                        {prev.title}
                    </span>
                </Link>
            ) : <div />}

            {next ? (
                <Link
                    href={next.href}
                    className="flex flex-col items-end text-right gap-2 p-6 rounded-2xl border border-[#151525] bg-[#0F0F1A] hover:border-[#9B6EFF]/50 hover:bg-[#151525] transition-all group"
                >
                    <span className="text-[10px] font-bold text-[#5B5380] uppercase tracking-widest flex items-center justify-end gap-1 group-hover:text-[#9B8EC4] transition-colors">
                        NEXT <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-lg font-bold text-[#F0EEFF] group-hover:text-[#B794FF] transition-colors">
                        {next.title}
                    </span>
                </Link>
            ) : <div />}
        </div>
    );
}
