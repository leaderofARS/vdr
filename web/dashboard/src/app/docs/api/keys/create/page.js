import Breadcrumb from '../../../components/Breadcrumb';
import Callout from '../../../components/Callout';
import CodeBlock from '../../../components/CodeBlock';
import ParamTable, { ParamRow } from '../../../components/ParamTable';
import DocsPrevNext from '../../../components/DocsPrevNext';
import Endpoint from '../../../components/Endpoint';
import ResponseTabs from '../../../components/ResponseTabs';
import Link from 'next/link';
import { ShieldCheck, Key, Lock, UserCheck, RefreshCw, AlertTriangle, CheckCircle, Info, ShieldAlert, Terminal, Fingerprint, Eye, KeyRound, Globe, Server, Activity, ArrowRight, Zap, ListTree } from 'lucide-react';

export default function APIKeyCreate() {
  return (
    <div className="pb-20">
      <Breadcrumb items={[{ "label": "API Reference", "href": "/docs/api" }, { "label": "Keys", "href": "/docs/api/keys" }, { "label": "Create" }]} />
      <div className="flex items-center justify-between mb-8">
        <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
      </div>

      <h1 id="api-key-create">Create API Key</h1>
      <Endpoint method="POST" path="/v1/keys/create" />

      <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
        Generate a new long-lived API key for your project. This key can be used to authenticate
        VDR CLI workers and backend SDKs.
        <strong> Warning: The plain-text key is only returned once. SipHeron does not store it.</strong>
      </p>

      <h2 id="usage-scenario">Usage Scenario: CI/CD Dynamic Keys</h2>
      <p className="text-[16px] leading-relaxed mb-8">
        For ephemeral environments (like a GitHub Actions runner), you may want to generate a
        one-time-use key that is revoked immediately after the pipeline finishes.
      </p>

      <div className="bg-[#050505] p-10 rounded-3xl border border-[#222] mb-16 shadow-2xl">
        <h4 className="text-[16px] font-bold text-[#EDEDED] mb-6 uppercase tracking-widest">Request Body</h4>
        <CodeBlock language="json">
          {`{
  "name": "Production-Master-V2",
  "scopes": ["vdr.hashes:write", "vdr.hashes:read"],
  "expires_at": "2027-01-01T00:00:00Z"
}`}
        </CodeBlock>
      </div>

      <h2 id="request-parameters">Request Parameters</h2>
      <ParamTable>
        <ParamRow name="name" type="string" required={true} description="A human-readable label for the key (e.g., 'Web-Backend')." />
        <ParamRow name="scopes" type="string[]" required={true} description="The list of permissions to grant." />
        <ParamRow name="expires_at" type="string" required={false} description="ISO 8601 timestamp for key expiration." />
      </ParamTable>

      <h2 id="response-schema">Response Schema</h2>
      <ResponseTabs
        success={`{
  "status": "success",
  "data": {
    "id": "key_8f2b3a9e...",
    "secret": "svdr_live_4021d3f9e2b3a9e42c1d3f9e2b3a9e42c1",
    "name": "Production-Master-V2",
    "scopes": ["vdr.hashes:write", "vdr.hashes:read"],
    "created_at": "2026-03-10T14:20:11Z"
  }
}`}
        error={`{
  "status": "error",
  "code": "KEY_LIMIT_REACHED",
  "message": "Your project has reached the maximum number of active API keys (10)."
}`}
      />

      <h2 id="secret-protection">The "First Look" Rule</h2>
      <div className="p-10 border border-[#222] bg-[#111] rounded-3xl mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Eye className="w-48 h-48 text-[#F87171]" />
        </div>
        <p className="text-[14px] text-[#888] leading-relaxed mb-6">
          The <code>secret</code> field in the response contains the actual API key string.
          Once you receive this response, you must securely store the secret in your
          password manager or environment vault. If lost, you must revoke the key ID
          and generate a new one.
        </p>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#F87171] animate-pulse" />
          <span className="text-[11px] text-[#F87171] font-mono">NEVER LEAVE KEYS IN PLAIN TEXT JSON FILES</span>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-[#1F1F1F] flex items-center justify-between mb-12">
        <span className="text-[14px] text-[#555] font-medium font-mono uppercase tracking-[0.3em] text-[#9B6EFF]">Key Engine v1.0</span>
        <div className="flex items-center gap-3">
          <Link href="/docs/api/keys/list" className="text-[13px] px-8 py-4 bg-[#9B6EFF] rounded-full text-white font-bold hover:bg-[#8A5EEF] transition-all flex items-center gap-2">
            Next: Listing Keys <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <DocsPrevNext prev={{ label: 'Keys Overview', href: '/docs/api/keys' }} next={{ label: 'List Keys', href: '/docs/api/keys/list' }} />
    </div>
  );
}
