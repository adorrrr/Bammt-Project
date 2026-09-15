import React from 'react';
import { Check } from 'lucide-react';
import { InvestmentTimelineStep } from '../../types/investment';
import { toBanglaDigits } from '../../utils/formatters';

interface InvestmentTimelineProps {
  timeline: InvestmentTimelineStep[];
  className?: string;
}

export const InvestmentTimeline: React.FC<InvestmentTimelineProps> = ({
  timeline,
  className = ''
}) => {
  return (
    <div className={className}>
      <h3 className="font-bold text-base sm:text-lg text-gangchil-text mb-4">
        প্রকল্প বাস্তবায়ন টাইমলাইন
      </h3>

      <div className="relative pl-8 space-y-5 before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-px before:bg-gangchil-border">
        {timeline.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';

          return (
            <div key={idx} className="relative">
              {/* Simple step indicator */}
              <div
                className={`absolute -left-8 top-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-semibold ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-gangchil-border text-gangchil-text-muted'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : toBanglaDigits(step.stage)}
              </div>

              <div className="flex flex-wrap items-baseline gap-x-2">
                <h4 className="font-semibold text-sm text-gangchil-text">{step.title}</h4>
                <span className="text-xs text-gangchil-text-muted">· {step.duration}</span>
              </div>
              <p className="text-xs sm:text-sm text-gangchil-text-muted leading-relaxed mt-0.5">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
