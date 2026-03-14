import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

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

const GuideEnterprisePage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Enterprise Setup Guide</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Configure SipHeron VDR for enterprise deployments with SSO, team management, 
        and organizational policies.
      </p>

      <h2 id="organization" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Organization Structure
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Enterprise organizations support multiple teams, custom roles, and centralized billing.
      </p>
      <CodeBlock code={`# Create organization
curl -X POST https://api.sipheron.com/dashboard/api/v1/organizations \\
  -H "Authorization: Bearer TOKEN" \\
  -d '{
    "name": "Acme Corp",
    "plan": "enterprise"
  }'`} />

      <h2 id="sso" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        SSO Configuration
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Enable SAML 2.0 or OIDC single sign-on for your organization.
      </p>
      <CodeBlock code={`# Configure SAML SSO
curl -X PATCH https://api.sipheron.com/dashboard/api/v1/organizations/ID/sso \\
  -H "Authorization: Bearer TOKEN" \\
  -d '{
    "provider": "saml",
    "entry_point": "https://sso.company.com/saml",
    "cert": "-----BEGIN CERTIFICATE-----..."
  }'`} />

      <h2 id="roles" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Role-Based Access Control
      </h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Role</th>
              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr><td className="py-3 pr-4 text-purple-300">Admin</td><td className="py-3 pr-4 text-gray-400">Full access</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300">Manager</td><td className="py-3 pr-4 text-gray-400">Anchoring, verification, team management</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300">User</td><td className="py-3 pr-4 text-gray-400">Anchoring and verification only</td></tr>
            <tr><td className="py-3 pr-4 text-purple-300">Viewer</td><td className="py-3 pr-4 text-gray-400">Read-only access</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="compliance" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Compliance Frameworks
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        SipHeron supports SOC 2, ISO 27001, and GDPR compliance requirements.
      </p>
      <ul className="space-y-3 text-gray-300 mb-8">
        <li>• Audit logs for all anchoring and verification events</li>
        <li>• Data retention policies</li>
        <li>• Encryption at rest and in transit</li>
        <li>• Role-based access controls</li>
        <li>• GDPR data export and deletion</li>
      </ul>
    </div>
  );
};

export default GuideEnterprisePage;
