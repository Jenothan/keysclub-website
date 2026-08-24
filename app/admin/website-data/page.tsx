"use client";

import React, { useState } from 'react';
import { useAdminRole } from '@/components/AdminRoleContext';
import { ShieldAlert, Globe, Save } from 'lucide-react';

export default function WebsiteDataPage() {
  const { role } = useAdminRole();
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

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
                  defaultValue="+94 77 123 4567"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@keysclub.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Club Address</label>
                <textarea 
                  defaultValue="123 Sports Avenue, Karanavai East"
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
                  defaultValue="https://facebook.com/keysclub"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Instagram URL</label>
                <input 
                  type="url" 
                  defaultValue="https://instagram.com/keysclub"
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
