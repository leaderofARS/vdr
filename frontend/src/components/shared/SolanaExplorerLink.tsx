import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SolanaExplorerLinkProps {
  signature?: string;
  address?: string;
  cluster?: 'devnet' | 'mainnet-beta' | 'testnet';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
  truncate?: boolean;
  truncateLength?: number;
}

export const SolanaExplorerLink: React.FC<SolanaExplorerLinkProps> = ({
  signature,
  address,
  cluster = 'devnet',
  className = '',
  showIcon = true,
  children,
  truncate = false,
  truncateLength = 8,
}) => {
  const baseUrl = 'https://explorer.solana.com';
  const path = signature ? `/tx/${signature}` : address ? `/address/${address}` : '';
  const clusterParam = cluster !== 'mainnet-beta' ? `?cluster=${cluster}` : '';
  const href = `${baseUrl}${path}${clusterParam}`;

  const displayText = () => {
    if (children) return children;
    const text = signature || address || '';
    if (truncate && text.length > truncateLength * 2) {
      return `${text.slice(0, truncateLength)}...${text.slice(-truncateLength)}`;
    }
    return text;
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-1.5
        text-sipheron-purple hover:text-sipheron-teal
        transition-colors duration-200
        ${className}
      `}
    >
      {displayText()}
      {showIcon && <ExternalLink className="w-3.5 h-3.5" />}
    </a>
  );
};

export default SolanaExplorerLink;
