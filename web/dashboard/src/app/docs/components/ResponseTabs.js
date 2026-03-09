'use client'
import { useState } from 'react';

export default function ResponseTabs({ success, error }) {
    const [activeTab, setActiveTab] = useState('success');

    return (
        <div className="my-6 rounded-lg border border-[#2A2A2A] overflow-hidden bg-[#111]">
            <div className="flex border-b border-[#2A2A2A] bg-[#0A0A0A]">
                <button
                    onClick={() => setActiveTab('success')}
                    className={`px-4 py-2 text-[12px] font-medium transition-colors ${activeTab === 'success'
                            ? 'text-[#EDEDED] border-b-2 border-[#9B6EFF] -mb-[1px]'
                            : 'text-[#555] hover:text-[#888]'
                        }`}
                >
                    Success (200 OK)
                </button>
                <button
                    onClick={() => setActiveTab('error')}
                    className={`px-4 py-2 text-[12px] font-medium transition-colors ${activeTab === 'error'
                            ? 'text-[#EDEDED] border-b-2 border-[#9B6EFF] -mb-[1px]'
                            : 'text-[#555] hover:text-[#888]'
                        }`}
                >
                    Error Response
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-[13px] leading-relaxed font-mono text-[#EDEDED]">
                    <code>{activeTab === 'success' ? success : error}</code>
                </pre>
            </div>
        </div>
    );
}
