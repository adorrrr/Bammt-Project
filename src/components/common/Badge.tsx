import React from 'react';
import { StockStatus } from '../../types/stock';
import { InvestmentStatus } from '../../types/investment';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'live' | 'upcoming' | 'sold' | 'open' | 'funded' | 'closed' | 'neutral' | 'gold';
  status?: StockStatus | InvestmentStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  size = 'md',
  className = ''
}) => {
  // Determine variant from status if variant is not explicitly provided
  const activeVariant = variant || (status as string) || 'neutral';

  const variantStyles: Record<string, { bg: string; text: string; dot?: string; label: string }> = {
    live: {
      bg: 'bg-emerald-600/25 border-emerald-300/40 backdrop-blur-md',
      text: 'text-white',
      dot: 'bg-emerald-200',
      label: 'বর্তমানে পাওয়া যাচ্ছে'
    },
    upcoming: {
      bg: 'bg-gangchill-cyan-tint border-gangchill-cyan/25 backdrop-blur-xs',
      text: 'text-gangchill-cyan-deep',
      dot: 'bg-gangchill-cyan',
      label: 'শীঘ্রই আসছে'
    },
    sold: {
      bg: 'bg-slate-100 border-slate-200',
      text: 'text-gangchill-ink-muted',
      dot: 'bg-gangchill-ink-muted',
      label: 'স্টক সমাপ্ত'
    },
    open: {
      bg: 'bg-amber-500/25 border-amber-300/40 backdrop-blur-md',
      text: 'text-white',
      dot: 'bg-amber-200',
      label: 'বিনিয়োগ গ্রহণ চলছে'
    },
    funded: {
      bg: 'bg-emerald-600/25 border-emerald-300/40 backdrop-blur-md',
      text: 'text-white',
      dot: 'bg-emerald-200',
      label: 'তহবিল সংগ্রহ সম্পন্ন'
    },
    closed: {
      bg: 'bg-slate-100 border-slate-200',
      text: 'text-gangchill-ink-muted',
      dot: 'bg-gangchill-ink-muted',
      label: 'সম্পন্ন'
    },
    neutral: {
      bg: 'bg-white/80 border-gangchill-border backdrop-blur-xs',
      text: 'text-gangchill-ink-muted',
      label: ''
    },
    gold: {
      bg: 'bg-gangchill-cyan-tint border-gangchill-cyan/30 backdrop-blur-xs',
      text: 'text-gangchill-cyan-deep',
      label: ''
    }
  };

  const current = variantStyles[activeVariant] || variantStyles.neutral;
  const labelContent = children || current.label;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5'
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${current.bg} ${current.text} ${sizeClasses[size]} ${className}
      `}
    >
      {current.dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0 animate-pulse`} />
      )}
      <span>{labelContent}</span>
    </span>
  );
};
