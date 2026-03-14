import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Terminal,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  Code2,
  Send,
  Copy,
  Globe,
  Zap,
  Shield,
  FileJson,
  Clock,
  Lightbulb,
  Sparkles,
  X,
  ChevronDown,
} from 'lucide-react';
import api from '@/utils/api';

// Endpoints configuration
const ENDPOINTS = [
  {
    id: 'verify',
    name: 'Verify Hash',
    method: 'POST',
    path: '/verify',
    description: 'Verify if a hash exists on the Solana blockchain',
    defaultBody: { hash: '' },
    params: [
      { name: 'hash', type: 'string', required: true, description: 'SHA-256 hash to verify (64 hex characters)' }
    ]
  },
  {
    id: 'record',
    name: 'Get Record',
    method: 'GET',
    path: '/record/:hash',
    description: 'Retrieve full record details by hash',
    defaultBody: null,
    params: [
      { name: 'hash', type: 'string', required: true, description: 'SHA-256 hash to lookup' }
    ]
  },
  {
    id: 'list',
    name: 'List Hashes',
    method: 'GET',
    path: '/api/hashes',
    description: 'List all hashes for your organization',
    defaultBody: null,
    params: [
      { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
      { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 20)' }
    ]
  },
  {
    id: 'stats',
    name: 'Org Stats',
    method: 'GET',
    path: '/api/org/stats',
    description: 'Get organization statistics',
    defaultBody: null,
    params: []
  }
];

const CODE_EXAMPLES: Record<string, string> = {
  javascript: `// Using fetch
const response = await fetch('https://api.sipheron.com/verify', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({ hash: 'f9f5a703...' })
});
const data = await response.json();
console.log(data.verified);`,
  python: `# Using requests
import requests

response = requests.post(
    'https://api.sipheron.com/verify',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={'hash': 'f9f5a703...'}
)
data = response.json()
print(data['verified'])`,
  curl: `curl -X POST https://api.sipheron.com/verify \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"hash": "f9f5a703..."}'`
};

export const PlaygroundPage: FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState(JSON.stringify(ENDPOINTS[0].defaultBody, null, 2));
  const [hashInput, setHashInput] = useState('');
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ status: number; message: string; data?: Record<string, unknown> } | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'response' | 'code'>('response');
  const [selectedLang, setSelectedLang] = useState<keyof typeof CODE_EXAMPLES>('javascript');
  const [showTips, setShowTips] = useState(true);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [showEndpointMenu, setShowEndpointMenu] = useState(false);

  useEffect(() => {
    if (selectedEndpoint.defaultBody) {
      setRequestBody(JSON.stringify(selectedEndpoint.defaultBody, null, 2));
    } else {
      setRequestBody('{}');
    }
    setResponse(null);
    setError(null);
  }, [selectedEndpoint]);

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const startTime = performance.now();

    try {
      let res;
      const path = selectedEndpoint.path.replace(/:hash/g, hashInput || 'example_hash');

      if (selectedEndpoint.method === 'GET') {
        res = await api.get(path);
      } else {
        const body = requestBody ? JSON.parse(requestBody) : {};
        if (hashInput) body.hash = hashInput;
        res = await api.post(path, body);
      }

      setResponseTime(Math.round(performance.now() - startTime));
      setResponse(res.data as Record<string, unknown>);
    } catch (err: any) {
      setError({
        status: err.response?.status || 500,
        message: err.response?.data?.message || err.message,
        data: err.response?.data as Record<string, unknown>
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJson = (obj: unknown): string => JSON.stringify(obj, null, 2);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'POST': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'PUT': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">
            API Playground
          </h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Test the SipHeron API endpoints in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/docs/api"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sipheron-text-secondary text-sm hover:bg-white/[0.05] transition-colors flex items-center gap-2"
          >
            <FileJson className="w-4 h-4" />
            API Docs
          </a>
        </div>
      </div>

      {/* Tips Banner */}
      {showTips && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sipheron-text-primary mb-1">Quick Tips</h4>
              <ul className="text-sm text-sipheron-text-muted space-y-1">
                <li>• All requests use your authenticated session</li>
                <li>• Responses are live from the devnet API</li>
                <li>• Copy code examples in your preferred language</li>
              </ul>
            </div>
            <button
              onClick={() => setShowTips(false)}
              className="text-sipheron-text-muted hover:text-sipheron-text-primary p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Playground Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Request */}
        <div className="space-y-4">
          {/* Endpoint Selector */}
          <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-medium text-sipheron-text-muted mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Select Endpoint
            </h3>
            
            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowEndpointMenu(!showEndpointMenu)}
                className="w-full text-left p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getMethodColor(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <div>
                    <div className="font-medium text-sipheron-text-primary">{selectedEndpoint.name}</div>
                    <div className="text-xs text-sipheron-text-muted font-mono">{selectedEndpoint.path}</div>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-sipheron-text-muted transition-transform ${showEndpointMenu ? 'rotate-180' : ''}`} />
              </button>

              {showEndpointMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-sipheron-surface border border-white/[0.06] rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  {ENDPOINTS.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => {
                        setSelectedEndpoint(endpoint);
                        setShowEndpointMenu(false);
                      }}
                      className={`w-full text-left p-4 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors last:border-0 ${
                        selectedEndpoint.id === endpoint.id ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <div>
                          <div className="font-medium text-sipheron-text-primary">{endpoint.name}</div>
                          <div className="text-xs text-sipheron-text-muted font-mono">{endpoint.path}</div>
                        </div>
                      </div>
                      <p className="text-xs text-sipheron-text-muted mt-2 ml-[calc(2.5rem+4px)]">{endpoint.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Click outside to close */}
            {showEndpointMenu && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowEndpointMenu(false)}
              />
            )}
          </div>

          {/* Request Configuration */}
          <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-medium text-sipheron-text-muted mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Request Configuration
            </h3>

            {/* Hash Input */}
            {(selectedEndpoint.id === 'verify' || selectedEndpoint.id === 'record') && (
              <div className="mb-4">
                <label className="text-xs font-medium text-sipheron-text-muted uppercase tracking-wider mb-2 block">
                  Hash
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    placeholder="Enter SHA-256 hash (64 characters)..."
                    className="flex-1 bg-sipheron-base border border-white/[0.06] rounded-xl px-4 py-3 text-sm font-mono text-sipheron-text-primary placeholder:text-sipheron-text-muted/50 focus:outline-none focus:border-sipheron-purple/50"
                  />
                </div>
                {hashInput && hashInput.length === 64 && (
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Valid hash format
                  </p>
                )}
              </div>
            )}

            {/* JSON Body Editor */}
            {selectedEndpoint.defaultBody && (
              <div>
                <label className="text-xs font-medium text-sipheron-text-muted uppercase tracking-wider mb-2 block">
                  Request Body (JSON)
                </label>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={8}
                  className="w-full bg-sipheron-base border border-white/[0.06] rounded-xl p-4 text-sm font-mono text-sipheron-text-primary focus:outline-none focus:border-sipheron-purple/50 resize-none"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="w-full mt-4 px-6 py-3 bg-sipheron-purple hover:bg-sipheron-purple-light rounded-xl font-medium text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Response & Code */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {(['response', 'code'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white/10 text-sipheron-text-primary'
                    : 'text-sipheron-text-muted hover:text-sipheron-text-secondary'
                }`}
              >
                {tab === 'response' ? (
                  <span className="flex items-center gap-2">
                    <FileJson className="w-4 h-4" /> Response
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> Code Example
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Response Panel */}
          {activeTab === 'response' && (
            <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] min-h-[400px]">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-medium text-sipheron-text-muted flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Response
                </h3>
                {responseTime && (
                  <span className="text-xs text-sipheron-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {responseTime}ms
                  </span>
                )}
              </div>

              <div className="p-4">
                {!response && !error && !loading && (
                  <div className="flex flex-col items-center justify-center py-20 text-sipheron-text-muted">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                      <Play className="w-8 h-8" />
                    </div>
                    <p className="text-sm">Send a request to see the response</p>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-2 border-sipheron-purple border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-sipheron-text-muted mt-4">Waiting for response...</p>
                  </div>
                )}

                {response && (
                  <div className="relative">
                    <div className="absolute top-0 right-0 flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded border border-emerald-500/20">
                        200 OK
                      </span>
                      <button
                        onClick={() => copyToClipboard(formatJson(response))}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-sipheron-text-muted hover:text-sipheron-text-primary"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="bg-sipheron-base rounded-xl p-4 pt-12 text-sm font-mono text-sipheron-text-secondary overflow-x-auto">
                      {formatJson(response)}
                    </pre>
                  </div>
                )}

                {error && (
                  <div className="relative">
                    <div className="absolute top-0 right-0">
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase rounded border border-red-500/20">
                        {error.status} Error
                      </span>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 pt-12">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-red-400 font-medium">{error.message}</p>
                          {error.data && (
                            <pre className="mt-3 text-xs font-mono text-sipheron-text-muted bg-sipheron-base rounded-lg p-3">
                              {formatJson(error.data)}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code Example Panel */}
          {activeTab === 'code' && (
            <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06]">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-medium text-sipheron-text-muted flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Code Example
                </h3>
                <div className="flex gap-1">
                  {(Object.keys(CODE_EXAMPLES) as Array<keyof typeof CODE_EXAMPLES>).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        selectedLang === lang
                          ? 'bg-sipheron-purple/20 text-sipheron-purple'
                          : 'text-sipheron-text-muted hover:text-sipheron-text-secondary'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="relative">
                  <button
                    onClick={() => copyToClipboard(CODE_EXAMPLES[selectedLang])}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors text-sipheron-text-muted hover:text-sipheron-text-primary z-10"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <pre className="bg-sipheron-base rounded-xl p-4 pt-12 text-sm font-mono text-sipheron-text-secondary overflow-x-auto">
                    <code>{CODE_EXAMPLES[selectedLang]}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Shield, title: 'Secure', desc: 'Authenticated requests with API keys' },
          { icon: Zap, title: 'Fast', desc: 'Sub-second response times from edge nodes' },
          { icon: Sparkles, title: 'Live', desc: 'Test against real devnet infrastructure' }
        ].map((feature, i) => (
          <div key={i} className="bg-sipheron-surface rounded-xl p-6 border border-white/[0.06] text-center">
            <div className="w-12 h-12 rounded-xl bg-sipheron-purple/10 flex items-center justify-center mx-auto mb-4">
              <feature.icon className="w-6 h-6 text-sipheron-purple" />
            </div>
            <h4 className="font-medium text-sipheron-text-primary mb-1">{feature.title}</h4>
            <p className="text-sm text-sipheron-text-muted">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaygroundPage;
