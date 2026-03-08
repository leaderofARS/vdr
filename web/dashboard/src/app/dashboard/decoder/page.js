"use client";

import { useState } from 'react';
import { Binary, Copy, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HashDecoder() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleDecode = () => {
        setError('');
        setOutput('');
        try {
            // Remove brackets and split by comma
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

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-4xl mx-auto"
        >
            <div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                    Hash Decoder Utility
                </h1>
                <p className="text-gray-400 font-medium">
                    Convert raw on-chain byte arrays back to hex hashes for verification.
                </p>
            </div>

            <div className="glass p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg">
                            <Binary className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Raw Byte Array</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Paste from Solana Explorer</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g. [249, 245, 167, 3, 111, 164, 68, 96, ...]"
                            className="w-full h-32 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600 font-mono text-sm resize-none text-gray-300"
                        />

                        {error && (
                            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold bg-amber-400/10 px-4 py-3 rounded-xl border border-amber-400/20">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleDecode}
                            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            <Binary className="w-5 h-5" />
                            Decode to Hex
                        </button>
                    </div>

                    {output && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-8 border-t border-white/10 space-y-4 mt-8"
                        >
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Decoded Hex String</label>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-mono text-sm text-emerald-400 break-all select-all flex items-center shadow-inner">
                                    {output}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 transition-colors flex items-center justify-center text-gray-400 hover:text-white"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="mt-6 flex items-start gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                <div className="p-2 rounded-xl bg-blue-500/20">
                                    <AlertCircle className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-blue-400 mb-1">Verification Hint</p>
                                    <p className="text-xs text-blue-400/80 leading-relaxed font-medium">
                                        Use this hex with <code className="bg-black/40 px-2 py-0.5 rounded ml-1 mr-1 text-blue-300 font-bold border border-blue-500/30">sipheron-vdr verify &lt;file&gt;</code> to verify your file against the on-chain registry.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
