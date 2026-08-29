"use client";

import React, { useState, useEffect } from 'react';
import Clock from '@mui/icons-material/AccessTime';
import Calendar from '@mui/icons-material/CalendarMonth';
import ShieldCheck from '@mui/icons-material/GppGood';
import MessageSquare from '@mui/icons-material/ChatBubbleOutlineOutlined';
import api from '@/lib/axios';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    todays_bookings: 0,
    pending_requests: 0,
    confirmed_bookings: 0,
    new_inquiries: 0
  });

  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    
    const fetchRecentBookings = async () => {
      try {
        const response = await api.get('/admin/bookings');
        setRecentRequests(response.data.slice(0, 5)); // First 5
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      }
    };

    fetchStats();
    fetchRecentBookings();
  }, []);

  return (
    <div className="p-6 md:p-10 w-full space-y-8 pb-20">
      


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Today's Bookings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500">Today's Bookings</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.todays_bookings.toString().padStart(2, '0')}</h3>
            <span className="text-lg font-bold text-[#0f172a]">Sessions</span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500">Pending Requests</span>
            <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.pending_requests.toString().padStart(2, '0')}</h3>
            <span className="text-lg font-bold text-[#0f172a]">Slots</span>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500">Confirmed Bookings</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.confirmed_bookings.toString().padStart(2, '0')}</h3>
            <span className="text-lg font-bold text-[#0f172a]">Slots</span>
          </div>
        </div>

        {/* New Inquiries */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500">New Inquiries</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-[#0f172a]">{stats.new_inquiries.toString().padStart(2, '0')}</h3>
            <span className="text-lg font-bold text-[#0f172a]">Messages</span>
          </div>
        </div>

      </div>

      {/* Recent Booking Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#0f172a]">Recent Booking Requests</h3>
          <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold text-xs h-9 px-4 rounded-md transition-colors">
            View All Requests
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs font-bold text-slate-500 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Booking Date</th>
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req, i) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    {req.user ? (
                      <span className="font-bold text-[#0f172a] block">{req.user.name}</span>
                    ) : (
                      <span className="font-bold text-[#0f172a] block">{req.customer_name || 'Walk-in'}</span>
                    )}
                    {req.booked_by && (
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wide block mt-0.5">
                        By {req.booked_by.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{req.user?.phone || req.customer_phone || '-'}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{req.booking_date}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{req.start_time} - {req.end_time}</td>
                  <td className="px-6 py-4 font-extrabold text-[#0f172a]">#KC-{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      {req.status === 'Pending' && (
                        <span className="text-yellow-600 bg-yellow-50 font-bold text-xs px-2.5 py-1 rounded-md w-20 text-center">Pending</span>
                      )}
                      {req.status === 'Confirmed' && (
                        <span className="text-emerald-600 bg-emerald-50 font-bold text-xs px-2.5 py-1 rounded-md w-20 text-center">Confirmed</span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="text-red-600 bg-red-50 font-bold text-xs px-2.5 py-1 rounded-md w-20 text-center">Rejected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
