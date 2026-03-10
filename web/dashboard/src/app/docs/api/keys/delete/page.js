import Breadcrumb from '../../../components/Breadcrumb';
import Callout from '../../../components/Callout';
import CodeBlock from '../../../components/CodeBlock';
import ParamTable, { ParamRow } from '../../../components/ParamTable';
import DocsPrevNext from '../../../components/DocsPrevNext';
import Link from 'next/link';
import Endpoint from '../../../components/Endpoint';
import { Trash2, ShieldAlert, Key, Info, Zap, ArrowRight, ShieldX, Lock, Globe, Server, Activity } from 'lucide-react';

export default function APIDeleteKeyPage() {
  return (
    <div className="pb-20">
      <Breadcrumb items={[{ "label": "API Reference", "href": "/docs/api" }, { "label": "Keys", "href": "/docs/api/keys" }, { "label": "Revoke" }]} />
      <div className="flex items-center justify-between mb-8">
        <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
      </div>

      <h1 id="revoke-api-key">Revoking API Keys</h1>
      <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
        When an application is decommissioned or a credential is suspected to be compromised, you must
        immediately revoke the key. Revocation is instantaneous and globally propagates across all
        clusters in under 5 seconds.
      </p>

      <h2 id="delete-key-endpoint">Endpoint</h2>
      <Endpoint method="DELETE" path="/v1/keys/:key_id" />

      <h2 id="delete-key-params">Path Parameters</h2>
      <ParamTable>
        <ParamRow name="key_id" type="string" required={true} description="The internal identifier for the key (e.g., key_8f2b3a9e)." />
      </ParamTable>

      <h2 id="delete-key-example">Example Revocation Call</h2>
      <CodeBlock language="bash">
        {`# Permanently deactivate a specific key
curl -X DELETE https://api.sipheron.com/v1/keys/key_8f2b3a9e \\
     -H "Authorization: Bearer <admin_token>"`}
      </CodeBlock>

      <h2 id="key-cleanup-logic">Propagation & TTL</h2>
      <p className="text-[15px] leading-relaxed mb-6">
        SipHeron uses a distributed cache to manage API gateway permissions. When a key is deleted via
        the API, the following atomic steps occur:
      </p>

      <div className="space-y-6 my-10">
        <div className="p-6 rounded-xl border border-[#222] bg-[#0A0A0A] flex gap-5 items-start border-l-4 border-l-[#F87171]">
          <div className="w-8 h-8 rounded bg-[#F8717110] flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold text-[#F87171]">1</span>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#EDEDED] mb-1">Database Deletion</h4>
            <p className="text-[12px] text-[#666]">The record is marked as <code>inactive</code> in the primary PostgreSQL database.</p>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-[#222] bg-[#0A0A0A] flex gap-5 items-start border-l-4 border-l-[#F87171]">
          <div className="w-8 h-8 rounded bg-[#F8717110] flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold text-[#F87171]">2</span>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#EDEDED] mb-1">Cache Purge</h4>
            <p className="text-[12px] text-[#666]">The gateway's Redis cache entry for the secret hash is purged (Latency: ~50ms).</p>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-[#222] bg-[#0A0A0A] flex gap-5 items-start border-l-4 border-l-[#F87171]">
          <div className="w-8 h-8 rounded bg-[#F8717110] flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold text-[#F87171]">3</span>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#EDEDED] mb-1">Audit Logged</h4>
            <p className="text-[12px] text-[#666]">An <code>API_KEY_REVOKED</code> event is emitted to your organization's activity timeline.</p>
          </div>
        </div>
      </div>

      <h2 id="revocation-warnings">Safety & Best Practices</h2>
      <div className="space-y-4 mb-20">
        <div className="p-6 rounded-xl border border-[#F8717140] bg-[#F8717105] flex gap-4">
          <div className="shrink-0 mt-1"><ShieldX className="w-5 h-5 text-[#F87171]" /></div>
          <div>
            <h4 className="text-[14px] font-bold text-[#EDEDED] mb-1">Action is Irreversible</h4>
            <p className="text-[12px] text-[#666] leading-relaxed">
              Deleting a key cannot be undone. Any application using the secret will immediately
              begin receiving <code>401 Unauthorized</code> errors. Ensure the key is no longer
              in use before terminating.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] flex gap-4">
          <div className="shrink-0 mt-1"><Activity className="w-5 h-5 text-[#9B6EFF]" /></div>
          <div>
            <h4 className="text-[14px] font-bold text-[#EDEDED] mb-1">Monitor Traffic First</h4>
            <p className="text-[12px] text-[#666] leading-relaxed">
              Use the <code>GET /v1/keys</code> endpoint to check the <code>last_used_at</code> claim.
              Only delete keys that haven't been active in the last 48 hours for non-emergency rotations.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-[#1F1F1F] flex items-center justify-between mb-12">
        <span className="text-[14px] text-[#555] font-medium">Want to see all your keys first?</span>
        <div className="flex items-center gap-3">
          <Link href="/docs/api/keys/list" className="text-[13px] px-4 py-2 bg-[#111] border border-[#2A2A2A] rounded-lg text-[#888] font-semibold hover:border-[#9B6EFF] hover:text-[#EDEDED] transition-colors flex items-center gap-2">
            Next: List Keys API <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <DocsPrevNext prev={{ label: 'Create Key', href: '/docs/api/keys/create' }} next={{ label: 'List Keys', href: '/docs/api/keys/list' }} />
    </div>
  );
}
