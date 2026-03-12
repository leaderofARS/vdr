'use client';

import { useState, useRef, useCallback } from 'react';
import { api } from '@/utils/api';

// Compute SHA-256 hash of a file using native Web Crypto API — no npm packages
async function computeSHA256(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const STATUS = {
    IDLE: 'idle',
    HASHING: 'hashing',
    READY: 'ready',
    ANCHORING: 'anchoring',
    DONE: 'done',
    ERROR: 'error'
};

export default function BulkAnchorModal({ onClose, onSuccess }) {
    const [files, setFiles] = useState([]); // { file, hash, status, error }
    const [dragging, setDragging] = useState(false);
    const [stage, setStage] = useState(STATUS.IDLE);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null);

    const processFiles = useCallback(async (rawFiles) => {
        const fileList = Array.from(rawFiles).slice(0, 50); // max 50 files
        if (fileList.length === 0) return;

        setStage(STATUS.HASHING);
        setProgress(0);

        const processed = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            try {
                const hash = await computeSHA256(file);
                processed.push({ file, hash, name: file.name, size: file.size, status: 'ready', error: null });
            } catch (err) {
                processed.push({ file, hash: null, name: file.name, size: file.size, status: 'error', error: 'Failed to hash' });
            }
            setProgress(Math.round(((i + 1) / fileList.length) * 100));
        }

        setFiles(processed);
        setStage(STATUS.READY);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = () => setDragging(false);

    const handleFileInput = (e) => {
        if (e.target.files?.length) processFiles(e.target.files);
    };

    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleAnchor = async () => {
        const readyFiles = files.filter(f => f.status === 'ready' && f.hash);
        if (readyFiles.length === 0) return;

        setStage(STATUS.ANCHORING);
        setProgress(0);

        const successList = [];
        const failList = [];

        for (let i = 0; i < readyFiles.length; i++) {
            const f = readyFiles[i];
            try {
                await api.post('/api/hashes', {
                    hash: f.hash,
                    metadata: f.name
                });
                successList.push(f.name);
                setFiles(prev => prev.map(p =>
                    p.hash === f.hash ? { ...p, status: 'anchored' } : p
                ));
            } catch (err) {
                const errMsg = err.response?.data?.error || 'Failed to anchor';
                failList.push({ name: f.name, error: errMsg });
                setFiles(prev => prev.map(p =>
                    p.hash === f.hash ? { ...p, status: 'error', error: errMsg } : p
                ));
            }
            setProgress(Math.round(((i + 1) / readyFiles.length) * 100));
        }

        setResults({ success: successList, failed: failList });
        setStage(STATUS.DONE);
        if (successList.length > 0) onSuccess?.();
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const readyCount = files.filter(f => f.status === 'ready').length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div>
                        <h2 className="text-white font-bold text-lg">Bulk Anchor Documents</h2>
                        <p className="text-gray-400 text-xs mt-0.5">Drag and drop up to 50 files to anchor their hashes on Solana</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={stage === STATUS.ANCHORING}
                        className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors p-1"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

                    {/* Drop zone — show when idle or ready */}
                    {(stage === STATUS.IDLE || stage === STATUS.READY) && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                                dragging
                                    ? 'border-purple-500 bg-purple-500/10'
                                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-white font-medium text-sm">
                                {dragging ? 'Drop files here' : 'Drop files or click to browse'}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">Any file type · Max 50 files · Files never leave your browser</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileInput}
                            />
                        </div>
                    )}

                    {/* Hashing progress */}
                    {stage === STATUS.HASHING && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-white font-medium text-sm mb-3">Computing SHA-256 hashes...</p>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-gray-400 text-xs mt-2">{progress}%</p>
                        </div>
                    )}

                    {/* Anchoring progress */}
                    {stage === STATUS.ANCHORING && (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-white font-medium text-sm mb-3">Anchoring on Solana...</p>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-gray-400 text-xs mt-2">{progress}% · Do not close this window</p>
                        </div>
                    )}

                    {/* File list */}
                    {files.length > 0 && stage !== STATUS.HASHING && stage !== STATUS.ANCHORING && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                                    {files.length} file{files.length !== 1 ? 's' : ''} selected
                                </p>
                                {stage === STATUS.READY && (
                                    <button
                                        onClick={() => { setFiles([]); setStage(STATUS.IDLE); }}
                                        className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                                        {/* Status icon */}
                                        <div className="flex-shrink-0">
                                            {f.status === 'anchored' && (
                                                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {f.status === 'ready' && (
                                                <div className="w-4 h-4 rounded-full border border-purple-500/50 bg-purple-500/10" />
                                            )}
                                            {f.status === 'error' && (
                                                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                        {/* File info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">{f.name}</p>
                                            {f.error ? (
                                                <p className="text-xs text-red-400">{f.error}</p>
                                            ) : f.hash ? (
                                                <p className="text-xs text-gray-500 font-mono truncate">{f.hash.slice(0, 32)}...</p>
                                            ) : null}
                                        </div>
                                        {/* Size */}
                                        <p className="text-xs text-gray-500 flex-shrink-0">{formatSize(f.size)}</p>
                                        {/* Remove button */}
                                        {stage === STATUS.READY && (
                                            <button
                                                onClick={() => handleRemoveFile(i)}
                                                className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results summary */}
                    {stage === STATUS.DONE && results && (
                        <div className="space-y-3">
                            {results.success.length > 0 && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                    <p className="text-green-400 font-bold text-sm">
                                        ✓ {results.success.length} document{results.success.length !== 1 ? 's' : ''} anchored successfully
                                    </p>
                                    <p className="text-green-400/70 text-xs mt-1">Hashes are pending Solana confirmation</p>
                                </div>
                            )}
                            {results.failed.length > 0 && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                    <p className="text-red-400 font-bold text-sm mb-2">
                                        ✗ {results.failed.length} failed
                                    </p>
                                    {results.failed.map((f, i) => (
                                        <p key={i} className="text-red-300/70 text-xs">{f.name}: {f.error}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-600">
                        Files never leave your browser — only SHA-256 hashes are sent
                    </p>
                    <div className="flex gap-2">
                        {stage === STATUS.DONE ? (
                            <button
                                onClick={onClose}
                                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors"
                            >
                                Done
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    disabled={stage === STATUS.ANCHORING}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors disabled:opacity-30"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAnchor}
                                    disabled={readyCount === 0 || stage !== STATUS.READY}
                                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors"
                                >
                                    Anchor {readyCount > 0 ? `${readyCount} File${readyCount !== 1 ? 's' : ''}` : ''}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
