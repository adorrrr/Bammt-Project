import React from 'react';
import { formatQuantity } from '../../utils/formatters';

interface QuantityDisplayProps {
  quantity: number;
  unit: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantityDisplay: React.FC<QuantityDisplayProps> = ({
  quantity,
  unit,
  label,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold'
  };

  return (
    <div className={`inline-flex flex-col ${className}`}>
      {label && <span className="text-xs text-gangchil-text-muted mb-0.5">{label}</span>}
      <span className={`text-gangchil-text ${sizeClasses[size]}`}>
        {formatQuantity(quantity, unit)}
      </span>
    </div>
  );
};
