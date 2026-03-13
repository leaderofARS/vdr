import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  className = '',
  size = 'sm',
  showTooltip = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const buttonClasses = `
    inline-flex items-center justify-center p-1.5 rounded-md
    text-sipheron-text-secondary hover:text-sipheron-text-primary
    hover:bg-white/5 transition-all duration-200
    ${className}
  `;

  const button = (
    <button
      onClick={handleCopy}
      className={buttonClasses}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className={`${sizeClasses[size]} text-sipheron-green`} />
      ) : (
        <Copy className={sizeClasses[size]} />
      )}
    </button>
  );

  if (!showTooltip) return button;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-sipheron-surface border-sipheron-purple/30">
          <p className="text-xs">{copied ? 'Copied!' : 'Copy'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyButton;
