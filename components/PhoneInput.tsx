'use client';

import React from 'react';
import RPNInput, { Value } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';

interface CustomPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "712345678",
  required = false,
  disabled = false,
  className
}: CustomPhoneInputProps) {
  return (
    <div className={cn(
      "relative flex items-center w-full rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-yellow-600 focus-within:ring-3 focus-within:ring-yellow-600/30 transition-all overflow-hidden h-12",
      className
    )}>
      <RPNInput
        international={false}
        defaultCountry="LK"
        country="LK"
        countryCallingCodeEditable={false}
        countries={['LK']}
        value={value as Value}
        onChange={(val) => onChange(val || '')}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full h-full flex items-center text-xs sm:text-sm font-medium text-slate-900 custom-phone-input"
      />
    </div>
  );
}
