"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Eye, EyeOff, Loader2 } from 'lucide-react';

// --- PurpleCard ---
export const PurpleCard = ({ children, className = "", hover = true }) => (
    <motion.div
        whileHover={hover ? { y: -2, boxShadow: "0 0 30px rgba(155, 110, 255, 0.15)" } : {}}
        className={`glass-card rounded-xl p-6 relative overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

// --- GlowButton ---
export const GlowButton = ({ children, onClick, className = "", variant = "primary", loading = false, disabled = false, icon: Icon }) => {
    const baseClasses = "relative px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 overflow-hidden group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "button-primary-glow text-white hover:shadow-[0_0_40px_rgba(124,92,191,0.4)]",
        danger: "bg-danger text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse-on-hover",
        ghost: "bg-transparent border border-purple-dim text-purple-glow hover:bg-purple-dim/20 hover:border-purple-mid"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={loading || disabled}
            className={`${baseClasses} ${variants[variant]} ${className}`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    {Icon && <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />}
                    {children}
                </>
            )}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
    );
};

// --- PurpleBadge ---
export const PurpleBadge = ({ children, variant = "success", pulse = false }) => {
    const styles = {
        success: "bg-success/10 text-success border-success/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        danger: "bg-danger/10 text-danger border-danger/20",
        purple: "bg-purple-vivid/10 text-purple-glow border-purple-vivid/20"
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${styles[variant]} ${pulse ? 'animate-status-pulse' : ''}`}>
            {pulse && <div className={`w-1.5 h-1.5 rounded-full bg-current ${variant === 'success' ? 'animate-pulse' : ''}`} />}
            {children}
        </span>
    );
};

// --- MonoHash ---
export const MonoHash = ({ hash, className = "" }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`group flex items-center gap-2 font-mono text-purple-vivid bg-purple-dim/10 rounded px-2 py-1 border border-purple-dim/20 transition-all hover:bg-purple-dim/20 ${className}`}>
            <span className="truncate max-w-[150px]">{hash}</span>
            <button
                onClick={copyToClipboard}
                className="text-text-muted hover:text-purple-glow transition-colors"
            >
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />}
            </button>
        </div>
    );
};

// --- PurpleSkeleton ---
export const PurpleSkeleton = ({ className = "" }) => (
    <div className={`loader-shimmer rounded-md ${className}`} />
);

// --- CountUp ---
export const CountUp = ({ end, duration = 1500 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function (easeOutQuad)
            const easePercentage = 1 - (1 - percentage) * (1 - percentage);

            setCount(Math.floor(easePercentage * end));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
};

// --- PurpleInput ---
export const PurpleInput = ({ placeholder, type = "text", value, onChange, className = "", icon: Icon }) => (
    <div className="relative group">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-purple-vivid transition-colors" />}
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full bg-bg-surface border border-bg-border rounded-lg py-2.5 ${Icon ? 'pl-10' : 'px-4'} pr-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-purple-vivid transition-all duration-200 ${className}`}
        />
    </div>
);

// --- PurpleTable ---
export const PurpleTable = ({ headers, children, className = "" }) => (
    <div className={`overflow-x-auto ${className}`}>
        <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
                <tr className="text-text-muted text-xs uppercase tracking-widest">
                    {headers.map((h, i) => (
                        <th key={i} className="px-4 py-2 font-semibold">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    </div>
);

export const PurpleTableRow = ({ children, className = "", onClick }) => (
    <motion.tr
        whileHover={{ backgroundColor: "rgba(45, 43, 85, 0.2)" }}
        onClick={onClick}
        className={`bg-bg-surface/40 hover:bg-purple-dim/20 transition-colors cursor-pointer group ${className}`}
    >
        {children}
    </motion.tr>
);

// --- PurpleModal ---
export const PurpleModal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-bg-surface border border-purple-vivid/20 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="px-6 py-4 bg-purple-gradient flex items-center justify-between">
                        <h3 className="text-white font-bold">{title}</h3>
                        <button onClick={onClose} className="text-white/80 hover:text-white">
                            <Check className="w-5 h-5 rotate-45" />
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- Light/Dark Toggle ---
export const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            setIsDark(false);
            document.documentElement.classList.add('light');
        }
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        if (!next) {
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <button
            onClick={toggle}
            className="p-2 rounded-full bg-bg-elevated text-purple-glow hover:bg-purple-dim transition-colors"
        >
            {isDark ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
    );
};
