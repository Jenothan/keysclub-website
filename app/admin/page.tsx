"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Clock from '@mui/icons-material/AccessTime';
import Calendar from '@mui/icons-material/CalendarMonth';
import ShieldCheck from '@mui/icons-material/GppGood';
import MessageSquare from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EyeIcon from '@mui/icons-material/Visibility';
import ChevronRight from '@mui/icons-material/ChevronRight';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { computeBookingStatus } from '@/lib/bookingUtils';
import BookingDetailsModal from '@/components/BookingDetailsModal';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [stats, setStats] = useState({
    todays_bookings: 0,
    pending_requests: 0,
    confirmed_bookings: 0,
    new_inquiries: 0
  });

  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  const fetchStatsAndRecent = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/bookings')
      ]);

      setStats(statsRes.data);
      setRecentRequests(bookingsRes.data.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndRecent();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-6 md:space-y-8 pb-20">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
          Admin Dashboard Overview
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Real-time summary of today's court bookings, pending requests, and new inquiries.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: APPLE-WALLET INSPIRED DESIGN (Visible on Mobile Devices) */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-6">

        {/* 1. Top Large Featured Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-slate-900 to-[#1e293b] p-6 text-white shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-extrabold text-xs shadow-sm">
                KC
              </div>
              <span className="text-xs font-black tracking-wider uppercase text-yellow-400">KEYS CLUB ADMIN</span>
            </div>
            <span className="text-[10px] font-extrabold bg-white/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-400/30 uppercase tracking-wider">
              Today Overview
            </span>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Total Bookings</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-white tracking-tight">
                {loading ? '..' : stats.todays_bookings.toString().padStart(2, '0')}
              </h2>
              <span className="text-xs font-extrabold text-yellow-400">Court Sessions Today</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">Live Court Operations</span>
            </div>
            <Link href="/admin/availability">
              <span className="text-xs font-extrabold text-yellow-400 hover:underline flex items-center gap-1">
                View Schedule →
              </span>
            </Link>
          </div>
        </div>

        {/* 2. Middle Stats Grid (2 Columns: Left 2 stacked cards, Right 1 tall card) */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Left Column (2 stacked cards) */}
          <div className="space-y-4">
            
            {/* Pending Requests Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Pending</span>
                <div className="w-7 h-7 rounded-lg bg-yellow-400/20 text-yellow-600 border border-yellow-400/30 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#0f172a]">
                  {loading ? '..' : stats.pending_requests.toString().padStart(2, '0')}
                </h3>
                <p className="text-[10px] font-bold text-amber-600 mt-0.5">Requires Action</p>
              </div>
            </div>

            {/* New Inquiries Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Inquiries</span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#0f172a]">
                  {loading ? '..' : stats.new_inquiries.toString().padStart(2, '0')}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Customer Messages</p>
              </div>
            </div>

          </div>

          {/* Right Column (Tall Featured Confirmed Card) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Confirmed</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-[#0f172a]">
                  {loading ? '..' : stats.confirmed_bookings.toString().padStart(2, '0')}
                </h3>
                <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Approved Sessions</p>
              </div>
            </div>

            <Link href="/admin/bookings" className="mt-4">
              <button type="button" className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-extrabold rounded-xl transition-all shadow-xs text-center cursor-pointer">
                Manage
              </button>
            </Link>
          </div>

        </div>

        {/* 3. Bottom Latest Transactions / Booking Activity List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm sm:text-base font-black text-[#0f172a] tracking-tight">Latest Card Bookings</h3>
            <Link href="/admin/bookings" className="text-xs font-extrabold text-yellow-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : recentRequests.length > 0 ? (
              recentRequests.map((req) => {
                const statusInfo = computeBookingStatus(req);
                const userName = req.user ? req.user.name : (req.customer_name || 'Walk-in Customer');
                const userInitial = userName.charAt(0).toUpperCase();

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedBooking(req)}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-slate-900 font-black flex items-center justify-center shrink-0 text-sm shadow-xs">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{userName}</h4>
                        <p className="text-[11px] font-semibold text-slate-500 truncate">
                          #KC-{req.id} • {req.booking_date}
                        </p>
                        <p className="text-[10px] font-bold text-slate-700 truncate">
                          {req.start_time} - {req.end_time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs", statusInfo.badgeClass)}>
                        {statusInfo.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs font-bold text-slate-400">
                No recent booking requests found.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP VIEW: STANDARD DASHBOARD GRID & TABLE (Visible on Desktop)     */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Today's Bookings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500">Today's Bookings</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-lg"></div>
              ) : (
                <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.todays_bookings.toString().padStart(2, '0')}</h3>
              )}
              <span className="text-lg font-bold text-[#0f172a]">Sessions</span>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500">Pending Requests</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-lg"></div>
              ) : (
                <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.pending_requests.toString().padStart(2, '0')}</h3>
              )}
              <span className="text-lg font-bold text-[#0f172a]">Slots</span>
            </div>
          </div>

          {/* Confirmed Bookings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500">Confirmed Bookings</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-lg"></div>
              ) : (
                <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.confirmed_bookings.toString().padStart(2, '0')}</h3>
              )}
              <span className="text-lg font-bold text-[#0f172a]">Slots</span>
            </div>
          </div>

          {/* New Inquiries */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500">New Inquiries</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-lg"></div>
              ) : (
                <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.new_inquiries.toString().padStart(2, '0')}</h3>
              )}
              <span className="text-lg font-bold text-[#0f172a]">Messages</span>
            </div>
          </div>

        </div>

        {/* Recent Booking Requests Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">Recent Booking Requests</h3>
              <p className="text-xs text-slate-400 font-medium">Click any row to view full details</p>
            </div>
            <Link href="/admin/bookings" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xs h-9 px-4 rounded-md transition-colors shadow-sm flex items-center justify-center">
              View All Requests
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs font-bold text-slate-500 bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Booking Date & Slot</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((req) => {
                      const statusInfo = computeBookingStatus(req);
                      return (
                      <tr 
                        key={req.id} 
                        onClick={() => setSelectedBooking(req)}
                        className="hover:bg-yellow-400/5 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4 font-bold text-[#0f172a] group-hover:text-yellow-600 transition-colors">
                          {req.user ? req.user.name : (req.customer_name || 'Walk-in')}
                        </td>
                        <td className="px-6 py-4 font-black text-[#0f172a]">#KC-{req.id}</td>
                        <td className="px-6 py-4 text-slate-700 font-medium">
                          {req.booking_date} ({req.start_time} - {req.end_time})
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn("text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs", statusInfo.badgeClass)}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedBooking(req)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    )})
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-medium">
                        No recent booking requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
        isAdmin={true}
        onConfirm={async (id) => {
          try {
            await api.post(`/admin/bookings/${id}/confirm`);
            toast.success('Booking confirmed successfully');
            fetchStatsAndRecent();
          } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to confirm');
          }
        }}
        onReject={async (id) => {
          try {
            await api.post(`/admin/bookings/${id}/reject`);
            toast.success('Booking rejected successfully');
            fetchStatsAndRecent();
          } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to reject');
          }
        }}
        onCancel={async (id) => {
          try {
            await api.post(`/admin/bookings/${id}/cancel`);
            toast.success('Booking cancelled successfully');
            fetchStatsAndRecent();
          } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to cancel');
          }
        }}
      />

    </div>
  );
}
