
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Introduction" };

export default function Page() {
    return (
        <div>
            
<h1>Introduction to SipHeron VDR</h1>
<p className="text-xl mb-8">Welcome to the SipHeron Verifiable Document Registry (VDR). The industry standard for on-chain, instant document authenticity on Solana.</p>
<Callout type="tip">
    SipHeron VDR represents a fundamental shift: instead of uploading sensitive files to cloud servers, we register their cryptographic fingerprints on the Solana blockchain.
</Callout>
<h2>What is SipHeron VDR?</h2>
<p>SipHeron VDR (Verifiable Document Registry) is an enterprise-grade protocol allowing organizations to anchor the cryptographic hash (SHA-256) of any digital asset directly to the Solana blockchain. This delivers undeniable proof of existence and pristine data provenance without ever compromising the confidentiality of the actual document.</p>
<h2>How it Works</h2>
<p>The process of verifiable document anchoring operates in three secure, localized stages:</p>
<ol>
    <li><strong>Client-Side Hashing:</strong> Your original document is hashed locally on your device (using SHA-256). The document file <strong>never</strong> leaves your network.</li>
    <li><strong>On-Chain Registration:</strong> The generated 64-character hash is securely signed by your organization's PDA and submitted as a transaction to the Solana ledger.</li>
    <li><strong>Instant Verification:</strong> Anyone in possession of the original document can drag-and-drop it into the SipHeron interface or use the CLI to instantly verify its un-tampered state.</li>
</ol>
<h2>Glossary</h2>
<ParamTable>
    <ParamRow name="Anchor" type="Transaction" required={true}>The confirmed transaction event where a document's SHA-256 hash gets irremovably saved into the Solana ledger.</ParamRow>
    <ParamRow name="PDA" type="Account Identifier" required={true}>Program Derived Address. An institutional identity on Solana mapping your SipHeron VDR Organization to a specific blockchain domain.</ParamRow>
    <ParamRow name="Stage" type="CLI Phase" required={true}>The preliminary phase where documents are batched locally to calculate their entropy signatures before network broadcasting.</ParamRow>
</ParamTable>
        
            <DocsPrevNext next={{ title: 'Quick Start', href: '/docs/quickstart' }} />
        </div>
    );
}
    