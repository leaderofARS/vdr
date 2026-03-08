'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RightSidebar() {
    const pathname = usePathname();
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        // Wait for content render
        const timeout = setTimeout(() => {
            const elements = Array.from(document.querySelectorAll('.docs-content h2, .docs-content h3'));
            const headingData = elements.map(elem => {
                if (!elem.id) {
                    elem.id = elem.innerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                }
                return {
                    id: elem.id,
                    text: elem.innerText,
                    level: Number(elem.tagName.replace('H', ''))
                };
            });
            setHeadings(headingData);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            }, { rootMargin: '-20% 0% -60% 0%' });

            elements.forEach(elem => observer.observe(elem));
            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <nav className="px-4 pt-4 pb-12">
            <h4 className="font-semibold text-gray-200 mb-4 text-sm uppercase tracking-wider">On This Page</h4>
            {headings.length === 0 ? <span className="text-gray-500 text-sm text-center block w-full py-4 opacity-70 italic">-</span> : null}
            <ul className="space-y-2 border-l border-gray-800 pl-4 relative">
                {headings.map((h, i) => (
                    <li key={i} className={`${h.level === 3 ? 'ml-3' : ''}`}>
                        <a
                            href={`#${h.id}`}
                            className={`text-sm block py-0.5 tracking-tight transition-colors ${activeId === h.id ? 'text-[#4285F4] font-medium' : 'text-gray-400 hover:text-gray-200'}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                                setActiveId(h.id);
                            }}
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
