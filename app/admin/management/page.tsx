"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import ShieldAlert from '@mui/icons-material/GppBad';
import Plus from '@mui/icons-material/Add';
import Trash2 from '@mui/icons-material/Delete';
import ShieldCheck from '@mui/icons-material/GppGood';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import KeyRound from '@mui/icons-material/VpnKey';
import CheckCircle2 from '@mui/icons-material/CheckCircleOutlined';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { OTPInput } from '@/components/OTPInput';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import api from '@/lib/axios';
import { toast } from 'sonner';

type FormState = 'list' | 'details';

export default function AdminManagementPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formState, setFormState] = useState<FormState>('list');
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', password: '' });
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [error, setError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdmins = async () => {
    if (role !== 'Super Admin') return;
    try {
      const res = await api.get('/super-admin/managers');
      setAdmins(res.data);
    } catch (err) {
      toast.error('Failed to load administrators');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [role]);

  if (role !== 'Super Admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Access Denied</h1>
        <p className="text-slate-500 max-w-md mx-auto text-lg">
          You do not have the required permissions to view this page. Only Super Admins can access Admin Management.
        </p>
      </div>
    );
  }

  const isLimitReached = admins.length >= 5;

  const handleRemoveAdmin = async (id: number) => {
    if (admins.length <= 1) return;
    if (!confirm('Are you sure you want to remove this administrator?')) return;
    try {
      await api.delete(`/super-admin/managers/${id}`);
      setAdmins(admins.filter(a => a.id !== id));
      toast.success('Administrator removed successfully');
    } catch (err) {
      toast.error('Failed to remove administrator');
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/super-admin/managers/request-otp', {
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        password: formData.password
      });
      setIsOtpModalOpen(true);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 422) {
        toast.error(err.response.data.message || 'Maximum limit of 5 administrators reached.');
      } else {
        toast.error('Failed to request OTP');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    setIsSubmitting(true);
    try {
      await api.post('/super-admin/managers/verify-add', {
        phone: formData.mobile,
        otp_code: otpValue
      });
      toast.success('Administrator added successfully');
      setFormState('list');
      setIsOtpModalOpen(false);
      setFormData({ name: '', mobile: '', email: '', password: '' });
      setOtp(Array(4).fill(''));
      setError('');
      fetchAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 w-full pb-20 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-end mb-8">
        {formState === 'list' && (
          <button 
            onClick={() => setFormState('details')}
            disabled={isLimitReached}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm",
              isLimitReached 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900"
            )}
          >
            <Plus className="w-5 h-5" />
            Add New Admin
          </button>
        )}
      </div>

      {isLimitReached && formState === 'list' && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Maximum Limit Reached</h4>
            <p className="text-sm mt-1">You have reached the maximum limit of 5 administrators. You must remove an existing admin before adding a new one.</p>
          </div>
        </div>
      )}

      {/* --- View: Admin List --- */}
      {formState === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 pl-6">Admin Details</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-inner">
                          {admin.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#0f172a]">{admin.name}</div>
                          <div className="text-sm text-slate-500">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 text-xs font-bold rounded-lg",
                        admin.role === 'Super Admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      {admin.role !== 'Super Admin' && (
                        <button 
                          onClick={() => handleRemoveAdmin(admin.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Admin"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- View: Admin Details Form --- */}
      {formState === 'details' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <button 
              onClick={() => setFormState('list')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to List
            </button>
            <h2 className="text-2xl font-extrabold text-[#0f172a]">Enter Admin Details</h2>
            <p className="text-slate-500 text-sm mt-1">Provide the necessary information to create a new administrator account.</p>
          </div>
          
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="h-12 border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                <Input 
                  required
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  placeholder="+94 77 000 0000"
                  className="h-12 border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <Input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  className="h-12 border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Temporary Password</label>
                <Input 
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="h-12 border-slate-200"
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end border-t border-slate-100 mt-6">
              <button 
                type="submit"
                className="px-8 py-3 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold rounded-xl transition-all shadow-sm"
              >
                Continue to Verification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- View: OTP Verification Modal --- */}
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">OTP Verification</DialogTitle>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-10 text-center relative w-full overflow-hidden">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0f172a] mb-2">Verify Mobile Number</h2>
            <p className="text-slate-500 mb-8">
              An OTP has been sent to <span className="font-bold text-slate-700">{formData.mobile || 'the provided number'}</span>. Please enter it below to confirm creation.
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <OTPInput length={4} otp={otp} setOtp={setOtp} />
                {error && <p className="text-red-500 text-sm font-bold mt-4">{error}</p>}
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold rounded-xl transition-all shadow-sm"
                >
                  Verify & Add
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
