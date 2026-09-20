import React, { useState, useEffect } from 'react';
import Check from '@mui/icons-material/Check';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import Lock from '@mui/icons-material/LockOutlined';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/store/authStore';
import { formatPhoneWithCountryCode } from '@/lib/phoneUtils';
import PhoneInput from '@/components/PhoneInput';
import { OTPInput } from '@/components/OTPInput';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlots: any[];
  onBookingSuccess?: () => void;
}

export default function BookingModal({ isOpen, onClose, selectedSlots, onBookingSuccess }: BookingModalProps) {
  const { user, setAuth, setUser } = useAuthStore();

  // Step states:
  // 1: Phone input (unauthenticated)
  // 2: OTP verification (4 individual boxes)
  // 3: Account creation prompt (if new or guest user)
  // 4: Password setup (if Yes to set password)
  // 5: Review & Notes
  // 6: Done / Booking Confirmation

  const [step, setStep] = useState(1);
  const [isInitiallyLoggedIn, setIsInitiallyLoggedIn] = useState(false);
  const [hasSetPasswordInSession, setHasSetPasswordInSession] = useState(false);

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otpArray, setOtpArray] = useState<string[]>(['', '', '', '']);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [confirmedSlots, setConfirmedSlots] = useState<any[]>([]);
  const [confirmedDate, setConfirmedDate] = useState<string>('');

  const isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';

  const handleModalClose = () => {
    const currentState = useAuthStore.getState();
    if (!isInitiallyLoggedIn && !hasSetPasswordInSession) {
      currentState.logout();
    }
    if (onBookingSuccess) {
      onBookingSuccess();
    }
    onClose();
  };

  // Determine initial step only when modal opens
  useEffect(() => {
    if (isOpen) {
      const loggedIn = !!user && !user.is_guest;
      setIsInitiallyLoggedIn(loggedIn);
      setHasSetPasswordInSession(false);
      if (loggedIn) {
        setStep(5); // Direct to Review & Notes if logged in as registered user
      } else {
        setStep(1); // Start with Phone Input if not logged in
      }
      setPhone('');
      setName('');
      setOtpArray(['', '', '', '']);
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setNotes('');
      setCustomerName('');
      setCustomerPhone('');
      setBookingId('');
      setConfirmedSlots([]);
      setConfirmedDate('');
    }
  }, [isOpen]); // Only re-run when modal opens, NOT on user state change!

  // Helper to compute contiguous merged time badges
  const getMergedSlotBadges = (slotsToMerge = selectedSlots) => {
    if (!slotsToMerge || slotsToMerge.length === 0) return [];
    const sorted = [...slotsToMerge].sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
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

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!phone || phone.trim().length < 7) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    setIsSendingOtp(true);
    try {
      const formattedPhone = formatPhoneWithCountryCode(phone);
      await api.post('/booking/request-otp', { phone: formattedPhone });
      toast.success('OTP sent to your mobile number!');
      setOtpArray(['', '', '', '']);
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const otpCode = otpArray.join('');
    if (!otpCode || otpCode.length !== 4) {
      toast.error('Please enter the 4-digit OTP code');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const formattedPhone = formatPhoneWithCountryCode(phone);
      const response = await api.post('/booking/verify-otp', {
        phone: formattedPhone,
        otp_code: otpCode,
        name: name.trim() || undefined,
      });

      const { user: verifiedUser, access_token, is_registered } = response.data;

      // Update global auth store
      setAuth(verifiedUser, access_token);
      toast.success('Mobile number verified successfully!');

      if (is_registered) {
        // Existing Registered User -> Skip account creation prompt -> Go directly to Review & Submit
        setStep(5);
      } else {
        // New User or Guest User -> Prompt for Account Creation
        setStep(3);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 3: Account Creation Choice (Yes / No)
  const handleAccountChoice = (choice: 'yes' | 'no') => {
    if (choice === 'yes') {
      const currentUser = useAuthStore.getState().user;
      setFullName(currentUser?.name && currentUser.name !== 'Guest User' ? currentUser.name : name);
      setStep(4);
    } else {
      // Continue as Guest User -> Go to Review & Submit
      setStep(5);
    }
  };

  // Step 4: Password Setup for Guest Upgrade
  const handleSetPassword = async () => {
    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSettingPassword(true);
    try {
      const response = await api.post('/booking/set-password', {
        password,
        name: fullName.trim() || undefined,
      });

      if (response.data?.user) {
        setUser(response.data.user);
        setHasSetPasswordInSession(true);
      }
      toast.success('Account created successfully!');
      setStep(5);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsSettingPassword(false);
    }
  };

  // Step 5: Final Booking Submission
  const handleSubmitBooking = async () => {
    if (!selectedSlots || selectedSlots.length === 0) {
      toast.error('No slots selected');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Real-time pre-check availability before submitting
      const dateStr = selectedSlots[0].rawDate;
      if (dateStr) {
        try {
          const availRes = await api.get(`/availability?date=${dateStr}`);
          const currentSlots = availRes.data || [];
          const unavailableSlot = selectedSlots.find(selected => {
            const matched = currentSlots.find((cs: any) => cs.start_time === selected.start_time);
            return matched && matched.status !== 'Available';
          });

          if (unavailableSlot) {
            toast.error('This slot is currently booked. Please choose another slot.', { duration: 5000 });
            if (onBookingSuccess) onBookingSuccess();
            handleModalClose();
            return;
          }
        } catch (checkErr) {
          // If pre-check fails due to network, proceed to server submission
        }
      }

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

      // Snapshot date & slots before onBookingSuccess clears selectedSlots
      const rawDateStr = selectedSlots[0]?.rawDate;
      const dateDisplay = selectedSlots[0]?.date || 
        (rawDateStr ? format(new Date(rawDateStr), 'EEEE, dd MMMM yyyy') : '');

      setConfirmedDate(dateDisplay);
      setConfirmedSlots([...selectedSlots]);

      const response = await api.post('/bookings', payload);
      const ref = response.data?.booking_reference || response.data?.booking?.booking_reference || `KEYS-${Date.now().toString().slice(-4)}`;
      setBookingId(ref);
      setStep(6);
      if (onBookingSuccess) onBookingSuccess();
    } catch (error: any) {
      const errMsg = error.response?.data?.errors?.slot?.[0] || error.response?.data?.message;
      const isSlotConflict = errMsg && (
        errMsg.toLowerCase().includes('unavailable') ||
        errMsg.toLowerCase().includes('booked') ||
        errMsg.toLowerCase().includes('choose')
      );

      const finalMsg = isSlotConflict 
        ? 'This slot is currently booked. Please choose another slot.'
        : (errMsg || 'Failed to submit booking');

      toast.error(finalMsg, { duration: 5000 });

      if (isSlotConflict) {
        if (onBookingSuccess) onBookingSuccess();
        handleModalClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step indicator badges
  const stepItems = isInitiallyLoggedIn ? [
    { id: 5, label: 'Review & Notes' },
    { id: 6, label: 'Done' }
  ] : [
    { id: 1, label: 'Verify Phone' },
    { id: 3, label: 'Account Choice' },
    { id: 5, label: 'Review & Submit' },
    { id: 6, label: 'Done' }
  ];

  const getStepProgressIndex = () => {
    if (step === 1 || step === 2) return 1;
    if (step === 3 || step === 4) return 3;
    if (step === 5) return 5;
    return 6;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="sm:max-w-175 p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">Booking Process</DialogTitle>
        <div className="relative w-full bg-white flex flex-col items-center rounded-2xl shadow-xl border border-slate-100 max-h-[90vh]">

          {/* Step Indicator */}
          <div className="flex items-center justify-between w-full pl-10 pr-6 sm:pl-16 sm:pr-10 py-5 bg-slate-50/50 border-b border-slate-100 shrink-0">
            {stepItems.map((item, index) => {
              const currentActiveIdx = getStepProgressIndex();
              const isCompleted = currentActiveIdx > item.id;
              const isCurrent = currentActiveIdx === item.id || (item.id === 1 && (step === 1 || step === 2)) || (item.id === 3 && (step === 3 || step === 4));

              return (
                <React.Fragment key={item.id}>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                          ? 'bg-yellow-400 text-slate-900'
                          : 'bg-slate-200 text-slate-500'
                        }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <span
                      className={`text-[11px] sm:text-sm font-semibold hidden sm:block whitespace-nowrap ${isCurrent ? 'text-yellow-600 font-extrabold' : 'text-slate-500'
                        }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {index < stepItems.length - 1 && (
                    <div className="flex-1 h-px bg-slate-200 mx-2 sm:mx-4" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Modal Card Content */}
          <div className="w-full p-6 sm:p-8 md:p-10 max-w-150 mx-auto overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">

            {/* STEP 1: Phone Number Input */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-[22px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Enter Phone Number</h2>
                <p className="text-slate-500 text-body-sm mb-6">
                  Please enter your mobile number to receive a verification OTP code for your booking.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <Input
                      type="text"
                      placeholder=" John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      value={phone}
                      onChange={(val) => setPhone(val)}
                      placeholder="712345678"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleModalClose}
                    variant="outline"
                    className="flex-1 h-12 text-slate-700 font-bold text-body"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !phone}
                    className="flex-1 h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body"
                  >
                    {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: OTP Verification (4-Box OTPInput) */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-4 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Change Phone Number
                </button>

                <h2 className="text-[22px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Enter Verification Code</h2>
                <p className="text-slate-500 text-body-sm mb-6">
                  We sent a 4-digit code to <span className="font-bold text-slate-900">{formatPhoneWithCountryCode(phone)}</span>.
                </p>

                <div className="mb-8 flex flex-col items-center">
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-4 text-center">
                    4-Digit OTP Code <span className="text-red-500">*</span>
                  </label>
                  <OTPInput
                    length={4}
                    otp={otpArray}
                    setOtp={setOtpArray}
                    onComplete={() => { }}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    variant="outline"
                    className="flex-1 h-12 text-slate-700 font-bold text-body"
                  >
                    Resend OTP
                  </Button>
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || otpArray.join('').length !== 4}
                    className="flex-1 h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body"
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Optional Account Creation Choice Dialog */}
            {step === 3 && (
              <div className="animate-in zoom-in-95 duration-300 text-center">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7" />
                </div>

                <h2 className="text-[22px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Create an Account?</h2>
                <p className="text-slate-600 text-body-sm mb-6 leading-relaxed">
                  Would you like to set a password and create an account to manage your court bookings easily in the future?
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>View & track your booking history anytime</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Faster future bookings with saved profile</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    onClick={() => handleAccountChoice('no')}
                    variant="outline"
                    className="w-full h-11 sm:h-12 text-[11px] sm:text-sm font-black text-slate-700 border-slate-200 cursor-pointer px-1.5 text-center whitespace-normal leading-tight rounded-xl"
                  >
                    No, Continue as Guest
                  </Button>
                  <Button
                    onClick={() => handleAccountChoice('yes')}
                    className="w-full h-11 sm:h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-black text-[11px] sm:text-sm cursor-pointer px-1.5 text-center whitespace-normal leading-tight rounded-xl shadow-xs"
                  >
                    Yes, Set Password
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Password Setup Modal */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-[22px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Set Your Password</h2>
                <p className="text-slate-500 text-body-sm mb-6">
                  Create a password to register your account. Your current phone number and booking history will be saved.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Your Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Password (min. 8 characters) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(5)}
                    variant="outline"
                    className="flex-1 h-12 text-slate-700 font-bold text-body cursor-pointer"
                  >
                    Skip for Now
                  </Button>
                  <Button
                    onClick={handleSetPassword}
                    disabled={isSettingPassword || !password || password.length < 8}
                    className="flex-1 h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body cursor-pointer"
                  >
                    {isSettingPassword ? 'Creating Account...' : 'Save & Continue'}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Notes */}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-[22px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Booking Details & Review</h2>
                <p className="text-slate-500 text-body-sm mb-6">
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
                        <span className="font-semibold text-[#0f172a]">{user?.name || name || 'Guest User'}</span>
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
                        <span className="font-semibold text-[#0f172a]">{user?.phone || formatPhoneWithCountryCode(phone)}</span>
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
                    onClick={handleModalClose}
                    disabled={isSubmitting}
                    variant="outline"
                    className="flex-1 h-12 text-slate-700 font-bold text-body cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitBooking}
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body cursor-pointer"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm & Book Slot'}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 6: Done / Booking Confirmation */}
            {step === 6 && (() => {
              const displaySlots = confirmedSlots.length > 0 ? confirmedSlots : selectedSlots;
              const rawDateStr = displaySlots[0]?.rawDate;
              const displayDate = confirmedDate || displaySlots[0]?.date || (rawDateStr ? format(new Date(rawDateStr), 'EEEE, dd MMMM yyyy') : '');
              const timeBadges = getMergedSlotBadges(displaySlots);

              return (
                <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8" />
                  </div>

                  <h2 className="text-[24px] font-extrabold text-[#0f172a] mb-2 tracking-tight text-center">Booking Confirmed!</h2>
                  <p className="text-slate-500 text-body-sm mb-8 text-center max-w-sm">
                    Your court booking is confirmed! Details have been sent via SMS to your mobile number.
                  </p>

                  <div className="w-full bg-slate-50/80 rounded-xl p-5 border border-slate-100 mb-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-slate-500">Booking ID</span>
                        <span className="font-semibold text-[#0f172a]">{bookingId}</span>
                      </div>
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-slate-500">Date</span>
                        <span className="font-semibold text-[#0f172a]">{displayDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start text-body-sm pb-4 border-b border-slate-200">
                        <span className="text-slate-500">Time(s)</span>
                        <div className="flex flex-col items-end gap-1">
                          {timeBadges.length > 0 ? (
                            timeBadges.map((badge, i) => (
                              <span key={i} className="font-semibold text-[#0f172a]">{badge}</span>
                            ))
                          ) : (
                            displaySlots.map((slot, i) => (
                              <span key={i} className="font-semibold text-[#0f172a]">{slot.time}</span>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-body-sm pt-1">
                        <span className="text-slate-500">Status</span>
                        <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2.5 py-1 rounded-md">Confirmed</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleModalClose}
                    className="w-full h-12 bg-[#fbbf24] hover:bg-[#f5b81a] text-slate-900 font-bold text-body mb-4 cursor-pointer"
                  >
                    {isInitiallyLoggedIn ? 'Close & View My Bookings' : 'Close'}
                  </Button>

                  <p className="text-[11px] text-slate-400 text-center">Confirmation details sent through SMS.</p>
                </div>
              );
            })()}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
