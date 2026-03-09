import Breadcrumb from '../../components/Breadcrumb';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';
import ParamTable, { ParamRow } from '../../components/ParamTable';
import DocsPrevNext from '../../components/DocsPrevNext';

export default function Page() {
  return (
    <div>
      <Breadcrumb items={[{"label":"API Reference","href":"/docs/api"},{"label":"Webhooks"}]} />
      <div className="flex items-center justify-between mb-8">
        <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
      </div>

      <h1 id="title">Webhooks Overview</h1>
      <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
        Extensive documentation for Webhooks Overview. Learn how to leverage SipHeron VDR for your enterprise needs.
      </p>

      <h2 id="overview">Overview</h2>
      <p>This section provides a comprehensive overview of Webhooks Overview. Our platform ensures that every interaction is secure, immutable, and verifiable.</p>
      <div className="min-h-[50vh]" />

      <h2 id="how-it-works">How It Works</h2>
      <p>Detailed technical explanation of Webhooks Overview.</p>
      <CodeBlock language="text">
{`Technical flow for Webhooks Overview...`}
      </CodeBlock>
      <div className="min-h-[50vh]" />

      <h2 id="examples">Detailed Examples</h2>
      <CodeBlock language="bash">
# Example command for Webhooks Overview
vdr example --flag
      </CodeBlock>
      <div className="min-h-[100vh]" />

      <h2 id="parameters">Parameters & Configuration</h2>
      <ParamTable>
        <ParamRow name="param_1" type="string" required={true} description="Description for parameter 1" />
        <ParamRow name="param_2" type="number" required={false} description="Description for parameter 2" />
      </ParamTable>
      <div className="min-h-[50vh]" />

      <h2 id="best-practices">Best Practices</h2>
      <Callout type="tip">Always test your Webhooks Overview configuration in devnet before moving to mainnet.</Callout>
      <div className="min-h-[100vh]" />

      <div className="mt-16 pt-6 border-t border-[#1F1F1F] flex items-center justify-between mb-8">
        <span className="text-[12px] text-[#555]">Was this helpful?</span>
        <div className="flex items-center gap-2">
          <button className="text-[12px] px-3 py-1 border border-[#2A2A2A] rounded hover:border-[#444] text-[#888]">Yes</button>
          <button className="text-[12px] px-3 py-1 border border-[#2A2A2A] rounded hover:border-[#444] text-[#888]">No</button>
        </div>
      </div>

      <DocsPrevNext />
    </div>
  );
}
