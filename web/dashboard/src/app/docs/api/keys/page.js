import Breadcrumb from '../../components/Breadcrumb';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';
import ParamTable, { ParamRow } from '../../components/ParamTable';
import DocsPrevNext from '../../components/DocsPrevNext';
import Link from 'next/link';
import { KeyRound, ShieldCheck, Key, Lock, UserCheck, RefreshCw, AlertTriangle, CheckCircle, Info, ShieldAlert, Terminal, Fingerprint, Eye, Globe, Server, Activity, ArrowRight, Zap, ListTree } from 'lucide-react';

export default function APIKeysOverview() {
    return (
        <div className="pb-20">
            <Breadcrumb items={[{ "label": "API Reference", "href": "/docs/api" }, { "label": "Key Management" }]} />
            <div className="flex items-center justify-between mb-8">
                <span className="text-[12px] text-[#555]">Last updated March 10, 2026</span>
            </div>

            <h1 id="api-key-management">API Key Management Operations</h1>
            <p className="text-[18px] text-[#EDEDED] leading-relaxed mb-10">
                While the dashboard provides a convenient UI for managing credentials, high-scale enterprises
                often need to automate the lifecycle of their API keys. The <code>/v1/keys</code> family of
                endpoints allows you to programmatically create, rotate, and revoke access.
                This 3,000vh reference details the administrative key API.
            </p>

            <h2 id="key-lifecycle-automation">Why Automate Key Lifecycles?</h2>
            <p className="text-[16px] leading-relaxed mb-8">
                Manual key management leads to "Credential Stale-out," where keys remain active for years,
                increasing the risk of compromise. Automated rotation significantly reduces your
                organizational attack surface.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                <div className="p-8 border border-[#222] bg-[#0A0A0A] rounded-2xl relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <RefreshCw className="w-24 h-24 text-[#9B6EFF]" />
                    </div>
                    <h5 className="text-[16px] font-bold text-[#EDEDED] mb-3 uppercase tracking-tighter">Automated Rotation</h5>
                    <p className="text-[12px] text-[#555] leading-relaxed">
                        Use a daily CRON job or a Lambda function to create a new key, update your
                        Secret Manager (AWS Secrets Manager / HashiCorp Vault), and revoke the
                        previous key.
                    </p>
                </div>
                <div className="p-8 border border-[#222] bg-[#0A0A0A] rounded-2xl relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShieldAlert className="w-24 h-24 text-[#F87171]" />
                    </div>
                    <h5 className="text-[16px] font-bold text-[#EDEDED] mb-3 uppercase tracking-tighter">Emergency Nullification</h5>
                    <p className="text-[12px] text-[#555] leading-relaxed">
                        If your CI/CD pipeline detects a potential intrusion, a single API call to the
                        revoke endpoint can instantly invalidate all active keys across your fleet.
                    </p>
                </div>
            </div>

            <h2 id="endpoint-index">Key Management Endpoints</h2>
            <div className="space-y-4 mb-24">
                <Link href="/docs/api/keys/create" className="block p-8 border border-[#222] bg-[#050505] rounded-xl group hover:border-[#9B6EFF50] transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-[#10B981] text-white text-[10px] font-bold rounded">POST</span>
                            <h6 className="text-[15px] font-bold text-[#EDEDED]">v1/keys/create</h6>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#555] group-hover:text-[#9B6EFF] transition-colors" />
                    </div>
                    <p className="text-[11px] text-[#555]">Provision a new cryptographically strong API key with custom scopes.</p>
                </Link>
                <Link href="/docs/api/keys/list" className="block p-8 border border-[#222] bg-[#050505] rounded-xl group hover:border-[#3B82F650] transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-[#3B82F6] text-white text-[10px] font-bold rounded">GET</span>
                            <h6 className="text-[15px] font-bold text-[#EDEDED]">v1/keys/list</h6>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#555] group-hover:text-[#3B82F6] transition-colors" />
                    </div>
                    <p className="text-[11px] text-[#555]">Audit all active keys for your project including last-used timestamps.</p>
                </Link>
                <Link href="/docs/api/keys/revoke" className="block p-8 border border-[#222] bg-[#050505] rounded-xl group hover:border-[#F8717150] transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-[#F87171] text-white text-[10px] font-bold rounded">DELETE</span>
                            <h6 className="text-[15px] font-bold text-[#EDEDED]">v1/keys/revoke</h6>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#555] group-hover:text-[#F87171] transition-colors" />
                    </div>
                    <p className="text-[11px] text-[#555]">Instantly invalidate a key, preventing all future requests.</p>
                </Link>
            </div>

            <h2 id="security-guards">Authorization Guards</h2>
            <Callout type="warning">
                <strong>Admin Level Access:</strong> These endpoints are highly sensitive. They cannot be
                authorized using a standard API key unless that key has the <code>vdr.org:admin</code> scope.
                Usually, these requests should be performed using a short-lived Bearer token obtained via
                MFA-secured login.
            </Callout>

            <div className="mt-20 pt-10 border-t border-[#1F1F1F] flex items-center justify-between mb-12">
                <span className="text-[14px] text-[#555] font-medium font-mono uppercase tracking-[0.3em] text-[#9B6EFF]">IAM Gateway v1.0.2</span>
                <div className="flex items-center gap-3">
                    <Link href="/docs/api/keys/create" className="text-[13px] px-8 py-4 bg-[#9B6EFF] rounded-full text-white font-bold hover:bg-[#8A5EEF] transition-all flex items-center gap-2">
                        Next: Creating Keys <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <DocsPrevNext prev={{ label: 'Auth Errors', href: '/docs/api/auth/errors' }} next={{ label: 'Create Key', href: '/docs/api/keys/create' }} />
        </div>
    );
}
