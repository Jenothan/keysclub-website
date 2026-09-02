'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Camera from '@mui/icons-material/CameraAlt';
import Lock from '@mui/icons-material/Lock';
import Phone from '@mui/icons-material/Phone';
import CheckCircle2 from '@mui/icons-material/CheckCircleOutlined';
import AlertCircle from '@mui/icons-material/ErrorOutlineOutlined';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';

type PhoneFlowState = 'INITIAL' | 'OLD_OTP' | 'NEW_PHONE' | 'NEW_OTP' | 'SUCCESS';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [phoneState, setPhoneState] = useState<PhoneFlowState>('INITIAL');
  const [currentPhone, setCurrentPhone] = useState(user?.phone || '');
  const [newPhoneInput, setNewPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpHint, setOtpHint] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Handlers for Phone OTP Flow
  const handleStartPhoneChange = () => setPhoneState('NEW_PHONE');
  
  const handleVerifyOldOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP verification delay
    setPhoneState('NEW_PHONE');
  };

  const handleSendNewPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/user/phone/request-otp', {
        purpose: 'new_phone_verify',
        new_phone: newPhoneInput
      });
      setOtpHint(res.data.otp_hint);
      setPhoneState('NEW_OTP');
      toast.success('OTP sent successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyNewOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/user/phone/verify-otp', {
        purpose: 'new_phone_verify',
        new_phone: newPhoneInput,
        otp: otpInput
      });
      setCurrentPhone(newPhoneInput);
      setPhoneState('SUCCESS');
      toast.success('Phone number updated successfully');
      setTimeout(() => {
        setPhoneState('INITIAL');
        setNewPhoneInput('');
        setOtpInput('');
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelPhoneChange = () => {
    setPhoneState('INITIAL');
    setNewPhoneInput('');
    setOtpInput('');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('Passwords do not match');
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

  if (!user) {
    return (
      <div className="p-6 md:p-10 w-full min-h-[60vh] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full space-y-10 pb-20">
      


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Basic Info & DP */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-8">
          
          {/* Profile Picture Section */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-6">
              <Image 
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-slate-50 shadow-md group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-[#0f172a]/70 p-3 rounded-full text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{user?.name}</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">Member since {user?.created_at ? new Date(user.created_at).getFullYear() : '2026'}</p>
            
            <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-lg transition-colors text-sm">
              Change Picture
            </button>
          </div>

        </div>

        {/* Right Column: Security & Settings */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          
          {/* Mobile Number Update Flow */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Mobile Number</h3>
                <p className="text-sm text-slate-500">Update your verified mobile number</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              {phoneState === 'INITIAL' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">Current Number</p>
                    <p className="text-xl font-bold text-slate-900">{currentPhone}</p>
                  </div>
                  <button 
                    onClick={handleStartPhoneChange}
                    className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
                  >
                    Change Number
                  </button>
                </div>
              )}

              {phoneState === 'OLD_OTP' && (
                <div></div> // Bypassed step for logged-in user in this flow
              )}

              {phoneState === 'NEW_PHONE' && (
                <form onSubmit={handleSendNewPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Enter New Mobile Number</label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="+94 7X XXX XXXX" 
                      value={newPhoneInput}
                      onChange={(e) => setNewPhoneInput(e.target.value)}
                      className="w-full max-w-sm bg-white border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 font-bold" 
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={isSubmitting} className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg transition-colors text-sm">
                      {isSubmitting ? 'Sending...' : 'Send OTP'}
                    </button>
                    <button type="button" onClick={cancelPhoneChange} className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-lg transition-colors text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {phoneState === 'NEW_OTP' && (
                <form onSubmit={handleVerifyNewOtp} className="space-y-4">
                  <div className="flex items-start gap-3 bg-yellow-400/10 text-slate-800 p-4 rounded-lg border border-yellow-400">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-400" />
                    <p className="text-sm font-medium">Please enter the OTP sent to your new number <strong>{newPhoneInput}</strong> to verify it.</p>
                  </div>

                  {otpHint && (
                    <div className="bg-yellow-400/10 border-2 border-yellow-400 text-slate-900 px-4 py-3 rounded-xl w-full max-w-xs font-mono text-center shadow-sm">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-0.5">Your OTP Code</p>
                      <p className="text-3xl font-black tracking-[0.3em] text-slate-900">{otpHint}</p>
                      <p className="text-[11px] text-slate-700 font-medium mt-0.5">SMS Gateway Pending • Code Shown Above</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Enter OTP</label>
                    <input required value={otpInput} onChange={(e) => setOtpInput(e.target.value)} type="text" placeholder="XXXX" className="w-full max-w-xs bg-white border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 text-lg tracking-widest font-mono text-center font-bold" maxLength={4} />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={isSubmitting} className="bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold px-6 py-2.5 rounded-lg transition-colors text-sm shadow-sm">
                      {isSubmitting ? 'Verifying...' : 'Verify & Save'}
                    </button>
                    <button type="button" onClick={cancelPhoneChange} className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-lg transition-colors text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {phoneState === 'SUCCESS' && (
                <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-bold">Mobile Number Updated</h4>
                    <p className="text-sm">Your new mobile number has been successfully verified.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
                <p className="text-sm text-slate-500">Ensure your account stays secure</p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                  <input type="password" required value={passwordForm.current_password} onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                  <input type="password" required minLength={8} value={passwordForm.password} onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                  <input type="password" required minLength={8} value={passwordForm.password_confirmation} onChange={(e) => setPasswordForm({...passwordForm, password_confirmation: e.target.value})} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 transition-colors" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={isUpdatingPassword} className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-lg transition-colors text-sm disabled:opacity-50">
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
