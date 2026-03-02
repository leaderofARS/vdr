"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FileUploader from "@/components/FileUploader";
import axios from "axios";
import { Loader2, ShieldCheck, ShieldAlert, FileSearch } from "lucide-react";
import Link from "next/link";

export default function Verify() {
    const [hash, setHash] = useState(null);
    const [status, setStatus] = useState("idle"); // idle, verifying, success, error, tampered
    const [result, setResult] = useState(null);

    const handleHashComputed = async (computedHash) => {
        setHash(computedHash);
        if (!computedHash) {
            setStatus("idle");
            setResult(null);
            return;
        }

        setStatus("verifying");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const res = await axios.post(`${apiUrl}/verify`, { hash: computedHash });

            const data = res.data;

            if (data.verified) {
                setResult(data);
                setStatus("success");
            } else {
                setResult(null);
                setStatus("tampered");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
                            Verify Data Integrity
                        </h1>
                        <p className="text-xl text-gray-400 max-w-xl mx-auto">
                            Check if a file perfectly matches its original on-chain timestamp.
                        </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl p-6 sm:p-8">
                        <h2 className="text-lg font-semibold text-white mb-6">Select a file to verify</h2>

                        <FileUploader onHashComputed={handleHashComputed} />

                        {status === "verifying" && (
                            <div className="mt-8 flex flex-col items-center justify-center text-gray-400 py-8">
                                <Loader2 className="w-12 h-12 mb-4 animate-spin text-blue-500" />
                                <p className="text-lg font-medium">Querying Solana Registry...</p>
                            </div>
                        )}

                        {status === "success" && result && (
                            <div className="mt-8 bg-green-900/10 border border-green-500/30 rounded-xl p-8 slide-up-fade-in text-center">
                                <div className="flex flex-col items-center justify-center text-green-400 mb-6">
                                    <ShieldCheck className="w-20 h-20 mb-4" />
                                    <h3 className="text-2xl font-bold">Verified Authentic</h3>
                                    <p className="text-green-300/70 mt-2">The exact hash of this file was found in the VDR registry.</p>
                                </div>

                                <div className="bg-gray-900 rounded-lg p-6 text-left border border-green-500/20 font-mono text-sm">
                                    <table className="w-full">
                                        <tbody>
                                            <tr className="border-b border-gray-800">
                                                <td className="py-3 text-gray-500">Registered By</td>
                                                <td className="py-3 text-gray-200 break-all">{result.owner}</td>
                                            </tr>
                                            <tr className="border-b border-gray-800">
                                                <td className="py-3 text-gray-500">Timestamp UTC</td>
                                                <td className="py-3 text-gray-200">{new Date(result.timestamp * 1000).toUTCString()}</td>
                                            </tr>
                                            <tr className="border-b border-gray-800">
                                                <td className="py-3 text-gray-500">Metadata</td>
                                                <td className="py-3 text-gray-200 break-all">{result.metadata || "—"}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 text-gray-500">PDA Address</td>
                                                <td className="py-3 text-gray-200 break-all">{result.pdaAddress}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {status === "tampered" && (
                            <div className="mt-8 bg-red-900/10 border border-red-500/30 rounded-xl p-8 slide-up-fade-in text-center">
                                <div className="flex flex-col items-center justify-center text-red-500 mb-6">
                                    <ShieldAlert className="w-20 h-20 mb-4" />
                                    <h3 className="text-2xl font-bold">Not Registered or Tampered</h3>
                                    <p className="text-red-400/80 mt-2">We could not find a matching record on the Solana blockchain. The file has either been modified or was never registered.</p>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="mt-8 bg-orange-900/10 border border-orange-500/30 rounded-xl p-8 slide-up-fade-in text-center">
                                <div className="flex flex-col items-center justify-center text-orange-500 mb-6">
                                    <FileSearch className="w-20 h-20 mb-4" />
                                    <h3 className="text-2xl font-bold">Network Error</h3>
                                    <p className="text-orange-400/80 mt-2">Could not connect to the Backend API. Please try again later.</p>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-center">
                            <Link href="/explorer" className="text-sm text-blue-400 hover:underline flex items-center">
                                Can't find it? Check the global Hash Explorer <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const ExternalLink = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);
