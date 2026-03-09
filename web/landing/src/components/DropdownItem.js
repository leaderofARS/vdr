'use client'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function DropdownItem({ item }) {
    return (
        <Link
            href={item.href}
            className="group flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-100 hover:bg-white/[0.03] relative overflow-hidden"
            target={item.external ? '_blank' : undefined}
        >
            {/* Left border indicator on hover */}
            <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[#9B6EFF] opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Icon */}
            <div
                className="mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all duration-150 group-hover:scale-110 shadow-sm"
                style={{
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}25`,
                    color: item.color
                }}
            >
                <span className="text-sm">{item.icon}</span>
            </div>

            {/* Text */}
            <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-medium text-[#EDEDED] group-hover:text-white transition-colors leading-none">
                        {item.label}
                    </span>
                    {item.external && <ExternalLink className="w-2.5 h-2.5 text-[#555]" />}
                </div>
                <p className="text-[12px] text-[#555] group-hover:text-[#888] transition-colors mt-0.5 leading-snug line-clamp-1">
                    {item.description}
                </p>
            </div>
        </Link>
    )
}
