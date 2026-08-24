"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-white md:bg-[#f8fafc] overflow-hidden">
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
            <div className="inline-block border border-yellow-500/80 rounded-full px-4 py-1.5">
              <span className="text-yellow-500 text-caption font-bold tracking-wider uppercase">
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
          <div className="mt-auto pt-10 pb-6 md:pb-10 border-t border-slate-700/50">
            <div className="flex items-center gap-3 text-slate-300 text-body-sm">
              <ShieldCheck className="w-5 h-5 text-yellow-500 shrink-0" />
              <span>National standard court mats & equipment setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane (Form) */}
      <div className="w-full h-full md:w-[55%] lg:w-[50%] flex flex-col p-0 md:p-8 lg:p-12 relative overflow-hidden">
        
        {/* Mobile Back Button (only visible on mobile, replacing the desktop one which is in the left pane) */}
        <div className="md:hidden pt-6 px-6 pb-2 shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-800 hover:text-slate-900 transition group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-body-sm">Back</span>
          </Link>
        </div>

        <div className="w-full flex-1 flex flex-col justify-center md:justify-start md:h-auto md:max-w-140 bg-white md:rounded-2xl md:shadow-[0_0_20px_rgba(30,58,138,0.4)] px-6 py-4 md:p-8 lg:p-10 z-10 md:m-auto relative overflow-y-auto md:overflow-visible">

          <div className="mb-4 md:mb-6 shrink-0">
            <h2 className="text-2xl md:text-title font-extrabold text-[#0f172a] mb-1.5 tracking-tight">Create Your Account</h2>
            <p className="text-slate-500 text-sm md:text-body leading-snug">Join KEYS Club and start booking badminton courts</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-caption font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Suresh Perera"
                  className="h-11 bg-white text-body-sm"
                />
              </div>

              <div>
                <label className="block text-caption font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <Input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  className="h-11 bg-white text-body-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-caption font-bold text-slate-900 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="suresh@gmail.com"
                className="h-11 bg-white text-body-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-caption font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="block w-full px-4 py-2.5 pr-12 rounded-lg border border-slate-200 bg-white text-slate-900 text-body-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-slate-400"
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
                <label className="block text-caption font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="block w-full px-4 py-2.5 pr-12 rounded-lg border border-slate-200 bg-white text-slate-900 text-body-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-slate-400"
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

            <div className="pt-1">
              <Button
                type="submit"
                className="w-full h-11 md:h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-sm md:text-body"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-4 md:mt-8 text-center shrink-0">
            <p className="text-slate-500 text-xs md:text-body-sm">
              Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
