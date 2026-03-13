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

const GuideCicdPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">CI/CD Integration Guide</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Integrate SipHeron VDR into your CI/CD pipelines to anchor build artifacts, 
        container images, and ensure software supply chain integrity.
      </p>

      <h2 id="github-actions" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        GitHub Actions
      </h2>
      <CodeBlock code={`- name: Install SipHeron CLI
  run: npm install -g @sipheron/vdr-cli

- name: Anchor build artifacts
  run: sipheron-vdr anchor ./dist/artifacts.zip --note "Build artifacts" --network mainnet
  env:
    SIPHERON_API_KEY: ` + '`' + `secrets.SIPHERON_API_KEY` + '`' + `

- name: Verify anchor
  run: sipheron-vdr verify ./dist/artifacts.zip`} language="yaml" />

      <h2 id="gitlab-ci" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        GitLab CI
      </h2>
      <CodeBlock code={`anchor_artifacts:
  stage: deploy
  image: node:18
  before_script:
    - npm install -g @sipheron/vdr-cli
  script:
    - sipheron-vdr anchor ./build/artifacts.zip --note "GitLab CI Build" --network mainnet
  only:
    - main`} language="yaml" />

      <h2 id="jenkins" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Jenkins Pipeline
      </h2>
      <CodeBlock code={`stage('Anchor Artifacts') {
    steps {
        sh 'npm install -g @sipheron/vdr-cli'
        sh 'sipheron-vdr anchor ./build/artifacts.zip --note "Jenkins Build" --network mainnet'
    }
}`} language="groovy" />

      <h2 id="container-images" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Container Image Anchoring
      </h2>
      <CodeBlock code={`# Build and push image
docker build -t myapp:v1.0.0 .
docker push myapp:v1.0.0

# Get image digest
DIGEST=$(docker inspect myapp:v1.0.0 --format='{{.Id}}')

# Anchor the digest
echo $DIGEST | sipheron-vdr anchor --note "Container image v1.0.0" --network mainnet`} />

      <h2 id="sbom" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        SBOM Anchoring
      </h2>
      <CodeBlock code={`# Generate SBOM with Syft
syft myapp:v1.0.0 -o spdx-json > sbom.json

# Anchor the SBOM
sipheron-vdr anchor ./sbom.json --note "SBOM for v1.0.0" --network mainnet`} />

      <h2 id="best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Best Practices
      </h2>
      <ul className="space-y-3 text-gray-300 mb-8">
        <li>• Anchor all release artifacts before deployment</li>
        <li>• Include build metadata in anchor notes</li>
        <li>• Verify artifacts before production deployment</li>
        <li>• Store anchor IDs as part of release records</li>
        <li>• Use mainnet for production releases</li>
      </ul>
    </div>
  );
};

export default GuideCicdPage;
