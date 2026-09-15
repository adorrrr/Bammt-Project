import React from 'react';
import { formatTaka, formatTakaShort } from '../../utils/formatters';

interface MoneyDisplayProps {
  amount: number;
  short?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
  perUnit?: string;
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount,
  short = false,
  size = 'md',
  className = '',
  label,
  perUnit
}) => {
  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl sm:text-3xl font-bold tracking-tight'
  };

  const displayText = short ? formatTakaShort(amount) : formatTaka(amount);

  return (
    <div className={`inline-flex flex-col ${className}`}>
      {label && <span className="text-xs text-gangchil-text-muted mb-0.5">{label}</span>}
      <div className="flex items-baseline gap-1">
        <span className={`text-gangchil-green-dark ${sizeClasses[size]}`}>
          {displayText}
        </span>
        {perUnit && (
          <span className="text-xs text-gangchil-text-muted font-normal">
            / {perUnit}
          </span>
        )}
      </div>
    </div>
  );
};
