"use client";

import { useState } from 'react';
import { Binary, Copy, Check, AlertCircle, Terminal, CheckCircle2, Cpu, Zap, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PurpleCard, GlowButton, PurpleInput, PurpleBadge } from '@/components/ui/PurpleUI';

export default function HashDecoder() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copiedHex, setCopiedHex] = useState(false);
    const [copiedCurl, setCopiedCurl] = useState(false);

    const handleDecode = () => {
        setError('');
        setOutput('');
        try {
            let clean = input.trim();
            if (clean.startsWith('[')) clean = clean.slice(1);
            if (clean.endsWith(']')) clean = clean.slice(0, -1);

            const numStrings = clean.split(',').map(s => s.trim()).filter(s => s.length > 0);

            if (numStrings.length === 0) {
                throw new Error("Input array is empty.");
            }
            if (numStrings.length !== 32) {
                throw new Error(`Invalid length: found ${numStrings.length} bytes, expected 32 bytes.`);
            }

            const hex = numStrings.map(numStr => {
                const n = parseInt(numStr, 10);
                if (isNaN(n) || n < 0 || n > 255) {
                    throw new Error(`Invalid byte value: ${numStr}`);
                }
                return n.toString(16).padStart(2, '0');
            }).join('');

            setOutput(hex);
        } catch (err) {
            setError(err.message || 'Failed to decode. Please ensure input is a valid 32-byte JSON array.');
        }
    };

    const copyToClipboard = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        if (type === 'hex') {
            setCopiedHex(true);
            setTimeout(() => setCopiedHex(false), 2000);
        } else {
            setCopiedCurl(true);
            setTimeout(() => setCopiedCurl(false), 2000);
        }
    };

    const curlCommand = output
        ? `curl -X GET https://api.sipheron.com/verify/${output} \\\n  -H "Authorization: Bearer YOUR_API_KEY"`
        : '';

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2 flex items-center gap-3">
                    <Binary className="w-8 h-8 text-purple-vivid" />
                    Byte Array Decoder
                </h1>
                <p className="text-sm text-text-muted">
                    Translate raw on-chain byte buffers into human-readable cryptographic hex strings.
                    Useful for debugging low-level Solana program outputs.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Input Area */}
                <div className="lg:col-span-3 space-y-6">
                    <PurpleCard className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Source Buffer</h2>
                            <PurpleBadge variant="purple">32-BYTE ARRAY</PurpleBadge>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="relative group flex-1">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="e.g. [249, 245, 167, 3, 111, 164, 68, 96, ...]"
                                    className="w-full h-48 px-4 py-4 bg-black/40 border border-bg-border rounded-2xl text-sm text-purple-glow font-mono focus:outline-none focus:border-purple-vivid transition-all resize-none placeholder:text-text-muted/20"
                                />
                                <div className="absolute inset-0 bg-purple-vivid/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-2xl" />
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-danger/10 border border-danger/30 rounded-xl p-4 flex items-start gap-3 text-[11px] font-bold text-danger uppercase tracking-tight"
                                    >
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <GlowButton
                                onClick={handleDecode}
                                className="w-full py-4 text-xs font-bold uppercase tracking-widest"
                                icon={Zap}
                            >
                                EXECUTE DECODING
                            </GlowButton>
                        </div>
                    </PurpleCard>
                </div>

                {/* Info / Quick Reference */}
                <div className="lg:col-span-2 space-y-6">
                    <PurpleCard className="bg-purple-dim/10 border-purple-vivid/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Terminal className="w-5 h-5 text-purple-glow" />
                            <h4 className="font-bold text-sm text-text-primary uppercase tracking-tight">Quick Usage</h4>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed mb-6">
                            Raw data from Solana accounts often arrives as a <code>Uint8Array</code>.
                            Paste the JSON representation here to derive the original SHA-256 hash.
                        </p>
                        <ul className="space-y-3 text-[11px] text-text-secondary">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-vivid" />
                                Must be exactly 32 bytes
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-vivid" />
                                Values between 0 and 255
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-vivid" />
                                Comma-separated format
                            </li>
                        </ul>
                    </PurpleCard>

                    <div className="p-6 bg-purple-glow/5 border border-purple-glow/10 rounded-3xl">
                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-[0.2em] mb-3">Integration Tip</p>
                        <p className="text-[11px] text-text-secondary leading-relaxed font-medium">
                            Automate this in your app using <code className="text-purple-glow">Buffer.from(data).toString('hex')</code> if using Node.js.
                        </p>
                    </div>
                </div>
            </div>

            {/* Results section */}
            <AnimatePresence>
                {output && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <PurpleCard className="border-success/20 bg-success/[0.02]">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-success/10 text-success rounded-xl">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Decoded Result</h2>
                                </div>
                                <PurpleBadge variant="success">READY FOR VERIFICATION</PurpleBadge>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Cryptographic Hex String</label>
                                    <div className="flex gap-3">
                                        <div className="flex-1 bg-black/50 border border-bg-border rounded-2xl px-5 py-4 font-mono text-sm text-success break-all flex items-center shadow-inner">
                                            {output}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(output, 'hex')}
                                            className="p-4 bg-bg-surface border border-bg-border rounded-2xl text-text-muted hover:text-white hover:border-purple-vivid/40 transition-all flex items-center justify-center min-w-[64px]"
                                        >
                                            {copiedHex ? <CheckCircle2 className="w-6 h-6 text-success" /> : <Copy className="w-6 h-6" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-bg-border/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Link className="w-3.5 h-3.5 text-purple-glow" />
                                            Verify via Enterprise API
                                        </label>
                                        <GlowButton
                                            variant="ghost"
                                            onClick={() => copyToClipboard(curlCommand, 'curl')}
                                            className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest"
                                            icon={copiedCurl ? Check : Copy}
                                        >
                                            {copiedCurl ? "COPIED" : "COPY CURL"}
                                        </GlowButton>
                                    </div>
                                    <div className="relative group">
                                        <pre className="w-full bg-black/60 border border-bg-border rounded-2xl p-6 text-xs text-text-secondary font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                            {curlCommand}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </PurpleCard>

                        <div className="flex justify-center">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push(`/dashboard/hashes/${output}`)}
                                className="px-10 py-5 bg-purple-vivid text-white rounded-3xl font-bold uppercase tracking-[0.2em] text-xs shadow-[0_0_50px_rgba(155,110,255,0.3)] hover:shadow-[0_0_70px_rgba(155,110,255,0.5)] transition-all flex items-center gap-3"
                            >
                                <Cpu className="w-5 h-5" />
                                Lookup Hash Identity
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
