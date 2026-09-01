"use client";

import React, { useState } from 'react';
import Camera from '@mui/icons-material/CameraAlt';
import Save from '@mui/icons-material/Save';
import Phone from '@mui/icons-material/Phone';
import Mail from '@mui/icons-material/Email';
import MapPin from '@mui/icons-material/LocationOn';
import DollarSign from '@mui/icons-material/AttachMoney';
import Clock from '@mui/icons-material/AccessTime';
import Pencil from '@mui/icons-material/Edit';
import { Input } from '@/components/ui/input';

export default function AdminSettingsPage() {

  return (
    <div className="p-6 md:p-10 w-full space-y-8 pb-20 min-h-screen">
      


      <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8">
              
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-28 h-28 rounded-full bg-yellow-400 flex items-center justify-center border-4 border-white shadow-md overflow-hidden mb-4 group cursor-pointer">
                  <div className="text-slate-900 font-extrabold text-4xl">AD</div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Super Admin</h2>
                <span className="bg-yellow-400/20 text-slate-900 font-extrabold text-[11px] px-3 py-1 rounded-full border border-yellow-400">
                  System Administrator
                </span>
              </div>

              <div className="w-full h-px bg-slate-100 mb-6"></div>

              <div className="space-y-5 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="font-extrabold text-[#0f172a] text-sm">Super Admin</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</p>
                  <p className="font-extrabold text-[#0f172a] text-sm">+94 76 332 6098</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="font-extrabold text-[#0f172a] text-sm">admin@keysclub.lk</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Role Since</p>
                  <p className="font-extrabold text-[#0f172a] text-sm">January 2024</p>
                </div>
              </div>

              <button className="w-full bg-[#facc15] hover:bg-[#eab308] text-[#0f172a] font-bold text-sm h-12 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>

            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Security & Password Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8">
                <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-2">Security & Change Password</h2>
                <p className="text-slate-500 text-sm mb-6">Keep your admin account secure by updating your password regularly.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0f172a]">Current Password</label>
                    <Input type="password" placeholder="••••••••••••" className="h-11 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0f172a]">New Password</label>
                    <Input type="password" placeholder="Enter new password" className="h-11 bg-slate-50/50" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm px-6 h-11 rounded-lg transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

            </div>
          </div>
      </div>
    </div>
  );
}
