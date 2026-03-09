import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
    return (
        <nav className="flex items-center gap-1.5 text-[12px] text-[#555] mb-6">
            <Link href="/docs" className="hover:text-[#EDEDED] transition-colors">Docs</Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-[#EDEDED] transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-[#888]">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
