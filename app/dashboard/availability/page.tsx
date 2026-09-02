'use client';
import React, { useState, useEffect } from 'react';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Clock from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/navigation';
import BookingModal from '@/components/BookingModal';
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function DashboardAvailabilityPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<{ time: string; status: string; start_time: string; end_time: string; court_id: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAvailability = async () => {
    if (!calendarDate) return;
    setIsLoading(true);
    try {
      const dateStr = format(calendarDate, 'yyyy-MM-dd');
      const res = await api.get(`/availability?date=${dateStr}`);
      
      const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const d = new Date();
        d.setHours(parseInt(hours, 10));
        d.setMinutes(parseInt(minutes, 10));
        return format(d, 'hh:mm a');
      };

      const backendSlots = res.data || [];
      const activeCourtId = backendSlots[0]?.court_id || 1;
      const hardcodedSlots = [];

      const selectedDateStr = format(calendarDate, 'yyyy-MM-dd');
      const todayDateStr = format(new Date(), 'yyyy-MM-dd');
      const isSelectedToday = selectedDateStr === todayDateStr;
      const isSelectedPastDate = selectedDateStr < todayDateStr;

      for (let hour = 6; hour < 22; hour++) {
        const startStr = `${hour.toString().padStart(2, '0')}:00:00`;
        const endStr = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
        
        const backendSlot = backendSlots.find((bs: any) => bs.start_time === startStr);
        let status = backendSlot ? backendSlot.status : 'Available';

        if (isSelectedPastDate) {
          status = 'Past';
        } else if (isSelectedToday) {
          const now = new Date();
          const slotStartTime = new Date();
          slotStartTime.setHours(hour, 0, 0, 0);
          if (now >= slotStartTime && status === 'Available') {
            status = 'Past';
          }
        }
        
        hardcodedSlots.push({
          time: `${formatTime(startStr)} - ${formatTime(endStr)}`,
          status,
          start_time: startStr,
          end_time: endStr,
          court_id: backendSlot?.court_id || activeCourtId
        });
      }
      
      setSlots(hardcodedSlots);
      setSelectedSlots([]);
    } catch (error) {
      toast.error('Failed to load availability');
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [calendarDate]);

  const handleToggleSlot = (slot: any) => {
    const isSelected = selectedSlots.some(s => s.start_time === slot.start_time);
    if (isSelected) {
      setSelectedSlots(selectedSlots.filter(s => s.start_time !== slot.start_time));
    } else {
      setSelectedSlots([...selectedSlots, {
        date: calendarDate ? format(calendarDate, "EEEE, dd MMMM yyyy") : "No date selected", 
        time: slot.time,
        court: 'Court A - Professional Mat',
        court_id: slot.court_id || 1,
        start_time: slot.start_time,
        end_time: slot.end_time,
        rawDate: calendarDate ? format(calendarDate, 'yyyy-MM-dd') : ''
      }]);
    }
  };

  const handleBookSelected = () => {
    if (!isLoggedIn) {
      router.push('/login');
    } else if (selectedSlots.length > 0) {
      setIsModalOpen(true);
    } else {
      toast.error('Please select at least one available slot.');
    }
  };

  return (
    <div className="p-6 md:p-10 w-full space-y-10 pb-20">
      <div className="max-w-7xl mx-auto">

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
                    <span className="w-2 h-2 rounded-full bg-red-600"></span> Booked
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span> Blocked
                  </div>
                </div>
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {isLoading ? (
                  <div className="col-span-full py-10 flex justify-center">
                    <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-slate-500 font-bold">
                    No slots available for this date.
                  </div>
                ) : slots.every(s => s.status === 'Blocked') ? (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center bg-[#fff5f5] border border-rose-200 rounded-2xl">
                    <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-rose-950 mb-2">Date Blocked</h3>
                    <p className="text-rose-700 text-center max-w-md">This date has been blocked for maintenance or a scheduled tournament. Please select another date.</p>
                  </div>
                ) : (
                  slots.map((slot, index) => {
                    const isSelected = selectedSlots.some(s => s.start_time === slot.start_time);

                    let cardStyle = 'border-slate-100 bg-slate-50 opacity-70';
                    let clockStyle = 'bg-white text-slate-400';
                    let textStyle = 'text-slate-800';

                    if (isSelected) {
                      cardStyle = 'border-[#fbbf24] bg-[#fbbf24] text-slate-900 shadow-[0_0_0_1px_#fbbf24]';
                      clockStyle = 'bg-slate-900 text-[#fbbf24]';
                      textStyle = 'text-slate-900';
                    } else if (slot.status === 'Available') {
                      cardStyle = 'cursor-pointer hover:border-[#fbbf24] hover:shadow-sm bg-[#f8fafc] border-slate-200';
                      clockStyle = 'bg-white text-slate-400 group-hover:text-slate-900';
                      textStyle = 'text-slate-800';
                    } else if (slot.status === 'Past') {
                      cardStyle = 'bg-slate-100/80 border-slate-200 opacity-60 pointer-events-none cursor-not-allowed';
                      clockStyle = 'bg-slate-200 text-slate-400';
                      textStyle = 'text-slate-400 line-through';
                    } else if (slot.status === 'Booked') {
                      cardStyle = 'bg-red-50/90 border-red-200 shadow-xs';
                      clockStyle = 'bg-red-100 text-red-600';
                      textStyle = 'text-red-950';
                    } else if (slot.status === 'Pending') {
                      cardStyle = 'bg-amber-50/90 border-amber-200 shadow-xs';
                      clockStyle = 'bg-amber-100 text-amber-600';
                      textStyle = 'text-amber-950';
                    } else if (slot.status === 'Blocked') {
                      cardStyle = 'bg-rose-50/90 border-rose-200 shadow-xs';
                      clockStyle = 'bg-rose-100 text-rose-600';
                      textStyle = 'text-rose-950';
                    }

                    return (
                      <div
                        key={index}
                        onClick={() => slot.status === 'Available' && handleToggleSlot(slot)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          {slot.status === 'Available' && (
                            <div className="relative flex items-center justify-center w-5 h-5">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                readOnly
                                className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded focus:ring-[#fbbf24] checked:bg-slate-900 checked:border-slate-900 transition-colors cursor-pointer"
                              />
                              <svg className={`absolute w-3 h-3 text-white pointer-events-none transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          <div className={`p-2 rounded-lg shadow-sm transition-colors ${clockStyle}`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <span className={`font-bold text-body-sm tracking-tight ${textStyle}`}>{slot.time}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {slot.status === 'Past' && (
                            <span className="bg-slate-200 text-slate-500 font-extrabold text-caption px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                              Past Slot
                            </span>
                          )}

                          {slot.status === 'Booked' && (
                            <span className="bg-red-600 text-white font-black text-caption px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                              Booked
                            </span>
                          )}

                          {slot.status === 'Pending' && (
                            <span className="bg-amber-500 text-white font-extrabold text-caption px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                              Pending Admin
                            </span>
                          )}

                          {slot.status === 'Available' && (
                            <span className={`font-extrabold text-caption px-3.5 py-1.5 rounded-full uppercase tracking-wider ${isSelected ? 'bg-slate-900 text-[#fbbf24]' : 'bg-emerald-100 text-emerald-700'}`}>
                              {isSelected ? 'Selected' : 'Available'}
                            </span>
                          )}

                          {slot.status === 'Blocked' && (
                            <span className="bg-rose-600 text-white font-black text-caption px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Action Area */}
              {slots.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm font-bold text-slate-500">
                    {selectedSlots.length} slot{selectedSlots.length !== 1 && 's'} selected
                  </div>
                  <button
                    onClick={handleBookSelected}
                    disabled={selectedSlots.length === 0}
                    className={`font-bold text-body-sm px-8 py-3 rounded-lg transition shadow-sm w-full sm:w-auto ${
                      selectedSlots.length > 0 
                        ? 'bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Book Selected Slots
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlots([]);
          fetchAvailability();
        }}
        selectedSlots={selectedSlots}
      />
    </div>
  );
}
