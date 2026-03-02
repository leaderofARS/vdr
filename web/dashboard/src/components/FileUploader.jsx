"use client";

import { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { hashFile } from "@/utils/hash";

export default function FileUploader({ onHashComputed }) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [computedHash, setComputedHash] = useState("");
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
        const hash = await hashFile(file);
        setComputedHash(hash);
        if (onHashComputed) {
            onHashComputed(hash, file.name);
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
            {!selectedFile ? (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${isDragging
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 bg-gray-900/50 hover:bg-gray-800/50 hover:border-gray-600"
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
                    <p className="text-lg font-medium text-gray-200 mb-1">
                        Drag & drop your file here
                    </p>
                    <p className="text-sm text-gray-500">
                        or click to browse your computer
                    </p>
                    <p className="text-xs text-gray-600 mt-6 max-w-sm text-center">
                        Files are hashed securely on your device. Raw data never leaves your computer.
                    </p>
                </div>
            ) : (
                <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <FileIcon className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-md font-medium text-gray-200 truncate max-w-xs">{selectedFile.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || "unknown file type"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearSelection}
                            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 font-mono text-sm break-all">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-sans font-semibold">SHA-256 Digest</div>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            {computedHash}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
