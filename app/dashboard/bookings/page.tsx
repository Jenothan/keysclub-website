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
import { computeBookingStatus } from '@/lib/bookingUtils';
import BookingDetailsModal from '@/components/BookingDetailsModal';

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/bookings?tab=${activeTab}`);
      setBookings(response.data);
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

  const filteredBookings = bookings.filter(b => 
    !searchTerm.trim() || 
    b.id?.toString().includes(searchTerm) || 
    b.start_time?.includes(searchTerm) ||
    b.end_time?.includes(searchTerm)
  );

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
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const bookingDate = booking.booking_date ? new Date(booking.booking_date) : new Date();
              const statusInfo = computeBookingStatus(booking);

              return (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-slate-900 font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                      KC
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">Badminton Court Session</h4>
                      <p className="text-[11px] font-semibold text-slate-500 truncate">
                        #KC-{booking.id} • {format(bookingDate, 'dd MMM yyyy')}
                      </p>
                      <p className="text-[10px] font-bold text-slate-700 truncate">
                        {booking.start_time} - {booking.end_time}
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
            <div className="py-16 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const bookingDate = booking.booking_date ? new Date(booking.booking_date) : new Date();
                const statusInfo = computeBookingStatus(booking);
                return (
                <div 
                  key={booking.id} 
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-6 group hover:border-yellow-400 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  {/* Date Box */}
                  <div className="flex items-center gap-4 lg:w-48">
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center w-16 h-16 border border-slate-100 group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-colors shrink-0">
                      <span className="text-xl font-black text-slate-900 leading-none group-hover:text-slate-900">{format(bookingDate, 'dd')}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{format(bookingDate, 'MMM')}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-slate-400 tracking-wider uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                          #KC-{booking.id}
                        </span>
                        <span className={cn("text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs", statusInfo.badgeClass)}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-yellow-600 transition-colors">Badminton Session</h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {booking.start_time} - {booking.end_time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          Karanavai East, Karaveddy
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 lg:ml-auto" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="flex-1 lg:flex-none text-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-lg transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <EyeIcon className="w-4 h-4" /> View Details
                    </button>
                    {activeTab === 'upcoming' && booking.status !== 'Cancelled' && statusInfo.status !== 'Completed' && (
                      <button onClick={() => handleCancel(booking.id)} className="flex-1 lg:flex-none text-center bg-red-50 hover:bg-red-100 text-red-600 font-bold px-5 py-2.5 rounded-lg transition-colors text-xs cursor-pointer">
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              )})}
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
        onCancel={handleCancel}
      />

    </div>
  );
}
