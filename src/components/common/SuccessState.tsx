import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface SuccessStateProps {
  title: string;
  message: string;
  referenceId?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  message,
  referenceId,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-8 px-4 sm:px-6 rounded-natural-lg bg-gangchil-surface/70 border border-[#C3E8D2] ${className}`}>
      <div className="w-14 h-14 rounded-full bg-[#EBF7F0] border border-[#C3E8D2] flex items-center justify-center mx-auto mb-4 text-[#16A34A] animate-scale-in">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-gangchil-text mb-2">
        {title}
      </h3>

      <p className="text-base text-gangchil-text-muted max-w-md mx-auto mb-4 leading-relaxed">
        {message}
      </p>

      {referenceId && (
        <div className="inline-block bg-white px-3.5 py-1.5 rounded-md border border-gangchil-border text-xs text-gangchil-text font-mono mb-6 shadow-2xs">
          রেফারেন্স নম্বর: <span className="font-bold text-gangchil-green">{referenceId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {actionLabel && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
