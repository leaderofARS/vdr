'use client';
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function DocsTOC() {
    const [headings, setHeadings] = useState([])
    const [activeId, setActiveId] = useState('')
    const pathname = usePathname()

    useEffect(() => {
        // Delay slightly to ensure DOM is updated after navigation
        const timer = setTimeout(() => {
            const elements = Array.from(document.querySelectorAll('.docs-content h2, .docs-content h3'))
            const headingData = elements.map(el => {
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
                { rootMargin: '-10% 0px -80% 0px' }
            )

            elements.forEach(el => observer.observe(el))
            return () => observer.disconnect()
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname])

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
                            const el = document.getElementById(h.id);
                            if (el) {
                                const offset = 80;
                                const bodyRect = document.body.getBoundingClientRect().top;
                                const elementRect = el.getBoundingClientRect().top;
                                const elementPosition = elementRect - bodyRect;
                                const offsetPosition = elementPosition - offset;

                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                            setActiveId(h.id);
                            window.history.pushState(null, '', `#${h.id}`);
                        }}
                        className={`block text-[13px] transition-colors duration-150 leading-snug hover:text-[#EDEDED] ${h.level === 'H3' ? 'pl-3' : ''
                            } ${activeId === h.id
                                ? 'text-[#9B6EFF] font-medium'
                                : 'text-[#555555]'
                            }`}
                    >
                        {h.text}
                    </a>
                ))}
            </div>
        </aside>
    )
}
