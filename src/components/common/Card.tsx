import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  variant?: 'default' | 'surface' | 'gold-tint' | 'outline';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-gangchil-border/80 shadow-xs',
    surface: 'bg-gangchil-surface border border-gangchil-border',
    'gold-tint': 'bg-gangchil-gold-subtle border border-gangchil-gold/20 shadow-xs',
    outline: 'bg-transparent border border-gangchil-border'
  };

  const hoverStyles = hoverable
    ? 'transition-all duration-200 hover:border-gangchil-green/40 hover:shadow-warm hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={`rounded-natural-lg overflow-hidden ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
