import React from 'react';
import { Clock, Calendar, ShieldCheck, MessageSquare } from 'lucide-react';

export default function AdminDashboardPage() {
  const recentRequests = [
    {
      name: 'Ashan Perera',
      mobile: '077 123 4567',
      date: '27 Oct 2026',
      time: '06:00 PM - 07:00 PM',
      id: '#KC-89420',
      status: 'Pending'
    },
    {
      name: 'Dilshan Silva',
      mobile: '071 987 6543',
      date: '27 Oct 2026',
      time: '07:00 PM - 08:00 PM',
      id: '#KC-89421',
      status: 'Pending'
    },
    {
      name: 'Kamil De Silva',
      mobile: '076 543 2109',
      date: '28 Oct 2026',
      time: '04:00 PM - 05:00 PM',
      id: '#KC-89422',
      status: 'Confirmed'
    },
    {
      name: 'Sajith Bandara',
      mobile: '075 111 2222',
      date: '28 Oct 2026',
      time: '05:00 PM - 06:00 PM',
      id: '#KC-89423',
      status: 'Rejected'
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 text-sm">
          Monitor court schedules, manage incoming booking inquiries, and oversee operations in Karanavai East.
        </p>
      </div>

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
            <h3 className="text-3xl font-extrabold text-[#0f172a]">12</h3>
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
            <h3 className="text-3xl font-extrabold text-[#0f172a]">08</h3>
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
            <h3 className="text-3xl font-extrabold text-[#0f172a]">24</h3>
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
            <h3 className="text-3xl font-extrabold text-[#0f172a]">03</h3>
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
          <table className="w-full text-sm text-left">
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
                <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#0f172a]">{req.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{req.mobile}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{req.date}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{req.time}</td>
                  <td className="px-6 py-4 font-extrabold text-[#0f172a]">{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      {req.status === 'Pending' && (
                        <span className="text-yellow-600 bg-yellow-50 font-bold text-xs px-2.5 py-1 rounded-md w-[80px] text-center">Pending</span>
                      )}
                      {req.status === 'Confirmed' && (
                        <span className="text-emerald-600 bg-emerald-50 font-bold text-xs px-2.5 py-1 rounded-md w-[80px] text-center">Confirmed</span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="text-red-600 bg-red-50 font-bold text-xs px-2.5 py-1 rounded-md w-[80px] text-center">Rejected</span>
                      )}
                      
                      <div className="flex flex-col gap-1 ml-4 w-16">
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded transition-colors flex items-center justify-center w-full">
                          Confirm
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded transition-colors flex items-center justify-center w-full">
                          Reject
                        </button>
                        <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded transition-colors flex items-center justify-center w-full">
                          Cancel
                        </button>
                      </div>
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
