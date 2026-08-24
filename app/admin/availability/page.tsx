"use client";

import React, { useState } from 'react';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import Clock from '@mui/icons-material/AccessTime';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function AdminAvailabilityPage() {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  const slots = [
    { time: '06:00 AM - 07:00 AM', status: 'Booked', user: 'Ashan Perera' },
    { time: '07:00 AM - 08:00 AM', status: 'Blocked', user: null },
    { time: '08:00 AM - 09:00 AM', status: 'Available', user: null },
    { time: '09:00 AM - 10:00 AM', status: 'Available', user: null },
    { time: '04:00 PM - 05:00 PM', status: 'Pending', user: 'Suresh Perera' },
    { time: '05:00 PM - 06:00 PM', status: 'Booked', user: 'Kamil De Silva' },
    { time: '06:00 PM - 07:00 PM', status: 'Available', user: null },
    { time: '07:00 PM - 08:00 PM', status: 'Available', user: null },
    { time: '08:00 PM - 09:00 PM', status: 'Booked', user: 'Dilshan' },
    { time: '09:00 PM - 10:00 PM', status: 'Blocked', user: null },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">
          Court Availability Management
        </h1>
        <p className="text-slate-500 text-sm">
          Block or open time slots for maintenance, tournaments, or custom events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Calendar Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6 flex justify-center items-start">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="rounded-md border-0"
            />
          </div>
        </div>

        {/* Slots Content */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {calendarDate ? format(calendarDate, "EEEE, MMMM dd, yyyy") : "Selected Date"}
              </h2>
              
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Blocked
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Booked
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-[#f8fafc] hover:border-blue-200 transition-all gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm tracking-tight block">{slot.time}</span>
                      {slot.user && (
                        <span className="text-[11px] font-bold text-blue-600 mt-1 block">Booked by: {slot.user}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {slot.status === 'Booked' && (
                      <span className="text-blue-600 font-extrabold text-[10px] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Booked</span>
                    )}

                    {slot.status === 'Pending' && (
                      <span className="text-amber-600 font-extrabold text-[10px] bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">Pending</span>
                    )}

                    {slot.status === 'Blocked' && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-extrabold text-[10px] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">Blocked</span>
                        <button className="bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-colors">
                          Unblock
                        </button>
                      </div>
                    )}

                    {slot.status === 'Available' && (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-extrabold text-[10px] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">Available</span>
                        <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-colors">
                          Block
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
