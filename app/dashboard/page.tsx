"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Search, List, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const history = [
    {
      date: '24 Oct 2026',
      time: '05:00 PM - 06:00 PM',
      id: '#KC-89102',
      status: 'Confirmed'
    },
    {
      date: '20 Oct 2026',
      time: '07:00 PM - 08:00 PM',
      id: '#KC-88741',
      status: 'Pending'
    },
    {
      date: '15 Oct 2026',
      time: '06:00 PM - 07:00 PM',
      id: '#KC-88129',
      status: 'Rejected'
    },
    {
      date: '10 Oct 2026',
      time: '04:00 PM - 05:00 PM',
      id: '#KC-87241',
      status: 'Cancelled'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-600';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-600';
      case 'Rejected':
        return 'bg-red-50 text-red-600';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-20">
      
      {/* Header Section */}
      <div className="flex items-center gap-6">
        <Image 
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt="Profile"
          width={72}
          height={72}
          className="rounded-full object-cover border-2 border-white shadow-md"
        />
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mb-2">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'}!
          </h1>
          <p className="text-slate-500 text-body">
            Here are your current bookings and activities at Point Pedro.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Booking Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#0f172a]">Upcoming Booking</h3>
                <p className="text-slate-500 text-body-sm">Your next session is scheduled for tomorrow.</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 mb-6">
              <div className="flex items-center gap-3 text-slate-500 text-body-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="font-medium">Tomorrow, Oct 27</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-body-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-medium">06:00 PM - 07:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-body-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-medium">Point Pedro (National Standard)</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Booking ID</p>
              <p className="font-extrabold text-[#0f172a] text-lg">#KC-89420</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 font-bold text-xs px-3 py-1.5 rounded-lg">
              Confirmed
            </span>
          </div>
        </div>

        {/* Action Cards */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-2">Check Availability</h3>
          <p className="text-slate-500 text-body-sm mb-6 flex-1">
            Find open slots and book instantly.
          </p>
          <Link href="/availability" className="text-blue-600 font-bold text-body-sm flex items-center gap-2 hover:gap-3 transition-all">
            View schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <List className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-2">My Bookings</h3>
          <p className="text-slate-500 text-body-sm mb-6 flex-1">
            Manage upcoming and past bookings.
          </p>
          <Link href="/dashboard/bookings" className="text-blue-600 font-bold text-body-sm flex items-center gap-2 hover:gap-3 transition-all">
            View bookings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Booking History Section */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#0f172a] mb-6 tracking-tight">My Booking History</h2>
        
        <div className="space-y-4">
          {history.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-200 transition-colors cursor-pointer"
            >
              <div>
                <h4 className="font-extrabold text-[#0f172a] text-body mb-1">Badminton Session</h4>
                <div className="flex items-center gap-2 text-slate-500 text-body-sm">
                  <span>{item.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{item.time}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <span className="font-bold text-[#0f172a] text-body-sm">{item.id}</span>
                <span className={cn("font-bold text-[11px] px-3 py-1.5 rounded-lg w-24 text-center", getStatusBadge(item.status))}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
