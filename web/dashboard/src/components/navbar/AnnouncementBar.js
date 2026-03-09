'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const isDismissed = localStorage.getItem('sipheron-announcement-dismissed')
        if (!isDismissed) {
            setIsVisible(true)
        }
    }, [])

    const dismiss = () => {
        localStorage.setItem('sipheron-announcement-dismissed', 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div
            className="h-8 flex items-center justify-center gap-2 text-[12px] text-white px-4 relative z-[60]"
            style={{ background: 'linear-gradient(90deg, #4C3D8F, #7C5CBF, #4F6EF7)' }}
        >
            <span className="hidden sm:inline">🎉</span>
            <span>SipHeron v0.9.4 released —</span>
            <Link href="/docs/changelog" className="underline font-medium hover:text-[#B794FF]">
                See what's new →
            </Link>
            <button
                onClick={dismiss}
                className="ml-auto text-white/60 hover:text-white transition-colors"
                aria-label="Dismiss announcement"
            >
                <X size={14} />
            </button>
        </div>
    )
}
