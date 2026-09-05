import React, { useState, useEffect } from 'react';
import Check from '@mui/icons-material/Check';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from '@/store/authStore';
import { formatPhoneWithCountryCode } from '@/lib/phoneUtils';
import PhoneInput from '@/components/PhoneInput';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlots: any[];
}

export default function BookingModal({ isOpen, onClose, selectedSlots }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuthStore();
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';

  const steps = [
    { id: 1, name: 'Review & Notes' },
    { id: 2, name: 'Done' }
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setNotes('');
      setCustomerName('');
      setCustomerPhone('');
      setBookingId('');
    }
  }, [isOpen]);

  // Helper to compute contiguous merged time badges
  const getMergedSlotBadges = () => {
    if (!selectedSlots || selectedSlots.length === 0) return [];
    const sorted = [...selectedSlots].sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
    const merged: { start_time: string; end_time: string }[] = [];
    for (const slot of sorted) {
      if (merged.length === 0) {
        merged.push({ start_time: slot.start_time, end_time: slot.end_time });
      } else {
        const last = merged[merged.length - 1];
        if (last.end_time === slot.start_time) {
          last.end_time = slot.end_time;
        } else {
          merged.push({ start_time: slot.start_time, end_time: slot.end_time });
        }
      }
    }

    const formatTime = (timeStr: string) => {
      if (!timeStr) return '';
      const [h, m] = timeStr.split(':');
      const d = new Date();
      d.setHours(parseInt(h, 10), parseInt(m, 10));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return merged.map(m => `${formatTime(m.start_time)} - ${formatTime(m.end_time)}`);
  };

  const handleSubmit = async () => {
    if (!selectedSlots || selectedSlots.length === 0) {
      toast.error('No slots selected');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        court_id: selectedSlots[0].court_id,
        date: selectedSlots[0].rawDate,
        slots: selectedSlots.map(s => ({
          start_time: s.start_time,
          end_time: s.end_time
        })),
        notes: notes
      };

      if (isAdmin && (customerName || customerPhone)) {
        payload.customer_name = customerName;
        payload.customer_phone = formatPhoneWithCountryCode(customerPhone);
      }

      const response = await api.post('/bookings', payload);
      const ref = response.data?.booking_reference || response.data?.booking?.booking_reference || `KEYS-${Date.now().toString().slice(-4)}`;
      setBookingId(ref);
      setCurrentStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit bookings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-175 p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">Booking Process</DialogTitle>
        <div className="relative w-full bg-white flex flex-col items-center rounded-2xl shadow-xl border border-slate-100 max-h-[90vh]">

          {/* Step Indicator */}
          <div className="flex items-center justify-between w-full pl-12 pr-6 sm:pl-16 sm:pr-10 py-5 bg-slate-50/50 border-b border-slate-100 shrink-0">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${currentStep > step.id
                        ? 'bg-emerald-500 text-white'
                        : currentStep === step.id
                          ? 'bg-yellow-400 text-slate-900'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                  >
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span
                    className={`text-[11px] sm:text-sm font-semibold hidden sm:block whitespace-nowrap ${currentStep === step.id ? 'text-yellow-400 font-extrabold' : 'text-slate-500'
                      }`}
                  >
                    {step.name}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-200 mx-2 sm:mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Modal Card Content */}
          <div className="w-full p-6 sm:p-8 md:p-10 max-w-150 mx-auto overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">

            {/* Step 1: Review & Notes */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-[22px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Booking Details & Review</h2>
                <p className="text-slate-500 text-body-sm mb-8">
                  Double-check your badminton court request schedule before final admin submission.
                </p>

                <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-100 mb-6">
                  <h3 className="font-bold text-[#0f172a] text-body-sm mb-4">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-slate-500">Date</span>
                      <span className="font-semibold text-[#0f172a]">{selectedSlots[0]?.date || '...'}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-body-sm">
                      <span className="text-slate-500">Selected Times</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {getMergedSlotBadges().map((badgeText, i) => (
                          <span key={i} className="bg-yellow-50 text-yellow-800 px-2.5 py-1 rounded-md font-semibold text-xs border border-yellow-200">
                            {badgeText}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-slate-500">Name</span>
                      {isAdmin ? (
                        <Input
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="Walk-in Customer Name"
                          className="h-8 text-right bg-transparent border-0 focus-visible:ring-0 p-0 font-semibold text-[#0f172a] placeholder:font-normal w-1/2"
                        />
                      ) : (
                        <span className="font-semibold text-[#0f172a]">{user?.name}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-body-sm gap-4">
                      <span className="text-slate-500 shrink-0">Mobile Number</span>
                      {isAdmin ? (
                        <div className="w-1/2">
                          <PhoneInput 
                            value={customerPhone} 
                            onChange={val => setCustomerPhone(val)} 
                            placeholder="712345678" 
                            className="h-9 text-xs"
                          />
                        </div>
                      ) : (
                        <span className="font-semibold text-[#0f172a]">{user?.phone}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[11px] font-bold text-[#0f172a] mb-2">
                    Optional Notes/Additional Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Need an extra racket if available. Thank you."
                    className="block w-full p-4 rounded-lg border border-slate-200 bg-slate-50/50 text-[#0f172a] text-body-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition placeholder:text-slate-400"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={onClose}
                    disabled={isSubmitting}
                    variant="outline"
                    className="flex-1 h-12 text-slate-700 font-bold text-body"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Done */}
            {currentStep === 2 && (
              <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8" />
                </div>

                <h2 className="text-[24px] font-extrabold text-[#0f172a] mb-2 tracking-tight text-center">Booking Request Submitted!</h2>
                <p className="text-slate-500 text-body-sm mb-8 text-center max-w-sm">
                  Your request has been sent to the club administrator. Your booking will be confirmed after admin approval.
                </p>

                <div className="w-full bg-slate-50/80 rounded-xl p-5 border border-slate-100 mb-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-slate-500">Booking ID</span>
                      <span className="font-semibold text-[#0f172a]">{bookingId}</span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-slate-500">Date</span>
                      <span className="font-semibold text-[#0f172a]">{selectedSlots[0]?.date}</span>
                    </div>
                    <div className="flex justify-between items-start text-body-sm pb-4 border-b border-slate-200">
                      <span className="text-slate-500">Time(s)</span>
                      <div className="flex flex-col items-end gap-1">
                        {selectedSlots.map((slot, i) => (
                          <span key={i} className="font-semibold text-[#0f172a]">{slot.time}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-body-sm pt-1">
                      <span className="text-slate-500">Status</span>
                      <span className="bg-yellow-100 text-yellow-700 font-bold text-[10px] px-2.5 py-1 rounded-md">Pending Confirmation</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={onClose}
                  className="w-full h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body mb-4"
                >
                  Close & View My Bookings
                </Button>

                <p className="text-[11px] text-slate-400 text-center">Confirmation will be sent through SMS.</p>
              </div>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
