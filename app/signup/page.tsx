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

export default function SignUpPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        phone: formData.mobile,
        password: formData.password,
      });
      setStep('otp');
      toast.success('OTP sent to your mobile number');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request OTP');
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
        phone: formData.mobile,
        password: formData.password,
        otp_code: otpCode,
      });
      setAuth(res.data.user, res.data.access_token);
      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-dvh bg-white md:bg-[#f8fafc] overflow-hidden">
      {/* Left Pane (Image Background) */}
      <div className="hidden md:flex relative w-full md:w-[45%] lg:w-[50%] bg-[#0f172a] flex-col justify-center px-8 md:px-12 lg:px-20 py-12 md:py-0 overflow-hidden shrink-0">
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

        <div className="relative z-10 h-full flex flex-col">
          {/* Top Section */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-auto gap-4 pt-4 md:pt-10">
            {/* Back Button */}
            <div className="pt-6 px-6 pb-2 md:p-0 md:mb-auto flex-1">
              <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-body-sm">Back</span>
              </Link>
            </div>

            {/* Pill */}
            <div className="inline-block border border-yellow-400/80 rounded-full px-4 py-1.5">
              <span className="text-yellow-400 text-caption font-bold tracking-wider uppercase">
                KEYS Sports Initiative
              </span>
            </div>
          </div>

          {/* Middle Content */}
          <div className="my-auto mt-16 md:mt-auto pt-10 md:pt-0">
            <div className="flex items-center gap-3 mb-8">
              <Image
                src="/logo.png"
                alt="KEYS Club Logo"
                width={56}
                height={56}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-subtitle leading-none tracking-tight text-white mb-1">KEYS CLUB</span>
                <span className="text-caption text-yellow-400 font-bold uppercase tracking-widest">KARANAVAI EAST YOUTH SPORTS CLUB</span>
              </div>
            </div>

            <h1 className="text-display font-black text-white mb-6 tracking-tight leading-tight">
              Play <span className="text-slate-400 font-normal px-2">•</span> Grow <span className="text-slate-400 font-normal px-2">•</span> Win
            </h1>

            <p className="max-w-md text-slate-300 leading-relaxed text-body">
              Welcome to KEYS Club — your premier home for professional badminton court bookings, tournament organization, and community sports development in Point Pedro.
            </p>
          </div>

          {/* Bottom Footer Area */}
          <div className="mt-auto pt-10 pb-6 md:pb-10 border-t border-slate-700/50">
            <div className="flex items-center gap-3 text-slate-300 text-body-sm">
              <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
              <span>National standard court mats & equipment setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane (Form) */}
      <div className="w-full h-full md:w-[55%] lg:w-[50%] flex flex-col justify-center items-center p-4 md:p-10 lg:p-14 relative overflow-y-auto">
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 md:top-10 md:left-12 z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-800 hover:text-slate-900 transition group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-body-sm">Back</span>
          </Link>
        </div>

        <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-slate-100 p-8 md:p-10 lg:p-12 z-10 my-auto">

          {step === 'details' ? (
            <>
              <div className="mb-6 md:mb-8 text-left shrink-0">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Create Your Account</h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">Join KEYS Club and start booking badminton courts</p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Suresh Perera"
                      className="h-12 bg-slate-50 focus:bg-white focus:border-yellow-400 focus:ring-yellow-400 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                      Mobile Number
                    </label>
                    <Input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      placeholder="+94 77 123 4567"
                      className="h-12 bg-slate-50 focus:bg-white focus:border-yellow-400 focus:ring-yellow-400 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="suresh@gmail.com"
                    className="h-12 bg-slate-50 focus:bg-white focus:border-yellow-400 focus:ring-yellow-400 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••"
                        className="block w-full h-12 px-4 pr-12 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        placeholder="••••••••"
                        className="block w-full h-12 px-4 pr-12 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold text-base shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Create Account'}
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center shrink-0">
                <p className="text-slate-500 text-sm font-medium">
                  Already have an account? <Link href="/login" className="text-yellow-400 font-extrabold hover:underline">Login</Link>
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-6">
                <KeyRound className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Verify Mobile Number</h2>
              <p className="text-slate-500 mb-8 max-w-sm">
                An OTP has been sent to <span className="font-bold text-slate-700">{formData.mobile}</span>. Please enter it below to verify your account.
              </p>

              <form onSubmit={handleVerifyOtp} className="w-full flex flex-col items-center space-y-6">
                <div>
                  <OTPInput length={4} otp={otp} setOtp={setOtp} />
                </div>
                
                <div className="flex gap-3 w-full max-w-xs pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep('details')}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold rounded-xl transition-all shadow-sm"
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
