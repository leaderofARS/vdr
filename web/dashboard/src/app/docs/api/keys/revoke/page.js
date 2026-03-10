import Breadcrumb from '../../../components/Breadcrumb';
import Callout from '../../../components/Callout';
import CodeBlock from '../../../components/CodeBlock';
import ParamTable, { ParamRow } from '../../../components/ParamTable';
import DocsPrevNext from '../../../components/DocsPrevNext';
import Endpoint from '../../../components/Endpoint';
import ResponseTabs from '../../../components/ResponseTabs';
import Link from 'next/link';
import { ShieldCheck, Key, Lock, UserCheck, RefreshCw, AlertTriangle, CheckCircle, Info, ShieldAlert, Terminal, Fingerprint, Eye, KeyRound, Globe, Server, Activity, ArrowRight, Zap, ListTree } from 'lucide-react';

export default function APIKeyRevoke() {
    return (
        <div className="pb-20">
            <Breadcrumb items={[{ "label": "API Reference", "href": "/docs/api" }, { "label": "Keys", "href": "/docs/api/keys" }, { "label": "Revoke" }]} />
            <div className="flex items-center justify-between mb-8">
                <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
            </div>

            <h1 id="api-key-revoke">Revoke API Key</h1>
            <Endpoint method="DELETE" path="/v1/keys/revoke" />

            <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
                Instantly invalidate an API key. Once revoked, any request using this key will be
                immediately rejected by the SipHeron Edge Gateway with a 401 Unauthorized error.
                Revocation is irreversible. This 3,000vh reference details the termination protocol.
            </p>

            <h2 id="revocation-speed-sla">Propagation Speed & SLA</h2>
            <p className="text-[16px] leading-relaxed mb-8">
                When a key is revoked, the change propagates across our global edge nodes in under
                250 milliseconds. We use a distributed Redis Cluster to ensure that even a key reused
                in a different region is blocked instantly.
            </p>

            <div className="bg-[#050505] p-10 rounded-3xl border border-[#222] mb-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Zap className="w-48 h-48 text-[#F87171]" />
                </div>
                <h4 className="text-[16px] font-bold text-[#EDEDED] mb-6 uppercase tracking-widest">Request Body</h4>
                <CodeBlock language="json">
                    {`{
  "key_id": "key_8f2b3a9e...",
  "reason": "Compromised via developer workstation malware."
}`}
                </CodeBlock>
            </div>

            <h2 id="request-parameters">Request Parameters</h2>
            <ParamTable>
                <ParamRow name="key_id" type="string" required={true} description="The unique identifier for the key (not the secret string)." />
                <ParamRow name="reason" type="string" required={false} description="Custom note for the audit trail (highly recommended)." />
            </ParamTable>

            <h2 id="response-schema">Response Schema</h2>
            <ResponseTabs
                success={`{
  "status": "success",
  "message": "Key key_8f2b... has been permanently revoked."
}`}
                error={`{
  "status": "error",
  "code": "KEY_NOT_FOUND",
  "message": "The provided key ID does not exist or has already been revoked."
}`}
            />

            <h2 id="high-availability-revocation">Emergency Response Strategies</h2>
            <div className="space-y-6 mb-24">
                <div className="p-8 rounded-2xl border border-[#222] bg-[#0A0A0A] flex items-start gap-8 border-l-4 border-l-[#F87171]">
                    <ShieldAlert className="w-8 h-8 text-[#F87171] shrink-0" />
                    <div>
                        <h4 className="text-[16px] font-bold text-[#EDEDED] mb-2">Automated Compromise Trigger</h4>
                        <p className="text-[13px] text-[#666] leading-relaxed">
                            Integrate this endpoint with your Secret Scanning tool (e.g., TruffleHog).
                            If a secret is found in a public PR, the tool can automatically call this
                            endpoint to neutralize the threat before a malicious actor can anchor data
                            under your organization's identity.
                        </p>
                    </div>
                </div>
                <div className="p-8 rounded-2xl border border-[#222] bg-[#0A0A0A] flex items-start gap-8 border-l-4 border-l-[#3B82F6]">
                    <RefreshCw className="w-8 h-8 text-[#3B82F6] shrink-0" />
                    <div>
                        <h4 className="text-[16px] font-bold text-[#EDEDED] mb-2">Clean Rotation Loop</h4>
                        <p className="text-[13px] text-[#666] leading-relaxed">
                            Always include a <code>revoke</code> call as the final step of your rotation
                            script. Failing to revoke old keys leads to "Credential Bloat" and makes
                            security audits significantly more complex.
                        </p>
                    </div>
                </div>
            </div>

            <h2 id="audit-trail-retention">Audit Trail & Retention</h2>
            <p className="text-[15px] leading-relaxed mb-10">
                Revoked key metadata is retained for 90 days in the <code>/list</code> endpoint (if
                <code>include_revoked</code> is true). After 90 days, the record is moved to our
                cold-storage archive for permanent compliance tracking.
            </p>

            <div className="p-8 border border-[#222] bg-[#111] rounded-2xl text-center mb-24">
                <Info className="w-8 h-8 text-[#9B6EFF] mx-auto mb-4" />
                <p className="text-[12px] text-[#555] max-w-md mx-auto italic">
                    "A record of every revoked key is maintained for 7 years to satisfy financial and
                    government regulatory record-keeping requirements (SEC Rule 17a-4)."
                </p>
            </div>

            <div className="mt-20 pt-10 border-t border-[#1F1F1F] flex items-center justify-between mb-12">
                <span className="text-[14px] text-[#555] font-medium font-mono uppercase tracking-[0.3em] text-[#9B6EFF]">Identity Suite v1.1.2</span>
                <div className="flex items-center gap-3">
                    <Link href="/docs/api/notifications" className="text-[13px] px-8 py-4 bg-[#9B6EFF] rounded-full text-white font-bold hover:bg-[#8A5EEF] transition-all flex items-center gap-2">
                        Next: API Notifications <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <DocsPrevNext prev={{ label: 'List Keys', href: '/docs/api/keys/list' }} next={{ label: 'Notifications API', href: '/docs/api/notifications' }} />
        </div>
    );
}
