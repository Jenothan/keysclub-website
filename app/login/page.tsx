"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import ShieldCheck from '@mui/icons-material/GppGood';
import Eye from '@mui/icons-material/Visibility';
import EyeOff from '@mui/icons-material/VisibilityOff';
import KeyRound from '@mui/icons-material/VpnKey';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { OTPInput } from '@/components/OTPInput';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { formatPhoneWithCountryCode } from '@/lib/phoneUtils';
import PhoneInput from '@/components/PhoneInput';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();

  // Forgot Password State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'mobile' | 'otp'>('mobile');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState<string[]>(Array(4).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/login', {
        phone: formatPhoneWithCountryCode(mobile),
        password: password
      });

      const { access_token, user } = response.data;

      setAuth(user, access_token);
      toast.success('Login successful!');

      if (user.role === 'Super Admin' || user.role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotLoading(true);
    try {
      await api.post('/password/forgot/request-otp', {
        phone: formatPhoneWithCountryCode(forgotPhone),
      });
      setForgotStep('otp');
      toast.success('OTP sent to your mobile number');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Make sure phone number is registered.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = forgotOtp.join('');
    if (otpCode.length !== 4) {
      toast.error('Please enter complete 4-digit OTP');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsForgotLoading(true);
    try {
      await api.post('/password/forgot/reset', {
        phone: formatPhoneWithCountryCode(forgotPhone),
        otp_code: otpCode,
        password: newPassword,
      });
      toast.success('Password reset successfully! Please login with your new password.');
      setIsForgotModalOpen(false);
      setMobile(forgotPhone);
      setPassword('');
      setForgotStep('mobile');
      setForgotOtp(Array(4).fill(''));
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen bg-white md:bg-[#f8fafc]">

      {/* Left Pane (Form) */}
      <div className="w-full h-full md:w-[55%] lg:w-[50%] flex flex-col justify-center items-center p-4 md:p-10 lg:p-14 relative overflow-y-auto">

        {/* Back Button */}
        <div className="absolute top-6 left-6 md:top-10 md:left-12 z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-800 hover:text-slate-900 transition group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-body-sm">Back</span>
          </Link>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-slate-100 p-8 md:p-10 lg:p-12 z-10 my-auto">

          <div className="mb-8 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">Login to manage your badminton bookings and details</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <PhoneInput
                required
                value={mobile}
                onChange={(val) => setMobile(val)}
                placeholder="712345678"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 text-sm md:text-base bg-slate-50 focus:bg-white focus:border-yellow-400 focus:ring-yellow-400 font-medium pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(true);
                  setForgotStep('mobile');
                  setForgotPhone(mobile);
                }}
                className="text-sm font-extrabold text-yellow-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold text-base shadow-sm cursor-pointer"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>

          <div className="my-8 flex items-center">
            <div className="grow border-t border-slate-100"></div>
            <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">or</span>
            <div className="grow border-t border-slate-100"></div>
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account? <Link href="/signup" className="text-yellow-400 font-extrabold hover:underline">Sign Up</Link>
            </p>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={isForgotModalOpen} onOpenChange={setIsForgotModalOpen}>
        <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">Forgot Password</DialogTitle>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8 text-center relative w-full overflow-hidden">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-extrabold text-[#0f172a] mb-1.5">Reset Password</h2>

            {forgotStep === 'mobile' ? (
              <form onSubmit={handleRequestForgotOtp} className="space-y-4 text-left pt-2">
                <p className="text-slate-500 text-sm text-center mb-4">
                  Enter your registered mobile number to receive a verification OTP.
                </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Mobile Number
                    </label>
                    <PhoneInput
                      required
                      value={forgotPhone}
                      onChange={(val) => setForgotPhone(val)}
                      placeholder="712345678"
                    />
                  </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-xl transition-all text-sm shadow-sm"
                  >
                    {isForgotLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-left pt-2">
                <p className="text-slate-500 text-sm text-center mb-4">
                  An OTP has been sent to <span className="font-bold text-slate-700">{forgotPhone}</span>.
                </p>

                <div className="flex flex-col items-center py-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Enter 4-Digit OTP
                  </label>
                  <OTPInput length={4} otp={forgotOtp} setOtp={setForgotOtp} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 bg-white"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setForgotStep('mobile')}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="flex-1 py-2.5 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold rounded-xl transition-all text-sm shadow-sm"
                  >
                    {isForgotLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Right Pane (Image Background) */}
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
          <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-auto gap-4 pt-4 md:pt-10">
            {/* Pill */}
            <div className="inline-block border border-yellow-400/80 rounded-full px-4 py-1.5">
              <span className="text-yellow-400 text-caption font-bold tracking-wider uppercase">
                KEYS Sports Initiative
              </span>
            </div>
          </div>

          {/* Middle Content */}
          <div className="my-auto mt-24 md:mt-auto pt-16 md:pt-0">
            <div className="flex items-center gap-3 mb-10">
              <Image
                src="/logo.png"
                alt="KEYS Club Logo"
                width={64}
                height={64}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl leading-none tracking-tight text-white mb-1">KEYS CLUB</span>
                <span className="text-caption text-yellow-400 font-bold uppercase tracking-widest">KARANAVAI EAST YOUTH SPORTS CLUB</span>
              </div>
            </div>

            <h1 className="text-display font-black text-white mb-6 tracking-tight leading-tight">
              Play <span className="text-slate-400 font-normal px-2">•</span> Grow <span className="text-slate-400 font-normal px-2">•</span> Win
            </h1>

            <p className="max-w-md text-slate-300 leading-relaxed text-body">
              Welcome to KEYS Club — your premier home for professional badminton court bookings, tournament organization, and community sports development in Karaveddy.
            </p>
          </div>

          {/* Bottom Footer Area */}
          <div className="mt-auto pt-12 pb-6 md:pb-10 border-t border-slate-700/50">
            <div className="flex items-center gap-3 text-slate-300 text-body-sm">
              <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
              <span>National standard court mats & equipment setup</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
