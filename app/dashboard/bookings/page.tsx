'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Mock Data
  const upcomingBookings = [
    {
      id: '#KC-89102',
      date: '24 Oct 2026',
      time: '05:00 PM - 06:00 PM',
      status: 'Confirmed'
    },
    {
      id: '#KC-88741',
      date: '20 Oct 2026',
      time: '07:00 PM - 08:00 PM',
      status: 'Pending'
    }
  ];

  const pastBookings = [
    {
      id: '#KC-87241',
      date: '10 Oct 2026',
      time: '04:00 PM - 05:00 PM',
      status: 'Completed'
    },
    {
      id: '#KC-86102',
      date: '05 Oct 2026',
      time: '06:00 PM - 08:00 PM',
      status: 'Cancelled'
    }
  ];

  const bookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mb-2">
            My Bookings
          </h1>
          <p className="text-slate-500 text-body">
            View and manage your reservations and history.
          </p>
        </div>
      </div>

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
          <div className="relative flex-1 sm:flex-none sm:min-w-[250px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search booking ID..." 
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 p-2.5 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {bookings.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6 group">
                
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1">
                  {/* Date Badge */}
                  <div className="bg-slate-100 rounded-xl p-3 flex flex-col items-center justify-center min-w-[80px] shrink-0 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-500">{booking.date.split(' ')[1]}</span>
                    <span className="text-2xl font-black text-[#0f172a] leading-none group-hover:text-blue-700">{booking.date.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">{booking.date.split(' ')[2]}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-400 tracking-wider uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                        {booking.id}
                      </span>
                      <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full", getStatusBadge(booking.status))}>
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Badminton Session</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {booking.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        Karanavai East, Point Pedro
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                  <button className="flex-1 lg:flex-none text-center bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-lg transition-colors text-sm">
                    View Details
                  </button>
                  {activeTab === 'upcoming' && (
                    <button className="flex-1 lg:flex-none text-center bg-red-50 hover:bg-red-100 text-red-600 font-bold px-6 py-2.5 rounded-lg transition-colors text-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
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
