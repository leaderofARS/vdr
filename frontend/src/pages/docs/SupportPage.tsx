import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Mail, MessageCircle, Github, Book, AlertCircle } from 'lucide-react';

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2002);
  };
  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border border-[#2A2A2A] rounded-t-lg">
        <span className="text-xs text-[#555]">{language}</span>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-[#555] hover:text-white transition-colors">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-[#0D0D0D] border-x border-b border-[#2A2A2A] rounded-b-lg p-4 overflow-x-auto">
        <code className="text-sm font-mono text-[#EDEDED]">{code}</code>
      </pre>
    </div>
  );
};

const SupportPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Support</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Get help with SipHeron VDR. We're here to assist you with technical issues, 
        integration questions, and enterprise support.
      </p>

      <h2 id="contact" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Contact Support
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <a href="mailto:support@sipheron.io" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
          <Mail className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 id="email-support" className="text-lg font-bold text-white mb-2 scroll-mt-24">Email Support</h3>
          <p className="text-sm text-gray-400">support@sipheron.io</p>
          <p className="text-xs text-gray-500 mt-2">Response within 24 hours</p>
        </a>
        <a href="https://discord.gg/sipheron" target="_blank" rel="noopener noreferrer" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
          <MessageCircle className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 id="community-discord" className="text-lg font-bold text-white mb-2 scroll-mt-24">Community Discord</h3>
          <p className="text-sm text-gray-400">Join our Discord</p>
          <p className="text-xs text-gray-500 mt-2">Community help & discussion</p>
        </a>
        <a href="https://github.com/leaderofARS/vdr/issues" target="_blank" rel="noopener noreferrer" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
          <Github className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 id="github-issues" className="text-lg font-bold text-white mb-2 scroll-mt-24">GitHub Issues</h3>
          <p className="text-sm text-gray-400">Report bugs & request features</p>
          <p className="text-xs text-gray-500 mt-2">Public issue tracking</p>
        </a>
      </div>

      <h2 id="response-times" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Response Times
      </h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Plan</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Response Time</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Support Channels</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-gray-300">Free</td>
              <td className="py-3 pr-4 text-gray-400">Best effort (48-72 hours)</td>
              <td className="py-3 pr-4 text-gray-400">Discord, GitHub</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-blue-400">Pro</td>
              <td className="py-3 pr-4 text-gray-400">24 hours</td>
              <td className="py-3 pr-4 text-gray-400">Email, Discord, GitHub</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-purple-400">Enterprise</td>
              <td className="py-3 pr-4 text-gray-400">4 hours (24/7)</td>
              <td className="py-3 pr-4 text-gray-400">All channels + Slack Connect</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="opening-ticket" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Opening a Support Ticket
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        When contacting support, please include the following information to help us assist you faster:
      </p>
      <div className="p-6 rounded-xl border border-white/10 bg-white/5 mb-8">
        <h4 className="font-bold text-white mb-4">Information to Include:</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Organization ID (found in Dashboard → Settings)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>CLI version: <code className="text-purple-300">sipheron-vdr --version</code></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Error messages or logs (with --verbose flag)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Steps to reproduce the issue</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Expected vs actual behavior</span>
          </li>
        </ul>
      </div>

      <h2 id="debugging" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Debugging Guide
      </h2>

      <h3 id="enable-debug-mode" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Enable Debug Mode</h3>
      <CodeBlock code={`# Enable verbose output
sipheron-vdr anchor ./file.pdf --verbose

# Enable debug logging
export SIPHERON_DEBUG=1
sipheron-vdr verify ./file.pdf

# Check CLI configuration
sipheron-vdr config show

# Test API connectivity
sipheron-vdr status network`} />

      <h3 id="common-debug-commands" className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">Common Debug Commands</h3>
      <CodeBlock code={`# Check authentication
sipheron-vdr auth whoami

# Verify network connection
sipheron-vdr status network --network mainnet

# Check rate limits
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.sipheron.io/v1/usage \\
  -v 2>&1 | grep -i rate`} />

      <h2 id="common-issues" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Common Issues
      </h2>

      <div className="space-y-6">
        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h4 className="font-bold text-white">Authentication Errors</h4>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            If you're seeing "Unauthorized" errors:
          </p>
          <ul className="text-sm text-gray-400 space-y-1 ml-5">
            <li>• Check your API key is valid: <code className="text-purple-300">sipheron-vdr auth whoami</code></li>
            <li>• Verify the key hasn't expired in Dashboard → API Keys</li>
            <li>• Ensure you're using the correct environment (dev/prod)</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h4 className="font-bold text-white">Network Timeouts</h4>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            If transactions are timing out:
          </p>
          <ul className="text-sm text-gray-400 space-y-1 ml-5">
            <li>• Check Solana network status: <code className="text-purple-300">sipheron-vdr status network</code></li>
            <li>• Try a different RPC endpoint</li>
            <li>• Increase timeout: <code className="text-purple-300">--timeout 60</code></li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h4 className="font-bold text-white">Insufficient Funds</h4>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            If you see "Insufficient funds" errors:
          </p>
          <ul className="text-sm text-gray-400 space-y-1 ml-5">
            <li>• Check your wallet balance</li>
            <li>• Ensure you have SOL for transaction fees (~0.000005 SOL per anchor)</li>
            <li>• Consider using devnet for testing</li>
          </ul>
        </div>
      </div>

      <h2 id="resources" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Additional Resources
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/docs" className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all">
          <Book className="w-5 h-5 text-purple-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Documentation</h4>
          <p className="text-xs text-gray-400">Browse our comprehensive docs</p>
        </Link>
        <a href="/docs/changelog" className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all">
          <AlertCircle className="w-5 h-5 text-purple-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Changelog</h4>
          <p className="text-xs text-gray-400">Latest updates and releases</p>
        </a>
      </div>

      <h2 id="status-page" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        System Status
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Check our status page for real-time information about API and network availability:
      </p>
      <a 
        href="https://status.sipheron.io" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        status.sipheron.io
      </a>

      <h2 id="enterprise" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Enterprise Support
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Enterprise customers receive priority support with dedicated channels:
      </p>
      <ul className="space-y-2 text-sm text-gray-400 mb-8">
        <li className="flex items-start gap-2">
          <span className="text-purple-400">•</span>
          <span>Slack Connect for real-time communication</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-purple-400">•</span>
          <span>Dedicated Technical Account Manager</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-purple-400">•</span>
          <span>24/7 emergency support hotline</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-purple-400">•</span>
          <span>Custom SLA options</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-purple-400">•</span>
          <span>Quarterly architecture reviews</span>
        </li>
      </ul>
      <a 
        href="mailto:enterprise@sipheron.io" 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <Mail className="w-4 h-4" />
        Contact Enterprise Sales
      </a>
    </div>
  );
};

export default SupportPage;
