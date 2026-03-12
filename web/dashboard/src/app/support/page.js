"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Mail, 
    MessageSquare, 
    Twitter, 
    Github, 
    LifeBuoy, 
    ExternalLink,
    ChevronRight,
    Search,
    HelpCircle,
    ArrowRight
} from 'lucide-react';

const Badge = ({ children, className = "" }) => (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${className}`}>
        {children}
    </span>
);

export default function SupportPage() {
    const contactMethods = [
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Support",
            description: "For technical inquiries, administrative issues, or security concerns.",
            linkText: "support@sipheron.com",
            href: "mailto:support@sipheron.com",
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Live Chat",
            description: "Institutional clients can access 24/7 dedicated support channels.",
            linkText: "Open Dashboard Chat",
            href: "https://app.sipheron.com",
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Developer Discord",
            description: "Join our active community of builders on the Solana network.",
            linkText: "Join Discord",
            href: "https://discord.gg/sipheron",
            color: "text-indigo-400",
            bg: "bg-indigo-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF] font-sans selection:bg-[#4F6EF7]/30 selection:text-white">
            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Hero */}
                <header className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7] mb-6 tracking-[0.3em]">Support Center</Badge>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black mb-8 tracking-tight"
                    >
                        How can we <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6]">help you?</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Whether you're troubleshooting a transaction or planning an enterprise integration, our team is here for you.
                    </motion.p>
                </header>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {contactMethods.map((method, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2rem] bg-[#111118] border border-[#1E1E2E] hover:border-[#4F6EF7]/30 transition-all group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${method.bg} ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {method.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                            <p className="text-sm text-[#6B7280] leading-relaxed mb-6">{method.description}</p>
                            <a href={method.href} className={`text-sm font-bold ${method.color} hover:underline flex items-center gap-2 group/link`}>
                                {method.linkText}
                                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ / Resources */}
                <section className="max-w-4xl mx-auto mb-40">
                    <h2 className="text-3xl font-black mb-12 text-center">Frequently Requested</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Is SipHeron VDR free for developers?", a: "Yes, Devnet anchoring is completely free. Primary organizations also receive 10 mainnet anchors per month for free." },
                            { q: "What happens if a document is revoked?", a: "The on-chain status is updated to 'Revoked'. The original proof remains, but any verification check will return a warning that the document is no longer authorized." },
                            { q: "Can I host my own SipHeron instance?", a: "We offer private cluster deployments for Enterprise clients who require sovereign control over their infrastructure." }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-[#0A0A0F] border border-[#1E1E2E] hover:border-white/10 transition-colors">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-3">
                                    <HelpCircle className="w-4 h-4 text-purple-400" />
                                    {faq.q}
                                </h4>
                                <p className="text-sm text-[#6B7280] leading-relaxed pl-7">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Status Footer */}
                <footer className="text-center">
                    <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Network Status: Operational</span>
                    </div>
                </footer>
            </main>

            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,_#4F6EF705_0%,_transparent_40%)] pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_80%,_#9B5CF605_0%,_transparent_40%)] pointer-events-none -z-10" />
        </div>
    );
}
