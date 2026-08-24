"use client";

import React, { useState, useEffect } from 'react';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import Clock from '@mui/icons-material/AccessTime';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import api from '@/lib/axios';
import { toast } from 'sonner';
import BookingModal from '@/components/BookingModal';

export default function AdminAvailabilityPage() {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<{ time: string; status: string; start_time: string; end_time: string; user?: string | null }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const handleBookNow = (slot: any) => {
    setSelectedSlot({
      date: calendarDate ? format(calendarDate, "EEEE, dd MMMM yyyy") : "No date selected",
      time: slot.time,
      court_id: 1,
      start_time: slot.start_time,
      end_time: slot.end_time,
      rawDate: calendarDate ? format(calendarDate, 'yyyy-MM-dd') : ''
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!calendarDate) return;
      setIsLoading(true);
      try {
        const dateStr = format(calendarDate, 'yyyy-MM-dd');
        const res = await api.get(`/availability?date=${dateStr}&court_id=1`).catch(() => ({ data: [] }));
        
        const formatTime = (timeStr: string) => {
          if (!timeStr) return '';
          const [hours, minutes] = timeStr.split(':');
          const d = new Date();
          d.setHours(parseInt(hours, 10));
          d.setMinutes(parseInt(minutes, 10));
          return format(d, 'hh:mm a');
        };

        const backendSlots = res.data || [];
        const hardcodedSlots = [];

        for (let hour = 6; hour < 22; hour++) {
          const startStr = `${hour.toString().padStart(2, '0')}:00:00`;
          const endStr = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
          const backendSlot = backendSlots.find((bs: any) => bs.start_time === startStr);
          
          hardcodedSlots.push({
            time: `${formatTime(startStr)} - ${formatTime(endStr)}`,
            status: backendSlot ? backendSlot.status : 'Available',
            start_time: startStr,
            end_time: endStr,
            user: backendSlot?.user
          });
        }
        setSlots(hardcodedSlots);
      } catch (error) {
        toast.error('Failed to load availability');
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, [calendarDate]);

  return (
    <div className="p-6 md:p-10 w-full space-y-8 pb-20 min-h-screen">
      


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
                        <button onClick={() => handleBookNow(slot)} className="bg-[#fbbf24] text-slate-900 hover:bg-[#f5b81a] text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-colors">
                          Book
                        </button>
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

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSlots={selectedSlot ? [selectedSlot] : []}
      />
    </div>
  );
}
