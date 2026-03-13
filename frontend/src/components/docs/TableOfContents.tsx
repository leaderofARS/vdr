import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents: React.FC = () => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    // Small delay to ensure the page content has rendered
    const timer = setTimeout(() => {
      const headings = Array.from(document.querySelectorAll('h2, h3'))
        .filter((h) => h.id)
        .map((h) => ({
          id: h.id,
          text: h.textContent || '',
          level: parseInt(h.tagName.substring(1)),
        }));

      setToc(headings);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '-10% 0% -80% 0%' }
      );

      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (toc.length === 0) return null;

  return (
    <div className="hidden xl:block w-56 flex-shrink-0 sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto pr-4 scrollbar-hide">
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-[0.15em] text-[#555] font-bold">
          On this page
        </h4>
        <nav className="flex flex-col gap-1">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`group flex items-center transition-all duration-300 py-1.5 ${
                item.level === 3 ? 'pl-4' : ''
              }`}
            >
              <div className="relative flex items-center w-full">
                {/* Active Indicator Line */}
                <AnimatePresence mode="wait">
                  {activeId === item.id && (
                    <motion.div
                      layoutId="toc-indicator"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="absolute -left-4 w-[2px] h-full bg-[#9B6EFF] shadow-[0_0_12px_rgba(155,110,255,0.6)]"
                    />
                  )}
                </AnimatePresence>
                
                <span
                  className={`text-[12px] leading-relaxed transition-colors duration-300 ${
                    activeId === item.id
                      ? 'text-[#EDEDED] font-medium'
                      : 'text-[#666] group-hover:text-[#999]'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-8 pt-8 border-t border-white/[0.04]">
        <p className="text-[11px] text-[#444] leading-relaxed">
          Spotted a mistake? Help us improve our documentation by submitting a PR.
        </p>
      </div>
    </div>
  );
};

export default TableOfContents;
