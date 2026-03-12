import DocLayout from '../../components/DocLayout';
import { Terminal, Github, Gitlab, Rocket, ShieldCheck, Zap, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'automation-overview', title: 'Automation Overview', level: 2 },
    { id: 'github-actions', title: 'GitHub Actions', level: 2 },
    { id: 'gitlab-ci', title: 'GitLab CI/CD', level: 2 },
    { id: 'build-hash-verification', title: 'Build Hash Verification', level: 2 },
    { id: 'security-best-practices', title: 'Security Best Practices', level: 2 },
    { id: 'example-script', title: 'Shell Script Template', level: 2 },
];

export default function GuideCicdPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Guide: CI/CD Integration</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Automate document anchoring and build verification directly within your deployment pipelines.
                </p>

                <h2 id="automation-overview" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Automation Overview
                </h2>
                <p className="text-gray-300 mb-6 font-light">
                    Manually anchoring documents is prone to human error. By integrating the <code className="text-purple-300">sipheron-vdr</code> CLI into your CI/CD pipelines, you can ensure every release artifact, build log, or legal disclosure is automatically anchored to the blockchain the moment it is generated.
                </p>

                <h2 id="github-actions" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    GitHub Actions
                </h2>
                <p className="text-gray-300 mb-4 font-light">
                    Add the following step to your <code className="text-purple-300">.github/workflows/deploy.yml</code>:
                </p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-12 overflow-x-auto">
                    <pre className="text-xs text-purple-200 font-mono">
{`- name: Anchor Build Artifact
  run: |
    npm install -g sipheron-vdr
    vdr link \${{ secrets.SIPHERON_API_KEY }}
    vdr stage ./build/artifact.zip
    vdr anchor --mainnet
  env:
    SIPHERON_API_KEY: \${{ secrets.SIPHERON_API_KEY }}`}
                    </pre>
                </div>

                <h2 id="gitlab-ci" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    GitLab CI/CD
                </h2>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-12 overflow-x-auto">
                    <pre className="text-xs text-purple-200 font-mono">
{`anchor_job:
  image: node:latest
  script:
    - npm install -g sipheron-vdr
    - vdr link $SIPHERON_API_KEY
    - vdr stage ./releases/latest.pdf
    - vdr anchor --mainnet
  only:
    - main`}
                    </pre>
                </div>

                <h2 id="build-hash-verification" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Build Hash Verification
                </h2>
                <p className="text-gray-300 mb-6 font-light leading-relaxed">
                    In high-security environments, you can also use SipHeron to verify that the build environment hasn't been tampered with. Simply anchor the hash of your <code className="text-purple-300">node_modules</code> or source directory at the start of the job, and verify it at the end.
                </p>

                <h2 id="security-best-practices" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Security Best Practices
                </h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-12">
                    <ul className="list-disc list-inside text-yellow-200/80 space-y-3 text-sm">
                        <li><strong>Use Secrets:</strong> Never commit your <code className="text-white">SIPHERON_API_KEY</code> to git. Use platform secrets.</li>
                        <li><strong>Ephemeral Agents:</strong> Run jobs on ephemeral agents that are destroyed after completion to ensure local config is wiped.</li>
                        <li><strong>Scoped Keys:</strong> Use an API key that only has <code className="text-white">anchor</code> permissions.</li>
                    </ul>
                </div>

                <h2 id="example-script" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
                    Shell Script Template
                </h2>
                <p className="text-gray-300 mb-4 font-mono text-xs">anchor.sh</p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-16 overflow-x-auto">
                    <pre className="text-xs text-purple-200 font-mono">
{`#!/bin/bash
# Exit on error
set -e

FILE_PATH=$1

echo "Anchoring $FILE_PATH to SipHeron VDR..."
vdr stage "$FILE_PATH"
vdr anchor --mainnet
echo "Done! Proof is now immutable."`}
                    </pre>
                </div>
            </div>
        </DocLayout>
    );
}
