'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink } from 'lucide-react'

export default function MobileNav({ open, items, onClose }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[100] bg-[#08080F] pt-16 flex flex-col"
                >
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                        {items.map(item => (
                            <MobileItem key={item.label} item={item} onClose={onClose} />
                        ))}
                    </div>

                    {/* Bottom CTAs */}
                    <div className="p-6 border-t border-[#1A1A2E] bg-[#08080F] flex flex-col gap-3">
                        <Link
                            href="/auth/login"
                            onClick={onClose}
                            className="w-full text-center py-3.5 border border-[#2A2A3E] rounded-xl text-[15px] font-medium text-[#888] hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/register"
                            onClick={onClose}
                            className="w-full text-center py-3.5 rounded-xl text-[15px] font-semibold text-white shadow-xl shadow-[#9B6EFF]/10 transition-transform active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #7C5CBF, #4F6EF7)' }}
                        >
                            Get Started Free
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function MobileItem({ item, onClose }) {
    const [expanded, setExpanded] = useState(false)

    if (!item.dropdown) {
        return (
            <Link
                href={item.href}
                onClick={onClose}
                className="block py-3 text-lg font-medium text-[#EDEDED] border-b border-white/[0.03]"
            >
                {item.label}
            </Link>
        )
    }

    return (
        <div className="border-b border-white/[0.03]">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between py-4 text-lg font-medium text-[#EDEDED]"
            >
                {item.label}
                <ChevronDown className={`w-5 h-5 text-[#555] transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/[0.02] rounded-xl"
                    >
                        <div className="p-4 space-y-6">
                            {item.sections.map(section => (
                                <div key={section.title}>
                                    <p className="text-[11px] font-bold text-[#555] uppercase tracking-widest mb-3">
                                        {section.title}
                                    </p>
                                    <div className="space-y-4">
                                        {section.items.map(sub => (
                                            <Link
                                                key={sub.label}
                                                href={sub.href}
                                                onClick={onClose}
                                                className="flex items-center gap-3 group"
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{ background: `${sub.color}15`, border: `1px solid ${sub.color}25`, color: sub.color }}
                                                >
                                                    <span className="text-sm">{sub.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-medium text-[#EDEDED]">{sub.label}</p>
                                                    <p className="text-[12px] text-[#555] line-clamp-1">{sub.description}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
