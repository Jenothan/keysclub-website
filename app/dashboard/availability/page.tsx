'use client';
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BookingModal from '@/components/BookingModal';
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function DashboardAvailabilityPage() {
  const router = useRouter();
  const isLoggedIn = true; // Mock authentication state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string; court: string } | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  const handleBookNow = (time: string) => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setSelectedSlot({
        date: calendarDate ? format(calendarDate, "EEEE, dd MMMM yyyy") : "No date selected",
        time: time,
        court: 'Court A - Professional Mat'
      });
      setIsModalOpen(true);
    }
  };

  // Mock data for the slots to render them nicely
  const slots = [
    { time: '06:00 AM - 07:00 AM', status: 'Booked' },
    { time: '07:00 AM - 08:00 AM', status: 'Booked' },
    { time: '08:00 AM - 09:00 AM', status: 'Available' },
    { time: '09:00 AM - 10:00 AM', status: 'Available' },
    { time: '04:00 PM - 05:00 PM', status: 'Pending' },
    { time: '05:00 PM - 06:00 PM', status: 'Booked' },
    { time: '06:00 PM - 07:00 PM', status: 'Available' },
    { time: '07:00 PM - 08:00 PM', status: 'Available' },
    { time: '08:00 PM - 09:00 PM', status: 'Booked' },
    { time: '09:00 PM - 10:00 PM', status: 'Available' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mb-2">
            Badminton Court Availability
          </h1>
          <p className="text-slate-500 text-body">
            Choose a date to see available booking times.
          </p>
        </div>

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
                          onClick={() => handleBookNow(slot.time)}
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
        selectedSlot={selectedSlot}
      />
    </div>
  );
}
