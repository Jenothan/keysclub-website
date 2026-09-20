'use client';
import React, { useState, useEffect } from 'react';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Clock from '@mui/icons-material/AccessTime';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';
import BookingModal from '@/components/BookingModal';
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { isPeakDay, isPeakSlot, PeakConfig, DEFAULT_PEAK_CONFIG } from '@/lib/peakUtils';

export default function AdminAvailabilityPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<{ time: string; status: string; start_time: string; end_time: string; court_id: number; is_recurring_blocked?: boolean; is_overridden?: boolean; user?: string | null; is_peak?: boolean; is_peak_day?: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [peakConfig, setPeakConfig] = useState<PeakConfig>(DEFAULT_PEAK_CONFIG);
  
  // States for Blocked Dates
  const [isBlockingModalOpen, setIsBlockingModalOpen] = useState(false);
  const [blockedDatesList, setBlockedDatesList] = useState<any[]>([]);
  const [datesToBlock, setDatesToBlock] = useState<Date[] | undefined>([]);
  const [blockReason, setBlockReason] = useState('');

  // States for Daily Recurring Blocks
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [recurringSlotsList, setRecurringSlotsList] = useState<any[]>([]);
  const [newRecStart, setNewRecStart] = useState('12:00:00');
  const [newRecEnd, setNewRecEnd] = useState('14:00:00');
  const [newRecReason, setNewRecReason] = useState('Daily Maintenance');
  
  const fetchBlockedDates = async () => {
    try {
      const res = await api.get('/admin/blocked-dates');
      setBlockedDatesList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecurringBlockedSlots = async () => {
    try {
      const res = await api.get('/admin/recurring-blocked-slots');
      setRecurringSlotsList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBlockedDates();
    fetchRecurringBlockedSlots();
    api.get('/website-data').then((res) => {
      if (res.data) {
        setPeakConfig({
          peak_start_time: res.data.peak_start_time || '15:00:00',
          peak_end_time: res.data.peak_end_time || '20:00:00',
          peak_off_days: Array.isArray(res.data.peak_off_days) ? res.data.peak_off_days : ['Saturday', 'Sunday'],
        });
      }
    }).catch(() => {});
  }, []);

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
      const isCurrentPeakDay = isPeakDay(calendarDate, peakConfig.peak_off_days);

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

        const isPeak = isPeakSlot(startStr, endStr, calendarDate, peakConfig);
        
        hardcodedSlots.push({
          time: `${formatTime(startStr)} - ${formatTime(endStr)}`,
          status,
          start_time: startStr,
          end_time: endStr,
          court_id: backendSlot?.court_id || activeCourtId,
          is_recurring_blocked: backendSlot?.is_recurring_blocked || false,
          is_overridden: backendSlot?.is_overridden || false,
          user: backendSlot?.user,
          is_peak: isPeak,
          is_peak_day: isCurrentPeakDay
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
  }, [calendarDate, peakConfig]);

  const handleToggleSlot = (slot: any) => {
    const isSelected = selectedSlots.some(s => s.start_time === slot.start_time);
    if (isSelected) {
      setSelectedSlots(selectedSlots.filter(s => s.start_time !== slot.start_time));
    } else {
      setSelectedSlots([...selectedSlots, {
        date: calendarDate ? format(calendarDate, "EEEE, dd MMMM yyyy") : "No date selected", 
        time: slot.time,
        court: 'KEYS Club Badminton Court',
        court_id: slot.court_id || 1,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_peak: slot.is_peak,
        is_peak_day: slot.is_peak_day,
        rawDate: calendarDate ? format(calendarDate, 'yyyy-MM-dd') : ''
      }]);
    }
  };

  const handleBookSelected = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (selectedSlots.length === 0) {
      toast.error('Please select at least one available slot.');
      return;
    }

    if (calendarDate) {
      try {
        const dateStr = format(calendarDate, 'yyyy-MM-dd');
        const res = await api.get(`/availability?date=${dateStr}`);
        const currentSlots = res.data || [];
        const unavailableSlot = selectedSlots.find(selected => {
          const matched = currentSlots.find((cs: any) => cs.start_time === selected.start_time);
          return matched && matched.status !== 'Available';
        });

        if (unavailableSlot) {
          toast.error('This slot is currently booked. Please choose another slot.', { duration: 5000 });
          setSelectedSlots([]);
          fetchAvailability();
          return;
        }
      } catch (err) {
        // proceed if network error on pre-check
      }
    }

    setIsModalOpen(true);
  };

  const handleBlockSelectedSlots = async () => {
    if (!selectedSlots || selectedSlots.length === 0) {
      toast.error('Please select at least one slot to block');
      return;
    }

    try {
      await api.post('/admin/availability/block', {
        court_id: selectedSlots[0].court_id,
        date: selectedSlots[0].rawDate,
        slots: selectedSlots.map(s => ({
          start_time: s.start_time,
          end_time: s.end_time
        })),
        notes: 'Blocked by Admin'
      });

      toast.success('Selected slots blocked successfully');
      setSelectedSlots([]);
      fetchAvailability();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to block selected slots');
    }
  };
  
  const handleBlockDate = async () => {
    if (!datesToBlock || datesToBlock.length === 0) return;
    try {
        await api.post('/admin/blocked-dates', {
            dates: datesToBlock.map(d => format(d, 'yyyy-MM-dd')),
            reason: blockReason
        });
        toast.success('Dates blocked successfully');
        setIsBlockingModalOpen(false);
        setBlockReason('');
        setDatesToBlock([]);
        fetchBlockedDates();
        if (datesToBlock.some(d => format(d, 'yyyy-MM-dd') === format(calendarDate!, 'yyyy-MM-dd'))) {
            setCalendarDate(new Date(calendarDate!));
        }
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to block dates');
    }
  };

  const handleAddRecurringBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/recurring-blocked-slots', {
        start_time: newRecStart,
        end_time: newRecEnd,
        reason: newRecReason,
      });
      toast.success('Daily recurring blocked slot added successfully');
      fetchRecurringBlockedSlots();
      fetchAvailability();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add daily recurring block');
    }
  };

  const handleDeleteRecurringBlock = async (id: number) => {
    try {
      await api.delete(`/admin/recurring-blocked-slots/${id}`);
      toast.success('Daily recurring block removed');
      fetchRecurringBlockedSlots();
      fetchAvailability();
    } catch (error: any) {
      toast.error('Failed to remove daily recurring block');
    }
  };

  const handleToggleSlotOverride = async (slot: any, targetStatus: 'Available' | 'Blocked') => {
    if (!calendarDate) return;
    const dateStr = format(calendarDate, 'yyyy-MM-dd');
    try {
      if (slot.is_overridden && targetStatus === 'Available' && slot.status === 'Available') {
        await api.delete('/admin/slot-overrides', {
          data: {
            date: dateStr,
            start_time: slot.start_time,
          }
        });
        toast.success(`Slot override reset for ${dateStr}`);
      } else {
        await api.post('/admin/slot-overrides', {
          date: dateStr,
          start_time: slot.start_time,
          end_time: slot.end_time,
          status: targetStatus,
          notes: targetStatus === 'Available' ? 'Unblocked for date by Admin' : 'Blocked for date by Admin',
        });
        toast.success(`Slot marked as ${targetStatus} for ${dateStr}`);
      }
      fetchAvailability();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update slot status');
    }
  };

  const handleUnblockDate = async (date: string) => {
      try {
          await api.delete(`/admin/blocked-dates/${date}`);
          toast.success('Date unblocked successfully');
          fetchBlockedDates();
          if (format(calendarDate!, 'yyyy-MM-dd') === date) {
              setCalendarDate(new Date(calendarDate!));
          }
      } catch (e: any) {
          toast.error(e.response?.data?.message || 'Failed to unblock date');
      }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-6 sm:space-y-8 pb-28 md:pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 md:mb-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
              Admin Availability & Slots
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Manage court availability and block dates for tournaments.
            </p>
          </div>

          <div className="flex gap-2.5 sm:gap-3 flex-wrap">
            <button 
                onClick={() => setIsRecurringModalOpen(true)}
                className="bg-yellow-50 text-yellow-800 font-extrabold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors cursor-pointer"
            >
                Daily Recurring Blocks
            </button>
            <button 
                onClick={() => setIsBlockingModalOpen(true)}
                className="bg-red-50 text-red-600 font-extrabold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
            >
                Block Whole Date(s)
            </button>
          </div>
        </div>

        {/* Recurring Daily Blocks Summary Banner if any exist */}
        {recurringSlotsList.length > 0 && (
          <div className="mb-4 sm:mb-6 bg-white p-3.5 sm:p-4 rounded-2xl border border-yellow-200 flex items-center gap-2 sm:gap-4 flex-wrap shadow-xs">
            <span className="text-[10px] sm:text-xs font-black text-slate-700 uppercase tracking-wider">Active Daily Blocks:</span>
            {recurringSlotsList.map((rec) => (
              <div key={rec.id} className="flex items-center gap-1.5 bg-yellow-50 text-yellow-900 border border-yellow-200 px-2.5 py-1 rounded-lg text-xs font-bold">
                <span>{rec.start_time.slice(0,5)} - {rec.end_time.slice(0,5)} ({rec.reason})</span>
                <button onClick={() => handleDeleteRecurringBlock(rec.id)} className="hover:text-red-700 ml-1 cursor-pointer font-extrabold text-sm">
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Blocked Dates List */}
        {blockedDatesList.length > 0 && (
          <div className="mb-4 sm:mb-6 bg-white p-3.5 sm:p-4 rounded-2xl border border-red-100 flex items-center gap-2 sm:gap-4 flex-wrap shadow-xs">
            <span className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider">Blocked Dates:</span>
            {blockedDatesList.map((bd) => (
              <div key={bd.id} className="flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                {format(new Date(bd.date), 'dd MMM yyyy')}
                <button onClick={() => handleUnblockDate(bd.date)} className="hover:text-red-900 ml-1 cursor-pointer text-sm">
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

          {/* Left Sidebar - Calendar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 md:p-8">

              {/* Header and Legend */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Slots for {calendarDate ? format(calendarDate, "EEEE, MMM dd") : "Selected Date"}
                  </h2>
                  <p className="text-slate-400 text-xs font-bold mt-0.5">Tap available slots to select multiple</p>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-extrabold text-slate-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse border border-amber-500"></span> Peak (Member)
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Booked / Blocked
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 📱 MOBILE VIEW: COMPACT 2-COLUMN SINGLE-LINE TIME SLOT GRID               */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-2 gap-2 sm:hidden">
                {isLoading ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-xl w-full" />
                  ))
                ) : slots.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-xs font-bold text-slate-400">
                    No slots available for this date.
                  </div>
                ) : (
                  slots.map((slot, index) => {
                    const isSelected = selectedSlots.some(s => s.start_time === slot.start_time);
                    const isAvailable = slot.status === 'Available';
                    const isPast = slot.status === 'Past';
                    const isBooked = slot.status === 'Booked';
                    const isBlocked = slot.status === 'Blocked';
                    const isPeakActive = slot.is_peak && slot.is_peak_day && isAvailable;

                    return (
                      <div
                        key={index}
                        onClick={() => isAvailable && handleToggleSlot(slot)}
                        className={cn(
                          "relative p-2.5 rounded-xl border transition-all flex flex-col justify-center select-none cursor-pointer min-h-[64px] overflow-hidden",
                          isSelected && "bg-yellow-400/15 border-2 border-yellow-400 shadow-xs ring-1 ring-yellow-400/30",
                          !isSelected && isAvailable && !isPeakActive && "bg-slate-50 border-slate-200 active:scale-95 hover:border-yellow-400",
                          !isSelected && isPeakActive && "bg-amber-50/30 border-2 border-amber-400 ring-2 ring-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse active:scale-95",
                          isPast && "bg-slate-100/60 border-slate-200 opacity-50 pointer-events-none cursor-not-allowed",
                          isBooked && "bg-red-50/80 border-red-200 text-red-950",
                          isBlocked && "bg-rose-50/80 border-rose-200 text-rose-950"
                        )}
                      >
                        {/* Selected Indicator Badge */}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-slate-900 text-yellow-400 rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-xs">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                        )}

                        {/* Top Row: Time string (Single Line, Non-bold text) */}
                        <div className="flex items-center justify-between gap-1 min-w-0">
                          <span className={cn(
                            "text-[10px] font-medium tracking-tighter whitespace-nowrap truncate min-w-0 flex-1",
                            isPast && "line-through text-slate-400 font-normal",
                            isSelected && "text-slate-900 font-bold",
                            !isSelected && isAvailable && "text-slate-800 font-semibold"
                          )}>
                            {slot.time}
                          </span>
                          
                          {/* Status Dot */}
                          <span className={cn(
                            "w-2 h-2 rounded-full shrink-0 ml-0.5",
                            isAvailable && (isSelected ? "bg-slate-900" : (isPeakActive ? "bg-amber-500 animate-pulse" : "bg-emerald-500")),
                            isPast && "bg-slate-300",
                            isBooked && "bg-red-500",
                            isBlocked && "bg-rose-600"
                          )} />
                        </div>

                        {/* Bottom Row: Status Badge & Quick Actions */}
                        <div className="flex items-center justify-between text-[9px] mt-1 pt-0.5 border-t border-slate-200/50">
                          <span className={cn(
                            "uppercase tracking-wider font-extrabold text-[9px]",
                            isAvailable && (isSelected ? "text-slate-900" : "text-emerald-700"),
                            isPast && "text-slate-400 font-normal",
                            isBooked && "text-red-700",
                            isBlocked && "text-rose-700"
                          )}>
                            {isPast ? 'Past' : (isSelected ? 'Selected' : (isPeakActive ? '⚡ Peak' : slot.status))}
                          </span>

                          {isBlocked && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSlotOverride(slot, 'Available');
                              }}
                              className="text-[9px] font-extrabold text-emerald-700 underline shrink-0"
                            >
                              Unblock
                            </button>
                          )}
                        </div>

                        {slot.user && (
                          <span className="text-[9px] font-medium text-slate-500 truncate block mt-0.5">
                            {slot.user}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* ========================================================================= */}
              {/* 💻 DESKTOP VIEW: FULL DETAILED TIME CARD GRID                             */}
              {/* ========================================================================= */}
              <div className="hidden sm:grid grid-cols-1 xl:grid-cols-2 gap-4">
                {isLoading ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-xl w-full" />
                  ))
                ) : slots.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-slate-500 font-bold">
                    No slots available for this date.
                  </div>
                ) : (
                  slots.map((slot, index) => {
                    const isSelected = selectedSlots.some(s => s.start_time === slot.start_time);
                    const isBlocked = slot.status === 'Blocked';
                    const isPeakActive = slot.is_peak && slot.is_peak_day && slot.status === 'Available';

                    let cardStyle = 'border-slate-100 bg-slate-50 opacity-80';
                    let clockStyle = 'bg-white text-slate-400';
                    let textStyle = 'text-slate-800';

                    if (isSelected) {
                      cardStyle = 'border-[#fbbf24] bg-[#fbbf24] text-slate-900 shadow-[0_0_0_1px_#fbbf24]';
                      clockStyle = 'bg-slate-900 text-[#fbbf24]';
                      textStyle = 'text-slate-900';
                    } else if (isPeakActive) {
                      cardStyle = 'cursor-pointer bg-amber-50/30 border-2 border-amber-400 ring-2 ring-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse hover:bg-yellow-100/30';
                      clockStyle = 'bg-amber-100 text-amber-900 border border-amber-300';
                      textStyle = 'text-amber-950 font-extrabold';
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
                          <div>
                            <span className={`font-bold text-body-sm tracking-tight ${textStyle}`}>{slot.time}</span>
                            {slot.user && (
                              <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[140px]">
                                {slot.user}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isBlocked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSlotOverride(slot, 'Available');
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-extrabold rounded-lg border border-emerald-200 transition-all cursor-pointer"
                              title="Unblock this slot for this date"
                            >
                              Make Available
                            </button>
                          )}

                          {slot.is_overridden && slot.status === 'Available' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSlotOverride(slot, 'Available');
                              }}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-extrabold rounded-lg border border-blue-200 transition-all cursor-pointer"
                              title="Override active: Click to reset to default"
                            >
                              Overridden ✓
                            </button>
                          )}

                          <span className={cn(
                            "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs",
                            slot.status === 'Available' && (isSelected ? "bg-slate-900 text-yellow-400" : (isPeakActive ? "bg-amber-400 text-slate-950 font-black border border-amber-500 shadow-2xs animate-pulse" : "bg-emerald-100 text-emerald-700")),
                            slot.status === 'Past' && "bg-slate-200 text-slate-500 font-extrabold",
                            slot.status === 'Pending' && "bg-amber-500 text-white",
                            slot.status === 'Booked' && "bg-red-600 text-white font-black",
                            slot.status === 'Blocked' && "bg-rose-600 text-white font-black"
                          )}>
                            {slot.status === 'Past' ? 'Past Slot' : (isSelected ? 'Selected' : (isPeakActive ? '⚡ Peak Hour' : slot.status))}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop Action Area */}
              {slots.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 hidden sm:flex flex-row items-center justify-between gap-4">
                  <div className="text-sm font-bold text-slate-500">
                    {selectedSlots.length} slot{selectedSlots.length !== 1 && 's'} selected
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleBlockSelectedSlots}
                      disabled={selectedSlots.length === 0}
                      className={`font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-sm ${
                        selectedSlots.length > 0 
                          ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Block Selected Slots
                    </button>
                    <button
                      onClick={handleBookSelected}
                      disabled={selectedSlots.length === 0}
                      className={`font-extrabold text-xs px-8 py-3 rounded-xl transition shadow-sm ${
                        selectedSlots.length > 0 
                          ? 'bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 cursor-pointer' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Book Selected Slots
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: FIXED BOTTOM ACTION DOCK                                  */}
      {/* ========================================================================= */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-xs font-black text-slate-900 block">
            {selectedSlots.length} Slot{selectedSlots.length !== 1 && 's'} Selected
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            {selectedSlots.length > 0 ? 'Ready to process' : 'Tap slot above'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBlockSelectedSlots}
            disabled={selectedSlots.length === 0}
            className={cn(
              "px-3 py-2 rounded-xl font-black text-xs transition-all shadow-xs shrink-0 cursor-pointer",
              selectedSlots.length > 0
                ? "bg-red-600 text-white active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
            )}
          >
            Block
          </button>
          
          <button
            onClick={handleBookSelected}
            disabled={selectedSlots.length === 0}
            className={cn(
              "px-4 py-2 rounded-xl font-black text-xs transition-all shadow-xs shrink-0 cursor-pointer",
              selectedSlots.length > 0
                ? "bg-yellow-400 text-slate-900 active:scale-95 shadow-md"
                : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
            )}
          >
            Book Slots
          </button>
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
        onBookingSuccess={() => {
          setSelectedSlots([]);
          fetchAvailability();
        }}
      />

      {/* Whole Date Blocking Modal */}
      {isBlockingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-black text-slate-900 mb-4">Block Whole Dates</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Select Date(s)</label>
                <div className="flex justify-center bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <Calendar
                    mode="multiple"
                    selected={datesToBlock}
                    onSelect={setDatesToBlock}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Reason (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tournament"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-yellow-400"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsBlockingModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-extrabold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBlockDate}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-extrabold text-xs rounded-xl hover:bg-red-700 transition-colors"
                >
                  Confirm Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Recurring Blocks Management Modal */}
      {isRecurringModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#0f172a]">Daily Recurring Blocked Slots</h2>
                <p className="text-xs text-slate-500 mt-0.5">These time slots will automatically be blocked every day</p>
              </div>
              <button 
                onClick={() => setIsRecurringModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-extrabold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div>
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">Current Daily Blocks</h3>
              {recurringSlotsList.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">No daily recurring blocks configured.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {recurringSlotsList.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-900 block">{rec.start_time.slice(0, 5)} - {rec.end_time.slice(0, 5)}</span>
                        <span className="text-[11px] text-slate-500">{rec.reason}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteRecurringBlock(rec.id)}
                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleAddRecurringBlock} className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Add New Daily Block</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Start Time</label>
                  <Select value={newRecStart} onValueChange={setNewRecStart}>
                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
                      <SelectValue placeholder="Select Start Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 16 }, (_, i) => i + 6).map(h => {
                        const val = `${h.toString().padStart(2, '0')}:00:00`;
                        const fmt = CarbonTimeFmt(h);
                        return <SelectItem key={val} value={val}>{fmt}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">End Time</label>
                  <Select value={newRecEnd} onValueChange={setNewRecEnd}>
                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
                      <SelectValue placeholder="Select End Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 16 }, (_, i) => i + 7).map(h => {
                        const val = `${h.toString().padStart(2, '0')}:00:00`;
                        const fmt = CarbonTimeFmt(h);
                        return <SelectItem key={val} value={val}>{fmt}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Reason</label>
                <input
                  type="text"
                  value={newRecReason}
                  onChange={(e) => setNewRecReason(e.target.value)}
                  placeholder="e.g. Daily Maintenance / Coaching"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecurringModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-extrabold rounded-xl hover:bg-slate-200 text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Add Daily Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CarbonTimeFmt(hour: number) {
  const d = new Date();
  d.setHours(hour, 0);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
