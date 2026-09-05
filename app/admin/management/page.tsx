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
import { formatPhoneWithCountryCode } from '@/lib/phoneUtils';
import PhoneInput from '@/components/PhoneInput';

type FormState = 'list' | 'details';

export default function AdminManagementPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formState, setFormState] = useState<FormState>('list');
  const [formData, setFormData] = useState({ name: '', mobile: '', password: '' });
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
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#0f172a] mb-2 tracking-tight">Access Denied</h1>
        <p className="text-slate-500 max-w-md mx-auto text-xs sm:text-sm">
          You do not have the required permissions to view this page. Only Super Admins can access Admin Management.
        </p>
      </div>
    );
  }

  const isLimitReached = admins.length >= 5;

  const [deleteAdminTarget, setDeleteAdminTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteAdmin = async () => {
    if (!deleteAdminTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/super-admin/managers/${deleteAdminTarget.id}`);
      setAdmins(prev => prev.filter(a => a.id !== deleteAdminTarget.id));
      toast.success('Administrator removed successfully');
      setDeleteAdminTarget(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove administrator');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/super-admin/managers/request-otp', {
        name: formData.name,
        phone: formatPhoneWithCountryCode(formData.mobile),
        password: formData.password
      });
      setIsOtpModalOpen(true);
      setError('');
      toast.success('OTP sent to mobile number');
    } catch (err: any) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.phone?.[0]
        || 'Failed to request OTP';

      const lower = msg.toLowerCase();
      if (lower.includes('already taken') || lower.includes('already registered') || lower.includes('already exists') || lower.includes('in use')) {
        toast.warning(msg);
      } else {
        toast.error(msg);
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
        phone: formatPhoneWithCountryCode(formData.mobile),
        otp_code: otpValue
      });
      toast.success('Administrator added successfully');
      setFormState('list');
      setIsOtpModalOpen(false);
      setFormData({ name: '', mobile: '', password: '' });
      setOtp(Array(4).fill(''));
      setError('');
      fetchAdmins();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid OTP code.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full pb-20 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Admin Staff Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Manage admin accounts & role permissions.
          </p>
        </div>

        {formState === 'list' && (
          <>
            {/* Desktop Add Admin Button */}
            <button
              onClick={() => setFormState('details')}
              disabled={isLimitReached}
              className={cn(
                "hidden md:flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all shadow-sm shrink-0 cursor-pointer",
                isLimitReached
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-slate-900"
              )}
            >
              <Plus className="w-4 h-4" />
              Add New Admin
            </button>

            {/* Mobile Floating Action Button (FAB) at bottom-right */}
            <button
              type="button"
              onClick={() => setFormState('details')}
              disabled={isLimitReached}
              className={cn(
                "md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer border border-slate-900/10",
                isLimitReached
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                  : "bg-yellow-400 text-slate-900 hover:bg-yellow-500"
              )}
              aria-label="Add New Admin"
            >
              <Plus className="w-7 h-7" />
            </button>
          </>
        )}
      </div>

      {isLimitReached && formState === 'list' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm">Maximum Limit Reached</h4>
            <p className="text-xs mt-0.5">You have reached the maximum limit of 5 administrators. You must remove an existing admin before adding a new one.</p>
          </div>
        </div>
      )}

      {/* --- View: Admin List --- */}
      {formState === 'list' && (
        <div>
          {/* Mobile Card List */}
          <div className="block md:hidden bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {admins.map((admin) => (
              <div key={admin.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/20 text-slate-900 font-black flex items-center justify-center text-xs shrink-0 shadow-xs border border-yellow-400/30">
                    {admin.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{admin.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-500 truncate">{admin.phone || ''}</p>
                    <span className={cn(
                      "inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider",
                      admin.role === 'Super Admin' ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-800"
                    )}>
                      {admin.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {admin.role !== 'Super Admin' && (
                    <button
                      onClick={() => setDeleteAdminTarget(admin)}
                      className="p-2 text-red-500 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove Admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                          <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold text-sm shadow-inner">
                            {admin.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#0f172a]">{admin.name}</div>
                            <div className="text-sm text-slate-500">{admin.phone || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2.5 py-1 text-xs font-bold rounded-lg",
                          admin.role === 'Super Admin' ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-800"
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
                            onClick={() => setDeleteAdminTarget(admin)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
        </div>
      )}

      {/* --- View: Admin Details Form --- */}
      {formState === 'details' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <button
              onClick={() => setFormState('list')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-4 transition-colors text-xs sm:text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </button>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Enter Admin Details</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Provide the necessary information to create a new administrator account.</p>
          </div>

          <form onSubmit={handleDetailsSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-extrabold text-slate-700 uppercase tracking-wider">Full Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="h-10 sm:h-11 bg-slate-50/50 focus:bg-white text-xs sm:text-sm placeholder:text-[11px] sm:placeholder:text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-extrabold text-slate-700 uppercase tracking-wider">Mobile Number</label>
                <PhoneInput
                  required
                  value={formData.mobile}
                  onChange={(val) => setFormData({ ...formData, mobile: val })}
                  placeholder="712345678"
                  className="h-10 sm:h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] sm:text-xs font-extrabold text-slate-700 uppercase tracking-wider">Temporary Password</label>
                <Input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-10 sm:h-11 bg-slate-50/50 focus:bg-white text-xs sm:text-sm placeholder:text-[11px] sm:placeholder:text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-100 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span>Continue to Verification</span>
                )}
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
            <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] mb-2">Verify Mobile Number</h2>
            <p className="text-slate-500 mb-6 text-xs sm:text-sm">
              An OTP has been sent to <span className="font-bold text-slate-700">{formData.mobile || 'the provided number'}</span>. Please enter it below to confirm creation.
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <OTPInput length={4} otp={otp} setOtp={setOtp} />
                {error && <p className="text-red-500 text-xs font-bold mt-4">{error}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-extrabold text-xs sm:text-sm rounded-xl hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify & Add</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Delete Admin Confirmation Modal --- */}
      <Dialog open={!!deleteAdminTarget} onOpenChange={(open) => !open && setDeleteAdminTarget(null)}>
        <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">Confirm Delete Administrator</DialogTitle>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8 text-center relative w-full overflow-hidden">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-2">Remove Administrator?</h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-800">{deleteAdminTarget?.name}</span>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteAdminTarget(null)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAdmin}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Removing...</span>
                  </>
                ) : (
                  <span>Delete Admin</span>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
