import React from 'react';
import { StockSpecificationItem } from '../../types/stock';

interface StockSpecificationProps {
  specifications: StockSpecificationItem[];
  className?: string;
}

export const StockSpecification: React.FC<StockSpecificationProps> = ({
  specifications,
  className = ''
}) => {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className={`rounded-natural-lg border border-gangchil-border bg-white overflow-hidden ${className}`}>
      <div className="px-4 py-3 bg-gangchil-surface/80 border-b border-gangchil-border font-semibold text-sm text-gangchil-text">
        পণ্যের বৈশিষ্ট্য ও স্পেসিফিকেশন
      </div>
      <div className="divide-y divide-gangchil-border/60">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="px-4 py-3 flex flex-col sm:flex-row sm:justify-between text-sm gap-1 hover:bg-gangchil-canvas/50 transition-colors"
          >
            <span className="text-gangchil-text-muted font-normal">{spec.label}</span>
            <span className="text-gangchil-text font-medium text-left sm:text-right">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
