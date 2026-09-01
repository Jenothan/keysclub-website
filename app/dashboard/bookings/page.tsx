'use client';

import React, { useState, useEffect } from 'react';
import Calendar from '@mui/icons-material/CalendarMonth';
import Clock from '@mui/icons-material/AccessTime';
import MapPin from '@mui/icons-material/LocationOn';
import Search from '@mui/icons-material/Search';
import Filter from '@mui/icons-material/FilterList';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'Pending':
        return 'bg-yellow-400/10 text-slate-900 border border-yellow-400 font-extrabold';
      case 'Cancelled':
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-8 pb-20">
      

      {/* Tabs and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={cn(
              "flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
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
              "flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
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
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search booking ID..." 
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
          <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 p-2.5 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading...</div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const bookingDate = booking.booking_date ? new Date(booking.booking_date) : new Date();
              return (
              <div 
                key={booking.id} 
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-6 group hover:border-yellow-400 hover:shadow-md transition-all duration-300"
              >
                {/* Date Box */}
                <div className="flex items-center gap-4 lg:w-48">
                  <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center w-16 h-16 border border-slate-100 group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-colors">
                    <span className="text-xl font-black text-slate-900 leading-none group-hover:text-slate-900">{format(bookingDate, 'dd')}</span>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{format(bookingDate, 'MMM')}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-400 tracking-wider uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                        #KC-{booking.id}
                      </span>
                      <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full", getStatusBadge(booking.status))}>
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Badminton Session</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {booking.start_time} - {booking.end_time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        Karanavai East, Point Pedro
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 lg:ml-auto">
                  <button className="flex-1 lg:flex-none text-center bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-lg transition-colors text-sm">
                    View Details
                  </button>
                  {activeTab === 'upcoming' && booking.status !== 'Cancelled' && (
                    <button onClick={() => handleCancel(booking.id)} className="flex-1 lg:flex-none text-center bg-red-50 hover:bg-red-100 text-red-600 font-bold px-6 py-2.5 rounded-lg transition-colors text-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No bookings found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              You don't have any {activeTab} bookings at the moment. Ready to play?
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
