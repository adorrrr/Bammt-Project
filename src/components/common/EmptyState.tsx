import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-4 rounded-natural-lg bg-gangchil-surface/50 border border-gangchil-border ${className}`}>
      <div className="w-12 h-12 rounded-full bg-gangchil-surface border border-gangchil-border flex items-center justify-center mx-auto mb-3 text-gangchil-text-muted">
        <PackageOpen className="w-6 h-6 text-gangchil-earth" />
      </div>
      <h3 className="text-lg font-semibold text-gangchil-text mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gangchil-text-muted max-w-sm mx-auto mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
