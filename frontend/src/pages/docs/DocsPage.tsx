import React from 'react';
import { Link } from 'react-router-dom';

const DocsIntroduction: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Introduction</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        SipHeron VDR (Vessel Daily Report) is an enterprise-grade blockchain document verification platform built on the Solana network.
        It provides an immutable trail of truth for critical digital assets, ensuring integrity and trust across global operations.
      </p>

      <h2 id="what-is-sipheron" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        What is SipHeron VDR?
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        At its core, SipHeron VDR is a "notary of the digital age." It allows you to take any file—a PDF contract, a financial report, an image, or a log file—and generate a cryptographic proof that the file existed in a specific state at a specific point in time.
      </p>
      <p className="text-gray-300 leading-relaxed mb-4">
        Think of it as a permanent, public timestamp that cannot be faked, altered, or deleted. By "anchoring" your documents to the blockchain, you create a defensive layer of transparency that protects both you and your stakeholders.
      </p>

      <h2 id="how-it-works" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        How It Works
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        You don't need to be a blockchain expert to use SipHeron. The process can be broken down into three easy steps.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
            <span className="text-purple-400 font-bold">1</span>
          </div>
          <h3 id="hash" className="text-lg font-bold text-white mb-2 scroll-mt-24">Hash</h3>
          <p className="text-sm text-gray-400">
            Your document is hashed locally using SHA-256, creating a unique digital fingerprint. The original file never leaves your device.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
            <span className="text-purple-400 font-bold">2</span>
          </div>
          <h3 id="anchor" className="text-lg font-bold text-white mb-2 scroll-mt-24">Anchor</h3>
          <p className="text-sm text-gray-400">
            The hash is anchored to the Solana blockchain with a timestamp, creating an immutable proof of existence that lasts forever.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
            <span className="text-purple-400 font-bold">3</span>
          </div>
          <h3 id="verify" className="text-lg font-bold text-white mb-2 scroll-mt-24">Verify</h3>
          <p className="text-sm text-gray-400">
            Anyone can verify the document's authenticity by re-hashing it and comparing with the blockchain record—instantly and for free.
          </p>
        </div>
      </div>

      <h2 id="why-solana" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Why Solana?
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        We chose Solana for one reason: <strong>Performance at Scale.</strong>
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Metric</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Value</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Benefit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 pr-4 text-gray-300">Block Time</td>
              <td className="py-3 pr-4 text-purple-300">~400ms</td>
              <td className="py-3 pr-4 text-gray-400">Near-instant transaction finality.</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Transaction Cost</td>
              <td className="py-3 pr-4 text-purple-300">&lt; $0.0001</td>
              <td className="py-3 pr-4 text-gray-400">Low-cost anchoring for enterprise volume.</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-gray-300">Throughput</td>
              <td className="py-3 pr-4 text-purple-300">65,000+ TPS</td>
              <td className="py-3 pr-4 text-gray-400">Handles thousands of document anchors simultaneously.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="key-features" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Key Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
            <span className="text-purple-400 text-lg">🔒</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Privacy First</h4>
            <p className="text-sm text-gray-400">Files are hashed locally. SipHeron never sees or stores your document content.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
            <span className="text-purple-400 text-lg">⚡</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Sub-Second Speed</h4>
            <p className="text-sm text-gray-400">Anchor your documents in milliseconds thanks to Solana's high-speed consensus.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
            <span className="text-purple-400 text-lg">🌐</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Public Verification</h4>
            <p className="text-sm text-gray-400">Generate public verification links or QR codes for third-party auditing.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
            <span className="text-purple-400 text-lg">📦</span>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Bulk Operations</h4>
            <p className="text-sm text-gray-400">Anchor thousands of records in a single batch to save on costs and time.</p>
          </div>
        </div>
      </div>

      <h2 id="get-started" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Get Started
      </h2>
      <p className="text-gray-300 leading-relaxed mb-8">
        Ready to start anchoring? Follow our guides to integrate SipHeron into your workflow.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        <Link to="/docs/quickstart" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
          <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">🚀</span>
          <h4 className="text-lg font-bold text-white mb-1">Quick Start</h4>
          <p className="text-sm text-gray-400">Install the CLI and anchor your first document in under 5 minutes.</p>
        </Link>
        <Link to="/docs/cli" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
          <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">⌨️</span>
          <h4 className="text-lg font-bold text-white mb-1">CLI Reference</h4>
          <p className="text-sm text-gray-400">Master every command and flag available in the SipHeron CLI.</p>
        </Link>
        <Link to="/docs/api" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
          <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">🔌</span>
          <h4 className="text-lg font-bold text-white mb-1">API Reference</h4>
          <p className="text-sm text-gray-400">Integrate VDR programmatically with our comprehensive REST API.</p>
        </Link>
        <Link to="/docs/concepts/hashing" className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group">
          <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">🛡️</span>
          <h4 className="text-lg font-bold text-white mb-1">Core Concepts</h4>
          <p className="text-sm text-gray-400">Deep dive into hashing, anchor lifecycles, and verification models.</p>
        </Link>
      </div>
    </div>
  );
};

const DocsPage: React.FC = () => {
  return <DocsIntroduction />;
};

export default DocsPage;
