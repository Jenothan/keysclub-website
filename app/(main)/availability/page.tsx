'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BookingModal from '@/components/BookingModal';
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AvailabilityPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string; court: string; court_id: number; start_time: string; end_time: string; rawDate: string } | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<{ time: string; status: string; start_time: string; end_time: string; court_id: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!calendarDate) return;
      setIsLoading(true);
      try {
        const dateStr = format(calendarDate, 'yyyy-MM-dd');
        // Defaulting court_id to 1 as per example, could be dynamic later
        const res = await api.get(`/availability?date=${dateStr}&court_id=1`);
        setSlots(res.data);
      } catch (error) {
        toast.error('Failed to load availability');
        setSlots([]); // clear on error
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
        court: 'Court A - Professional Mat',
        court_id: slot.court_id || 1,
        start_time: slot.start_time,
        end_time: slot.end_time,
        rawDate: calendarDate ? format(calendarDate, 'yyyy-MM-dd') : ''
      });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-0">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-title font-black text-[#0f172a] tracking-tight mb-2">
              Badminton Court Availability
            </h1>
            <p className="text-slate-500 text-body">
              Choose a date to see available booking times.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-4 py-2 border border-slate-200">
            <span className="text-slate-500 text-body-sm font-semibold">Operating Hours:</span>
            <span className="text-slate-900 text-body-sm font-bold">Mon-Sun | 6:00 AM - 10:00 PM</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar - Calendar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">

              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={calendarDate}
                  onSelect={setCalendarDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border-0"
                />
              </div>
            </div>
          </div>

          {/* Right Main Content - Slots */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8">

              {/* Header and Legend */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-subtitle font-extrabold text-slate-900 tracking-tight">
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
                {isLoading ? (
                  <div className="col-span-full py-10 flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-slate-500 font-bold">
                    No slots available for this date.
                  </div>
                ) : (
                  slots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-[#f8fafc] hover:border-slate-200 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-800 text-body-sm tracking-tight">{slot.time}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {slot.status === 'Booked' && (
                          <span className="text-red-500 font-bold text-caption">Booked</span>
                        )}

                        {slot.status === 'Pending' && (
                          <span className="bg-orange-100 text-orange-600 font-bold text-caption px-3 py-1.5 rounded-full uppercase tracking-wider">
                            Pending Admin Approval
                          </span>
                        )}

                        {slot.status === 'Available' && (
                          <>
                            <span className="text-emerald-500 font-bold text-caption mr-2">Available</span>
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
                  ))
                )}
              </div>

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
