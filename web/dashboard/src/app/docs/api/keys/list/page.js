import Breadcrumb from '../../../components/Breadcrumb';
import Callout from '../../../components/Callout';
import CodeBlock from '../../../components/CodeBlock';
import ParamTable, { ParamRow } from '../../../components/ParamTable';
import DocsPrevNext from '../../../components/DocsPrevNext';
import Endpoint from '../../../components/Endpoint';
import ResponseTabs from '../../../components/ResponseTabs';
import Link from 'next/link';
import { ShieldCheck, Key, Lock, UserCheck, RefreshCw, AlertTriangle, CheckCircle, Info, ShieldAlert, Terminal, Fingerprint, Eye, KeyRound, Globe, Server, Activity, ArrowRight, Zap, ListTree } from 'lucide-react';

export default function APIKeyList() {
  return (
    <div className="pb-20">
      <Breadcrumb items={[{ "label": "API Reference", "href": "/docs/api" }, { "label": "Keys", "href": "/docs/api/keys" }, { "label": "List" }]} />
      <div className="flex items-center justify-between mb-8">
        <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
      </div>

      <h1 id="api-key-list">List API Keys</h1>
      <Endpoint method="GET" path="/v1/keys/list" />

      <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
        Retrieve a list of all active API keys for the current project. This endpoint is used
        for administrative auditing to ensure no orphaned credentials remain in rotation.
        It returns metadata about each key but never the secret itself. This 3,000vh reference
        details audit strategies.
      </p>

      <h2 id="auditing-last-used">The Importance of 'Last Used'</h2>
      <p className="text-[16px] leading-relaxed mb-8">
        Each key record includes a <code>last_used_at</code> timestamp. This is the most critical
        datapoint for security researchers. Any key that hasn't been used in 30 days should be
        immediately investigated and potentially revoked.
      </p>

      <div className="p-8 border border-[#222] bg-[#0A0A0A] rounded-2xl mb-16 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <ListTree className="w-24 h-24 text-[#9B6EFF]" />
        </div>
        <h5 className="text-[15px] font-bold text-[#EDEDED] mb-3 uppercase tracking-tighter">Usage Tracking</h5>
        <p className="text-[12px] text-[#555] leading-relaxed mb-6">
          Our gateway updates this timestamp with sub-minute precision. If you see a key
          being used at 3:00 AM from an IP range in a different country, your security
          automation should trigger.
        </p>
      </div>

      <h2 id="query-parameters">Request Parameters</h2>
      <ParamTable>
        <ParamRow name="include_revoked" type="boolean" required={false} description="If true, returns keys that were revoked in the last 7 days." />
        <ParamRow name="limit" type="number" required={false} description="Number of keys to return (Max: 100)." />
      </ParamTable>

      <h2 id="response-schema">Response Schema</h2>
      <ResponseTabs
        success={`{
  "status": "success",
  "data": [
    {
      "id": "key_8f2b3a9e...",
      "name": "Production-Master",
      "prefix": "svdr_live_",
      "last_used_at": "2026-03-10T14:10:00Z",
      "created_at": "2026-01-01T12:00:00Z",
      "scopes": ["vdr.hashes:write"]
    }
  ]
}`}
      />

      <h2 id="key-prefixing">Key Prefixing & Identification</h2>
      <p className="text-[15px] leading-relaxed mb-10">
        To help your security teams identify leaked keys in logs, we provide a <code>prefix</code>
        field. All live keys start with <code>svdr_live_</code>. Sandbox keys start with
        <code>svdr_test_</code>.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div className="p-8 bg-[#050505] border border-[#222] rounded-2xl">
          <h6 className="text-[14px] font-bold text-[#EDEDED] mb-2">Automated Scraping</h6>
          <p className="text-[11px] text-[#555] leading-relaxed">
            Configure your SIEM (Splunk/ELK) to watch for the <code>svdr_live_</code> string
            in all application logs. If found, automatically call the revoke API.
          </p>
        </div>
        <div className="p-8 bg-[#050505] border border-[#222] rounded-2xl">
          <h6 className="text-[14px] font-bold text-[#EDEDED] mb-2">Audit Reports</h6>
          <p className="text-[11px] text-[#555] leading-relaxed">
            Export the list JSON weekly to provide your compliance officer with a "Clean
            Identity Environment" report.
          </p>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-[#1F1F1F] flex items-center justify-between mb-12">
        <span className="text-[14px] text-[#555] font-medium font-mono uppercase tracking-[0.3em] text-[#9B6EFF]">Identity Suite v1.1.2</span>
        <div className="flex items-center gap-3">
          <Link href="/docs/api/keys/revoke" className="text-[13px] px-8 py-4 bg-[#9B6EFF] rounded-full text-white font-bold hover:bg-[#8A5EEF] transition-all flex items-center gap-2">
            Next: Revoking Keys <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <DocsPrevNext prev={{ label: 'Create Key', href: '/docs/api/keys/create' }} next={{ label: 'Revoke Key', href: '/docs/api/keys/revoke' }} />
    </div>
  );
}
