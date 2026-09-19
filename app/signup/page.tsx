"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import ShieldCheck from '@mui/icons-material/GppGood';
import Eye from '@mui/icons-material/Visibility';
import EyeOff from '@mui/icons-material/VisibilityOff';
import KeyRound from '@mui/icons-material/VpnKey';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OTPInput } from '@/components/OTPInput';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { formatPhoneWithCountryCode } from '@/lib/phoneUtils';
import PhoneInput from '@/components/PhoneInput';

export default function SignUpPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, token, setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({ name: '', mobile: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && token) {
      router.replace('/');
    }
  }, [mounted, token, router]);

  if (!mounted || token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/register/request-otp', {
        name: formData.name,
        phone: formatPhoneWithCountryCode(formData.mobile),
        password: formData.password,
      });
      setStep('otp');
      toast.success('OTP sent to your mobile number');
    } catch (error: any) {
      const msg = error.response?.data?.message
        || error.response?.data?.errors?.phone?.[0]
        || 'Failed to request OTP';

      const lower = msg.toLowerCase();
      if (lower.includes('already taken') || lower.includes('already registered') || lower.includes('already exists') || lower.includes('in use')) {
        toast.warning(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 4) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/register/verify', {
        name: formData.name,
        phone: formatPhoneWithCountryCode(formData.mobile),
        password: formData.password,
        otp_code: otpCode,
      });
      setAuth(res.data.user, res.data.access_token);
      toast.success('Account created successfully');
      
      const shouldOpenMembership = typeof window !== 'undefined' && 
        (sessionStorage.getItem('open_membership_modal') === 'true' || window.location.search.includes('redirect=membership'));

      if (shouldOpenMembership) {
        router.push('/availability?open_membership=true');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col lg:landscape:flex-row justify-center items-stretch">
      {/* Left Pane (Image Background) */}
      <div className="hidden lg:landscape:flex relative w-full lg:landscape:w-[50%] min-h-screen bg-[#0f172a] flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden shrink-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/login-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark Blue Overlay */}
        <div className="absolute inset-0 bg-[#0f172a]/70 z-0" />

        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex justify-between items-center w-full">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition group shrink-0">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold text-sm">Back</span>
            </Link>

            {/* Pill */}
            <div className="inline-block border border-yellow-400/80 rounded-full px-4 py-1.5 shrink-0">
              <span className="text-yellow-400 text-xs font-bold tracking-wider uppercase">
                KEYS Sports Initiative
              </span>
            </div>
          </div>

          {/* Middle Content */}
          <div className="my-auto py-4">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.png"
                alt="KEYS Club Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl leading-none tracking-tight text-white mb-1">KEYS CLUB</span>
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">KARANAVAI EAST YOUTH SPORTS CLUB</span>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
              Play <span className="text-slate-400 font-normal px-1.5">•</span> Grow <span className="text-slate-400 font-normal px-1.5">•</span> Win
            </h1>

            <p className="max-w-md text-slate-300 leading-relaxed text-sm lg:text-base">
              Welcome to KEYS Club — your premier home for professional badminton court bookings, tournament organization, and community sports development in Karaveddy.
            </p>
          </div>

          {/* Bottom Footer Area */}
          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
              <span>National standard court mats & equipment setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane (Form) */}
      <div className="w-full min-h-screen lg:landscape:w-[50%] flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10 relative">

        {/* Back Button (Only visible on mobile/portrait when side image is hidden) */}
        <div className="lg:landscape:hidden absolute top-6 left-6 md:top-10 md:left-12 z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-800 hover:text-slate-900 transition group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Back</span>
          </Link>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8 md:p-8 lg:p-9 z-10 my-auto">

          {step === 'details' ? (
            <>
              <div className="mb-5 text-left shrink-0">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] mb-1.5 tracking-tight">Create Your Account</h2>
                <p className="text-slate-500 text-sm leading-relaxed">Join KEYS Club and start booking badminton courts</p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Suresh Perera"
                    className="h-11 bg-slate-50 focus:bg-white focus:border-yellow-400 focus:ring-yellow-400 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
                    Mobile Number
                  </label>
                  <PhoneInput
                    required
                    value={formData.mobile}
                    onChange={(val) => setFormData({ ...formData, mobile: val })}
                    placeholder="7xxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="block w-full h-11 px-4 pr-12 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="block w-full h-11 px-4 pr-12 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold text-base shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Create Account'}
                  </Button>
                </div>
              </form>

              <div className="mt-5 text-center shrink-0">
                <p className="text-slate-500 text-sm font-medium">
                  Already have an account? <Link href="/login" className="text-yellow-400 font-extrabold hover:underline">Login</Link>
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Verify Mobile Number</h2>
              <p className="text-slate-500 mb-6 max-w-sm text-sm">
                An OTP has been sent to <span className="font-bold text-slate-700">{formData.mobile}</span>. Please enter it below to verify your account.
              </p>

              <form onSubmit={handleVerifyOtp} className="w-full flex flex-col items-center space-y-5">
                <div>
                  <OTPInput length={4} otp={otp} setOtp={setOtp} />
                </div>

                <div className="flex gap-3 w-full max-w-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold rounded-xl transition-all shadow-sm text-sm cursor-pointer"
                  >
                    Verify & Create
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
