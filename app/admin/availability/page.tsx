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
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAvailabilityPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<{ time: string; status: string; start_time: string; end_time: string; court_id: number; is_recurring_blocked?: boolean; is_overridden?: boolean; user?: string | null }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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

      for (let hour = 6; hour < 22; hour++) {
        const startStr = `${hour.toString().padStart(2, '0')}:00:00`;
        const endStr = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
        
        const backendSlot = backendSlots.find((bs: any) => bs.start_time === startStr);
        
        hardcodedSlots.push({
          time: `${formatTime(startStr)} - ${formatTime(endStr)}`,
          status: backendSlot ? backendSlot.status : 'Available',
          start_time: startStr,
          end_time: endStr,
          court_id: backendSlot?.court_id || activeCourtId,
          is_recurring_blocked: backendSlot?.is_recurring_blocked || false,
          is_overridden: backendSlot?.is_overridden || false,
          user: backendSlot?.user
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
        // Force refresh slots if the blocked date is the one currently viewed
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
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-8 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight mb-2">
              Admin Availability
            </h1>
            <p className="text-slate-500 text-sm">
              Manage court availability and block dates for tournaments.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button 
                onClick={() => setIsRecurringModalOpen(true)}
                className="bg-yellow-50 text-yellow-800 font-bold text-sm px-4 py-2 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors cursor-pointer"
            >
                Daily Recurring Blocks
            </button>
            <button 
                onClick={() => setIsBlockingModalOpen(true)}
                className="bg-red-50 text-red-600 font-bold text-sm px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
            >
                Block Whole Date(s)
            </button>
            <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-4 py-2 border border-slate-200 hidden md:flex">
              <span className="text-slate-500 text-xs font-semibold">Operating Hours:</span>
              <span className="text-slate-900 text-xs font-bold">Mon-Sun | 6:00 AM - 10:00 PM</span>
            </div>
          </div>
        </div>

        {/* Recurring Daily Blocks Summary Banner if any exist */}
        {recurringSlotsList.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-xl border border-yellow-200 flex items-center gap-4 flex-wrap shadow-sm">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Active Daily Recurring Blocks:</span>
            {recurringSlotsList.map((rec) => (
              <div key={rec.id} className="flex items-center gap-2 bg-yellow-50 text-yellow-900 border border-yellow-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                <span>{rec.start_time.slice(0,5)} - {rec.end_time.slice(0,5)} ({rec.reason})</span>
                <button onClick={() => handleDeleteRecurringBlock(rec.id)} className="hover:text-red-700 ml-1 cursor-pointer font-extrabold">
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Blocked Dates List */}
        {blockedDatesList.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-xl border border-red-100 flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Currently Blocked Whole Dates:</span>
            {blockedDatesList.map((bd) => (
              <div key={bd.id} className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                {format(new Date(bd.date), 'dd MMM yyyy')}
                <button onClick={() => handleUnblockDate(bd.date)} className="hover:text-red-900 ml-1 cursor-pointer">
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

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
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Booked / Blocked
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
                ) : (
                  slots.map((slot, index) => {
                    const isSelected = selectedSlots.some(s => s.start_time === slot.start_time);
                    const isBlocked = slot.status === 'Blocked';

                    return (
                      <div
                        key={index}
                        onClick={() => slot.status === 'Available' && handleToggleSlot(slot)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${
                          slot.status === 'Available' ? 'cursor-pointer hover:border-[#fbbf24] hover:shadow-sm bg-[#f8fafc]' : 'bg-slate-50 border-slate-100 opacity-80'
                        } ${isSelected ? 'border-[#fbbf24] bg-[#fbbf24] text-slate-900 shadow-[0_0_0_1px_#fbbf24]' : 'border-slate-100'}`}
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
                          <div className={`p-2 rounded-lg shadow-sm transition-colors ${isSelected ? 'bg-slate-900 text-[#fbbf24]' : 'bg-white text-slate-400 group-hover:text-slate-900'}`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className={`font-bold text-body-sm tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>{slot.time}</span>
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
                            "text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider",
                            slot.status === 'Available' && "bg-emerald-50 text-emerald-600",
                            slot.status === 'Pending' && "bg-yellow-400/20 text-yellow-800 border border-yellow-400",
                            slot.status === 'Booked' && "bg-slate-200 text-slate-700",
                            slot.status === 'Blocked' && "bg-red-50 text-red-600 border border-red-200"
                          )}>
                            {slot.status}
                          </span>
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
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleBlockSelectedSlots}
                      disabled={selectedSlots.length === 0}
                      className={`font-bold text-body-sm px-6 py-3 rounded-lg transition shadow-sm w-full sm:w-auto ${
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
                      className={`font-bold text-body-sm px-8 py-3 rounded-lg transition shadow-sm w-full sm:w-auto ${
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

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlots([]);
          fetchAvailability();
        }}
        selectedSlots={selectedSlots}
      />

      {/* Whole Date Blocking Modal */}
      {isBlockingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Block Whole Dates</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Date(s)</label>
                <div className="flex justify-center bg-slate-50 border border-slate-200 rounded-lg p-2">
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
                <label className="block text-sm font-bold text-slate-700 mb-2">Reason (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tournament"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-yellow-400"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsBlockingModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBlockDate}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
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
                <h2 className="text-xl font-extrabold text-[#0f172a]">Daily Recurring Blocked Slots</h2>
                <p className="text-xs text-slate-500 mt-0.5">These time slots will automatically be blocked every day</p>
              </div>
              <button 
                onClick={() => setIsRecurringModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-extrabold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* List of active recurring blocks */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Current Daily Blocks</h3>
              {recurringSlotsList.length === 0 ? (
                <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">No daily recurring blocks configured.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {recurringSlotsList.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <div>
                        <span className="font-mono font-bold text-sm text-slate-900 block">{rec.start_time.slice(0, 5)} - {rec.end_time.slice(0, 5)}</span>
                        <span className="text-xs text-slate-500">{rec.reason}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteRecurringBlock(rec.id)}
                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form to add a new daily recurring block */}
            <form onSubmit={handleAddRecurringBlock} className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Add New Daily Block</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Start Time</label>
                  <Select value={newRecStart} onValueChange={setNewRecStart}>
                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
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
                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-medium outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecurringModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 text-sm transition-colors cursor-pointer"
                >
                  Done
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
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
