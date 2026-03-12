'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents({ headings }) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: '0px 0px -70% 0px', threshold: 0.1 }
        );

        headings.forEach(h => {
            const el = document.getElementById(h.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    const handleClick = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            const offset = 100; // Account for sticky header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (!headings || headings.length === 0) return null;

    return (
        <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24 pl-8 border-l border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
                    On this page
                </p>
                <nav className="space-y-1">
                    {headings.map(h => (
                        <a
                            key={h.id}
                            href={`#${h.id}`}
                            onClick={(e) => handleClick(e, h.id)}
                            className={`block text-[13px] py-1.5 transition-colors leading-snug ${
                                h.level === 3 ? 'pl-4 border-l border-transparent' : 'font-medium'
                            } ${
                                activeId === h.id
                                    ? 'text-purple-400'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {h.title}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
}
