'use client';
import { useState } from 'react';

export default function ResponseTabs({ tabs }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="my-6 rounded-2xl overflow-hidden bg-[#08080F] border border-[#151525] shadow-2xl">
            <div className="flex border-b border-[#151525] bg-[#0F0F1A]">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-5 py-3 text-xs font-bold font-mono tracking-tight border-b-2 transition-all duration-200 outline-none ${activeTab === idx
                                ? 'border-[#9B6EFF] text-[#F0EEFF] bg-[#151525]'
                                : 'border-transparent text-[#5B5380] hover:text-[#9B8EC4] hover:bg-[#151525]/50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-0 m-0 [&>div]:m-0 [&_div]:!border-0 [&_div]:!rounded-none [&_div]:!shadow-none">
                {tabs[activeTab].content}
            </div>
        </div>
    );
}
