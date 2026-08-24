'use client';
import React, { useState, useEffect } from 'react';
import Clock from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/navigation';
import BookingModal from '@/components/BookingModal';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function DashboardAvailabilityPage() {
  const router = useRouter();
  const isLoggedIn = true; // Mock authentication state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleBookNow = (slot: any) => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setSelectedSlot({
        date: calendarDate ? format(calendarDate, "EEEE, dd MMMM yyyy") : "No date selected",
        time: slot.time,
        court_id: 1,
        start_time: slot.start_time,
        end_time: slot.end_time,
        rawDate: calendarDate ? format(calendarDate, 'yyyy-MM-dd') : ''
      });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="p-6 md:p-10 w-full space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex justify-end gap-6">

        <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-slate-100 shadow-sm">
          <span className="text-slate-500 text-body-sm font-semibold">Operating Hours:</span>
          <span className="text-slate-900 text-body-sm font-bold">Mon-Sun | 6:00 AM - 10:00 PM</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Calendar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex justify-center items-start">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md border-0"
            />
          </div>
        </div>

        {/* Right Main Content - Slots */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            {/* Header and Legend */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
              <h2 className="text-subtitle font-bold text-slate-900 tracking-tight">
                Available Slots for {calendarDate ? format(calendarDate, "EEEE, MMM dd") : "Selected Date"}
              </h2>

              <div className="flex items-center gap-4 text-caption font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span> Pending
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Booked
                </div>
              </div>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-[#f8fafc] hover:border-yellow-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-800 text-body-sm tracking-tight">{slot.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {slot.status === 'Booked' && (
                      <span className="text-red-500 font-bold text-caption bg-red-50 px-3 py-1.5 rounded-lg">Booked</span>
                    )}

                    {slot.status === 'Pending' && (
                      <span className="bg-orange-100 text-orange-600 font-bold text-caption px-3 py-1.5 rounded-lg uppercase tracking-wider">
                        Pending Admin Approval
                      </span>
                    )}

                    {slot.status === 'Available' && (
                      <>
                        <span className="text-emerald-500 font-bold text-caption mr-2 bg-emerald-50 px-3 py-1.5 rounded-lg">Available</span>
                        <button
                          onClick={() => handleBookNow(slot)}
                          className="bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-caption px-5 py-2.5 rounded-lg transition shadow-sm"
                        >
                          Book Now
                        </button>
                      </>
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
