"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Calendar from '@mui/icons-material/CalendarMonth';
import Clock from '@mui/icons-material/AccessTime';
import MapPin from '@mui/icons-material/LocationOn';
import Search from '@mui/icons-material/Search';
import List from '@mui/icons-material/FormatListBulleted';
import ArrowRight from '@mui/icons-material/ArrowForward';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings?tab=upcoming');
        setHistory(response.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      }
    };
    if (user) {
      fetchBookings();
    }
  }, [user]);

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
    <div className="p-6 md:p-10 w-full space-y-10 pb-20">
      


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
          {history.length > 0 ? history.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-200 transition-colors cursor-pointer"
            >
              <div>
                <h4 className="font-extrabold text-[#0f172a] text-body mb-1">Badminton Session</h4>
                <div className="flex items-center gap-2 text-slate-500 text-body-sm">
                  <span>{item.booking_date ? format(new Date(item.booking_date), 'dd MMM yyyy') : ''}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{item.start_time} - {item.end_time}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <span className="font-bold text-[#0f172a] text-body-sm">#KC-{item.id}</span>
                <span className={cn("font-bold text-[11px] px-3 py-1.5 rounded-lg w-24 text-center", getStatusBadge(item.status))}>
                  {item.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-500 shadow-sm">
              No recent bookings found. Check availability to book a court!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
