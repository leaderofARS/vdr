"use client";

import { useState } from 'react';
import { Binary, Copy, Check, AlertCircle, Terminal, CheckCircle2 } from 'lucide-react';

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
        <div className="max-w-[1000px] mx-auto space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-normal text-white mb-1">Hash Decoder Utility</h1>
                <p className="text-sm text-[#9AA0A6]">
                    Convert raw on-chain byte arrays back to hex hashes for verification.
                </p>
            </div>

            <div className="bg-[#1A1D24] border border-[#2C3038] rounded shadow-sm">
                <div className="border-b border-[#2C3038] px-5 py-3 bg-[#1D2128]">
                    <h2 className="text-[#E8EAED] text-sm font-medium">Input Configuration</h2>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-[#9AA0A6] mb-2 uppercase">Raw Byte Array</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g. [249, 245, 167, 3, 111, 164, 68, 96, ...]"
                            className="w-full h-32 px-3 py-2 bg-[#131418] border border-[#3C4043] rounded text-sm text-[#4285F4] font-mono focus:outline-none focus:border-[#4285F4] transition-colors resize-none mb-4"
                        />

                        {error && (
                            <div className="bg-[#3C2A2A] border border-[#F28B82]/30 rounded p-3 mb-4 flex items-start gap-2 text-sm text-[#F28B82]">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleDecode}
                            className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-5 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Binary className="w-4 h-4" />
                            DECODE TO HEX
                        </button>
                    </div>
                </div>
            </div>

            {output && (
                <div className="bg-[#1A1D24] border border-[#2C3038] rounded shadow-sm">
                    <div className="border-b border-[#2C3038] px-5 py-3 bg-[#1D2128]">
                        <h2 className="text-[#E8EAED] text-sm font-medium">Decoding Results</h2>
                    </div>

                    <div className="p-5 space-y-8">
                        <div>
                            <label className="block text-xs font-medium text-[#9AA0A6] mb-2 uppercase">Decoded Hex String</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    readOnly
                                    value={output}
                                    className="w-full bg-[#131418] border border-[#3C4043] rounded px-3 py-2.5 text-sm text-[#10B981] font-mono focus:outline-none"
                                />
                                <button
                                    onClick={() => copyToClipboard(output, 'hex')}
                                    className="shrink-0 p-2.5 bg-[#2C3038] hover:bg-[#3C4043] text-white rounded transition-colors"
                                    title="Copy hex to clipboard"
                                >
                                    {copiedHex ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-[#9AA0A6]">
                                Use this hex with <code className="bg-[#131418] border border-[#2C3038] px-1 rounded text-[#E8EAED]">sipheron-vdr verify &lt;file&gt;</code>
                            </p>
                        </div>

                        <div className="border-t border-[#2C3038] pt-6">
                            <label className="flex items-center gap-2 text-xs font-medium text-[#9AA0A6] mb-2 uppercase">
                                <Terminal className="w-4 h-4" /> Verify via API
                            </label>
                            <div className="relative group">
                                <pre className="w-full bg-[#131418] border border-[#3C4043] rounded p-4 text-sm text-[#E8EAED] font-mono overflow-x-auto whitespace-pre-wrap">
                                    {curlCommand}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(curlCommand, 'curl')}
                                    className="absolute top-3 right-3 p-1.5 bg-[#2C3038] hover:bg-[#3C4043] text-[#9AA0A6] hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Copy command"
                                >
                                    {copiedCurl ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
