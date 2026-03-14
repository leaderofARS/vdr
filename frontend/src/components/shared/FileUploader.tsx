import { useState, useRef, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X, Check, Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import { hashFile } from '@/utils/hash';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FileUploaderProps {
  onHashComputed: (hash: string | null, filename: string | null) => void;
  onFileSelect?: (file: File | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onHashComputed, onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 100MB.');
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
    setIsHashing(true);
    
    try {
      const hash = await hashFile(file);
      setComputedHash(hash);
      onHashComputed(hash, file.name);
      toast.success('File hashed successfully');
    } catch (error) {
      console.error('Hashing error:', error);
      toast.error('Failed to compute file hash');
      onHashComputed(null, null);
    } finally {
      setIsHashing(false);
    }
  }, [onHashComputed, onFileSelect]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  }, [processFile]);

  const clearSelection = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedFile(null);
    setComputedHash("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onHashComputed(null, null);
    if (onFileSelect) onFileSelect(null);
  }, [onHashComputed, onFileSelect]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden ${
              isDragging
                ? "border-sipheron-purple bg-sipheron-purple/10 scale-[1.02]"
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
                className="absolute inset-0 bg-sipheron-purple/5 blur-3xl pointer-events-none"
              />
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              isDragging ? "bg-sipheron-purple text-white" : "bg-white/5 text-sipheron-text-muted"
            }`}>
              <UploadCloud className="w-8 h-8" />
            </div>

            <p className="text-lg font-semibold text-sipheron-text-primary mb-2">
              Drop files to anchor
            </p>
            <p className="text-sm text-sipheron-text-muted">
              Drag & drop or <span className="text-sipheron-purple">browse</span> to upload
            </p>

            <div className="mt-8 flex items-center gap-4 opacity-40">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Client-Side Hashing</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-sipheron-text-muted" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Zero-Knowledge</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-sipheron-text-muted">
              Maximum file size: 100MB
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-sipheron-surface border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sipheron-purple/10 border border-sipheron-purple/20 flex items-center justify-center relative">
                  {isHashing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-t-2 border-sipheron-purple rounded-full"
                    />
                  ) : (
                    <FileIcon className="w-6 h-6 text-sipheron-purple" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-base font-medium text-sipheron-text-primary truncate max-w-[200px] sm:max-w-md">
                    {selectedFile.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-sipheron-text-muted mt-0.5">
                    <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    <div className="w-1 h-1 rounded-full bg-sipheron-text-muted/50" />
                    <span className="uppercase tracking-wide">{selectedFile.type?.split('/')[1] || "Binary"}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 text-sipheron-text-muted hover:text-red-400 transition-all flex items-center justify-center border border-white/5 hover:border-red-500/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-white/5 relative group/hash overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover/hash:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(computedHash);
                    toast.success('Hash copied to clipboard');
                  }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy hash"
                >
                  <Check className="w-4 h-4 text-sipheron-purple" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Fingerprint className="w-4 h-4 text-sipheron-purple" />
                <span className="text-[10px] font-medium text-sipheron-text-muted uppercase tracking-wider">SHA-256 Hash</span>
              </div>

              <div className="font-mono text-sm break-all">
                {isHashing ? (
                  <span className="text-sipheron-text-muted">Computing hash...</span>
                ) : (
                  <span className="text-sipheron-purple">
                    {computedHash}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
