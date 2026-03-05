"use client";

import { motion } from "framer-motion";

export default function Page() {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-mesh opacity-30 pointer-events-none" />
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full relative z-10 flex flex-col items-center justify-center text-center pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 mb-8">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-gray-300 tracking-wide">Coming Soon</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                        Whitepaper
                    </h1>
                    <p className="text-gray-400 text-xl font-light leading-relaxed mb-10">
                        Technical architecture and theoretical foundations of SipHeron.
                    </p>
                    <div className="p-8 border border-white/10 bg-[#0a0a0a] rounded-2xl shadow-2xl inline-block mt-8">
                        <p className="text-sm font-mono text-gray-500">
                           This section of the platform is currently under active development.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
