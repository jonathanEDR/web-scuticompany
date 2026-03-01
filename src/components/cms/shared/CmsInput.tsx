import React from 'react';

interface CmsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  charCount?: { current: number; max: number };
  focusColor?: string; // amber, blue, green, purple (default: blue)
}

const focusRingMap: Record<string, string> = {
  amber: 'focus:ring-amber-500',
  blue: 'focus:ring-blue-500',
  green: 'focus:ring-green-500',
  purple: 'focus:ring-purple-500',
};

const CmsInput: React.FC<CmsInputProps> = ({
  label,
  hint,
  charCount,
  focusColor = 'blue',
  className = '',
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
      <input
        {...props}
        className={`w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 ${ringClass} focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${className}`}
      />
      {(hint || charCount) && (
        <div className="flex justify-between mt-0.5">
          {hint && <p className="text-[11px] text-gray-400 dark:text-gray-500">{hint}</p>}
          {charCount && (
            <p className={`text-[11px] ml-auto ${charCount.current > charCount.max * 0.9 ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}`}>
              {charCount.current}/{charCount.max}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CmsInput;
