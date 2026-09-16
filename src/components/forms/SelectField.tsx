import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[] | string[];
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, helperText, required, id, className = '', ...props }, ref) => {
    const selectId = id || `select-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="w-full space-y-1.5 text-left">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gangchil-text"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`
              w-full px-3.5 py-2.5 rounded-natural bg-white text-gangchil-text border text-base sm:text-sm appearance-none
              transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gangchil-green/20 focus:border-gangchil-green
              disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer
              ${error ? 'border-red-500 bg-red-50/20' : 'border-gangchil-border'}
              ${className}
            `}
            {...props}
          >
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value;
              const labelText = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={value} value={value}>
                  {labelText}
                </option>
              );
            })}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gangchil-text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
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

SelectField.displayName = 'SelectField';
