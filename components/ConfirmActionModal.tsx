"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CheckCircle from '@mui/icons-material/CheckCircleOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import WarningIcon from '@mui/icons-material/WarningOutlined';
import Clock from '@mui/icons-material/AccessTime';
import Calendar from '@mui/icons-material/CalendarMonth';
import UserIcon from '@mui/icons-material/PersonOutlined';
import TagIcon from '@mui/icons-material/ConfirmationNumber';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAction: () => void;
  action: 'confirm' | 'reject' | 'cancel' | null;
  booking: any | null;
  isLoading?: boolean;
}

export default function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirmAction,
  action,
  booking,
  isLoading = false,
}: ConfirmActionModalProps) {
  if (!booking || !action) return null;

  const refCode = booking.booking_reference 
    ? (booking.booking_reference.startsWith('#') ? booking.booking_reference : `#${booking.booking_reference}`)
    : `#KC-${booking.id}`;

  const customerName = booking.customer_name || booking.user?.name || (booking.booked_by?.name ? booking.booked_by.name : 'Walk-in Customer');
  const customerPhone = booking.customer_phone || booking.user?.phone || (booking.booked_by?.phone ? booking.booked_by.phone : '-');
  const bookingDate = booking.booking_date || '-';

  const timeDisplay = booking.time_ranges && booking.time_ranges.length > 0
    ? booking.time_ranges.join(', ')
    : (booking.start_time && booking.end_time ? `${booking.start_time} - ${booking.end_time}` : '-');

  const isConfirm = action === 'confirm';
  const isReject = action === 'reject';
  const isCancel = action === 'cancel';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100">
        
        <div className="flex flex-col items-center text-center">
          
          {/* Header Icon */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 border ${
            isConfirm 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
              : isReject 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}>
            {isConfirm && <CheckCircle className="w-8 h-8" />}
            {isReject && <CancelIcon className="w-8 h-8" />}
            {isCancel && <WarningIcon className="w-8 h-8" />}
          </div>

          <DialogTitle className="text-xl font-black text-[#0f172a] mb-1">
            {isConfirm && 'Confirm Court Reservation?'}
            {isReject && 'Reject Booking Request?'}
            {isCancel && 'Cancel Booking?'}
          </DialogTitle>

          <DialogDescription className="text-slate-500 text-xs max-w-sm mb-5 leading-relaxed">
            {isConfirm && `Are you sure you want to CONFIRM booking ${refCode} for ${customerName}? An SMS notification will be sent.`}
            {isReject && `Are you sure you want to REJECT booking request ${refCode} for ${customerName}? An SMS notification will be sent.`}
            {isCancel && `Are you sure you want to CANCEL booking ${refCode}?`}
          </DialogDescription>

          {/* Details Summary Card */}
          <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-left mb-6">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <TagIcon className="w-3.5 h-3.5 text-yellow-500" /> Reference
              </span>
              <span className="font-black text-[#0f172a]">{refCode}</span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Customer
              </span>
              <span className="font-bold text-slate-800">{customerName} ({customerPhone})</span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date
              </span>
              <span className="font-bold text-slate-800">{bookingDate}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Time Slot
              </span>
              <span className="font-extrabold text-amber-700">{timeDisplay}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmAction();
              }}
              disabled={isLoading}
              className={`flex-1 py-3 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
                isConfirm
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : isReject
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading
                ? 'Processing...'
                : isConfirm
                ? 'Yes, Confirm'
                : isReject
                ? 'Yes, Reject'
                : 'Yes, Cancel'}
            </button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
