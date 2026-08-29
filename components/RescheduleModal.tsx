import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import Clock from '@mui/icons-material/AccessTime';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export default function RescheduleModal({ isOpen, onClose, booking, onSuccess }: RescheduleModalProps) {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(booking ? new Date(booking.booking_date) : new Date());
  const [slots, setSlots] = useState<{ time: string; status: string; start_time: string; end_time: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !booking) return;
    
    // Reset selection when modal opens or date changes
    setSelectedSlot(null);

    const fetchAvailability = async () => {
      if (!calendarDate) return;
      setIsLoading(true);
      try {
        const dateStr = format(calendarDate, 'yyyy-MM-dd');
        const res = await api.get(`/availability?date=${dateStr}&court_id=${booking.court_id}`).catch(() => ({ data: [] }));
        
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
          
          let status = backendSlot ? backendSlot.status : 'Available';
          // If the slot is the current booking's slot on the current booking's date, show it as available or "Current"
          if (dateStr === booking.booking_date && startStr === booking.start_time) {
              status = 'Current';
          }
          
          hardcodedSlots.push({
            time: `${formatTime(startStr)} - ${formatTime(endStr)}`,
            status,
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
  }, [calendarDate, isOpen, booking]);

  const handleReschedule = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      await api.post(`/admin/bookings/${booking.id}/reschedule`, {
        date: format(calendarDate!, 'yyyy-MM-dd'),
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time
      });
      toast.success('Booking rescheduled successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reschedule booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Reschedule Booking</h2>
            <p className="text-sm font-medium text-slate-500">Booking #{booking.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left side: Calendar */}
            <div className="md:col-span-5 flex justify-center md:justify-start items-start">
              <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm inline-block">
                <Calendar
                  mode="single"
                  selected={calendarDate}
                  onSelect={setCalendarDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border-0"
                />
              </div>
            </div>

            {/* Right side: Slots */}
            <div className="md:col-span-7">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Available Slots for {calendarDate ? format(calendarDate, "MMM dd, yyyy") : ""}
              </h3>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      onClick={() => slot.status === 'Available' && setSelectedSlot(slot)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        slot.status === 'Available' ? 'cursor-pointer hover:border-blue-400 hover:bg-blue-50' : 'opacity-60 bg-slate-50'
                      } ${selectedSlot?.start_time === slot.start_time ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-100'}`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-sm text-slate-700">{slot.time}</span>
                      </div>
                      
                      {slot.status === 'Current' && (
                          <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">Current</span>
                      )}
                      {slot.status === 'Available' && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Available</span>
                      )}
                      {(slot.status === 'Booked' || slot.status === 'Pending' || slot.status === 'Blocked') && (
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Unavailable</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleReschedule}
            disabled={!selectedSlot || isSubmitting}
            className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-colors ${
              selectedSlot && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700 shadow-sm' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
}
