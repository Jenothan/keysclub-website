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

export default function WebsiteDataPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    primary_phone: '',
    support_email: '',
    club_address: '',
    court_pricing: '',
    full_day_pricing: '',
    membership_pricing: '',
    registration_fee: '',
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
            court_pricing: res.data.court_pricing || 'LKR 400',
            full_day_pricing: res.data.full_day_pricing || 'LKR 3,000',
            membership_pricing: res.data.membership_pricing || 'LKR 1,000',
            registration_fee: res.data.registration_fee || 'LKR 2,000',
          });
        }
      }).catch(err => console.error("Failed to load website data", err))
      .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [role]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/super-admin/website-data', formData);
      toast.success('Website data updated successfully');
    } catch (error) {
      toast.error('Failed to update website data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (role !== 'Super Admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Access Denied</h1>
        <p className="text-slate-500 max-w-md mx-auto text-lg">
          You do not have the required permissions to view this page. Only Super Admins can edit Website Data.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-10 w-full min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full pb-20 min-h-screen">

      <div className="space-y-6">

        {/* Website General Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-[#0f172a] mb-6">Public Contact Information</h2>
          <p className="text-sm text-slate-500 mb-6 -mt-4">This information will be displayed publicly on the contact page and footer of the website.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Support Phone
              </label>
              <Input name="primary_phone" value={formData.primary_phone} onChange={handleChange} className="h-11 bg-slate-50/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Support Email
              </label>
              <Input name="support_email" value={formData.support_email} onChange={handleChange} className="h-11 bg-slate-50/50" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Club Location / Address
              </label>
              <Input name="club_address" value={formData.club_address} onChange={handleChange} className="h-11 bg-slate-50/50" />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} disabled={isSaving} className="bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold text-sm h-11 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Court Configuration */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-[#0f172a] mb-6">Court & Booking Configuration</h2>
          <p className="text-sm text-slate-500 mb-6 -mt-4">Update pricing and operating hours for court bookings shown dynamically across the site.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                Court Hourly Rate (e.g. LKR 400)
              </label>
              <Input name="court_pricing" value={formData.court_pricing} onChange={handleChange} placeholder="LKR 400" className="h-11 bg-slate-50/50 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                Club Membership Monthly Rate (e.g. LKR 1,000)
              </label>
              <Input name="membership_pricing" value={formData.membership_pricing} onChange={handleChange} placeholder="LKR 1,000" className="h-11 bg-slate-50/50 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                One-Time Annual Registration Fee (e.g. LKR 2,000)
              </label>
              <Input name="registration_fee" value={formData.registration_fee} onChange={handleChange} placeholder="LKR 2,000" className="h-11 bg-slate-50/50 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                Full Day Rate (e.g. LKR 3,000)
              </label>
              <Input name="full_day_pricing" value={formData.full_day_pricing} onChange={handleChange} placeholder="LKR 3,000" className="h-11 bg-slate-50/50 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Opening Time
              </label>
              <Select defaultValue="06:00 AM">
                <SelectTrigger className="h-11 bg-slate-50/50">
                  <SelectValue placeholder="06:00 AM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="05:00 AM">05:00 AM</SelectItem>
                  <SelectItem value="06:00 AM">06:00 AM</SelectItem>
                  <SelectItem value="07:00 AM">07:00 AM</SelectItem>
                  <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Closing Time
              </label>
              <Select defaultValue="10:00 PM">
                <SelectTrigger className="h-11 bg-slate-50/50">
                  <SelectValue placeholder="10:00 PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00 PM">08:00 PM</SelectItem>
                  <SelectItem value="09:00 PM">09:00 PM</SelectItem>
                  <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                  <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} disabled={isSaving} className="bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold text-sm h-11 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-[#0f172a] mb-6">System Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div>
                <div className="font-bold text-[#0f172a] text-sm group-hover:text-yellow-600 transition-colors">Email Notifications</div>
                <div className="text-xs text-slate-500 mt-0.5">Receive email alerts for new booking requests.</div>
              </div>
              <div className="relative inline-block w-11 h-6 select-none">
                <input type="checkbox" className="peer absolute w-0 h-0 opacity-0" defaultChecked />
                <span className="absolute inset-0 bg-slate-200 rounded-full cursor-pointer transition-colors peer-checked:bg-yellow-400 peer-focus:ring-4 peer-focus:ring-yellow-100"></span>
                <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></span>
              </div>
            </label>
            <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div>
                <div className="font-bold text-[#0f172a] text-sm group-hover:text-yellow-600 transition-colors">SMS Notifications</div>
                <div className="text-xs text-slate-500 mt-0.5">Receive text alerts for new booking requests.</div>
              </div>
              <div className="relative inline-block w-11 h-6 select-none">
                <input type="checkbox" className="peer absolute w-0 h-0 opacity-0" />
                <span className="absolute inset-0 bg-slate-200 rounded-full cursor-pointer transition-colors peer-checked:bg-yellow-400 peer-focus:ring-4 peer-focus:ring-yellow-100"></span>
                <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></span>
              </div>
            </label>
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} disabled={isSaving} className="bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-sm h-11 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
