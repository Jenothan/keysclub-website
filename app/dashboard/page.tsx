"use client";

import React, { useEffect, useState } from 'react';
import Calendar from '@mui/icons-material/CalendarMonth';
import Clock from '@mui/icons-material/AccessTime';
import MapPin from '@mui/icons-material/LocationOn';
import Search from '@mui/icons-material/Search';
import List from '@mui/icons-material/FormatListBulleted';
import ArrowRight from '@mui/icons-material/ArrowForward';
import EyeIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { computeBookingStatus } from '@/lib/bookingUtils';
import BookingDetailsModal from '@/components/BookingDetailsModal';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [upRes, histRes] = await Promise.all([
        api.get('/bookings?tab=upcoming'),
        api.get('/bookings?tab=past')
      ]);

      const upcomingList = upRes.data || [];
      setUpcoming(upcomingList[0] || null);
      setHistory((histRes.data || []).slice(0, 5));
    } catch (error) {
      console.error('Failed to load user dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleCancelBooking = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      setSelectedBooking(null);
      fetchDashboardData();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to cancel');
    }
  };

  const upcomingStatusInfo = upcoming ? computeBookingStatus(upcoming) : null;

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-8 pb-20">
      
      {/* Hero Welcome Card */}
      <div className="bg-[#0f172a] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-yellow-400 font-extrabold text-xs tracking-wider uppercase bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
            Player Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Welcome back, <span className="text-yellow-400">{user?.name || 'Player'}</span>! 🏸
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            Reserve your badminton court slots, track active reservations, and manage your club profile.
          </p>
          <div className="pt-2">
            <Link
              href="/availability"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black text-sm px-6 py-3 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
            >
              Book A Slot Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Layout: Next Match & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Next Match Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-[#0f172a]">Upcoming Session</h3>
            <Link href="/dashboard/bookings" className="text-xs font-bold text-yellow-600 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : upcoming ? (
            <div 
              onClick={() => setSelectedBooking(upcoming)}
              className="space-y-4 bg-slate-50/80 p-5 rounded-xl border border-slate-100 hover:border-yellow-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  #KC-{upcoming.id}
                </span>
                {upcomingStatusInfo && (
                  <span className={cn("text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs", upcomingStatusInfo.badgeClass)}>
                    {upcomingStatusInfo.label}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-[#0f172a] group-hover:text-yellow-600 transition-colors">Badminton Court Session</h4>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {upcoming.booking_date ? format(new Date(upcoming.booking_date), 'EEE, dd MMM yyyy') : ''}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {upcoming.start_time} - {upcoming.end_time}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Point Pedro Court
                </span>
                <span className="text-xs font-black text-yellow-600 flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" /> Click for Details
                </span>
              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center text-center justify-center h-full">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-500 border border-yellow-200 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">No Upcoming Bookings</h3>
              <p className="text-slate-500 text-xs mb-6 max-w-xs font-medium">You don't have any active court sessions scheduled.</p>
              <Link href="/availability" className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xs rounded-xl shadow-sm transition-all">
                Book a Court Now
              </Link>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 flex items-center justify-center mb-6">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-2">Check Availability</h3>
          <p className="text-slate-500 text-xs font-medium mb-6 flex-1 leading-relaxed">
            Find open slots and reserve your playing time instantly.
          </p>
          <Link href="/availability" className="text-yellow-600 font-extrabold text-xs flex items-center gap-2 hover:underline">
            View Schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 flex items-center justify-center mb-6">
            <List className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-2">My Bookings</h3>
          <p className="text-slate-500 text-xs font-medium mb-6 flex-1 leading-relaxed">
            Manage upcoming and past court reservation records.
          </p>
          <Link href="/dashboard/bookings" className="text-yellow-600 font-extrabold text-xs flex items-center gap-2 hover:underline">
            View All Bookings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Booking History Section */}
      <div>
        <h2 className="text-xl font-extrabold text-[#0f172a] mb-4 tracking-tight">Recent Booking History</h2>

        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-100 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : history.length > 0 ? history.map((item) => {
            const statusInfo = computeBookingStatus(item);
            return (
            <div
              key={item.id}
              onClick={() => setSelectedBooking(item)}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-yellow-400 transition-all cursor-pointer group"
            >
              <div>
                <h4 className="font-extrabold text-[#0f172a] text-sm mb-1 group-hover:text-yellow-600 transition-colors">Badminton Session</h4>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <span>{item.booking_date ? format(new Date(item.booking_date), 'dd MMM yyyy') : ''}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{item.start_time} - {item.end_time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <span className="font-black text-[#0f172a] text-xs">#KC-{item.id}</span>
                <span className={cn("text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs", statusInfo.badgeClass)}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          )}) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-500 shadow-xs font-medium text-xs">
              No recent bookings found. Check availability to book a court!
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
        isAdmin={false}
        onCancel={handleCancelBooking}
      />

    </div>
  );
}
