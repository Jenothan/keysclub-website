import React, { useState, useRef } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OTPInput } from "@/components/OTPInput";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: {
    date: string;
    time: string;
  } | null;
}

export default function BookingModal({ isOpen, onClose, selectedSlot }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

  const steps = [
    { id: 1, name: 'Your Details' },
    { id: 2, name: 'Mobile Verification' },
    { id: 3, name: 'Review & Notes' },
    { id: 4, name: 'Done' }
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">Booking Process</DialogTitle>
        <div className="relative w-full bg-white flex flex-col items-center rounded-2xl shadow-xl border border-slate-100 max-h-[90vh]">
        
        {/* Back Button */}
        {currentStep > 1 && currentStep < 4 && (
          <button 
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            className="absolute top-4 left-3 sm:top-5 sm:left-4 p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors z-20 bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

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
          
          {/* Step 1: Your Details */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-[22px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Your Details</h2>
              <p className="text-slate-500 text-body-sm mb-8">
                Please provide your contact information to begin the booking request process.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-caption font-bold text-[#0f172a] mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    defaultValue="Kamil Perera"
                    className="h-12 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-caption font-bold text-[#0f172a] mb-2">
                    Mobile Number
                  </label>
                  <div className="flex gap-3">
                    <div className="px-4 py-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-center shrink-0 w-20">
                      <span className="text-[#0f172a] text-body-sm font-semibold">+94</span>
                    </div>
                    <Input
                      type="tel"
                      defaultValue="771234567"
                      className="h-12 bg-slate-50/50"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Verification OTP will be sent to this mobile number.</p>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleNext}
                    className="w-full h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Mobile Verification */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-[22px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Verify Your Mobile Number</h2>
              <p className="text-slate-500 text-body-sm mb-8">
                Enter the 6-digit verification code sent to your mobile number +94 77 123 4567.
              </p>

              <div className="space-y-8">
                <OTPInput length={6} otp={otp} setOtp={setOtp} />

                <Button 
                  onClick={handleNext}
                  className="w-full h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body"
                >
                  Verify & Continue
                </Button>

                <div className="text-center">
                  <span className="text-caption text-slate-500">Didn't receive code? </span>
                  <button className="text-caption font-bold text-blue-600 hover:underline">Resend OTP</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Notes */}
          {currentStep === 3 && (
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
                    <span className="font-semibold text-[#0f172a]">{selectedSlot?.date || 'Tuesday, 27 October 2026'}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-semibold text-[#0f172a]">{selectedSlot?.time || '06:00 PM - 07:00 PM'}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-slate-500">Name</span>
                    <span className="font-semibold text-[#0f172a]">Kamil Perera</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-slate-500">Mobile Number</span>
                    <span className="font-semibold text-[#0f172a]">+94 77 123 4567</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-[11px] font-bold text-[#0f172a] mb-2">
                  Optional Notes/Additional Requirements
                </label>
                <textarea 
                  rows={3}
                  placeholder="Need an extra racket if available. Thank you."
                  className="block w-full p-4 rounded-lg border border-slate-200 bg-slate-50/50 text-[#0f172a] text-body-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-slate-400"
                ></textarea>
              </div>

              <Button 
                onClick={handleNext}
                className="w-full h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body"
              >
                Submit Booking Request
              </Button>
            </div>
          )}

          {/* Step 4: Done */}
          {currentStep === 4 && (
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
                    <span className="font-semibold text-[#0f172a]">KEYS-2026-9874</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-semibold text-[#0f172a]">{selectedSlot?.date || 'Tuesday, 27 October 2026'}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Time</span>
                    <span className="font-semibold text-[#0f172a]">{selectedSlot?.time || '06:00 PM - 07:00 PM'}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm pt-1">
                    <span className="text-slate-500">Status</span>
                    <span className="bg-yellow-100 text-yellow-700 font-bold text-[10px] px-2.5 py-1 rounded-md">Pending Confirmation</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  onClose();
                  setTimeout(() => setCurrentStep(1), 300);
                }}
                className="w-full h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body mb-4"
              >
                View My Booking
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
