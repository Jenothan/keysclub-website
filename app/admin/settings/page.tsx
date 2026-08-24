"use client";

import React, { useState } from 'react';
import Camera from '@mui/icons-material/CameraAlt';
import Save from '@mui/icons-material/Save';
import Phone from '@mui/icons-material/Phone';
import Mail from '@mui/icons-material/Email';
import MapPin from '@mui/icons-material/LocationOn';
import DollarSign from '@mui/icons-material/AttachMoney';
import Clock from '@mui/icons-material/AccessTime';
import Pencil from '@mui/icons-material/Edit';
import { Input } from '@/components/ui/input';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your administrator profile and global website configuration.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'profile' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Admin Profile
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'website' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Website Settings
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8">
              
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md overflow-hidden mb-4 group cursor-pointer">
                  <div className="text-blue-600 font-extrabold text-4xl">AD</div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Super Admin</h2>
                <span className="bg-blue-50 text-blue-600 font-extrabold text-[11px] px-3 py-1 rounded-full border border-blue-100">
                  System Administrator
                </span>
              </div>

              <div className="w-full h-px bg-slate-100 mb-6"></div>

              <div className="space-y-5 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="font-extrabold text-[#0f172a] text-sm">Super Admin</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</p>
                  <p className="font-extrabold text-[#0f172a] text-sm">+94 76 332 6098</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="font-extrabold text-[#0f172a] text-sm">admin@keysclub.lk</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Role Since</p>
                  <p className="font-extrabold text-[#0f172a] text-sm">January 2024</p>
                </div>
              </div>

              <button className="w-full bg-[#facc15] hover:bg-[#eab308] text-[#0f172a] font-bold text-sm h-12 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>

            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Security & Password Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8">
                <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-2">Security & Change Password</h2>
                <p className="text-slate-500 text-sm mb-6">Keep your admin account secure by updating your password regularly.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0f172a]">Current Password</label>
                    <Input type="password" placeholder="••••••••••••" className="h-11 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0f172a]">New Password</label>
                    <Input type="password" placeholder="Enter new password" className="h-11 bg-slate-50/50" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm px-6 h-11 rounded-lg transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
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
                  <Input defaultValue="+94 77 123 4567" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Support Email
                  </label>
                  <Input defaultValue="info@keysclub.lk" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Club Location / Address
                  </label>
                  <Input defaultValue="Karanavai East, Point Pedro, Jaffna District, Sri Lanka" className="h-11 bg-slate-50/50" />
                </div>
              </div>
            </div>

            {/* Court Configuration */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-extrabold text-[#0f172a] mb-6">Court & Booking Configuration</h2>
              <p className="text-sm text-slate-500 mb-6 -mt-4">Update pricing and operating hours for court bookings.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Hourly Rate (LKR)
                  </label>
                  <Input defaultValue="800" type="number" className="h-11 bg-slate-50/50 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Full Day Rate (LKR)
                  </label>
                  <Input defaultValue="5000" type="number" className="h-11 bg-slate-50/50 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Opening Time
                  </label>
                  <select className="flex h-11 w-full rounded-md border border-input bg-slate-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-medium">
                    <option>05:00 AM</option>
                    <option selected>06:00 AM</option>
                    <option>07:00 AM</option>
                    <option>08:00 AM</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Closing Time
                  </label>
                  <select className="flex h-11 w-full rounded-md border border-input bg-slate-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-medium">
                    <option>08:00 PM</option>
                    <option>09:00 PM</option>
                    <option selected>10:00 PM</option>
                    <option>11:00 PM</option>
                  </select>
                </div>
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
            </div>

            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm h-11 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                <Save className="w-4 h-4" />
                Update Website Settings
              </button>
            </div>
            
          </div>
        )}
      </div>

    </div>
  );
}
