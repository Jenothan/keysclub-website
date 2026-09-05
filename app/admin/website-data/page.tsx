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
    facebook_url: '',
    instagram_url: '',
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
            facebook_url: res.data.facebook_url || '',
            instagram_url: res.data.instagram_url || '',
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
      <div className="p-4 sm:p-6 md:p-10 w-full min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full pb-20 min-h-screen">

      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Website Data & Pricing Configuration
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Update public contact info, court hourly rates, and membership fees.
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
            <button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs sm:text-sm h-11 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
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
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-yellow-500" /> Opening Time
              </label>
              <Select defaultValue="06:00 AM">
                <SelectTrigger className="h-11 bg-slate-50/50 text-xs sm:text-sm font-medium rounded-xl">
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
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-yellow-500" /> Closing Time
              </label>
              <Select defaultValue="10:00 PM">
                <SelectTrigger className="h-11 bg-slate-50/50 text-xs sm:text-sm font-medium rounded-xl">
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
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs sm:text-sm h-11 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
