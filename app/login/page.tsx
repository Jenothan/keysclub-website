"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import ShieldCheck from '@mui/icons-material/GppGood';
import Eye from '@mui/icons-material/Visibility';
import EyeOff from '@mui/icons-material/VisibilityOff';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/login', {
        phone: mobile,
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

  return (
    <div className="flex flex-col-reverse md:flex-row h-dvh bg-white md:bg-[#f8fafc] overflow-hidden">

      {/* Left Pane (Form) */}
      <div className="w-full h-full md:w-[55%] lg:w-[50%] flex flex-col p-0 md:p-8 lg:p-12 relative overflow-hidden">

        {/* Back Button */}
        <div className="pt-6 px-6 pb-2 md:p-0 md:absolute md:top-10 md:left-12 z-10 shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-800 hover:text-slate-900 transition group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-body-sm">Back</span>
          </Link>
        </div>

        <div className="w-full flex-1 flex flex-col justify-center md:justify-start md:h-auto md:max-w-120 bg-white md:rounded-2xl md:shadow-[0_0_20px_rgba(30,58,138,0.4)] px-6 py-4 md:p-10 z-10 md:m-auto relative overflow-y-auto md:overflow-visible">

          <div className="mb-6 md:mb-8 shrink-0">
            <h2 className="text-2xl md:text-title font-extrabold text-[#0f172a] mb-1.5 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-sm md:text-body leading-snug">Login to manage your badminton bookings and details</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-caption font-bold text-slate-900 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <Input
                type="tel"
                placeholder="+94 77 123 4567"
                className="h-12 bg-white text-body-sm"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-caption font-bold text-slate-900 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 bg-white text-body-sm pr-12"
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
              <Link href="#" className="text-body-sm font-bold text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 md:h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-sm md:text-body"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>

          <div className="my-6 md:my-8 flex items-center shrink-0">
            <div className="grow border-t border-slate-100"></div>
            <span className="px-4 text-xs md:text-caption text-slate-400">or</span>
            <div className="grow border-t border-slate-100"></div>
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-body-sm">
              Don't have an account? <Link href="/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
            </p>
          </div>

        </div>
      </div>

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
            <div className="inline-block border border-yellow-500/80 rounded-full px-4 py-1.5">
              <span className="text-yellow-500 text-caption font-bold tracking-wider uppercase">
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
                <span className="text-caption text-yellow-500 font-bold uppercase tracking-widest">KARANAVAI EAST YOUTH SPORTS CLUB</span>
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
          <div className="mt-auto pt-12 pb-6 md:pb-10 border-t border-slate-700/50">
            <div className="flex items-center gap-3 text-slate-300 text-body-sm">
              <ShieldCheck className="w-5 h-5 text-yellow-500 shrink-0" />
              <span>National standard court mats & equipment setup</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
