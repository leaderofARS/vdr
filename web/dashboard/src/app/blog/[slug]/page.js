"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Share2, Twitter, Linkedin, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';

// --- Stub Data ---
const blogPosts = {
    'why-document-authenticity-matters': {
        title: "Why Document Authenticity Matters in 2025",
        category: "Opinion",
        date: "March 15, 2026",
        readTime: "8 min read",
        author: "SipHeron Team",
        content: `
## The Cost of Fake Documents in a Digital World

In 2025, the digital landscape has fundamentally shifted. With the rise of advanced AI and deepfakes, generating a perfectly forged digital document takes seconds. From employment records to legal contracts, the inability to instantly verify the authenticity of a document is creating a massive crisis of trust.

Fraudulent documents lead to billion-dollar losses in the financial sector and endless legal disputes over contract tampering. 

## The Current State of Verification

Historically, we relied on centralized authorities, physical seals, and notaries. In the modern era, these methods are not only slow but fundamentally incompatible with a global, digital-first economy. They act as bottlenecks, imposing friction and excessive costs on simple transactions.

Consider a multi-national legal dispute. Verifying cross-border electronic records traditionally involves requesting original documents, hiring forensic experts, and cross-referencing server logs.

## Why Hashes are the Ultimate Truth

Cryptographic hashing changes the game. By passing a file through an algorithm like SHA-256, we generate a unique digital fingerprint. It is impossible to reverse-engineer the original document from the hash, and any change to the document—even a single pixel or character—completely alters the resulting hash.

## Building the Trust Layer

This is why we need a global, decentralized registry for document hashes. A system where the authenticity of a document can be proven mathematically, instantly, and without relying on a central point of failure. SipHeron serves exactly this purpose, providing an immutable anchor on Solana for the world's documents.
        `
    },
    'solana-for-document-registry': {
        title: "Why We Built on Solana Instead of Ethereum",
        category: "Technical",
        date: "March 10, 2026",
        readTime: "6 min read",
        author: "SipHeron Team",
        content: `
## The Need for Speed and Scale

When designing a global document registry, the underlying infrastructure must support thousands of registrations per second. Our initial prototypes considered multiple blockchains, but Ethereum's 12-second block times and fluctuating gas fees presented a major hurdle for enterprise adoption.

## The Cost Equation

Registering a document should cost fractions of a cent, not dollars. On Solana, the average transaction fee is a fraction of a penny. This economic efficiency allows SipHeron to offer batching and high-throughput APIs without passing exorbitant network costs onto our users.

## Finality and Throughput

Solana offers sub-second finality. When a user anchors a document via the SipHeron CLI or Dashboard, the proof is finalized and mathematically verified across thousands of nodes in under a second. This makes the experience feel as seamless as a traditional web2 application, while delivering all the security and immutability guarantees of web3.
        `
    },
    'how-vdr-works-technically': {
        title: "How SipHeron VDR Works Under the Hood",
        category: "Technical",
        date: "March 5, 2026",
        readTime: "7 min read",
        author: "SipHeron Team",
        content: `
## Cryptographic Foundations: SHA-256

SipHeron operates on a simple principle: we never see your file. When you register a document, your local client (CLI or web app) computes the SHA-256 hash of the file. This 64-character string is the only piece of data transmitted to our servers. Your raw data and its contents remain entirely private and localized.

## The Solana Anchor Program

Our backend interacts with a custom smart contract written using the Anchor framework. This program receives the file hash and writes it to the Solana blockchain. 

\`\`\`rust
pub fn register_hash(ctx: Context<RegisterHash>, file_hash: [u8; 32]) -> Result<()> {
    let document_record = &mut ctx.accounts.document_record;
    document_record.hash = file_hash;
    document_record.timestamp = Clock::get()?.unix_timestamp;
    document_record.authority = ctx.accounts.authority.key();
    Ok(())
}
\`\`\`

## Program Derived Addresses (PDAs)

To ensure rapid lookup and verification, SipHeron uses PDAs. We derive a unique blockchain address using the file's hash as the seed. This means anyone looking to verify a document only needs to compute the hash and check if an account exists at that specific PDA—no complex indexing or centralized databases required.

## The Registration Flow

1. **Client-side hashing**: File is hashed locally.
2. **Transaction construction**: Our API or SDK builds a Solana transaction.
3. **Execution**: The smart contract allocates a PDA and stores the metadata.
4. **Verification**: The file is permanently anchored and instantly verifiable.
        `
    },
    'cli-workflow-guide': {
        title: "The 3-Command Workflow That Proves Any Document",
        category: "Guide",
        date: "February 28, 2026",
        readTime: "5 min read",
        author: "SipHeron Team",
        content: `
## A Builder-First Approach

We designed the SipHeron CLI to be instantly familiar to anyone who uses Git. Integrating document verification into your CI/CD pipelines or local workflows is practically effortless.

## Step 1: Install and Authenticate

First, install the CLI globally via npm:

\`\`\`bash
npm install -g sipheron-vdr
\`\`\`

Then, link your CLI to your SipHeron account using an API key from your dashboard:

\`\`\`bash
sipheron auth login --key your_api_key_here
\`\`\`

## Step 2: Anchor Your Document

To register the state of any file or directory, simply anchor it:

\`\`\`bash
sipheron anchor ./contract-v2.pdf
\`\`\`

The CLI will compute the SHA-256 hash locally and broadcast the proof to Solana. You will receive an immediate confirmation with a transaction signature.

## Step 3: Verify Anywhere

To verify that a file matches its on-chain registration:

\`\`\`bash
sipheron verify ./contract-v2.pdf
\`\`\`

If a single byte has been modified since it was anchored, the verification will fail. Proof, made simple.
        `
    },
    'use-cases-legal-finance': {
        title: "5 Use Cases for Blockchain Document Verification",
        category: "Use Cases",
        date: "February 20, 2026",
        readTime: "6 min read",
        author: "SipHeron Team",
        content: `
## Legal Contracts

The cornerstone of modern commerce is the contract. By registering signed contracts on-chain, legal firms eliminate the possibility of backdated or secretly modified agreements. The chain of custody is permanently cemented.

## Financial Reports

Publicly traded companies and fintech startups can anchor their quarterly reports right before publication. This provides auditors and investors with mathematical certainty that the numbers haven't been altered post-facto.

## Intellectual Property

Creators, researchers, and engineers can prove prior art. By hashing a design file or a research paper and anchoring it, you generate a timestamped proof of existence, invaluable in patent disputes.

## HR & Academic Records

Universities and employers can issue digital certificates anchored to the blockchain. Background checks drop from weeks to seconds when an applicant's resume hashes can be checked against institutional registries.

## Supply Chain Integrity

Manifests, compliance certificates, and origin records can all be hashed and tracked as goods move globally. If a manifest is altered down the line, the discrepancy is immediately apparent.
        `
    },
    'devnet-to-mainnet': {
        title: "From Devnet to Mainnet: Our Roadmap",
        category: "Updates",
        date: "February 15, 2026",
        readTime: "4 min read",
        author: "SipHeron Team",
        content: `
## The Journey So Far

SipHeron VDR has been operating successfully on the Solana Devnet, processing thousands of test registrations and allowing developers to integrate our SDK and CLI tools without incurring real-world costs.

## Current Status

We are currently feature-complete for V1. Our PDA architecture is stable, our indexer is capturing events in real-time, and the dashboard provides a seamless interface for API key management and billing configuration. 

## What's Next: Security Audit

Before we touch Mainnet, security is our absolute priority. We are engaging with an industry-leading smart contract auditing firm to thoroughly review our Anchor program. We expect this process to take a few weeks to ensure there are no edge-case vulnerabilities.

## Mainnet Plan

Once the audit is complete and all findings are remediated, we will launch on the Solana Mainnet Beta. At that point, the Devnet infrastructure will remain available for testing, but Mainnet API keys will begin requiring credits for registration. Stay tuned for the official launch date announcement!
        `
    }
};

const Badge = ({ children, className = "" }) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${className}`}>
        {children}
    </span>
);

export default function BlogPost() {
    const params = useParams();
    const slug = params?.slug;
    const post = blogPosts[slug];

    const [copied, setCopied] = useState(false);

    if (!post) {
        return (
            <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF] font-sans flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">Post Not Found</h1>
                    <Link href="/blog" className="text-[#4F6EF7] hover:underline">← Back to Blog</Link>
                </div>
            </div>
        );
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Render markdown to basic elements
    const renderMarkdown = (content) => {
        const parts = content.split('\\n');
        let inCodeBlock = false;
        let codeContent = [];
        let language = '';

        return parts.map((line, idx) => {
            if (line.trim().startsWith('\`\`\`')) {
                if (inCodeBlock) {
                    const code = codeContent.join('\\n');
                    inCodeBlock = false;
                    codeContent = [];
                    return (
                        <div key={idx} className="my-8 rounded-xl overflow-hidden bg-[#111118] border border-[#1E1E2E]">
                            <div className="flex items-center px-4 py-2 bg-[#1E1E2E] text-xs text-[#6B7280] font-mono">
                                {language}
                            </div>
                            <pre className="p-4 overflow-x-auto text-sm text-[#F8F8FF] font-mono">
                                {code}
                            </pre>
                        </div>
                    );
                } else {
                    inCodeBlock = true;
                    language = line.replace('\`\`\`', '').trim();
                    return null;
                }
            }

            if (inCodeBlock) {
                codeContent.push(line);
                return null;
            }

            if (line.trim().startsWith('## ')) {
                return (
                    <h2 key={idx} className="text-3xl font-black text-white mt-12 mb-6">
                        {line.replace('## ', '')}
                    </h2>
                );
            }
            if (line.trim().match(/^[0-9]+\./)) {
                return (
                    <li key={idx} className="ml-6 list-decimal text-[#A1A1AA] leading-relaxed mb-2 text-lg">
                        {line.trim().substring(line.indexOf('.') + 1).trim().replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-white">$1</strong>')}
                    </li>
                );
            }
            if (line.trim().length > 0) {
                // simple bold render hack
                const htmlStr = line.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-white">$1</strong>');
                return (
                    <p key={idx} className="text-[#A1A1AA] text-lg leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: htmlStr }} />
                );
            }
            return null;
        });
    };

    // Related posts (just grab 2 other ones)
    const related = Object.entries(blogPosts).filter(([k]) => k !== slug).slice(0, 2);

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF] font-sans selection:bg-[#4F6EF7]/30 selection:text-white">
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <article className="max-w-4xl mx-auto px-6">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-white transition-colors mb-12 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
                    </Link>

                    <header className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7]">{post.category}</Badge>
                            <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-bold uppercase tracking-wider">
                                <Clock size={14} /> {post.readTime}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4F6EF7] to-[#9B5CF6] flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white">{post.author}</span>
                                <span className="text-sm text-[#6B7280]">{post.date}</span>
                            </div>
                        </div>
                    </header>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1E1E2E] to-transparent mb-16" />

                    <div className="prose prose-invert prose-lg max-w-none">
                        {renderMarkdown(post.content)}
                    </div>

                    <div className="mt-16 pt-8 border-t border-[#1E1E2E] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-[#6B7280] uppercase tracking-widest">Share this article</span>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-full bg-[#111118] border border-[#1E1E2E] flex items-center justify-center text-[#6B7280] hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors">
                                    <Twitter size={16} />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-[#111118] border border-[#1E1E2E] flex items-center justify-center text-[#6B7280] hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors">
                                    <Linkedin size={16} />
                                </button>
                                <button onClick={copyLink} className="w-10 h-10 rounded-full bg-[#111118] border border-[#1E1E2E] flex items-center justify-center text-[#6B7280] hover:text-white hover:border-white transition-colors relative">
                                    {copied ? <CheckCircle2 size={16} className="text-[#10B981]" /> : <LinkIcon size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                <div className="max-w-7xl mx-auto px-6 mt-32">
                    <h3 className="text-2xl font-black text-white mb-8">Related Posts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {related.map(([s, p]) => (
                            <Link href={`/blog/${s}`} key={s} className="block group">
                                <div className="p-8 rounded-3xl bg-[#111118] border border-[#1E1E2E] hover:border-[#4F6EF7]/40 transition-all h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Badge className="bg-[#4F6EF7]/10 text-[#4F6EF7]">{p.category}</Badge>
                                        <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">{p.date}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-4 group-hover:text-[#4F6EF7] transition-colors line-clamp-2">{p.title}</h4>
                                    <div className="mt-auto flex items-center justify-between text-sm text-[#6B7280] font-bold">
                                        Read more <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-[#4F6EF7]/10 to-[#9B5CF6]/10 border border-[#4F6EF7]/20 rounded-3xl p-12 text-center">
                        <h3 className="text-3xl font-black text-white mb-4">Ready to secure your documents?</h3>
                        <p className="text-[#A1A1AA] mb-8 max-w-xl mx-auto">Join the new standard of document verification. Open source, blazing fast, and secured by Solana.</p>
                        <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4F6EF7] to-[#9B5CF6] font-bold text-white rounded-xl hover:opacity-90 transition-opacity uppercase tracking-widest text-sm shadow-xl shadow-[#4F6EF7]/20">
                            Start anchoring documents free →
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
