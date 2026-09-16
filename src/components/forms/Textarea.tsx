import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, required, id, rows = 3, className = '', ...props }, ref) => {
    const textareaId = id || `textarea-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="w-full space-y-1.5 text-left">
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gangchil-text"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`
            w-full px-3.5 py-2.5 rounded-natural bg-white text-gangchil-text border text-base sm:text-sm
            transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gangchil-green/20 focus:border-gangchil-green
            placeholder:text-gangchil-text-muted/60 disabled:bg-gray-50 disabled:text-gray-400 resize-y
            ${error ? 'border-red-500 bg-red-50/20' : 'border-gangchil-border'}
            ${className}
          `}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-gangchil-text-muted">{helperText}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-red-600 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
