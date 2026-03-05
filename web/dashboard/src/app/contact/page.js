"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Globe, Send, CheckCircle2, ArrowRight, Building2, User } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    const [status, setStatus] = useState("idle"); // idle, loading, success
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("Contact Form Submission:", formData);
        setStatus("success");

        // Reset form after success
        setTimeout(() => {
            setStatus("idle");
            setFormData({ name: "", email: "", company: "", message: "" });
        }, 5000);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex flex-col relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-[#000000] to-[#000000] pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-full bg-mesh opacity-20 pointer-events-none" />

            <main className="relative z-10 flex-grow pt-40 pb-32 px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                    {/* Left Column: Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 mb-8">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-mono">Support & Sales</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
                            Let&apos;s talk about <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">
                                your data strategy.
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-lg">
                            Whether you&apos;re an institution looking to anchor large datasets or a developer building on the VDR protocol, our team is here to help.
                        </p>

                        <div className="space-y-10">
                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Email Us</h4>
                                    <a href="mailto:contact@sipheron.com" className="text-2xl font-black text-white hover:text-blue-400 transition-colors tracking-tight">
                                        contact@sipheron.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Technical Chat</h4>
                                    <p className="text-xl font-bold text-white tracking-tight">Discord Community</p>
                                    <p className="text-sm text-gray-500 mt-1">Join 2,000+ developers building on SipHeron.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Globe className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Global Presence</h4>
                                    <p className="text-xl font-bold text-white tracking-tight">Remote-First Infrastructure</p>
                                    <p className="text-sm text-gray-500 mt-1">Distributed teams across San Francisco, London, and Singapore.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full -z-10" />
                        <div className="bg-[#050505] border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">

                            <AnimatePresence mode="wait">
                                {status === "success" ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="py-20 text-center"
                                    >
                                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                        </div>
                                        <h3 className="text-3xl font-black mb-4">Message Received</h3>
                                        <p className="text-gray-400 max-w-xs mx-auto">
                                            Our institutional onboarding team will reach out to you within 24 hours.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                                    <User className="w-3 h-3" /> Full Name
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                                    <Mail className="w-3 h-3" /> Business Email
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="john@company.com"
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                                <Building2 className="w-3 h-3" /> Company / Organization
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                placeholder="SipHeron Labs"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Project Details</label>
                                            <textarea
                                                required
                                                rows={5}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us about your use case for the VDR protocol..."
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                            />
                                        </div>

                                        <button
                                            disabled={status === "loading"}
                                            className="w-full bg-white text-black font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition-all disabled:opacity-50 group"
                                        >
                                            {status === "loading" ? (
                                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Submit Inquiry
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>

                                        <p className="text-[10px] text-gray-600 text-center leading-relaxed">
                                            By submitting this form, you agree to our <Link href="/terms" className="underline hover:text-gray-400">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-gray-400">Privacy Policy</Link>.
                                        </p>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
