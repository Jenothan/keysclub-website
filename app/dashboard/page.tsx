"use client";

import React, { useEffect, useState } from 'react';
import Calendar from '@mui/icons-material/CalendarMonth';
import Clock from '@mui/icons-material/AccessTime';
import MapPin from '@mui/icons-material/LocationOn';
import Search from '@mui/icons-material/Search';
import List from '@mui/icons-material/FormatListBulleted';
import ArrowRight from '@mui/icons-material/ArrowForward';
import ChevronRight from '@mui/icons-material/ChevronRight';
import EyeIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { computeBookingStatus } from '@/lib/bookingUtils';
import BookingDetailsModal from '@/components/BookingDetailsModal';
import { Skeleton } from '@/components/ui/skeleton';

import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import MembershipRequestModal from '@/components/MembershipRequestModal';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // Membership Request State
  const [membershipData, setMembershipData] = useState<{ is_member: boolean; latest_request: any } | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const fetchMembershipStatus = async () => {
    try {
      const res = await api.get('/membership-request/status');
      setMembershipData(res.data);
    } catch (e) {
      console.error('Failed to fetch membership status', e);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [upRes, histRes] = await Promise.all([
        api.get('/bookings?tab=upcoming'),
        api.get('/bookings?tab=past'),
        fetchMembershipStatus()
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

      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const openFromUrl = urlParams.get('open_membership') === 'true';
        const openFromStorage = sessionStorage.getItem('open_membership_modal') === 'true';

        if (openFromUrl || openFromStorage) {
          sessionStorage.removeItem('open_membership_modal');
          setIsRequestModalOpen(true);
        }
      }
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
  const isMember = user?.is_member || membershipData?.is_member;
  const latestRequest = membershipData?.latest_request;

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-6 md:space-y-8 pb-20">
      
      {/* Top Hero Welcome Card */}
      <div className="bg-[#0f172a] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-yellow-400 font-extrabold text-[11px] tracking-wider uppercase bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
              Player Dashboard
            </span>
            {isMember && (
              <span className="text-slate-900 font-black text-[11px] tracking-wider uppercase bg-yellow-400 px-3 py-1 rounded-full border border-yellow-500 shadow-sm flex items-center gap-1">
                <ShieldIcon className="w-3.5 h-3.5 text-slate-900" /> Court Member
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Welcome back, <span className="text-yellow-400">{user?.name || 'Player'}</span>! 🏸
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
            Reserve your badminton court slots, track active reservations, and manage your club profile.
          </p>
          <div className="pt-2">
            <Link
              href="/availability"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 border border-yellow-500"
            >
              Book A Slot Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Badminton Court Membership Banner / Status Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        {isMember ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-yellow-400/10 border border-yellow-400/40 p-5 rounded-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-slate-900 flex items-center justify-center font-black shrink-0 shadow-md border border-yellow-500">
                <ShieldIcon className="w-7 h-7 text-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">Registered Court Member</h3>
                  <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-yellow-500">Active</span>
                </div>
                <p className="text-slate-600 text-xs font-medium mt-0.5">
                  You have full access to book <strong>Peak Hour Slots (3:00 PM - 8:00 PM)</strong> and exclusive member features!
                </p>
              </div>
            </div>
            <Link href="/availability" className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 border border-yellow-500 font-black text-xs rounded-xl shrink-0 transition-all shadow-md">
              Book Peak Slots
            </Link>
          </div>
        ) : latestRequest?.status === 'Pending' ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-yellow-50 border border-yellow-200 p-5 rounded-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-slate-900 border border-yellow-400/40 flex items-center justify-center font-black shrink-0">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">Membership Request Under Review</h3>
                  <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-yellow-500">Pending</span>
                </div>
                <p className="text-slate-600 text-xs font-medium mt-0.5">
                  Submitted on {latestRequest.created_at ? format(new Date(latestRequest.created_at), 'dd MMM yyyy, hh:mm a') : 'Recently'}. {latestRequest.payment_proof_path ? 'Payment proof attached ✓' : 'No proof attached.'} Admin is reviewing your application.
                </p>
              </div>
            </div>
          </div>
        ) : latestRequest?.status === 'Rejected' ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-rose-50 border border-rose-200 p-5 rounded-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center font-black shrink-0">
                <ShieldIcon className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-rose-950">Membership Request Not Approved</h3>
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Rejected</span>
                </div>
                <p className="text-rose-800 text-xs font-medium mt-0.5">
                  Reason: <span className="font-bold">{latestRequest.rejection_reason || 'Did not meet requirements.'}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shrink-0 transition-colors shadow-sm cursor-pointer"
            >
              Re-apply for Membership
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-slate-900 border border-yellow-400/40 flex items-center justify-center font-black shrink-0">
                <ShieldIcon className="w-7 h-7 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0f172a]">Become a Badminton Court Member</h3>
                <p className="text-slate-500 text-xs font-medium mt-0.5">
                  Regular accounts cannot book <strong>Peak Hour Slots (3 PM - 8 PM)</strong>. Request court membership now with optional payment proof!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black text-xs rounded-xl border border-yellow-500 shrink-0 transition-all shadow-md cursor-pointer flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <ShieldIcon className="w-4 h-4 text-slate-900" /> Request Membership
            </button>
          </div>
        )}
      </div>

      {/* Grid Layout: Next Match & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Next Match Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-extrabold text-[#0f172a]">Upcoming Session</h3>
            <Link href="/dashboard/bookings" className="text-xs font-black text-slate-900 hover:text-yellow-500 transition-colors">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="p-5 bg-slate-50/80 rounded-xl space-y-3 border border-slate-100">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-6 w-48 rounded-md" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
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
                <h4 className="text-base sm:text-lg font-extrabold text-[#0f172a] group-hover:text-yellow-500 transition-colors">Badminton Court Session</h4>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-yellow-500" />
                    {upcoming.booking_date ? format(new Date(upcoming.booking_date), 'EEE, dd MMM yyyy') : ''}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    {upcoming.start_time} - {upcoming.end_time}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-yellow-500" /> Karaveddy Court
                </span>
                <span className="text-xs font-black text-yellow-500 flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" /> Click for Details
                </span>
              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center text-center justify-center h-full">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 text-slate-900 border border-yellow-400/40 flex items-center justify-center mb-4 font-black">
                <Calendar className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-base font-extrabold text-[#0f172a] mb-1">No Upcoming Bookings</h3>
              <p className="text-slate-500 text-xs mb-6 max-w-xs font-medium">You don't have any active court sessions scheduled.</p>
              <Link href="/availability" className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black text-xs rounded-xl border border-yellow-500 shadow-sm transition-all">
                Book a Court Now
              </Link>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-yellow-400 text-slate-900 border border-yellow-500 flex items-center justify-center mb-6 shadow-sm">
            <Search className="w-6 h-6 text-slate-900" />
          </div>
          <h3 className="text-base font-extrabold text-[#0f172a] mb-2">Check Availability</h3>
          <p className="text-slate-500 text-xs font-medium mb-6 flex-1 leading-relaxed">
            Find open slots and reserve your playing time instantly.
          </p>
          <Link href="/availability" className="text-yellow-500 hover:text-yellow-600 font-black text-xs flex items-center gap-2 hover:underline">
            View Schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-yellow-400 text-slate-900 border border-yellow-500 flex items-center justify-center mb-6 shadow-sm">
            <List className="w-6 h-6 text-slate-900" />
          </div>
          <h3 className="text-base font-extrabold text-[#0f172a] mb-2">My Bookings</h3>
          <p className="text-slate-500 text-xs font-medium mb-6 flex-1 leading-relaxed">
            Manage upcoming and past court reservation records.
          </p>
          <Link href="/dashboard/bookings" className="text-yellow-500 hover:text-yellow-600 font-black text-xs flex items-center gap-2 hover:underline">
            View All Bookings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Booking History Section - Apple Wallet Style Card List */}
      <div>
        <h2 className="text-lg font-extrabold text-[#0f172a] mb-3 tracking-tight">Recent Booking History</h2>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-4 w-32 rounded-md" />
                      <Skeleton className="h-3 w-48 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          ) : history.length > 0 ? history.map((item) => {
            const statusInfo = computeBookingStatus(item);
            return (
            <div
              key={item.id}
              onClick={() => setSelectedBooking(item)}
              className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-slate-900 font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                  KC
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">Badminton Session</h4>
                  <p className="text-[11px] font-semibold text-slate-500 truncate">
                    #KC-{item.id} • {item.booking_date ? format(new Date(item.booking_date), 'dd MMM yyyy') : ''}
                  </p>
                  <p className="text-[10px] font-bold text-slate-700 truncate">
                    {item.start_time} - {item.end_time}
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
          )}) : (
            <div className="p-6 text-center text-xs font-bold text-slate-400">
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

      {/* Membership Request Modal */}
      <MembershipRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={() => fetchDashboardData()}
      />

    </div>
  );
}
