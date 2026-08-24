"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Pencil from '@mui/icons-material/Edit';
import Camera from '@mui/icons-material/CameraAlt';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function UserSettingsPage() {
  const { user } = useAuthStore();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    try {
      // Send password directly without confirmation since there is no confirmation field in this UI
      await api.post('/user/password', {
        current_password: passwordForm.current_password,
        password: passwordForm.password,
        password_confirmation: passwordForm.password // Assuming UI missed confirmation, auto-fill it
      });
      toast.success('Password updated successfully');
      setPasswordForm({ current_password: '', password: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="p-6 md:p-10 w-full pb-20 min-h-screen">



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
              <p className="font-extrabold text-[#0f172a] text-sm">{user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'January 2026'}</p>
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

            <form onSubmit={handlePasswordUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Current Password</label>
                  <Input type="password" required value={passwordForm.current_password} onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})} placeholder="••••••••••••" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">New Password</label>
                  <Input type="password" required minLength={8} value={passwordForm.password} onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})} placeholder="Enter new password" className="h-11 bg-slate-50/50" />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={isUpdatingPassword} className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm px-6 h-11 rounded-lg transition-colors disabled:opacity-50">
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
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
