"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FileUploader from "@/components/FileUploader";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { Loader2, ExternalLink, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Register() {
  const { connected } = useWallet();
  const [hash, setHash] = useState(null);
  const [filename, setFilename] = useState("");
  const [metadata, setMetadata] = useState("");
  const [status, setStatus] = useState("idle"); // idle, registering, success, error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleHashComputed = (computedHash, name) => {
    setHash(computedHash);
    setFilename(name);
    setMetadata(name || "");
    setStatus("idle");
    setResult(null);
  };

  const handleRegister = async () => {
    if (!hash) return;

    setStatus("registering");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await axios.post(`${apiUrl}/register`, {
        hash,
        metadata
      });

      setResult(res.data);
      setStatus("success");
    } catch (err) {
      if (err.response?.status === 409) {
        setErrorMessage("This file hash has already been registered on VDR.");
      } else {
        setErrorMessage(err.response?.data?.error || "An unknown error occurred during registration.");
      }
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
              Register Data Integrity
            </h1>
            <p className="text-xl text-gray-400 max-w-xl mx-auto">
              Cryptographically anchor your files to Solana without trusting a middleman.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-6">Select a file to register</h2>

            <FileUploader onHashComputed={handleHashComputed} />

            {hash && status !== "success" && (
              <div className="mt-8 space-y-6 slide-up-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Optional Metadata Label
                  </label>
                  <input
                    type="text"
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. contract-v2-final.pdf"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-2">Maximum 200 characters. Visible publicly on-chain.</p>
                </div>

                {status === "error" && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={status === "registering"}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${status === "registering"
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-pointer"
                    }`}
                >
                  {status === "registering" ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Registering on Solana...
                    </>
                  ) : (
                    "Register to Solana"
                  )}
                </button>
              </div>
            )}

            {status === "success" && result && (
              <div className="mt-8 bg-green-900/10 border border-green-500/20 rounded-xl p-6 slide-up-fade-in">
                <div className="flex items-center text-green-400 mb-4">
                  <CheckCircle className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-bold">Successfully Registered</h3>
                </div>

                <div className="space-y-3 font-mono text-sm mt-6">
                  <div className="flex flex-col">
                    <span className="text-gray-500 uppercase tracking-wider text-xs mb-1">Transaction Signature</span>
                    <a
                      href={result.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center truncate break-all"
                    >
                      {result.txSignature} <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 uppercase tracking-wider text-xs mb-1">Owner Address</span>
                    <span className="text-gray-300 truncate">{result.owner}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 uppercase tracking-wider text-xs mb-1">Timestamp</span>
                    <span className="text-gray-300">{new Date(result.timestamp * 1000).toUTCString()}</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => handleHashComputed(null, "")}
                    className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-center"
                  >
                    Register Another
                  </button>
                  <Link
                    href="/verify"
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-center"
                  >
                    Verify a File
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
