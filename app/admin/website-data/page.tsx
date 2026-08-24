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
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function WebsiteDataPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    primary_phone: '',
    support_email: '',
    club_address: '',
    court_pricing: '',
    full_day_pricing: '',
    membership_pricing: '',
  });

  useEffect(() => {
    if (role === 'Super Admin') {
      api.get('/website-data').then((res) => {
        if (res.data) {
          setFormData({
            primary_phone: res.data.primary_phone || '',
            support_email: res.data.support_email || '',
            club_address: res.data.club_address || '',
            court_pricing: res.data.court_pricing || '',
            full_day_pricing: res.data.full_day_pricing || '',
            membership_pricing: res.data.membership_pricing || '',
          });
        }
      }).catch(err => console.error("Failed to load website data", err));
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

  return (
    <div className="p-6 md:p-10 w-full pb-20 min-h-screen">



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
            <button onClick={handleSave} disabled={isSaving} className="bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-sm h-11 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Court Configuration */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-[#0f172a] mb-6">Court & Booking Configuration</h2>
          <p className="text-sm text-slate-500 mb-6 -mt-4">Update pricing and operating hours for court bookings.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                Hourly Rate (LKR)
              </label>
              <Input name="court_pricing" value={formData.court_pricing} onChange={handleChange} type="number" className="h-11 bg-slate-50/50 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                Full Day Rate (LKR)
              </label>
              <Input name="full_day_pricing" value={formData.full_day_pricing} onChange={handleChange} type="number" className="h-11 bg-slate-50/50 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                Monthly Membership Fee (LKR)
              </label>
              <Input name="membership_pricing" value={formData.membership_pricing} onChange={handleChange} type="number" className="h-11 bg-slate-50/50 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                Member's Monthly Court Price (LKR)
              </label>
              <Input defaultValue="1000" type="number" className="h-11 bg-slate-50/50 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Opening Time
              </label>
              <select defaultValue="06:00 AM" className="flex h-11 w-full rounded-md border border-input bg-slate-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-medium">
                <option>05:00 AM</option>
                <option>06:00 AM</option>
                <option>07:00 AM</option>
                <option>08:00 AM</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Closing Time
              </label>
              <select defaultValue="10:00 PM" className="flex h-11 w-full rounded-md border border-input bg-slate-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-medium">
                <option>08:00 PM</option>
                <option>09:00 PM</option>
                <option>10:00 PM</option>
                <option>11:00 PM</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} disabled={isSaving} className="bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-sm h-11 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
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
                <div className="font-bold text-[#0f172a] text-sm group-hover:text-blue-600 transition-colors">Email Notifications</div>
                <div className="text-xs text-slate-500 mt-0.5">Receive email alerts for new booking requests.</div>
              </div>
              <div className="relative inline-block w-11 h-6 select-none">
                <input type="checkbox" className="peer absolute w-0 h-0 opacity-0" defaultChecked />
                <span className="absolute inset-0 bg-slate-200 rounded-full cursor-pointer transition-colors peer-checked:bg-blue-500 peer-focus:ring-4 peer-focus:ring-blue-100"></span>
                <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></span>
              </div>
            </label>
            <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div>
                <div className="font-bold text-[#0f172a] text-sm group-hover:text-blue-600 transition-colors">SMS Notifications</div>
                <div className="text-xs text-slate-500 mt-0.5">Receive text alerts for new booking requests.</div>
              </div>
              <div className="relative inline-block w-11 h-6 select-none">
                <input type="checkbox" className="peer absolute w-0 h-0 opacity-0" />
                <span className="absolute inset-0 bg-slate-200 rounded-full cursor-pointer transition-colors peer-checked:bg-blue-500 peer-focus:ring-4 peer-focus:ring-blue-100"></span>
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
