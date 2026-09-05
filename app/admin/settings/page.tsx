"use client";

import React, { useState, useEffect } from 'react';
import Camera from '@mui/icons-material/CameraAlt';
import Save from '@mui/icons-material/Save';
import Phone from '@mui/icons-material/Phone';
import Mail from '@mui/icons-material/Email';
import Pencil from '@mui/icons-material/Edit';
import Lock from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { user, setUser } = useAuthStore();

  // Profile Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Update State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
    }
  }, [user]);

  const handleOpenEditModal = () => {
    if (user) {
      setProfileName(user.name || '');
    }
    setIsEditModalOpen(true);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await api.put('/user', {
        name: profileName.trim(),
      });
      
      toast.success(response.data.message || 'Profile updated successfully!');
      
      if (response.data.user) {
        setUser(response.data.user);
      }
      
      setIsEditModalOpen(false);
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to update profile';
      toast.error(errMsg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.current_password) {
      toast.error('Please enter your current password');
      return;
    }

    if (passwordForm.password.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('New password and Confirm password do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await api.post('/user/password', passwordForm);
      toast.success(response.data.message || 'Password updated successfully!');
      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to update password. Please check your current password.';
      toast.error(errMsg);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-6 sm:space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
          Admin Profile & Security Settings
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Manage your administrator account details, profile credentials, and password security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column - Profile Summary Card */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8">
          
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-yellow-400 flex items-center justify-center border-4 border-white shadow-md overflow-hidden mb-3.5 group">
              <span className="text-slate-900 font-black text-xl sm:text-3xl">{initials}</span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#0f172a] mb-1 tracking-tight text-center">
              {user?.name || 'Super Admin'}
            </h2>
            <span className="bg-yellow-400/20 text-[#0f172a] font-extrabold text-[10px] sm:text-[11px] px-3 py-0.5 rounded-full border border-yellow-400/40 uppercase tracking-wider">
              {user?.role || 'Administrator'}
            </span>
          </div>

          <div className="w-full h-px bg-slate-100 mb-5 sm:mb-6"></div>

          <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                <PersonIcon className="w-3.5 h-3.5 text-slate-400" /> Full Name
              </p>
              <p className="font-extrabold text-[#0f172a] text-xs sm:text-sm">{user?.name || 'Super Admin'}</p>
            </div>

            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile Number
              </p>
              <p className="font-extrabold text-[#0f172a] text-xs sm:text-sm">{user?.phone || '+94 76 332 6098'}</p>
            </div>

            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                <ShieldIcon className="w-3.5 h-3.5 text-slate-400" /> Account Status
              </p>
              <div className="inline-flex items-center gap-1 text-emerald-600 font-extrabold text-[11px] sm:text-xs bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                <CheckCircleIcon className="w-3.5 h-3.5" /> Active & Verified
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleOpenEditModal}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs sm:text-sm h-11 sm:h-12 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Pencil className="w-4 h-4" /> Edit Profile Details
          </button>

        </div>

        {/* Right Column - Security & Password Change */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6 w-full">
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-400/10 text-yellow-600 border border-yellow-400/20 rounded-xl flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-extrabold text-[#0f172a] tracking-tight">Security & Change Password</h2>
                <p className="text-slate-500 text-xs font-medium">Keep your administrator account secure by updating your password regularly.</p>
              </div>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-5 sm:space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider">Current Password</label>
                <Input 
                  type="password" 
                  required
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  placeholder="Enter current password" 
                  className="h-11 bg-slate-50/50 focus:border-yellow-400 text-xs sm:text-sm font-medium rounded-xl" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider">New Password</label>
                  <Input 
                    type="password" 
                    required
                    minLength={8}
                    value={passwordForm.password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                    placeholder="Enter new password (min. 8 chars)" 
                    className="h-11 bg-slate-50/50 focus:border-yellow-400 text-xs sm:text-sm font-medium rounded-xl" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider">Confirm New Password</label>
                  <Input 
                    type="password" 
                    required
                    minLength={8}
                    value={passwordForm.password_confirmation}
                    onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                    placeholder="Re-enter new password to confirm" 
                    className="h-11 bg-slate-50/50 focus:border-yellow-400 text-xs sm:text-sm font-medium rounded-xl" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  disabled={isUpdatingPassword}
                  className="w-full sm:w-auto bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-8 h-11 sm:h-12 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                </Button>
              </div>

            </form>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-5 sm:p-8 shadow-2xl border border-slate-100">
          <DialogHeader className="border-b border-slate-100 pb-3 mb-3">
            <DialogTitle className="text-lg sm:text-xl font-black text-[#0f172a] flex items-center gap-2">
              <Pencil className="w-5 h-5 text-yellow-500" /> Edit Admin Profile
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs mt-0.5">
              Update your administrator name.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider">Full Name</label>
              <Input 
                type="text" 
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter full name" 
                className="h-11 bg-slate-50/50 focus:border-yellow-400 text-xs sm:text-sm font-medium rounded-xl" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider">Mobile Number</label>
              <Input 
                type="text" 
                disabled
                value={user?.phone || ''}
                className="h-11 bg-slate-100 text-slate-500 text-xs sm:text-sm font-medium cursor-not-allowed rounded-xl" 
              />
              <p className="text-[10px] text-slate-400 font-medium">Mobile number is verified with account security.</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
