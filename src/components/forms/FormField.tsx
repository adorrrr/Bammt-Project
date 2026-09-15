import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, required, id, className = '', ...props }, ref) => {
    const inputId = id || `field-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="w-full space-y-1.5 text-left">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gangchil-text"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`
            w-full px-3.5 py-2.5 rounded-natural bg-white text-gangchil-text border text-base sm:text-sm
            transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gangchil-green/20 focus:border-gangchil-green
            placeholder:text-gangchil-text-muted/60 disabled:bg-gray-50 disabled:text-gray-400
            ${error ? 'border-red-500 bg-red-50/20' : 'border-gangchil-border'}
            ${className}
          `}
          {...props}
        />
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-gangchil-text-muted">{helperText}</p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-red-600 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
