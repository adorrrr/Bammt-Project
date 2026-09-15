import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-natural transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white font-semibold hover:from-blue-800 hover:to-blue-800 focus-visible:ring-gangchill-blue shadow-xs active:scale-[0.98]',
    secondary: 'liquid-glass text-gangchill-blue font-semibold hover:bg-white focus-visible:ring-gangchill-blue border border-gangchill-border shadow-xs',
    outline: 'bg-transparent text-gangchill-ink font-semibold border border-gangchill-ink/20 hover:border-gangchill-blue hover:text-gangchill-blue hover:bg-blue-50/50 focus-visible:ring-gangchill-blue',
    gold: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-700 hover:to-blue-700 focus-visible:ring-gangchill-cyan shadow-xs',
    ghost: 'bg-transparent text-gangchill-ink font-medium hover:bg-white/80 hover:text-gangchill-blue focus-visible:ring-gangchill-blue'
  };

  const sizes = {
    sm: 'text-sm px-3.5 py-2 min-h-[40px] gap-1.5',
    md: 'text-base px-5 py-2.5 min-h-[48px] gap-2',
    lg: 'text-lg px-6 py-3.5 min-h-[54px] gap-2.5 font-semibold'
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
