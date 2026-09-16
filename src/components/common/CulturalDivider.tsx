import React from 'react';

interface CulturalDividerProps {
  className?: string;
  variant?: 'paddy' | 'kantha' | 'simple';
}

export const CulturalDivider: React.FC<CulturalDividerProps> = ({
  className = '',
  variant = 'paddy'
}) => {
  if (variant === 'simple') {
    return <div className={`w-full h-px bg-gangchil-border ${className}`} />;
  }

  if (variant === 'kantha') {
    return (
      <div className={`flex items-center justify-center my-6 text-gangchil-earth/30 ${className}`}>
        <div className="h-px bg-gangchill-ink/15 flex-grow" />
        <div className="flex items-center space-x-1.5 px-3">
          <span className="w-1.5 h-1.5 rotate-45 border border-gangchil-earth/50" />
          <span className="w-2 h-2 rotate-45 bg-gangchil-gold/60" />
          <span className="w-1.5 h-1.5 rotate-45 border border-gangchil-earth/50" />
        </div>
        <div className="h-px bg-gangchill-ink/15 flex-grow" />
      </div>
    );
  }

  // Paddy grain subtle motif
  return (
    <div className={`flex items-center justify-center my-8 text-gangchil-gold/40 ${className}`}>
      <div className="h-px bg-gangchil-border flex-grow max-w-xs" />
      <div className="px-3 flex items-center gap-1">
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gangchil-gold">
          {/* Subtle paddy grains */}
          <path d="M4 6C4 3.5 7 1.5 10 1.5C10 4 7 6 4 6Z" fill="currentColor" fillOpacity="0.7" />
          <path d="M16 6C16 3.5 13 1.5 10 1.5C10 4 13 6 16 6Z" fill="currentColor" fillOpacity="0.7" />
          <path d="M4 6C4 8.5 7 10.5 10 10.5C10 8 7 6 4 6Z" fill="currentColor" fillOpacity="0.5" />
          <path d="M16 6C16 8.5 13 10.5 10 10.5C10 8 13 6 16 6Z" fill="currentColor" fillOpacity="0.5" />
          <circle cx="10" cy="6" r="1.5" fill="#0B192C" />
        </svg>
      </div>
      <div className="h-px bg-gangchil-border flex-grow max-w-xs" />
    </div>
  );
};
