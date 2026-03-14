import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Code2,
  Copy,
  Check,
  Share2,
  Palette,
  Settings,
  Eye,
  Shield,
  Hash,
  QrCode,
  Link2,
  Download,
  Twitter,
  Linkedin,
  Mail,
  CheckCircle2,
  Globe,
  FileCheck,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import api from '@/utils/api';


// Widget themes
const THEMES = [
  { id: 'dark', name: 'Dark', bg: '#0a0a0f', text: '#f0f0ff', accent: '#6C63FF' },
  { id: 'light', name: 'Light', bg: '#ffffff', text: '#1a1a2e', accent: '#6C63FF' },
  { id: 'purple', name: 'Purple', bg: '#1a1a3e', text: '#f0f0ff', accent: '#a855f7' },
  { id: 'minimal', name: 'Minimal', bg: '#f8f8fa', text: '#333333', accent: '#6C63FF' },
];

// Widget sizes
const SIZES = [
  { id: 'compact', name: 'Compact', width: 280, height: 120 },
  { id: 'standard', name: 'Standard', width: 360, height: 160 },
  { id: 'large', name: 'Large', width: 480, height: 200 },
];

interface HashRecord {
  hash: string;
  metadata: string;
  status: string;
  registeredAt: string;
  txSignature: string;
}

export const EmbedSharePage: FC = () => {
  
  const [hashes, setHashes] = useState<HashRecord[]>([]);
  const [selectedHash, setSelectedHash] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [showMetadata, setShowMetadata] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [showNetwork, setShowNetwork] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'embed' | 'share' | 'qr'>('embed');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(true);
  const [customTitle] = useState('Verified on SipHeron');

  // Fetch user's hashes
  useEffect(() => {
    const fetchHashes = async () => {
      try {
        const { data } = await api.get('/api/hashes', {
          params: { page: 1, limit: 50 },
        });
        setHashes(data.data || []);
        if (data.data?.length > 0) {
          setSelectedHash(data.data[0].hash);
        }
      } catch (error) {
        console.error('Failed to fetch hashes:', error);
        toast.error('Failed to load hashes');
      } finally {
        setLoading(false);
      }
    };

    fetchHashes();
  }, []);

  const selectedHashData = hashes.find(h => h.hash === selectedHash);

  // Generate embed code
  const generateEmbedCode = () => {
    const params = new URLSearchParams({
      theme: selectedTheme.id,
      size: selectedSize.id,
      title: customTitle,
      ...(showMetadata && { metadata: '1' }),
      ...(showTimestamp && { timestamp: '1' }),
      ...(showNetwork && { network: '1' }),
    });
    
    return `<iframe
  src="https://embed.sipheron.com/verify/${selectedHash}?${params.toString()}"
  width="${selectedSize.width}"
  height="${selectedSize.height}"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.1);"
  title="SipHeron Verification"
></iframe>`;
  };



  // Generate direct link
  const generateDirectLink = () => {
    return `https://app.sipheron.com/verify/${selectedHash}`;
  };

  // Social share URLs
  const getSocialShareUrls = () => {
    const url = encodeURIComponent(generateDirectLink());
    const text = encodeURIComponent(`Verify this document on SipHeron VDR - blockchain-backed proof of existence`);
    
    return {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=Document Verification&body=Verify this document: ${generateDirectLink()}`,
    };
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  // QR Code URL - use consistent format like web/dashboard
  const qrCodeUrl = selectedHash 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(generateDirectLink())}&bgcolor=000000&color=a855f7&qzone=2`
    : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (hashes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 rounded-2xl bg-sipheron-purple/10 flex items-center justify-center mb-4">
          <Hash className="w-8 h-8 text-sipheron-purple" />
        </div>
        <h2 className="text-xl font-semibold text-sipheron-text-primary mb-2">
          No Hashes Available
        </h2>
        <p className="text-sm text-sipheron-text-muted text-center max-w-md mb-6">
          You need to anchor at least one document before you can create embed widgets or share links.
        </p>
        <a
          href="/dashboard/hashes"
          className="px-4 py-2 bg-sipheron-purple hover:bg-sipheron-purple-light rounded-lg text-white text-sm font-medium transition-colors"
        >
          Anchor Your First Document
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">
            Embed & Share
          </h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Create embeddable widgets and share verification links
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-sipheron-surface rounded-xl border border-white/[0.06] w-fit">
        {[
          { id: 'embed', icon: Code2, label: 'Embed Widget' },
          { id: 'share', icon: Share2, label: 'Share Link' },
          { id: 'qr', icon: QrCode, label: 'QR Code' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-sipheron-purple text-white'
                : 'text-sipheron-text-muted hover:text-sipheron-text-secondary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-4">
          {/* Document Selector */}
          <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-medium text-sipheron-text-muted mb-4 flex items-center gap-2">
              <FileCheck className="w-4 h-4" /> Select Document
            </h3>
            <select
              value={selectedHash}
              onChange={(e) => setSelectedHash(e.target.value)}
              className="w-full bg-sipheron-base border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-sipheron-text-primary focus:outline-none focus:border-sipheron-purple/50"
            >
              {hashes.map((hash) => (
                <option key={hash.hash} value={hash.hash}>
                  {hash.metadata || 'Untitled'} - {hash.hash.slice(0, 16)}...
                </option>
              ))}
            </select>
            {selectedHashData && (
              <div className="mt-4 p-4 bg-sipheron-base rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-sipheron-text-primary">
                    {selectedHashData.metadata || 'Untitled'}
                  </span>
                </div>
                <div className="text-xs text-sipheron-text-muted font-mono">
                  {selectedHashData.hash}
                </div>
                <div className="text-xs text-sipheron-text-muted mt-1">
                  Anchored on {new Date(selectedHashData.registeredAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* Embed Configuration */}
          {activeTab === 'embed' && (
            <>
              {/* Theme Selector */}
              <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
                <h3 className="text-sm font-medium text-sipheron-text-muted mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Theme
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-3 rounded-xl border transition-all ${
                        selectedTheme.id === theme.id
                          ? 'border-sipheron-purple bg-sipheron-purple/10'
                          : 'border-white/[0.06] hover:border-white/[0.1]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg border border-white/10"
                          style={{ background: theme.bg }}
                        />
                        <span className="text-sm text-sipheron-text-primary">{theme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
                <h3 className="text-sm font-medium text-sipheron-text-muted mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Size
                </h3>
                <div className="flex gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                        selectedSize.id === size.id
                          ? 'border-sipheron-purple bg-sipheron-purple/10'
                          : 'border-white/[0.06] hover:border-white/[0.1]'
                      }`}
                    >
                      <div className="text-sm font-medium text-sipheron-text-primary">{size.name}</div>
                      <div className="text-xs text-sipheron-text-muted mt-1">
                        {size.width}×{size.height}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Options */}
              <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
                <h3 className="text-sm font-medium text-sipheron-text-muted mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Display Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-sipheron-base rounded-xl cursor-pointer">
                    <span className="text-sm text-sipheron-text-secondary">Show Metadata</span>
                    <input
                      type="checkbox"
                      checked={showMetadata}
                      onChange={(e) => setShowMetadata(e.target.checked)}
                      className="w-4 h-4 rounded border-white/[0.1] bg-sipheron-base text-sipheron-purple focus:ring-sipheron-purple"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-sipheron-base rounded-xl cursor-pointer">
                    <span className="text-sm text-sipheron-text-secondary">Show Timestamp</span>
                    <input
                      type="checkbox"
                      checked={showTimestamp}
                      onChange={(e) => setShowTimestamp(e.target.checked)}
                      className="w-4 h-4 rounded border-white/[0.1] bg-sipheron-base text-sipheron-purple focus:ring-sipheron-purple"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-sipheron-base rounded-xl cursor-pointer">
                    <span className="text-sm text-sipheron-text-secondary">Show Network</span>
                    <input
                      type="checkbox"
                      checked={showNetwork}
                      onChange={(e) => setShowNetwork(e.target.checked)}
                      className="w-4 h-4 rounded border-white/[0.1] bg-sipheron-base text-sipheron-purple focus:ring-sipheron-purple"
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Share Options */}
          {activeTab === 'share' && (
            <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
              <h3 className="text-sm font-medium text-sipheron-text-muted mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Social Sharing
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'hover:bg-blue-500/20 hover:text-blue-400' },
                  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-600/20 hover:text-blue-500' },
                  { id: 'email', icon: Mail, label: 'Email', color: 'hover:bg-amber-500/20 hover:text-amber-400' },
                ].map((social) => (
                  <a
                    key={social.id}
                    href={getSocialShareUrls()[social.id as keyof ReturnType<typeof getSocialShareUrls>]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-sipheron-base border border-white/[0.06] transition-all ${social.color}`}
                  >
                    <social.icon className="w-6 h-6" />
                    <span className="text-xs text-sipheron-text-muted">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Preview & Code */}
        <div className="space-y-4">
          {/* Preview */}
          <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-medium text-sipheron-text-muted flex items-center gap-2">
                <Eye className="w-4 h-4" /> Preview
              </h3>
              {activeTab === 'embed' && (
                <div className="flex gap-1">
                  {[
                    { id: 'desktop', icon: Monitor },
                    { id: 'tablet', icon: Tablet },
                    { id: 'mobile', icon: Smartphone },
                  ].map((device) => (
                    <button
                      key={device.id}
                      onClick={() => setPreviewMode(device.id as typeof previewMode)}
                      className={`p-2 rounded-lg transition-colors ${
                        previewMode === device.id
                          ? 'bg-white/10 text-sipheron-text-primary'
                          : 'text-sipheron-text-muted hover:text-sipheron-text-secondary'
                      }`}
                    >
                      <device.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-8 flex items-center justify-center bg-sipheron-base/50 min-h-[300px]">
              {activeTab === 'embed' && (
                <div
                  className="relative rounded-xl overflow-hidden shadow-2xl transition-all"
                  style={{
                    width: previewMode === 'mobile' ? 280 : previewMode === 'tablet' ? 360 : selectedSize.width,
                    height: selectedSize.height,
                    background: selectedTheme.bg,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Widget Content */}
                  <div className="p-5 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5" style={{ color: selectedTheme.accent }} />
                      <span className="text-sm font-semibold truncate" style={{ color: selectedTheme.text }}>
                        {customTitle}
                      </span>
                    </div>
                    
                    {selectedHashData && (
                      <>
                        {showMetadata && selectedHashData.metadata && (
                          <div className="text-sm mb-2 truncate" style={{ color: selectedTheme.text, opacity: 0.9 }}>
                            {selectedHashData.metadata}
                          </div>
                        )}
                        <div className="font-mono text-xs mb-2 truncate" style={{ color: selectedTheme.text, opacity: 0.6 }}>
                          {selectedHashData.hash.slice(0, 20)}...{selectedHashData.hash.slice(-8)}
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          {showTimestamp && (
                            <span className="text-[10px]" style={{ color: selectedTheme.text, opacity: 0.5 }}>
                              {new Date(selectedHashData.registeredAt).toLocaleDateString()}
                            </span>
                          )}
                          {showNetwork && (
                            <span className="text-[10px] px-2 py-1 rounded-full" style={{ 
                              background: selectedTheme.accent + '20',
                              color: selectedTheme.accent 
                            }}>
                              Devnet
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'share' && (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-sipheron-purple/10 flex items-center justify-center mx-auto mb-4">
                    <Link2 className="w-10 h-10 text-sipheron-purple" />
                  </div>
                  <p className="text-sm text-sipheron-text-muted">Direct link to verification page</p>
                </div>
              )}

              {activeTab === 'qr' && selectedHash && (
                <div className="text-center">
                  {qrCodeUrl && (
                    <div 
                      className="inline-block p-6 rounded-2xl"
                      style={{ background: selectedTheme.bg, border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-48 h-48"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(generateDirectLink())}`;
                        }}
                      />
                      <p className="mt-4 text-sm font-medium" style={{ color: selectedTheme.text }}>
                        Scan to verify
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Code Output */}
          {activeTab === 'embed' && (
            <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06]">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-medium text-sipheron-text-muted flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Embed Code
                </h3>
                <button
                  onClick={() => copyToClipboard(generateEmbedCode(), 'embed')}
                  className="text-xs text-sipheron-purple hover:text-sipheron-purple-light transition-colors flex items-center gap-1"
                >
                  {copied === 'embed' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === 'embed' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4">
                <pre className="bg-sipheron-base rounded-xl p-4 text-xs font-mono text-sipheron-text-secondary overflow-x-auto">
                  <code>{generateEmbedCode()}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06]">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-medium text-sipheron-text-muted flex items-center gap-2">
                  <Link2 className="w-4 h-4" /> Direct Link
                </h3>
                <button
                  onClick={() => copyToClipboard(generateDirectLink(), 'link')}
                  className="text-xs text-sipheron-purple hover:text-sipheron-purple-light transition-colors flex items-center gap-1"
                >
                  {copied === 'link' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === 'link' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4">
                <div className="bg-sipheron-base rounded-xl p-4 text-sm font-mono text-sipheron-text-secondary break-all">
                  {generateDirectLink()}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr' && selectedHash && (
            <div className="flex gap-3">
              <a
                href={qrCodeUrl}
                download={`sipheron-qr-${selectedHash.slice(0, 8)}.png`}
                className="flex-1 px-4 py-3 bg-sipheron-purple hover:bg-sipheron-purple-light rounded-xl text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </a>
              <button
                onClick={() => copyToClipboard(generateDirectLink(), 'qr')}
                className="flex-1 px-4 py-3 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl text-sipheron-text-primary text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {copied === 'qr' ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                {copied === 'qr' ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmbedSharePage;
