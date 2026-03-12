'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { 
    Code2, Copy, Check, ExternalLink, Info, 
    Layout, Type, FileCode, Frame, Globe
} from 'lucide-react';
import { 
    PurpleCard, GlowButton, PurpleBadge,
    PurpleTable, PurpleSkeleton
} from '@/components/ui/PurpleUI';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.sipheron.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sipheron.com';

// Custom Shield icon component
const Shield = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

export default function EmbedPage() {
    const [hashes, setHashes] = useState([]);
    const [selectedHash, setSelectedHash] = useState('');
    const [embedType, setEmbedType] = useState('badge');
    const [copied, setCopied] = useState('');
    const [loading, setLoading] = useState(true);
    const [codeTab, setCodeTab] = useState('html');

    useEffect(() => {
        api.get('/api/hashes').then(res => {
            // Correctly handle the paginated response structure from the backend
            const list = res.data?.data || res.data?.hashes || res.data?.records || (Array.isArray(res.data) ? res.data : []);
            setHashes(list);
            
            // Set first hash as selected if available
            if (list.length > 0 && list[0]?.hash) {
                setSelectedHash(list[0].hash);
            }
        }).catch(err => {
            console.error('Registry sync failure:', err);
        }).finally(() => setLoading(false));
    }, []);

    const verifyUrl = `${BASE_URL}/verify/${selectedHash}`;
    const badgeUrl = `${API_URL}/api/hashes/badge/${selectedHash}`;

    const EMBED_OPTIONS = {
        badge: {
            id: 'badge',
            label: 'SVG Dynamic Badge',
            icon: Shield,
            description: 'A lightweight, live SVG badge that updates automatically based on blockchain status.',
            preview: selectedHash ? (
                <img src={badgeUrl} alt="SipHeron VDR verified" height={20} className="shadow-lg shadow-purple-900/20" />
            ) : <div className="text-text-muted text-sm italic">Select a cryptographic hash...</div>,
            codes: {
                html: `<a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${badgeUrl}" alt="SipHeron VDR verified" />\n</a>`,
                markdown: `[![SipHeron VDR Verified](${badgeUrl})](${verifyUrl})`,
                react: `<a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${badgeUrl}" alt="SipHeron VDR verified" />\n</a>`
            }
        },
        button: {
            id: 'button',
            label: 'Verification Button',
            icon: Type,
            description: 'A premium-styled action button for direct link to the public verification proof.',
            preview: (
                <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-purple-vivid text-white rounded-xl text-sm font-bold shadow-xl shadow-purple-900/20 hover:scale-105 transition-transform"
                >
                    <Check className="w-4 h-4" /> Verify on Blockchain
                </a>
            ),
            codes: {
                html: `<a href="${verifyUrl}"\n   target="_blank"\n   rel="noopener noreferrer"\n   style="display:inline-flex;align-items:center;gap:10px;padding:10px 24px;background:#8B5CF6;color:white;border-radius:12px;text-decoration:none;font-size:14px;font-weight:700;font-family:sans-serif;box-shadow:0 10px 15px -3px rgba(139, 92, 198, 0.3)">\n  ✓ Verify on Blockchain\n</a>`,
                markdown: `[✓ Verify on Blockchain](${verifyUrl})`,
                react: `<a\n  href="${verifyUrl}"\n  target="_blank"\n  rel="noopener noreferrer"\n  className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 shadow-lg shadow-purple-900/20 transition-all"\n>\n  <Check className="w-4 h-4" /> Verify on Blockchain\n</a>`
            }
        },
        iframe: {
            id: 'iframe',
            label: 'Embedded Viewer',
            icon: Frame,
            description: 'Embed the entire verification transparency report directly into your portal or dApp.',
            preview: selectedHash ? (
                <div className="flex flex-col items-center gap-3">
                    <div className="w-48 h-24 bg-purple-vivid/5 border border-purple-vivid/20 rounded-2xl flex items-center justify-center">
                        <Globe className="w-8 h-8 text-purple-vivid/40 animate-pulse" />
                    </div>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none mt-1">Responsive Frame Active</p>
                </div>
            ) : null,
            codes: {
                html: `<iframe\n  src="${verifyUrl}"\n  width="100%"\n  height="600"\n  frameborder="0"\n  style="border-radius:16px;border:1px solid rgba(139, 92, 246, 0.2);background:#000"\n  title="Cryptographic Verification Report — SipHeron VDR"\n></iframe>`,
                markdown: `_Iframe embeds are not supported in Markdown containers._`,
                react: `<iframe\n  src="${verifyUrl}"\n  width="100%"\n  height={600}\n  frameBorder="0"\n  style={{ borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', background: '#000' }}\n  title="Cryptographic Verification Report — SipHeron VDR"\n/>`
            }
        }
    };

    const currentEmbed = EMBED_OPTIONS[embedType];

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(label);
            setTimeout(() => setCopied(''), 2000);
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent mb-2 flex items-center gap-4">
                    <Code2 className="w-8 h-8 text-purple-vivid" />
                    Embed & Disseminate
                </h1>
                <p className="text-sm text-text-muted max-w-lg leading-relaxed">
                    Generate tamper-evident verification badges and interactive report embeds for your digital assets.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-6">
                    {/* Select hash */}
                    <PurpleCard className="p-6">
                        <label className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold block mb-4">
                            Select Cryptographic Provenance
                        </label>
                        {loading ? (
                            <div className="py-4 flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-purple-vivid border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs text-purple-glow font-bold uppercase tracking-widest">Synchronizing Registry...</span>
                            </div>
                        ) : hashes.length === 0 ? (
                            <div className="py-4 text-center border border-dashed border-bg-border rounded-xl">
                                <p className="text-text-muted text-xs italic">No active provenances identified.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <select
                                    value={selectedHash}
                                    onChange={e => setSelectedHash(e.target.value)}
                                    className="w-full bg-black/40 border border-bg-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-purple-vivid transition-all font-medium"
                                >
                                    {hashes.map(h => (
                                        <option key={h.hash || Math.random().toString()} value={h.hash || ''}>
                                            {h.metadata || (h.hash ? h.hash.slice(0, 16) + '...' : 'Unknown Signal')}
                                        </option>
                                    ))}
                                </select>

                                {selectedHash && (
                                    <div className="p-3 bg-purple-vivid/[0.03] border border-purple-vivid/10 rounded-xl flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-[9px] text-purple-vivid font-bold uppercase tracking-widest mb-1 opacity-70 italic">Transparency Link</p>
                                            <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-text-muted hover:text-purple-glow transition-colors font-mono truncate block">
                                                {verifyUrl}
                                            </a>
                                        </div>
                                        <GlowButton onClick={() => handleCopy(verifyUrl, 'verifyUrl')} variant="ghost" className="shrink-0 p-2 h-9 w-9">
                                            {copied === 'verifyUrl' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </GlowButton>
                                    </div>
                                )}
                            </div>
                        )}
                    </PurpleCard>

                    {/* Embed type selector */}
                    <div className="space-y-4">
                        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold ml-1">Asset Configuration</p>
                        <div className="grid grid-cols-1 gap-4">
                            {Object.entries(EMBED_OPTIONS).map(([key, opt]) => {
                                const Icon = opt.icon;
                                const isActive = embedType === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setEmbedType(key)}
                                        className={`p-5 rounded-2xl border text-left transition-all group relative overflow-hidden ${
                                            isActive
                                                ? 'border-purple-vivid/50 bg-purple-vivid/[0.08]'
                                                : 'border-bg-border bg-bg-surface/50 hover:bg-bg-surface hover:border-text-muted/30'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`p-2.5 rounded-xl border ${isActive ? 'bg-purple-vivid text-white border-transparent' : 'bg-bg-primary text-text-muted border-bg-border group-hover:text-text-primary group-hover:border-text-muted/50'}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'}`}>{opt.label}</p>
                                                <p className="text-[11px] text-text-muted/70 mt-0.5 leading-relaxed">{opt.description}</p>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <motion.div layoutId="activeEmbed" className="absolute left-0 top-0 bottom-0 w-1 bg-purple-vivid" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                    {/* Preview Visualization */}
                    <PurpleCard className="p-0 overflow-hidden">
                        <div className="px-6 py-4 border-b border-bg-border/50 flex items-center justify-between bg-bg-surface/30">
                            <div className="flex items-center gap-3">
                                <Layout className="w-4 h-4 text-purple-vivid" />
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Real-Time Visualization</span>
                            </div>
                        </div>
                        <div className="p-12 flex items-center justify-center min-h-[220px] bg-[url('/grid.svg')] bg-center bg-no-repeat bg-contain">
                            <motion.div
                                key={embedType + selectedHash}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="z-10"
                            >
                                {currentEmbed.preview}
                            </motion.div>
                        </div>
                    </PurpleCard>

                    {/* Code Snippets */}
                    <PurpleCard className="p-0 overflow-hidden">
                        <div className="flex items-center border-b border-bg-border/50 bg-bg-surface/30">
                            <div className="flex-1 flex">
                                {['html', 'markdown', 'react'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setCodeTab(tab)}
                                        className={`px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                                            codeTab === tab
                                                ? 'text-purple-vivid'
                                                : 'text-text-muted hover:text-text-primary'
                                        }`}
                                    >
                                        {tab === 'react' ? 'React / JSX' : tab}
                                        {codeTab === tab && (
                                            <motion.div layoutId="codeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-vivid" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="pr-4">
                                <GlowButton
                                    onClick={() => handleCopy(currentEmbed.codes[codeTab], 'code')}
                                    variant="ghost"
                                    className="h-10 px-4 text-[10px] uppercase font-bold tracking-[0.2em]"
                                    icon={copied === 'code' ? Check : Copy}
                                >
                                    {copied === 'code' ? 'Manifested' : 'Manifest Code'}
                                </GlowButton>
                            </div>
                        </div>
                        <div className="p-6 bg-black/40">
                            <pre className="text-xs font-mono text-purple-glow/80 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-auto">
                                <code className="block py-2">{currentEmbed.codes[codeTab]}</code>
                            </pre>
                        </div>
                    </PurpleCard>

                    {/* Operational Protocols */}
                    <div className="p-6 bg-purple-vivid/[0.03] border border-purple-vivid/10 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Info className="w-16 h-16 text-purple-vivid" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-purple-glow text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Info className="w-4 h-4" /> Operational Intelligence
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                <ProtocolItem label="Cryptographic Binding" text="Badges are cryptographically linked to on-chain accounts." />
                                <ProtocolItem label="Automated Synchronization" text="Verification statuses update in real-time as state changes." />
                                <ProtocolItem label="Global Dissemination" text="Assets can be embedded across websites, emails, or PDFs." />
                                <ProtocolItem label="Audit Resilience" text="Badges provide instant, public proof of document validity." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProtocolItem({ label, text }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-primary uppercase tracking-wider leading-none">{label}</p>
            <p className="text-[11px] text-text-muted/80 leading-relaxed font-medium">{text}</p>
        </div>
    );
}
