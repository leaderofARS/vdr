"use client";

/**
 * @file FileUploader.jsx
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/components/FileUploader.jsx
 * @description Reusable React UI components.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */


import { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X, Check, Fingerprint, Lock, ShieldCheck } from "lucide-react";
import { hashFile } from "@/utils/hash";
import { motion, AnimatePresence } from "framer-motion";

export default function FileUploader({ onHashComputed }) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [computedHash, setComputedHash] = useState("");
    const [isHashing, setIsHashing] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const processFile = async (file) => {
        setSelectedFile(file);
        setIsHashing(true);
        try {
            const hash = await hashFile(file);
            setComputedHash(hash);
            if (onHashComputed) {
                onHashComputed(hash, file.name);
            }
        } finally {
            setIsHashing(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            await processFile(e.target.files[0]);
        }
    };

    const clearSelection = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setComputedHash("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onHashComputed) onHashComputed(null, null);
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <motion.div
                        key="uploader"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative border-2 border-dashed rounded-[32px] p-16 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden ${isDragging
                            ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {/* Background Glow */}
                        {isDragging && (
                            <motion.div
                                layoutId="glow"
                                className="absolute inset-0 bg-blue-500/5 blur-3xl pointer-events-none"
                            />
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-colors ${isDragging ? "bg-blue-500 text-white" : "bg-white/5 text-gray-500"}`}>
                            <UploadCloud className="w-10 h-10" />
                        </div>

                        <p className="text-xl font-black text-white mb-2 tracking-tight">
                            Infrastructure Asset Drop
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                            Drag & drop or <span className="text-blue-500">browse local node</span>
                        </p>

                        <div className="mt-10 flex items-center gap-6 opacity-40">
                            <div className="flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Client-Side Hashing</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-700" />
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Zero-Knowledge</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative">
                                    {isHashing ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-8 h-8 border-t-2 border-blue-500 rounded-full"
                                        />
                                    ) : (
                                        <FileIcon className="w-7 h-7 text-blue-400" />
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-lg font-black text-white truncate max-w-[200px] sm:max-w-md tracking-tight">{selectedFile.name}</h3>
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500 mt-0.5">
                                        <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-800" />
                                        <span className="uppercase tracking-widest text-[10px]">{selectedFile.type?.split('/')[1] || "Binary"}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={clearSelection}
                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all flex items-center justify-center border border-white/5 hover:border-red-500/20"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-black/40 rounded-2xl p-6 border border-white/5 relative group/hash overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover/hash:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(computedHash);
                                    }}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <Check className="w-4 h-4 text-blue-400" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <Fingerprint className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">SHA-256 Protocol Digest</span>
                            </div>

                            <div className="font-mono text-sm break-all font-bold leading-relaxed">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_auto] animate-gradient">
                                    {isHashing ? "Computing cryptographic entropy..." : computedHash}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
