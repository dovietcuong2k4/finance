'use client';

import React, { useState } from 'react';

interface FormattedAmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  defaultValue?: string;
  name: string;
  placeholder?: string;
  className?: string;
}

export default function FormattedAmountInput({
  defaultValue = '',
  name,
  placeholder,
  className,
  ...props
}: FormattedAmountInputProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw) {
      const formatted = new Intl.NumberFormat('vi-VN').format(Number(raw));
      setValue(formatted);
    } else {
      setValue('');
    }
  };

  const numericValue = Number(value.replace(/\D/g, ''));

  const getAmountSuggestions = () => {
    if (!numericValue || numericValue >= 10000000) return [];
    return Array.from(new Set([
      numericValue * 1000,
      numericValue * 10000,
      numericValue * 100000,
      numericValue * 1000000
    ])).filter(val => val >= 1000 && val <= 10000000000).slice(0, 3);
  };

  const suggestions = getAmountSuggestions();

  return (
    <div className="relative w-full">
      <input
        {...props}
        type="text"
        inputMode="numeric"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
      />
      {suggestions.length > 0 && (
        <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-1 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {suggestions.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setValue(new Intl.NumberFormat('vi-VN').format(val))}
              className="whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold text-gray-800 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 cursor-pointer shadow-sm"
            >
              {new Intl.NumberFormat('vi-VN').format(val)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

