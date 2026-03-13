import React, { useState } from 'react';
import { Copy, Check, AlertTriangle, Info, Terminal, Package } from 'lucide-react';

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border border-[#2A2A2A] rounded-t-lg">
        <span className="text-xs text-[#555]">{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-[#555] hover:text-white transition-colors"
        >
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

const InstallationPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Installation Guide</h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Complete installation instructions for the SipHeron VDR CLI. Choose from npm, Docker, 
        or manual installation methods to get started with document anchoring and verification 
        on the Solana blockchain.
      </p>

      {/* System Requirements */}
      <h2 id="system-requirements" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        System Requirements
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            Node.js
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Node.js 18.0.0 or higher (LTS recommended)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              npm 8.0.0+ or yarn 1.22.0+
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              Node.js 16.x is deprecated (EOL)
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-400" />
            Operating Systems
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              macOS 10.15 (Catalina) or newer
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Windows 10/11 (64-bit)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Linux (Ubuntu 18.04+, Debian 10+, RHEL 8+)
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-8">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-300 font-medium mb-1">Architecture Support</p>
          <p className="text-sm text-blue-400/80">
            Binaries are available for x64, ARM64, and ARMv7 architectures. 
            Rosetta 2 is supported on Apple Silicon Macs for x64 emulation.
          </p>
        </div>
      </div>

      {/* NPM Installation */}
      <h2 id="npm-installation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        NPM Global Installation
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        The recommended way to install SipHeron VDR CLI is via npm. This provides automatic 
        updates and cross-platform compatibility.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Standard Installation
      </h3>
      <CodeBlock code={`# Install globally with npm
npm install -g @sipheron/vdr-cli

# Or with yarn
yarn global add @sipheron/vdr-cli

# Or with pnpm
pnpm add -g @sipheron/vdr-cli`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Installation with Specific Version
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        For production environments, you may want to pin to a specific version:
      </p>
      <CodeBlock code={`# Install a specific version
npm install -g @sipheron/vdr-cli@2.5.0

# Install latest patch version of a minor release
npm install -g @sipheron/vdr-cli@^2.5.0`} />

      {/* Platform-Specific Instructions */}
      <h2 id="platform-specific" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Platform-Specific Instructions
      </h2>

      <h3 id="macos-linux" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        macOS and Linux
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        On Unix-based systems, you may need to configure npm's global directory or use sudo, 
        though the latter is not recommended for security reasons.
      </p>
      <CodeBlock code={`# Check npm prefix (where global packages are installed)
npm prefix -g

# Option 1: Change npm's default directory to avoid sudo
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Option 2: Install with sudo (not recommended)
sudo npm install -g @sipheron/vdr-cli

# Verify the binary is in your PATH
which sipheron-vdr
sipheron-vdr --version`} />

      <h3 id="windows" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Windows
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        On Windows, run Command Prompt or PowerShell as Administrator for global installation, 
        or configure npm to use a user directory.
      </p>
      <CodeBlock code={`# Using Command Prompt (as Administrator)
npm install -g @sipheron/vdr-cli

# Using PowerShell (as Administrator)
npm install -g @sipheron/vdr-cli

# Configure npm to use user directory (no admin required)
npm config set prefix "%APPDATA%\\npm"
setx PATH "%APPDATA%\\npm;%PATH%"

# Verify installation
sipheron-vdr --version`} language="powershell" />

      <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-8">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-300 font-medium mb-1">Windows Execution Policy</p>
          <p className="text-sm text-yellow-400/80">
            If you encounter execution policy errors in PowerShell, run:{' '}
            <code className="bg-yellow-500/20 px-1.5 py-0.5 rounded">Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser</code>
          </p>
        </div>
      </div>

      {/* Docker Installation */}
      <h2 id="docker-installation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Docker Installation
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        For containerized environments or CI/CD pipelines, use the official Docker image. 
        This ensures consistent behavior across different systems without managing Node.js versions.
      </p>

      <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
        <Package className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-gray-300 font-medium mb-1">Docker Hub Repository</p>
          <code className="text-sm text-gray-400">sipheron/vdr-cli:latest</code>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">
        Pull and Run
      </h3>
      <CodeBlock code={`# Pull the latest image
docker pull sipheron/vdr-cli:latest

# Run a command
docker run --rm sipheron/vdr-cli:latest --version

# Run with mounted volume for file access
docker run --rm -v $(pwd):/docs sipheron/vdr-cli:latest anchor /docs/contract.pdf

# Run with environment variables
docker run --rm -e SIPHERON_API_KEY=your_key sipheron/vdr-cli:latest auth whoami`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Docker Compose Setup
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        For persistent configurations, create a docker-compose.yml file:
      </p>
      <CodeBlock code={`version: '3.8'

services:
  vdr-cli:
    image: sipheron/vdr-cli:latest
    container_name: sipheron-vdr
    volumes:
      - ./documents:/documents
      - vdr-config:/root/.sipheron
    environment:
      - SIPHERON_API_KEY=\${SIPHERON_API_KEY}
      - SIPHERON_NETWORK=mainnet
    working_dir: /documents
    command: ["--version"]

volumes:
  vdr-config:`} language="yaml" />

      {/* Verify Installation */}
      <h2 id="verify-installation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Verify Installation
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        After installation, verify that the CLI is properly installed and accessible:
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">
        Basic Verification
      </h3>
      <CodeBlock code={`# Check CLI version
sipheron-vdr --version
# Expected output: 2.5.0

# Check CLI help
sipheron-vdr --help

# Verify all commands are available
sipheron-vdr auth --help
sipheron-vdr anchor --help
sipheron-vdr verify --help`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Diagnostic Command
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Run the diagnostic command to check your environment and connectivity:
      </p>
      <CodeBlock code={`# Run diagnostics
sipheron-vdr doctor

# Expected output includes:
# ✓ Node.js version: 18.17.0
# ✓ CLI version: 2.5.0
# ✓ Network connectivity: OK
# ✓ Solana RPC: Reachable
# ✓ Configuration directory: /home/user/.sipheron`} />

      {/* Updating the CLI */}
      <h2 id="updating" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Updating the CLI
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Keep your CLI up to date to access new features and security patches.
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">
        Check for Updates
      </h3>
      <CodeBlock code={`# Check current version
sipheron-vdr --version

# Check for available updates
sipheron-vdr update check`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Update Commands
      </h3>
      <CodeBlock code={`# Update via npm
npm update -g @sipheron/vdr-cli

# Or reinstall for latest version
npm install -g @sipheron/vdr-cli@latest

# Update via yarn
yarn global upgrade @sipheron/vdr-cli

# Update Docker image
docker pull sipheron/vdr-cli:latest`} />

      {/* Uninstallation */}
      <h2 id="uninstallation" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Uninstallation
      </h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        To completely remove SipHeron VDR CLI from your system:
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3 scroll-mt-24">
        NPM Uninstall
      </h3>
      <CodeBlock code={`# Uninstall globally
npm uninstall -g @sipheron/vdr-cli

# Verify removal
which sipheron-vdr
# Should return: sipheron-vdr not found`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
        Clean Up Configuration
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        Remove configuration files and cached data:
      </p>
      <CodeBlock code={`# macOS/Linux
rm -rf ~/.sipheron
rm -rf ~/.config/sipheron

# Windows (PowerShell)
Remove-Item -Recurse -Force $env:APPDATA\sipheron
Remove-Item -Recurse -Force $env:LOCALAPPDATA\sipheron

# Docker cleanup
docker rmi sipheron/vdr-cli:latest
docker volume rm vdr-config`} />

      {/* Troubleshooting */}
      <h2 id="troubleshooting" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Troubleshooting
      </h2>

      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h3 className="font-semibold text-red-300 mb-2">Error: command not found</h3>
          <p className="text-sm text-gray-400 mb-3">
            The CLI binary is not in your system PATH.
          </p>
          <CodeBlock code={`# Find npm global bin directory
npm bin -g

# Add to PATH (macOS/Linux)
export PATH="$(npm bin -g):$PATH"
echo 'export PATH="$(npm bin -g):$PATH"' >> ~/.bashrc

# Add to PATH (Windows)
setx PATH "%APPDATA%\\npm;%PATH%"`} />
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h3 className="font-semibold text-red-300 mb-2">Error: EACCES: permission denied</h3>
          <p className="text-sm text-gray-400 mb-3">
            npm doesn't have permission to write to the global directory.
          </p>
          <CodeBlock code={`# Fix npm permissions (macOS/Linux)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Reinstall without sudo
npm install -g @sipheron/vdr-cli`} />
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h3 className="font-semibold text-red-300 mb-2">Error: Unsupported Node.js version</h3>
          <p className="text-sm text-gray-400 mb-3">
            Your Node.js version is too old or incompatible.
          </p>
          <CodeBlock code={`# Check Node.js version
node --version

# Install nvm and upgrade Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from nodejs.org`} />
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h3 className="font-semibold text-red-300 mb-2">Error: Self-signed certificate</h3>
          <p className="text-sm text-gray-400 mb-3">
            Corporate proxies or antivirus software may interfere with SSL connections.
          </p>
          <CodeBlock code={`# Temporarily disable strict SSL (not recommended for production)
npm config set strict-ssl false

# Or configure corporate proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Install the package
npm install -g @sipheron/vdr-cli`} />
        </div>
      </div>

      {/* Next Steps */}
      <h2 id="next-steps" className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24">
        Next Steps
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Now that you have the CLI installed, follow these guides to get started:
      </p>
      <ul className="space-y-2 text-gray-400 mb-16">
        <li className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          <a href="/docs/quickstart" className="text-purple-400 hover:text-purple-300">Quick Start Guide</a>
          {' '}- Anchor your first document in 5 minutes
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          <a href="/docs/cli" className="text-purple-400 hover:text-purple-300">CLI Reference</a>
          {' '}- Learn all available commands
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          <a href="/docs/auth/bearer" className="text-purple-400 hover:text-purple-300">Authentication</a>
          {' '}- Set up API keys and tokens
        </li>
      </ul>
    </div>
  );
};

export default InstallationPage;
