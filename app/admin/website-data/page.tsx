"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import ShieldAlert from '@mui/icons-material/GppBad';
import Globe from '@mui/icons-material/Language';
import Save from '@mui/icons-material/Save';
import Phone from '@mui/icons-material/Phone';
import Mail from '@mui/icons-material/Email';
import MapPin from '@mui/icons-material/LocationOn';
import DollarSign from '@mui/icons-material/AttachMoney';
import Clock from '@mui/icons-material/AccessTime';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function WebsiteDataPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<'contact' | 'peak' | 'court' | null>(null);

  const [formData, setFormData] = useState({
    primary_phone: '',
    support_email: '',
    club_address: '',
    facebook_url: '',
    instagram_url: '',
    court_pricing: '',
    full_day_pricing: '',
    membership_pricing: '',
    registration_fee: '',
    peak_start_time: '15:00:00',
    peak_end_time: '20:00:00',
    peak_off_days: ['Saturday', 'Sunday'],
  });

  useEffect(() => {
    if (role === 'Super Admin') {
      setIsLoading(true);
      api.get('/website-data').then((res) => {
        if (res.data) {
          setFormData({
            primary_phone: res.data.primary_phone || '',
            support_email: res.data.support_email || '',
            club_address: res.data.club_address || '',
            facebook_url: res.data.facebook_url || '',
            instagram_url: res.data.instagram_url || '',
            court_pricing: res.data.court_pricing || 'LKR 400',
            full_day_pricing: res.data.full_day_pricing || 'LKR 3,000',
            membership_pricing: res.data.membership_pricing || 'LKR 1,000',
            registration_fee: res.data.registration_fee || 'LKR 2,000',
            peak_start_time: res.data.peak_start_time || '15:00:00',
            peak_end_time: res.data.peak_end_time || '20:00:00',
            peak_off_days: Array.isArray(res.data.peak_off_days) ? res.data.peak_off_days : ['Saturday', 'Sunday'],
          });
        }
      }).catch(err => console.error("Failed to load website data", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [role]);

  const handleSave = async (section: 'contact' | 'peak' | 'court') => {
    if (savingSection) return;
    setSavingSection(section);
    try {
      await api.post('/super-admin/website-data', formData);
      toast.success('Website data and peak settings updated successfully');
    } catch (error) {
      toast.error('Failed to update website data');
    } finally {
      setSavingSection(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePeakOffDay = (day: string) => {
    const current = formData.peak_off_days || [];
    if (current.includes(day)) {
      setFormData({ ...formData, peak_off_days: current.filter(d => d !== day) });
    } else {
      if (current.length >= 2) {
        toast.error('Peak Hours do not apply on 2 days. Please unselect one before selecting another.');
        return;
      }
      setFormData({ ...formData, peak_off_days: [...current, day] });
    }
  };

  if (role !== 'Super Admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#0f172a] mb-2 tracking-tight">Access Denied</h1>
        <p className="text-slate-500 max-w-md mx-auto text-xs sm:text-sm">
          You do not have the required permissions to view this page. Only Super Admins can edit Website Data.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-10 w-full pb-20 min-h-screen space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-8 space-y-6 shadow-sm">
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full pb-20 min-h-screen">

      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Website Data & Peak Hours Configuration
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Update public contact info, pricing, and configure Member-only Peak Hours & off-days.
          </p>
        </div>

        {/* Website General Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0f172a] mb-2">Public Contact & Social Links Information</h2>
          <p className="text-xs text-slate-500 mb-6">This information will be displayed publicly on the contact page and footer of the website.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5 text-yellow-500" /> Support Phone
              </label>
              <Input name="primary_phone" value={formData.primary_phone} onChange={handleChange} placeholder="+94 77 123 4567" className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-yellow-500" /> Support Email
              </label>
              <Input name="support_email" value={formData.support_email} onChange={handleChange} placeholder="info@keysclub.lk" className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-yellow-500" /> Club Location / Address
              </label>
              <Input name="club_address" value={formData.club_address} onChange={handleChange} placeholder="Karanavai East, Karaveddy, Jaffna, Sri Lanka." className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-yellow-500" /> Facebook Page Link
              </label>
              <Input name="facebook_url" value={formData.facebook_url} onChange={handleChange} placeholder="https://facebook.com/yourpage" className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-yellow-500" /> Instagram Profile Link
              </label>
              <Input name="instagram_url" value={formData.instagram_url} onChange={handleChange} placeholder="https://instagram.com/yourprofile" className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleSave('contact')}
              disabled={savingSection === 'contact'}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs sm:text-sm h-11 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {savingSection === 'contact' ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Member-Only Peak Hours Configuration */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0f172a] mb-2 flex items-center gap-2">
            ⚡ Member-Only Peak Hours Configuration
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            During Peak Hours, court slots are restricted exclusively to registered <strong>Members</strong> (guest bookings not allowed).
            Peak slots display glowing borders on peak days. Set daily time range and select 2 Off-Days per week when Peak Hours are inactive.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-yellow-500" /> Peak Hours Start Time
                </label>
                <Select
                  value={formData.peak_start_time}
                  onValueChange={(val) => setFormData({ ...formData, peak_start_time: val })}
                >
                  <SelectTrigger className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl border-slate-200">
                    <SelectValue placeholder="Select Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15:00:00">03:00 PM</SelectItem>
                    <SelectItem value="16:00:00">04:00 PM</SelectItem>
                    <SelectItem value="17:00:00">05:00 PM</SelectItem>
                    <SelectItem value="18:00:00">06:00 PM</SelectItem>
                    <SelectItem value="19:00:00">07:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-yellow-500" /> Peak Hours End Time
                </label>
                <Select
                  value={formData.peak_end_time}
                  onValueChange={(val) => setFormData({ ...formData, peak_end_time: val })}
                >
                  <SelectTrigger className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl border-slate-200">
                    <SelectValue placeholder="Select End Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18:00:00">06:00 PM</SelectItem>
                    <SelectItem value="19:00:00">07:00 PM</SelectItem>
                    <SelectItem value="20:00:00">08:00 PM</SelectItem>
                    <SelectItem value="21:00:00">09:00 PM</SelectItem>
                    <SelectItem value="22:00:00">10:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Peak Off Days Selection */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider">
                  Peak Off-Days (Select 2 Days where Peak Hours do NOT apply)
                </label>
                <span className="text-[11px] font-bold text-slate-500">
                  {formData.peak_off_days.length}/2 Off-Days Selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {allDays.map((day) => {
                  const isSelected = formData.peak_off_days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => togglePeakOffDay(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${isSelected
                        ? "bg-yellow-400 text-slate-900 border-yellow-500 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-yellow-400"
                        }`}
                    >
                      {day} {isSelected ? "✓ (Off-Day)" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleSave('peak')}
              disabled={savingSection === 'peak'}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs sm:text-sm h-11 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {savingSection === 'peak' ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Court Configuration */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0f172a] mb-2">Court & Booking Configuration</h2>
          <p className="text-xs text-slate-500 mb-6">Update pricing and operating hours for court bookings shown dynamically across the site.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                Court Hourly Rate
              </label>
              <Input name="court_pricing" value={formData.court_pricing} onChange={handleChange} placeholder="LKR 400" className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                Club Membership Monthly Rate
              </label>
              <Input name="membership_pricing" value={formData.membership_pricing} onChange={handleChange} placeholder="LKR 1,000" className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                One-Time Annual Registration Fee
              </label>
              <Input name="registration_fee" value={formData.registration_fee} onChange={handleChange} placeholder="LKR 2,000" className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                Full Day Rate
              </label>
              <Input name="full_day_pricing" value={formData.full_day_pricing} onChange={handleChange} placeholder="LKR 3,000" className="h-11 bg-slate-50/50 font-medium text-xs sm:text-sm rounded-xl" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleSave('court')}
              disabled={savingSection === 'court'}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs sm:text-sm h-11 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {savingSection === 'court' ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
