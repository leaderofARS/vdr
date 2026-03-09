'use client'
import { useEffect, useState } from 'react'

export default function DocsTOC() {
    const [headings, setHeadings] = useState([])
    const [activeId, setActiveId] = useState('')

    useEffect(() => {
        // Get all headings in the main content area
        const elements = Array.from(document.querySelectorAll('main h2, main h3'))
        const headingData = elements.map(el => {
            // Ensure element has an ID for linking
            if (!el.id) {
                el.id = el.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            }
            return {
                id: el.id,
                text: el.textContent,
                level: el.tagName
            }
        });
        setHeadings(headingData)

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-20% 0px -70% 0px' }
        )

        elements.forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    if (headings.length === 0) return null;

    return (
        <aside className="hidden xl:block w-[180px] shrink-0 sticky top-20 self-start border-l border-[#2A2A2A] pl-6 h-fit max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-none">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#555555] font-medium mb-4">On this page</p>
            <div className="flex flex-col gap-2">
                {headings.map((h, i) => (
                    <a
                        key={`${h.id}-${i}`}
                        href={`#${h.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                            setActiveId(h.id);
                        }}
                        className={`block text-[13px] transition-colors duration-150 leading-snug ${h.level === 'H3' ? 'pl-3' : ''
                            } ${activeId === h.id
                                ? 'text-[#EDEDED] font-medium'
                                : 'text-[#888888] hover:text-[#EDEDED]'
                            }`}
                    >
                        {h.text}
                    </a>
                ))}
            </div>
        </aside>
    )
}
