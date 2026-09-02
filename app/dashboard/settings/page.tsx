"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Pencil from '@mui/icons-material/Edit';
import Camera from '@mui/icons-material/CameraAlt';
import Close from '@mui/icons-material/Close';
import AlertCircle from '@mui/icons-material/ErrorOutlineOutlined';
import Phone from '@mui/icons-material/Phone';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function UserSettingsPage() {
  const { user, setUser } = useAuthStore();
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Edit Name & Email Profile States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Edit Phone Modal States (with OTP Verification)
  const [showEditModal, setShowEditModal] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [newPhoneInput, setNewPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  const handleOpenProfileEdit = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setShowProfileModal(true);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      toast.error('Name and Email are required');
      return;
    }
    setIsUpdatingProfile(true);
    try {
      const res = await api.put('/user', {
        name: editName.trim(),
        email: editEmail.trim(),
      });
      if (res.data.user && user) {
        setUser(res.data.user);
      }
      toast.success(res.data.message || 'Profile updated successfully!');
      setShowProfileModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleStartEdit = () => {
    setNewPhoneInput(user?.phone || '');
    setOtpInput('');
    setPhoneStep('INPUT');
    setShowEditModal(true);
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoneInput) return;
    setIsSubmittingPhone(true);
    try {
      await api.post('/user/phone/request-otp', {
        purpose: 'new_phone_verify',
        new_phone: newPhoneInput
      });
      setPhoneStep('OTP');
      toast.success('OTP sent to new mobile number');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) return;
    setIsSubmittingPhone(true);
    try {
      await api.post('/user/phone/verify-otp', {
        purpose: 'new_phone_verify',
        new_phone: newPhoneInput,
        otp: otpInput
      });
      if (user) {
        setUser({ ...user, phone: newPhoneInput });
      }
      toast.success('Mobile number updated successfully!');
      setShowEditModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.password.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('New password and confirm password do not match');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await api.post('/user/password', passwordForm);
      toast.success('Password updated successfully');
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full pb-20 min-h-screen">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column - Profile Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8">

          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden mb-4 group cursor-pointer">
              <div className="w-full h-full bg-yellow-400 flex items-center justify-center text-slate-900 text-3xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-[#0f172a] mb-1 tracking-tight">{user?.name}</h2>
          </div>

          <div className="w-full h-px bg-slate-100 mb-6"></div>

          <div className="space-y-5 mb-8">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
              <p className="font-extrabold text-[#0f172a] text-sm">{user?.name || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
              <p className="font-extrabold text-[#0f172a] text-sm">{user?.email || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</p>
              <p className="font-extrabold text-[#0f172a] text-sm">{user?.phone || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
              <p className="font-extrabold text-[#0f172a] text-sm">{user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'January 2026'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleOpenProfileEdit}
              className="w-full bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold text-sm h-11 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile Details
            </button>
            <button 
              onClick={handleStartEdit}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs h-10 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Change Mobile Number
            </button>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-6">

          {/* Security & Password Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8">
            <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-2">Security & Change Password</h2>
            <p className="text-slate-500 text-sm mb-6">Keep your account secure by updating your password regularly.</p>

            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Current Password</label>
                  <Input type="password" required value={passwordForm.current_password} onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})} placeholder="••••••••••••" className="h-11 bg-slate-50/50 font-medium" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0f172a]">New Password</label>
                    <Input type="password" required minLength={8} value={passwordForm.password} onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})} placeholder="Enter new password (min. 8 chars)" className="h-11 bg-slate-50/50 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0f172a]">Confirm New Password</label>
                    <Input type="password" required minLength={8} value={passwordForm.password_confirmation} onChange={(e) => setPasswordForm({...passwordForm, password_confirmation: e.target.value})} placeholder="Re-enter new password to confirm" className="h-11 bg-slate-50/50 font-medium" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={isUpdatingPassword} className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm px-6 h-11 rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm">
                  {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

      {/* Edit Profile & Mobile Number OTP Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Close className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#0f172a]">Update Mobile Number</h3>
                <p className="text-xs text-slate-500">Requires OTP Verification</p>
              </div>
            </div>

            {phoneStep === 'INPUT' ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-[#0f172a] mb-2 uppercase tracking-wider">
                    New Mobile Number
                  </label>
                  <Input 
                    type="tel"
                    required
                    placeholder="+94 7X XXX XXXX"
                    value={newPhoneInput}
                    onChange={(e) => setNewPhoneInput(e.target.value)}
                    className="h-12 bg-slate-50 font-bold focus:border-yellow-400 focus:ring-yellow-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">An OTP verification code will be generated for your new number.</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmittingPhone}
                    className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingPhone ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-5">
                <div className="flex items-start gap-3 bg-yellow-400/10 text-slate-800 p-4 rounded-xl border border-yellow-400 text-xs font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-400" />
                  <span>Enter the 4-digit OTP code sent to <strong>{newPhoneInput}</strong> to verify your new mobile number.</span>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0f172a] mb-2 uppercase tracking-wider text-center">
                    Enter 4-Digit OTP
                  </label>
                  <input 
                    type="text"
                    required
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="XXXX"
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-mono text-2xl tracking-[0.4em] text-center font-bold outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setPhoneStep('INPUT')}
                    className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmittingPhone}
                    className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingPhone ? 'Verifying...' : 'Verify & Save'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Name & Email Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Close className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 rounded-xl flex items-center justify-center">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#0f172a]">Edit Profile Details</h3>
                <p className="text-xs text-slate-500">Update your account name and email</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0f172a] mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <Input 
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-11 bg-slate-50 font-bold focus:border-yellow-400 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0f172a] mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <Input 
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="h-11 bg-slate-50 font-bold focus:border-yellow-400 focus:ring-yellow-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowProfileModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdatingProfile}
                  className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
