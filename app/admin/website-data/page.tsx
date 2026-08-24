"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import ShieldAlert from '@mui/icons-material/GppBad';
import Globe from '@mui/icons-material/Language';
import Save from '@mui/icons-material/Save';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function WebsiteDataPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    primary_phone: '',
    support_email: '',
    club_address: '',
    facebook_url: '',
    instagram_url: ''
  });

  useEffect(() => {
    if (role !== 'Super Admin') return;
    const fetchData = async () => {
      try {
        const response = await api.get('/website-data');
        if (response.data) {
          setFormData({
            primary_phone: response.data.primary_phone || '',
            support_email: response.data.support_email || '',
            club_address: response.data.club_address || '',
            facebook_url: response.data.facebook_url || '',
            instagram_url: response.data.instagram_url || ''
          });
        }
      } catch (error) {
        toast.error('Failed to fetch website data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [role]);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto pb-20 min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2 flex items-center gap-2">
          <Globe className="text-blue-600" />
          Website Data Configuration
        </h1>
        <p className="text-slate-500 text-sm">
          Manage global website information like contact details, social links, and about text.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0f172a] border-b border-slate-100 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Phone Number</label>
                <input 
                  type="text" 
                  name="primary_phone"
                  value={formData.primary_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                <input 
                  type="email" 
                  name="support_email"
                  value={formData.support_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Club Address</label>
                <textarea 
                  name="club_address"
                  value={formData.club_address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700 resize-none" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0f172a] border-b border-slate-100 pb-2">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Facebook URL</label>
                <input 
                  type="url" 
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Instagram URL</label>
                <input 
                  type="url" 
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold rounded-xl focus:ring-4 focus:ring-yellow-100 transition-all shadow-sm"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
