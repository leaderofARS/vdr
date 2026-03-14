import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Book,
  Terminal,
  Code2,
  FileText,
  Zap,
  Shield,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
  href: string;
  section: string;
  icon: React.ElementType;
}

const DOCS_ITEMS: DocItem[] = [
  // Getting Started
  { id: 'intro', title: 'Introduction', href: '/docs', section: 'Getting Started', icon: Book },
  { id: 'quickstart', title: 'Quick Start', href: '/docs/quickstart', section: 'Getting Started', icon: Zap },
  { id: 'installation', title: 'Installation', href: '/docs/installation', section: 'Getting Started', icon: Terminal },
  { id: 'auth-bearer', title: 'Bearer Token Auth', href: '/docs/authentication/bearer', section: 'Getting Started', icon: Shield },
  { id: 'auth-keys', title: 'API Keys Auth', href: '/docs/authentication/api-keys', section: 'Getting Started', icon: Shield },
  
  // Core Concepts
  { id: 'hashing', title: 'How Hashing Works', href: '/docs/concepts/hashing', section: 'Core Concepts', icon: Shield },
  { id: 'lifecycle', title: 'Anchor Lifecycle', href: '/docs/concepts/lifecycle', section: 'Core Concepts', icon: Clock },
  { id: 'verification', title: 'Verification Model', href: '/docs/concepts/verification', section: 'Core Concepts', icon: FileText },
  { id: 'storage', title: 'On-Chain Storage', href: '/docs/concepts/storage', section: 'Core Concepts', icon: Shield },

  // CLI
  { id: 'cli-ref', title: 'CLI Reference Overview', href: '/docs/cli', section: 'CLI Reference', icon: Terminal },
  { id: 'cli-link', title: 'sipheron-vdr link', href: '/docs/cli/link', section: 'CLI Reference', icon: Terminal },
  { id: 'cli-stage', title: 'sipheron-vdr stage', href: '/docs/cli/stage', section: 'CLI Reference', icon: Terminal },
  { id: 'cli-anchor', title: 'sipheron-vdr anchor', href: '/docs/cli/anchor', section: 'CLI Reference', icon: Terminal },
  { id: 'cli-verify', title: 'sipheron-vdr verify', href: '/docs/cli/verify', section: 'CLI Reference', icon: Terminal },
  { id: 'cli-status', title: 'sipheron-vdr status', href: '/docs/cli/status', section: 'CLI Reference', icon: Terminal },
  { id: 'cli-history', title: 'sipheron-vdr history', href: '/docs/cli/history', section: 'CLI Reference', icon: Terminal },
  { id: 'cli-revoke', title: 'sipheron-vdr revoke', href: '/docs/cli/revoke', section: 'CLI Reference', icon: Terminal },

  // API
  { id: 'api-ref', title: 'API Reference Overview', href: '/docs/api', section: 'API Reference', icon: Code2 },
  { id: 'api-auth', title: 'API Authentication', href: '/docs/api/auth', section: 'API Reference', icon: Code2 },
  { id: 'api-hashes', title: 'Hashes API', href: '/docs/api/hashes', section: 'API Reference', icon: Code2 },
  { id: 'api-keys', title: 'API Keys API', href: '/docs/api/keys', section: 'API Reference', icon: Code2 },
  { id: 'api-orgs', title: 'Organizations API', href: '/docs/api/orgs', section: 'API Reference', icon: Code2 },
  { id: 'api-webhooks', title: 'Webhooks API', href: '/docs/api/webhooks', section: 'API Reference', icon: Code2 },
  { id: 'api-usage', title: 'Usage & Analytics API', href: '/docs/api/usage', section: 'API Reference', icon: Code2 },

  // Guides
  { id: 'guide-legal', title: 'Legal Documents Guide', href: '/docs/guides/legal', section: 'Guides', icon: FileText },
  { id: 'guide-financial', title: 'Financial Reports Guide', href: '/docs/guides/financial', section: 'Guides', icon: FileText },
  { id: 'guide-enterprise', title: 'Enterprise Setup', href: '/docs/guides/enterprise', section: 'Guides', icon: FileText },
  { id: 'guide-cicd', title: 'CI/CD Integration', href: '/docs/guides/cicd', section: 'Guides', icon: Zap },
  { id: 'guide-webhooks', title: 'Webhook Integration Guide', href: '/docs/guides/webhooks', section: 'Guides', icon: Zap },

  // SDKs
  { id: 'sdk-js', title: 'JavaScript SDK', href: '/docs/sdks/javascript', section: 'SDKs', icon: Code2 },
  { id: 'sdk-python', title: 'Python SDK', href: '/docs/sdks/python', section: 'SDKs', icon: Code2 },

  // Other
  { id: 'changelog', title: 'Changelog', href: '/changelog', section: 'Resources', icon: Zap },
  { id: 'support', title: 'Support', href: '/support', section: 'Resources', icon: Book },
];

interface DocSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocSearch: React.FC<DocSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = query
    ? DOCS_ITEMS.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.section.toLowerCase().includes(query.toLowerCase())
      )
    : DOCS_ITEMS;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          navigate(filteredItems[selectedIndex].href);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 sm:pt-32 px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-[#EDEDED] outline-none placeholder:text-gray-600 text-base"
          />
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-500 font-mono">
              ESC
            </kbd>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredItems.length > 0 ? (
            <div className="space-y-1 px-2">
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.href);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                      isSelected 
                        ? 'bg-[#9B6EFF]/10 text-[#EDEDED]' 
                        : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#9B6EFF]/20 text-[#9B6EFF]' : 'bg-white/5 text-gray-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className={`text-sm font-medium truncate ${isSelected ? 'text-white' : ''}`}>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {item.section}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-1 py-1 px-2 rounded bg-[#9B6EFF]/20 text-[#9B6EFF] text-[10px] font-bold">
                         ENTER <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-400">No results found for &quot;{query}&quot;</p>
              <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-white/5 bg-[#0D0D14] flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="hidden sm:block">
            Search shortcuts enabled
          </span>
        </div>
      </div>
    </div>
  );
};
