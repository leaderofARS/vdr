import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table-row' | 'chart' | 'text-line' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text-line',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'rounded-2xl h-32';
      case 'table-row':
        return 'rounded-md h-12 mb-2';
      case 'chart':
        return 'rounded-2xl h-64';
      case 'text-line':
        return 'rounded-md h-4';
      case 'circle':
        return 'rounded-full';
      case 'rect':
        return 'rounded-lg';
      default:
        return 'rounded-md h-4';
    }
  };

  const getDefaultDimensions = () => {
    switch (variant) {
      case 'card':
        return { width: '100%', height: height || 128 };
      case 'table-row':
        return { width: '100%', height: height || 48 };
      case 'chart':
        return { width: '100%', height: height || 256 };
      case 'text-line':
        return { width: width || '100%', height: height || 16 };
      case 'circle':
        return { width: width || 48, height: height || 48 };
      case 'rect':
        return { width: width || '100%', height: height || 96 };
      default:
        return { width: width || '100%', height: height || 16 };
    }
  };

  const dims = getDefaultDimensions();

  const skeletonItem = (
    <div
      className={`
        bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03]
        bg-[length:200%_100%] animate-shimmer
        ${getVariantClasses()}
        ${className}
      `}
      style={{
        width: typeof dims.width === 'number' ? `${dims.width}px` : dims.width,
        height: typeof dims.height === 'number' ? `${dims.height}px` : dims.height,
      }}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <React.Fragment key={i}>
            {skeletonItem}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return skeletonItem;
};

// Specialized skeleton components for common use cases
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06] ${className}`}>
    <LoadingSkeleton variant="circle" width={48} height={48} className="mb-4" />
    <LoadingSkeleton variant="text-line" width="60%" className="mb-2" />
    <LoadingSkeleton variant="text-line" width="40%" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className 
}) => (
  <div className={`space-y-2 ${className}`}>
    <LoadingSkeleton variant="table-row" className="bg-white/[0.05]" />
    {Array.from({ length: rows }).map((_, i) => (
      <LoadingSkeleton key={i} variant="table-row" />
    ))}
  </div>
);

export const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06] ${className}`}>
    <LoadingSkeleton variant="text-line" width="30%" className="mb-4" />
    <LoadingSkeleton variant="chart" />
  </div>
);

export const StatCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06] ${className}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <LoadingSkeleton variant="text-line" width="50%" className="mb-2" />
        <LoadingSkeleton variant="text-line" width="70%" className="h-8" />
      </div>
      <LoadingSkeleton variant="circle" width={40} height={40} />
    </div>
  </div>
);

export default LoadingSkeleton;
