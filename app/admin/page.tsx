"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Clock from '@mui/icons-material/AccessTime';
import Calendar from '@mui/icons-material/CalendarMonth';
import ShieldCheck from '@mui/icons-material/GppGood';
import MessageSquare from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EyeIcon from '@mui/icons-material/Visibility';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { format } from 'date-fns';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { computeBookingStatus, groupBookings, GroupedBooking } from '@/lib/bookingUtils';
import BookingDetailsModal from '@/components/BookingDetailsModal';
import ConfirmActionModal from '@/components/ConfirmActionModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<GroupedBooking | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'confirm' | 'reject' | 'cancel' | null;
    booking: GroupedBooking | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    action: null,
    booking: null,
    isLoading: false,
  });
  const [stats, setStats] = useState({
    todays_bookings: 0,
    pending_memberships: 0,
    new_inquiries: 0,
    confirmed_bookings: 0,
  });
  const [recentRequests, setRecentRequests] = useState<GroupedBooking[]>([]);

  const requestConfirmAction = (booking: GroupedBooking, action: 'confirm' | 'reject' | 'cancel') => {
    setConfirmModal({
      isOpen: true,
      action,
      booking,
      isLoading: false,
    });
  };

  const executeConfirmedAction = async () => {
    if (!confirmModal.booking || !confirmModal.action) return;
    setConfirmModal((prev) => ({ ...prev, isLoading: true }));
    try {
      await api.post(`/admin/bookings/${confirmModal.booking.id}/${confirmModal.action}`);
      const actionPast = confirmModal.action === 'confirm' ? 'confirmed' : confirmModal.action === 'reject' ? 'rejected' : 'cancelled';
      toast.success(`Booking ${actionPast} successfully`);
      setConfirmModal({ isOpen: false, action: null, booking: null, isLoading: false });
      if (selectedBooking?.id === confirmModal.booking.id) {
        setSelectedBooking(null);
      }
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${confirmModal.action} booking`);
      setConfirmModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        api.get('/admin/bookings'),
        api.get('/admin/stats').catch(() => ({ data: {} }))
      ]);

      const rawBookings = bookingsRes.data;
      const groupedBookings = groupBookings(rawBookings);

      const todayStr = format(new Date(), 'yyyy-MM-dd');

      const todaysCount = groupedBookings.filter((b: GroupedBooking) => {
        if (!b.booking_date) return false;
        const bDateStr = format(new Date(b.booking_date), 'yyyy-MM-dd');
        return bDateStr === todayStr && b.status !== 'Cancelled' && b.status !== 'Rejected';
      }).length;

      const confirmedCount = groupedBookings.filter((b: GroupedBooking) => b.status === 'Confirmed' || b.status === 'Ongoing').length;

      setStats({
        todays_bookings: todaysCount,
        pending_memberships: statsRes.data?.pending_memberships ?? 0,
        new_inquiries: statsRes.data?.new_inquiries ?? 0,
        confirmed_bookings: confirmedCount,
      });

      setRecentRequests(groupedBookings.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error('Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-6 md:space-y-8 pb-20 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
          Welcome back, {user?.name || 'Administrator'}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Here's a quick overview of court bookings, pending requests, and operations today.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: APPLE-WALLET INSPIRED DESIGN                             */}
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
              {loading ? (
                <Skeleton className="h-10 w-20 bg-white/20 rounded-lg" />
              ) : (
                <h2 className="text-4xl font-black text-white tracking-tight">
                  {stats.todays_bookings.toString().padStart(2, '0')}
                </h2>
              )}
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

        {/* 2. Middle Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Left Column (2 stacked cards) */}
          <div className="space-y-4">
            
            {/* Membership Requests Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Memberships</span>
                <div className="w-7 h-7 rounded-lg bg-yellow-400/20 text-yellow-600 border border-yellow-400/30 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                {loading ? (
                  <Skeleton className="h-8 w-14 rounded-lg my-0.5" />
                ) : (
                  <h3 className="text-2xl font-black text-[#0f172a]">
                    {(stats.pending_memberships || 0).toString().padStart(2, '0')}
                  </h3>
                )}
                <p className="text-[10px] font-bold text-amber-600 mt-0.5">Pending Approvals</p>
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
                {loading ? (
                  <Skeleton className="h-8 w-14 rounded-lg my-0.5" />
                ) : (
                  <h3 className="text-2xl font-black text-[#0f172a]">
                    {stats.new_inquiries.toString().padStart(2, '0')}
                  </h3>
                )}
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
                {loading ? (
                  <Skeleton className="h-9 w-16 rounded-lg my-0.5" />
                ) : (
                  <h3 className="text-3xl font-black text-[#0f172a]">
                    {stats.confirmed_bookings.toString().padStart(2, '0')}
                  </h3>
                )}
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

        {/* 3. Bottom Latest Booking Requests List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm sm:text-base font-black text-[#0f172a] tracking-tight">Recent Bookings</h3>
            <Link href="/admin/bookings" className="text-xs font-extrabold text-yellow-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-3 w-48 rounded-md" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            ) : recentRequests.length > 0 ? (
              recentRequests.map((req) => {
                const statusInfo = computeBookingStatus(req);
                const userName = req.customer_name || req.user?.name || req.booked_by?.name || 'Walk-in Customer';
                const userInitial = userName.charAt(0).toUpperCase();

                return (
                  <div
                    key={req.booking_reference || req.id}
                    onClick={() => setSelectedBooking(req)}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-slate-900 font-black flex items-center justify-center shrink-0 text-sm shadow-xs">
                        {userInitial}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{userName}</h4>
                          {(req.total_slots_count || (req.slots && req.slots.length)) > 1 && (
                            <span className="text-[9px] font-black text-slate-700 bg-yellow-100 border border-yellow-300 px-1.5 py-0.5 rounded-md">
                              {req.total_slots_count || req.slots.length} Slots
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 truncate">
                          {req.booking_reference} • {req.booking_date}
                        </p>
                        <p className="text-[10px] font-extrabold text-amber-700 truncate">
                          {req.time_display || `${req.start_time} - ${req.end_time}`}
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
      {/* 💻 DESKTOP VIEW: STANDARD DASHBOARD GRID & TABLE                         */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

          {/* Today's Bookings */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 gap-2">
              <span className="text-sm font-bold text-slate-500 truncate">Today's Bookings</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              {loading ? (
                <Skeleton className="h-9 w-16 rounded-lg my-0.5" />
              ) : (
                <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.todays_bookings.toString().padStart(2, '0')}</h3>
              )}
              <span className="text-base sm:text-lg font-bold text-[#0f172a]">Sessions</span>
            </div>
          </div>

          {/* Membership Requests */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 gap-2">
              <span className="text-sm font-bold text-slate-500 truncate">Membership Requests</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              {loading ? (
                <Skeleton className="h-9 w-16 rounded-lg my-0.5" />
              ) : (
                <h3 className="text-3xl font-extrabold text-[#0f172a]">{(stats.pending_memberships || 0).toString().padStart(2, '0')}</h3>
              )}
              <span className="text-base sm:text-lg font-bold text-[#0f172a]">Applications</span>
            </div>
          </div>

          {/* Confirmed Bookings */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 gap-2">
              <span className="text-sm font-bold text-slate-500 truncate">Confirmed Bookings</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              {loading ? (
                <Skeleton className="h-9 w-16 rounded-lg my-0.5" />
              ) : (
                <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.confirmed_bookings.toString().padStart(2, '0')}</h3>
              )}
              <span className="text-base sm:text-lg font-bold text-[#0f172a]">Sessions</span>
            </div>
          </div>

          {/* New Inquiries */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 gap-2">
              <span className="text-sm font-bold text-slate-500 truncate">New Inquiries</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              {loading ? (
                <Skeleton className="h-9 w-16 rounded-lg my-0.5" />
              ) : (
                <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.new_inquiries.toString().padStart(2, '0')}</h3>
              )}
              <span className="text-base sm:text-lg font-bold text-[#0f172a]">Messages</span>
            </div>
          </div>

        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">Recent Bookings</h3>
              <p className="text-xs text-slate-400 font-medium">Click any row to view full details</p>
            </div>
            <Link href="/admin/bookings" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xs h-9 px-4 rounded-md transition-colors shadow-sm flex items-center justify-center">
              View All Bookings
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex items-center justify-between gap-4 py-2">
                    <Skeleton className="h-5 w-36 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-5 w-48 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs font-bold text-slate-500 bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Booking Ref</th>
                    <th className="px-6 py-4">Booking Date & Slots</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((req) => {
                      const statusInfo = computeBookingStatus(req);
                      const displayName = req.customer_name || req.user?.name || req.booked_by?.name || 'Walk-in Customer';

                      return (
                        <tr 
                          key={req.booking_reference || req.id} 
                          onClick={() => setSelectedBooking(req)}
                          className="hover:bg-yellow-400/5 transition-colors group cursor-pointer"
                        >
                          <td className="px-6 py-4 font-extrabold text-[#0f172a] group-hover:text-yellow-600 transition-colors flex items-center gap-2">
                            {displayName}
                            {req.user && (
                              <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider",
                                req.user.is_guest ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                              )}>
                                {req.user.is_guest ? 'Guest' : 'User'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-black text-[#0f172a] bg-yellow-400/20 text-yellow-950 px-2.5 py-1 rounded-md border border-yellow-400/30">
                              {req.booking_reference}
                            </span>
                            {(req.total_slots_count || (req.slots && req.slots.length)) > 1 && (
                              <span className="block text-[10px] font-extrabold text-slate-500 mt-1">
                                {req.total_slots_count || req.slots.length} Slots Booked
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-700 font-bold">
                            <div>
                              <span>{req.booking_date}</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {req.time_ranges && req.time_ranges.length > 0 ? (
                                  req.time_ranges.map((tr: string, i: number) => (
                                    <span key={i} className="text-[11px] font-extrabold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                                      {tr}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[11px] font-extrabold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                                    {req.start_time} - {req.end_time}
                                  </span>
                                )}
                              </div>
                            </div>
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
                      );
                    })
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
        onConfirm={(id) => {
          const target = recentRequests.find(b => b.id === id) || selectedBooking;
          if (target) requestConfirmAction(target, 'confirm');
        }}
        onReject={(id) => {
          const target = recentRequests.find(b => b.id === id) || selectedBooking;
          if (target) requestConfirmAction(target, 'reject');
        }}
        onCancel={(id) => {
          const target = recentRequests.find(b => b.id === id) || selectedBooking;
          if (target) requestConfirmAction(target, 'cancel');
        }}
      />

      {/* Action Confirmation Modal */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirmAction={executeConfirmedAction}
        action={confirmModal.action}
        booking={confirmModal.booking}
        isLoading={confirmModal.isLoading}
      />

    </div>
  );
}

