import React from 'react';
import { toBanglaDigits } from '../../utils/formatters';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabels?: boolean;
  className?: string;
  variant?: 'green' | 'gold' | 'earth';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showLabels = false,
  className = '',
  variant = 'green'
}) => {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  const barColors = {
    green: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    gold: 'bg-gradient-to-r from-cyan-500 to-sky-400',
    earth: 'bg-gradient-to-r from-slate-600 to-slate-400'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex justify-between items-center text-xs font-medium text-gangchill-ink-muted mb-1.5">
          <span>তহবিল সংগৃহীত</span>
          <span className="font-semibold text-gangchill-ink">
            {toBanglaDigits(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColors[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
