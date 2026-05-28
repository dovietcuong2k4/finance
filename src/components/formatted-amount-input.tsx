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

  return (
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
  );
}
