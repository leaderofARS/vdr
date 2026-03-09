'use client';
import { useEffect, useState } from 'react';

export default function DocsTOC() {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const hTags = Array.from(document.querySelectorAll('main h2, main h3'));

        const validHeadings = hTags.map((el) => {
            if (!el.id) {
                el.id = el.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            return {
                id: el.id,
                text: el.textContent,
                level: Number(el.tagName.charAt(1))
            };
        });
        setHeadings(validHeadings);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter(e => e.isIntersecting);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: '-100px 0px -60% 0px' }
        );

        hTags.forEach((el) => observer.observe(el));
        return () => hTags.forEach((el) => observer.unobserve(el));
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="w-48 xl:w-56 shrink-0 hidden lg:block pb-24 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 custom-scrollbar">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#5B5380] mb-4 pl-3">
                On this page
            </h5>
            <ul className="space-y-2 text-sm border-l border-[#151525]">
                {headings.map((h) => (
                    <li key={h.id} className={`${h.level === 3 ? 'ml-3' : ''}`}>
                        <a
                            href={`#${h.id}`}
                            className={`block py-1 pl-3 border-l-2 transition-all ${activeId === h.id
                                ? 'border-[#9B6EFF] text-[#B794FF] font-medium bg-[#9B6EFF]/5'
                                : 'border-transparent text-[#9B8EC4] hover:text-[#F0EEFF] hover:border-[#5B5380]'
                                }`}
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
