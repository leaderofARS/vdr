'use client'
import Link from 'next/link'

export default function FeaturedCard({ card }) {
    return (
        <div className="w-[180px] shrink-0 border-l border-[#1A1A2E] pl-6 hidden md:block">
            <Link href={card.href} className="block rounded-xl p-3 border border-[#9B6EFF]/20 bg-[#9B6EFF]/5 hover:bg-[#9B6EFF]/10 transition-all cursor-pointer group shadow-[0_0_20px_rgba(155,110,255,0.05)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B6EFF] block mb-2">
                    {card.label}
                </span>
                <p className="text-[13px] font-semibold text-[#EDEDED] leading-snug mb-2">
                    {card.title}
                </p>
                <p className="text-[11px] text-[#555] leading-relaxed mb-3">
                    {card.description}
                </p>
                <span className="text-[12px] text-[#9B6EFF] group-hover:text-[#B794FF] transition-colors flex items-center gap-1 font-medium">
                    {card.cta}
                </span>
            </Link>
        </div>
    )
}
