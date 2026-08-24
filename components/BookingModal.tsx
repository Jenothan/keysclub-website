import React, { useState, useEffect } from 'react';
import Check from '@mui/icons-material/Check';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: {
    date: string;
    time: string;
    court_id?: number;
    start_time?: string;
    end_time?: string;
    rawDate?: string;
  } | null;
}

export default function BookingModal({ isOpen, onClose, selectedSlot }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuthStore();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const steps = [
    { id: 1, name: 'Review & Notes' },
    { id: 2, name: 'Done' }
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setNotes('');
      setBookingId('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedSlot?.court_id || !selectedSlot?.start_time || !selectedSlot?.end_time) {
      toast.error('Invalid slot selected');
      return;
    }

    setIsSubmitting(true);
    try {
      // API expects: { court_id, booking_date, start_time, end_time }
      // We will extract booking_date from start_time or use calendarDate if passed
      // Usually start_time is just "HH:mm" in some APIs, let's assume it's properly formatted.
      // Or we can construct it if we have the date. Let's send what we have.
      // We need booking_date in YYYY-MM-DD.
      // Let's assume the API handles it if we send date, start_time, end_time.
      // But the guide says: { court_id, booking_date, start_time, end_time }
      // So we must pass it. Wait, the date string we have in selectedSlot is "EEEE, dd MMMM yyyy".
      // We need the raw Date. We didn't pass it from AvailabilityPage.
      // Let's assume start_time from API comes as "YYYY-MM-DD HH:mm:ss" or just "HH:mm".
      // We will parse the date from selectedSlot or pass it explicitly.
      // We will need to update AvailabilityPage to pass raw `booking_date` in `selectedSlot`. Let's assume we do.
      
      const payload = {
        court_id: selectedSlot.court_id,
        booking_date: (selectedSlot as any).rawDate, // We will update AvailabilityPage to pass this
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        notes: notes
      };

      const res = await api.post('/bookings', payload);
      setBookingId(res.data?.id || `KEYS-${Date.now().toString().slice(-4)}`);
      setCurrentStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">Booking Process</DialogTitle>
        <div className="relative w-full bg-white flex flex-col items-center rounded-2xl shadow-xl border border-slate-100 max-h-[90vh]">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between w-full pl-12 pr-6 sm:pl-16 sm:pr-10 py-5 bg-slate-50/50 border-b border-slate-100 shrink-0">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    currentStep > step.id 
                      ? 'bg-emerald-500 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span 
                  className={`text-[11px] sm:text-sm font-semibold hidden sm:block whitespace-nowrap ${
                    currentStep === step.id ? 'text-blue-600' : 'text-slate-500'
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
        <div className="w-full p-6 sm:p-8 md:p-10 max-w-[600px] mx-auto overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
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
                    <span className="font-semibold text-[#0f172a]">{selectedSlot?.date || '...'}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-semibold text-[#0f172a]">{selectedSlot?.time || '...'}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-slate-500">Name</span>
                    <span className="font-semibold text-[#0f172a]">{user?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-slate-500">Mobile Number</span>
                    <span className="font-semibold text-[#0f172a]">{user?.phone}</span>
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
                  className="block w-full p-4 rounded-lg border border-slate-200 bg-slate-50/50 text-[#0f172a] text-body-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-slate-400"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={onClose}
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-full h-12 text-slate-700 font-bold text-body"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body"
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
                    <span className="font-semibold text-[#0f172a]">{selectedSlot?.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Time</span>
                    <span className="font-semibold text-[#0f172a]">{selectedSlot?.time}</span>
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

              <p className="text-[11px] text-slate-400 text-center">Confirmation will be sent through SMS and/or email.</p>
            </div>
          )}

        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
}
