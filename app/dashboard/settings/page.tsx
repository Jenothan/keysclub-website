"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Pencil, Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/authStore';

export default function UserSettingsPage() {
  const { user } = useAuthStore();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(false);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto pb-20 min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your personal information and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column - Profile Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8">

          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden mb-4 group cursor-pointer">
              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-[#0f172a] mb-2 tracking-tight">{user?.name}</h2>
            <span className="bg-amber-50 text-amber-600 font-extrabold text-[11px] px-3 py-1 rounded-full border border-amber-100">
              {user?.role}
            </span>
          </div>

          <div className="w-full h-px bg-slate-100 mb-6"></div>

          <div className="space-y-5 mb-8">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
              <p className="font-extrabold text-[#0f172a] text-sm">{user?.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</p>
              <p className="font-extrabold text-[#0f172a] text-sm">{user?.phone}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Role</p>
              <p className="font-extrabold text-[#0f172a] text-sm">{user?.role}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
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
            <p className="text-slate-500 text-sm mb-6">Keep your account secure by updating your password regularly.</p>

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

          {/* Notification Preferences Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8">
            <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-2">Notification Preferences</h2>
            <p className="text-slate-500 text-sm mb-6">Choose how you'd like to receive booking updates, reminders, and club news.</p>

            <div className="space-y-0 divide-y divide-slate-100">

              <div className="py-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Email Notifications</h3>
                  <p className="text-xs text-slate-500 mt-1">Receive receipts, detailed booking confirmations, and monthly statements.</p>
                </div>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>

              <div className="py-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0f172a]">SMS Reminders</h3>
                  <p className="text-xs text-slate-500 mt-1">Get quick mobile text alerts 2 hours before your scheduled play session.</p>
                </div>
                <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
              </div>

              <div className="py-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0f172a]">WhatsApp Updates</h3>
                  <p className="text-xs text-slate-500 mt-1">Receive direct instant message notifications for court approval & schedule shifts.</p>
                </div>
                <Switch checked={whatsappNotif} onCheckedChange={setWhatsappNotif} />
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
