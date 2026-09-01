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
        return 'bg-yellow-400/10 text-slate-900 border border-yellow-400';
      case 'Rejected':
        return 'bg-red-50 text-red-600';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-8 md:space-y-10 pb-20">


      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Upcoming Booking Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          {history.length > 0 ? (
            <>
              <div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0f172a]">Upcoming Booking</h3>
                    <p className="text-slate-500 text-body-sm">
                      Your next session is scheduled for {history[0].booking_date ? format(new Date(history[0].booking_date), 'dd MMM yyyy') : 'soon'}.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 mb-6">
                  <div className="flex items-center gap-3 text-slate-500 text-body-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">
                      {history[0].booking_date ? format(new Date(history[0].booking_date), 'EEEE, dd MMM yyyy') : '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-body-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{history[0].start_time} - {history[0].end_time}</span>
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
                  <p className="font-extrabold text-[#0f172a] text-lg">#KC-{history[0].id}</p>
                </div>
                <span className={cn("font-bold text-xs px-3 py-1.5 rounded-lg", getStatusBadge(history[0].status))}>
                  {history[0].status}
                </span>
              </div>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center text-center justify-center h-full">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-400 border border-yellow-200 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">No Upcoming Bookings</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-xs">You don't have any active court sessions scheduled.</p>
              <Link href="/availability" className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold text-xs rounded-xl shadow-sm transition-all">
                Book a Court Now
              </Link>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center mb-6">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-2">Check Availability</h3>
          <p className="text-slate-500 text-body-sm mb-6 flex-1">
            Find open slots and book instantly.
          </p>
          <Link href="/availability" className="text-yellow-400 font-extrabold text-body-sm flex items-center gap-2 hover:underline">
            View schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center mb-6">
            <List className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-2">My Bookings</h3>
          <p className="text-slate-500 text-body-sm mb-6 flex-1">
            Manage upcoming and past bookings.
          </p>
          <Link href="/dashboard/bookings" className="text-yellow-400 font-extrabold text-body-sm flex items-center gap-2 hover:underline">
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
