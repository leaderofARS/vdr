import type { FC } from 'react';
import { Check, X, AlertTriangle, Loader2, Ban } from 'lucide-react';

export type StatusType = 'CONFIRMED' | 'PENDING' | 'FAILED' | 'REVOKED' | 'INVALID';

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  className?: string;
}

interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: typeof Check;
  dotColor: string;
  animate?: boolean;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  CONFIRMED: {
    label: 'Confirmed',
    bgColor: 'bg-sipheron-green/10',
    textColor: 'text-sipheron-green',
    borderColor: 'border-sipheron-green/20',
    icon: Check,
    dotColor: 'bg-sipheron-green',
  },
  PENDING: {
    label: 'Pending',
    bgColor: 'bg-sipheron-gold/10',
    textColor: 'text-sipheron-gold',
    borderColor: 'border-sipheron-gold/20',
    icon: Loader2,
    dotColor: 'bg-sipheron-gold',
    animate: true,
  },
  FAILED: {
    label: 'Failed',
    bgColor: 'bg-sipheron-red/10',
    textColor: 'text-sipheron-red',
    borderColor: 'border-sipheron-red/20',
    icon: X,
    dotColor: 'bg-sipheron-red',
  },
  REVOKED: {
    label: 'Revoked',
    bgColor: 'bg-sipheron-orange/10',
    textColor: 'text-sipheron-orange',
    borderColor: 'border-sipheron-orange/20',
    icon: Ban,
    dotColor: 'bg-sipheron-orange',
  },
  INVALID: {
    label: 'Invalid',
    bgColor: 'bg-sipheron-text-muted/10',
    textColor: 'text-sipheron-text-muted',
    borderColor: 'border-sipheron-text-muted/20',
    icon: AlertTriangle,
    dotColor: 'bg-sipheron-text-muted',
  },
};

export const StatusBadge: FC<StatusBadgeProps> = ({ 
  status, 
  showIcon = true,
  className = '' 
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        border ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${className}
      `}
    >
      {showIcon && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${config.animate ? 'animate-pulse' : ''}`} />
      )}
      {config.animate ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : showIcon ? (
        <Icon className="w-3 h-3" />
      ) : null}
      {config.label}
    </span>
  );
};

export default StatusBadge;
