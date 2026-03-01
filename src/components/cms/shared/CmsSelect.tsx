import React from 'react';

interface CmsSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  focusColor?: string;
  options?: { value: string; label: string }[];
}

const focusRingMap: Record<string, string> = {
  amber: 'focus:ring-amber-500',
  blue: 'focus:ring-blue-500',
  green: 'focus:ring-green-500',
  purple: 'focus:ring-purple-500',
};

const CmsSelect: React.FC<CmsSelectProps> = ({
  label,
  hint,
  focusColor = 'blue',
  options,
  className = '',
  children,
  ...props
}) => {
  const ringClass = focusRingMap[focusColor] || focusRingMap.blue;

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 ${ringClass} focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${className}`}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {hint && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{hint}</p>}
    </div>
  );
};

export default CmsSelect;
