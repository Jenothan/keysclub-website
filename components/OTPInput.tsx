import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  otp: string[];
  setOtp: (otp: string[]) => void;
  onComplete?: (otpString: string) => void;
}

export function OTPInput({ length = 6, otp, setOtp, onComplete }: OTPInputProps) {
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize otp array if it doesn't match length
  useEffect(() => {
    if (otp.length !== length) {
      setOtp(Array(length).fill(''));
    }
  }, [length, otp.length, setOtp]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const val = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < length - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(v => v !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < length) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    const focusIndex = Math.min(pastedData.length, length - 1);
    otpRefs.current[focusIndex]?.focus();

    if (newOtp.every(v => v !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { otpRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[i] || ''}
          onChange={(e) => handleOtpChange(i, e.target.value)}
          onKeyDown={(e) => handleOtpKeyDown(i, e)}
          onPaste={handleOtpPaste}
          className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg text-center text-lg font-bold border transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
            otp[i] ? 'border-blue-500 text-[#0f172a] bg-white' : 'border-slate-200 bg-slate-50/50 text-[#0f172a]'
          }`}
        />
      ))}
    </div>
  );
}
