"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import Clock from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import XIcon from '@mui/icons-material/Close';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
  isAdmin?: boolean;
}

const safeParseDate = (dateVal: any): Date => {
  if (!dateVal) return new Date();
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) return dateVal;

  const str = String(dateVal).trim();
  const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  const fallback = new Date(str);
  return !isNaN(fallback.getTime()) ? fallback : new Date();
};

const safeFormatTime = (timeStr: string) => {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return format(d, 'hh:mm a');
};

const normalizeTime = (timeStr: string) => {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return '';
  const h = parts[0].padStart(2, '0');
  const m = parts[1].padStart(2, '0');
  const s = parts.length >= 3 ? parts[2].padStart(2, '0') : '00';
  return `${h}:${m}:${s}`;
};

export default function RescheduleModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
  isAdmin = true
}: RescheduleModalProps) {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    booking?.booking_date ? safeParseDate(booking.booking_date) : new Date()
  );
  const [slots, setSlots] = useState<{ time: string; status: string; start_time: string; end_time: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Total contiguous slots count needed for this booking
  const requiredSlotsCount = booking?.total_slots_count || (booking?.slots && booking.slots.length) || 1;

  useEffect(() => {
    if (!isOpen || !booking) return;

    // Set initial calendar date to booking_date
    if (booking.booking_date) {
      setCalendarDate(safeParseDate(booking.booking_date));
    } else {
      setCalendarDate(new Date());
    }
    setSelectedSlots([]);
  }, [isOpen, booking]);

  useEffect(() => {
    if (!isOpen || !booking || !calendarDate) return;

    setSelectedSlots([]);

    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const validDate = safeParseDate(calendarDate);
        const dateStr = format(validDate, 'yyyy-MM-dd');
        const courtId = booking.court_id || 1;
        const res = await api.get(`/availability?date=${dateStr}&court_id=${courtId}`).catch(() => ({ data: [] }));

        const backendSlots = Array.isArray(res.data) ? res.data : [];
        const hardcodedSlots = [];

        const bookingDateStr = booking.booking_date
          ? format(safeParseDate(booking.booking_date), 'yyyy-MM-dd')
          : '';

        const isBookingDate = (dateStr === bookingDateStr);

        const bookingSlotStartTimes = new Set<string>();
        if (Array.isArray(booking.slots) && booking.slots.length > 0) {
          booking.slots.forEach((s: any) => {
            if (s.start_time) bookingSlotStartTimes.add(normalizeTime(s.start_time));
          });
        } else if (booking.start_time) {
          bookingSlotStartTimes.add(normalizeTime(booking.start_time));
        }

        for (let hour = 6; hour < 22; hour++) {
          const startStr = `${hour.toString().padStart(2, '0')}:00:00`;
          const endStr = `${(hour + 1).toString().padStart(2, '0')}:00:00`;

          const normStartStr = normalizeTime(startStr);

          const backendSlot = backendSlots.find((bs: any) => normalizeTime(bs.start_time) === normStartStr);

          let status = backendSlot ? backendSlot.status : 'Available';

          const isCurrentSlot = isBookingDate && bookingSlotStartTimes.has(normStartStr);

          if (isCurrentSlot) {
            status = 'Current';
          }

          hardcodedSlots.push({
            time: `${safeFormatTime(startStr)} - ${safeFormatTime(endStr)}`,
            status,
            start_time: startStr,
            end_time: endStr,
          });
        }

        setSlots(hardcodedSlots);
      } catch (error) {
        console.error('Failed to load availability', error);
        toast.error('Failed to load availability');
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [calendarDate, isOpen, booking]);

  const handleToggleSlot = (slot: any) => {
    const isAlreadySelected = selectedSlots.some(s => s.start_time === slot.start_time);

    if (isAlreadySelected) {
      // Unselect this slot
      const updated = selectedSlots.filter(s => s.start_time !== slot.start_time);
      setSelectedSlots(updated);
      return;
    }

    if (requiredSlotsCount === 1) {
      setSelectedSlots([slot]);
      return;
    }

    if (selectedSlots.length >= requiredSlotsCount) {
      toast.error(`You can only select ${requiredSlotsCount} slots for this booking. Click a selected slot to unselect it.`);
      return;
    }

    const updated = [...selectedSlots, slot].sort((a, b) => a.start_time.localeCompare(b.start_time));
    setSelectedSlots(updated);
  };

  const handleReschedule = async () => {
    if (!selectedSlots || selectedSlots.length === 0 || !calendarDate || !booking) return;

    if (selectedSlots.length !== requiredSlotsCount) {
      toast.error(`Please select exactly ${requiredSlotsCount} slot(s) to proceed.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = isAdmin
        ? `/admin/bookings/${booking.id}/reschedule`
        : `/bookings/${booking.id}/reschedule`;

      const validDate = safeParseDate(calendarDate);

      const payload = {
        date: format(validDate, 'yyyy-MM-dd'),
        start_time: selectedSlots[0].start_time,
        end_time: selectedSlots[selectedSlots.length - 1].end_time,
        slots: selectedSlots.map(s => ({
          start_time: s.start_time,
          end_time: s.end_time
        }))
      };

      await api.post(endpoint, payload);
      toast.success('Booking rescheduled successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reschedule booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !booking) return null;

  const refCode = booking.booking_reference
    ? (booking.booking_reference.startsWith('#') ? booking.booking_reference : `#${booking.booking_reference}`)
    : `#KC-${booking.id}`;

  const formatTimeRange = () => {
    if (!selectedSlots || selectedSlots.length === 0) return null;
    return `${safeFormatTime(selectedSlots[0].start_time)} - ${safeFormatTime(selectedSlots[selectedSlots.length - 1].end_time)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
              Reschedule Court Reservation
            </span>
            <h2 className="text-xl font-extrabold text-[#0f172a] flex items-center gap-2">
              Reschedule {refCode}
            </h2>
            {requiredSlotsCount > 1 && (
              <p className="text-xs font-bold text-yellow-600 mt-1">
                ⚡ Select {requiredSlotsCount} available slots individually ({selectedSlots.length}/{requiredSlotsCount} selected).
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left side: Calendar */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                1. Select New Date
              </label>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs inline-block">
                <Calendar
                  mode="single"
                  selected={calendarDate}
                  onSelect={setCalendarDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border-0"
                />
              </div>
            </div>

            {/* Right side: Slot Selection */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  2. Select New Time Slot ({calendarDate ? format(safeParseDate(calendarDate), "MMM dd, yyyy") : ""})
                </label>
                {selectedSlots.length > 0 && (
                  <span className="text-xs font-black text-yellow-600 bg-yellow-100 border border-yellow-300 px-2.5 py-0.5 rounded-full">
                    {selectedSlots.length}/{requiredSlotsCount} Selected {formatTimeRange() ? `(${formatTimeRange()})` : ''}
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {slots.map((slot, index) => {
                    const isSelected = selectedSlots.some(s => s.start_time === slot.start_time);
                    const isAvailable = slot.status === 'Available' || slot.status === 'Current';

                    return (
                      <div
                        key={index}
                        onClick={() => isAvailable && handleToggleSlot(slot)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          isAvailable
                            ? 'cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/50'
                            : 'opacity-50 bg-slate-50 cursor-not-allowed border-slate-100'
                        } ${
                          isSelected
                            ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-400 shadow-xs'
                            : 'border-slate-200/80 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-yellow-600' : 'text-slate-400'}`} />
                          <span className={`font-extrabold text-xs ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                            {slot.time}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] font-black text-slate-900 bg-yellow-400 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                            <CheckCircleIcon className="w-3 h-3 text-slate-900" /> Selected
                          </span>
                        )}
                        {!isSelected && slot.status === 'Current' && (
                          <span className="text-[10px] font-extrabold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">
                            Current
                          </span>
                        )}
                        {!isSelected && slot.status === 'Available' && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md">
                            Available
                          </span>
                        )}
                        {!isSelected && (slot.status === 'Booked' || slot.status === 'Pending' || slot.status === 'Blocked') && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                            Unavailable
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/80">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            disabled={selectedSlots.length !== requiredSlotsCount || isSubmitting}
            className={`px-6 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm border ${
              selectedSlots.length === requiredSlotsCount && !isSubmitting
                ? 'bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-yellow-500 hover:scale-[1.02]'
                : 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            {isSubmitting
              ? 'Rescheduling...'
              : selectedSlots.length < requiredSlotsCount
              ? `Select ${requiredSlotsCount - selectedSlots.length} More Slot${requiredSlotsCount - selectedSlots.length > 1 ? 's' : ''}`
              : 'Confirm Reschedule'}
          </button>
        </div>

      </div>
    </div>
  );
}

