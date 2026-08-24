"use client";

import React from 'react';
import Calendar from '@mui/icons-material/CalendarMonth';
import LayoutGrid from '@mui/icons-material/GridView';
import MoreVertical from '@mui/icons-material/MoreVert';
import { Input } from '@/components/ui/input';

export default function AdminBookingsPage() {
  const allBookings = [
    {
      name: 'Ashan Perera',
      mobile: '077 123 4567',
      id: '#KC-89420',
      requestDate: '25 Oct 2026',
      selectedSlot: 'Tomorrow 06:00 PM',
      notes: 'Requires extra shuttlecocks',
      status: 'Pending'
    },
    {
      name: 'Suresh Perera',
      mobile: '077 765 4321',
      id: '#KC-89419',
      requestDate: '24 Oct 2026',
      selectedSlot: 'Tomorrow 08:00 PM',
      notes: 'Umpire chair requested',
      status: 'Confirmed'
    },
    {
      name: 'Mahela Jayawardene',
      mobile: '071 222 3333',
      id: '#KC-89418',
      requestDate: '24 Oct 2026',
      selectedSlot: '28 Oct 05:00 PM',
      notes: 'None',
      status: 'Rejected'
    },
    {
      name: 'Kusal Mendis',
      mobile: '072 333 4444',
      id: '#KC-89417',
      requestDate: '23 Oct 2026',
      selectedSlot: '29 Oct 07:00 PM',
      notes: 'Training practice pass holder',
      status: 'Pending'
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">
          Booking Inquiries
        </h1>
        <p className="text-slate-500 text-sm">
          Review and manage incoming hourly and full-day booking requests.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        
        <div className="relative flex-1 w-full">
          <LayoutGrid className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search Name or ID..." 
            className="pl-12 h-12 bg-white border-slate-200 focus:border-blue-500 w-full font-medium"
          />
        </div>

        <div className="relative flex-1 w-full">
          <select className="h-12 w-full appearance-none bg-white border border-slate-200 rounded-md pl-4 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Rejected</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </div>
        </div>

        <div className="relative flex-1 w-full">
          <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Filter by Date" 
            className="pl-12 h-12 bg-white border-slate-200 focus:border-blue-500 w-full font-medium"
          />
        </div>

        <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm h-12 px-8 rounded-md transition-colors w-full md:w-auto shrink-0 shadow-md">
          Apply Filters
        </button>
        
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div className="overflow-x-auto p-4 md:p-6 pb-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-extrabold text-slate-600 bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 rounded-l-lg">User & Mobile</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4">Selected Slot</th>
                <th className="px-6 py-4">Notes / Specific Request</th>
                <th className="px-2 py-4"></th>
                <th className="px-2 py-4 rounded-r-lg"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allBookings.map((req, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-extrabold text-[#0f172a]">{req.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5 font-medium">{req.mobile}</p>
                  </td>
                  <td className="px-6 py-5 font-extrabold text-[#0f172a]">{req.id}</td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{req.requestDate}</td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{req.selectedSlot}</td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{req.notes}</td>
                  <td className="px-2 py-5 text-right whitespace-nowrap">
                    {req.status === 'Pending' && (
                      <span className="text-amber-500 bg-amber-50 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Pending</span>
                    )}
                    {req.status === 'Confirmed' && (
                      <span className="text-[#10b981] bg-emerald-50 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Confirmed</span>
                    )}
                    {req.status === 'Rejected' && (
                      <span className="text-red-500 bg-red-50 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Rejected</span>
                    )}
                  </td>
                  <td className="px-4 py-5 w-24">
                    {req.status === 'Pending' ? (
                      <div className="flex flex-col gap-1.5">
                        <button className="bg-[#10b981] hover:bg-[#059669] text-white text-[10px] font-extrabold px-3 py-1.5 rounded transition-colors text-center w-20 tracking-wide">
                          Confirm
                        </button>
                        <button className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-[10px] font-extrabold px-3 py-1.5 rounded transition-colors text-center w-20 tracking-wide">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <LayoutGrid className="w-4 h-4 text-blue-500" />
            Confirmed slots automatically become unavailable to other users
          </div>
          
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-md shadow-sm">
              1
            </button>
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors">
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
