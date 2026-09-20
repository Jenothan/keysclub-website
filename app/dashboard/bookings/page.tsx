'use client';

import React, { useState, useEffect } from 'react';
import Calendar from '@mui/icons-material/CalendarMonth';
import Clock from '@mui/icons-material/AccessTime';
import MapPin from '@mui/icons-material/LocationOn';
import Search from '@mui/icons-material/Search';
import EyeIcon from '@mui/icons-material/Visibility';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { computeBookingStatus, groupBookings, GroupedBooking } from '@/lib/bookingUtils';
import { Skeleton } from '@/components/ui/skeleton';
import BookingDetailsModal from '@/components/BookingDetailsModal';
import RescheduleModal from '@/components/RescheduleModal';

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<GroupedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<GroupedBooking | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/bookings?tab=${activeTab}`);
      const grouped = groupBookings(response.data);
      setBookings(grouped);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await api.post(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled successfully');
      setSelectedBooking(null);
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    const ref = (b.booking_reference || '').toLowerCase();
    const idStr = b.id?.toString() || '';
    const timeDisp = (b.time_display || `${b.start_time} - ${b.end_time}`).toLowerCase();
    return ref.includes(query) || idStr.includes(query) || timeDisp.includes(query);
  });

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-6 md:space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
          My Court Bookings
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Track upcoming reservation requests, view status updates, and review past play sessions. Click any booking to view details.
        </p>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={cn(
              "flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer",
              activeTab === 'upcoming' 
                ? "bg-[#0f172a] text-white shadow-md" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={cn(
              "flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer",
              activeTab === 'past' 
                ? "bg-[#0f172a] text-white shadow-md" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            Past Bookings
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto px-2 sm:px-0">
          <div className="relative flex-1 sm:flex-none sm:min-w-62.5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search booking ID or time..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-yellow-400 transition-colors font-medium"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: APPLE-WALLET STYLE CARD TRANSACTION LIST                 */}
      {/* ========================================================================= */}
      <div className="block md:hidden">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const bookingDate = booking.booking_date ? new Date(booking.booking_date) : new Date();
              const statusInfo = computeBookingStatus(booking);

              return (
                <div
                  key={booking.booking_reference || booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-slate-900 font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                      KC
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-slate-900 text-xs truncate">Badminton Session</h4>
                        {(booking.total_slots_count || (booking.slots && booking.slots.length)) > 1 && (
                          <span className="text-[9px] font-black text-slate-700 bg-yellow-100 border border-yellow-300 px-1.5 py-0.5 rounded-md">
                            {booking.total_slots_count || booking.slots.length} Slots
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 truncate">
                        {booking.booking_reference} • {format(bookingDate, 'dd MMM yyyy')}
                      </p>
                      <p className="text-[10px] font-bold text-amber-700 truncate">
                        {booking.time_display || `${booking.start_time} - ${booking.end_time}`}
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
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-500">No {activeTab} bookings found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP VIEW: DETAILED BOOKING CARDS LIST                             */}
      {/* ========================================================================= */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-6">
                  <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-16 rounded-md" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                  <Skeleton className="h-10 w-28 rounded-lg shrink-0" />
                </div>
              ))}
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const bookingDate = booking.booking_date ? new Date(booking.booking_date) : new Date();
                const statusInfo = computeBookingStatus(booking);

                return (
                  <div 
                    key={booking.booking_reference || booking.id} 
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:border-yellow-400 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    {/* Date & Details */}
                    <div className="flex items-start lg:items-center gap-5 flex-1 min-w-0">
                      <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center w-16 h-16 border border-slate-100 group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-colors shrink-0">
                        <span className="text-xl font-black text-slate-900 leading-none group-hover:text-slate-900">
                          {format(bookingDate, 'dd')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                          {format(bookingDate, 'MMM')}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-slate-900 tracking-wider bg-yellow-400/20 text-yellow-950 border border-yellow-400/40 px-2.5 py-0.5 rounded-md">
                            {booking.booking_reference}
                          </span>
                          {(booking.total_slots_count || (booking.slots && booking.slots.length)) > 1 && (
                            <span className="text-[10px] font-black text-slate-700 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {booking.total_slots_count || booking.slots.length} Slots
                            </span>
                          )}
                          <span className={cn("text-xs font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs", statusInfo.badgeClass)}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-yellow-600 transition-colors">
                          Badminton Court Session
                        </h3>
                        
                        {/* Slot Time Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                          {booking.time_ranges && booking.time_ranges.length > 0 ? (
                            booking.time_ranges.map((tr: string, idx: number) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-slate-50 text-slate-800 border border-slate-200 px-3 py-1 rounded-xl">
                                <Clock className="w-3.5 h-3.5 text-yellow-500" />
                                {tr}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-slate-50 text-slate-800 border border-slate-200 px-3 py-1 rounded-xl">
                              <Clock className="w-3.5 h-3.5 text-yellow-500" />
                              {booking.start_time} - {booking.end_time}
                            </span>
                          )}

                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 ml-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            Karanavai East, Karaveddy
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="flex-1 lg:flex-none text-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <EyeIcon className="w-4 h-4 text-slate-500" /> View Details
                      </button>
                      {activeTab === 'upcoming' && booking.status !== 'Cancelled' && statusInfo.status !== 'Completed' && (
                        <button 
                          onClick={() => handleCancel(booking.id)} 
                          className="flex-1 lg:flex-none text-center bg-red-50 hover:bg-red-100 text-red-600 font-extrabold px-5 py-2.5 rounded-xl border border-red-200/60 transition-colors text-xs cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No bookings found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                You don't have any {activeTab} bookings matching your search. Ready to play?
              </p>
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
        onReschedule={(b) => setRescheduleBooking(b)}
        onCancel={handleCancel}
      />

      {/* Reschedule Modal */}
      {rescheduleBooking && (
        <RescheduleModal
          isOpen={!!rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          booking={rescheduleBooking}
          isAdmin={false}
          onSuccess={() => {
            setRescheduleBooking(null);
            fetchBookings();
          }}
        />
      )}

    </div>
  );
}

