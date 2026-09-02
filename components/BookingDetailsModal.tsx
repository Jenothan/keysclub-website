"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import Clock from '@mui/icons-material/AccessTime';
import Calendar from '@mui/icons-material/CalendarMonth';
import UserIcon from '@mui/icons-material/PersonOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Email';
import LocationIcon from '@mui/icons-material/LocationOn';
import NoteIcon from '@mui/icons-material/StickyNote2';
import TagIcon from '@mui/icons-material/ConfirmationNumber';
import ShieldIcon from '@mui/icons-material/AdminPanelSettings';
import { computeBookingStatus } from '@/lib/bookingUtils';
import { cn } from '@/lib/utils';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any | null;
  isAdmin?: boolean;
  onConfirm?: (id: number) => void;
  onReject?: (id: number) => void;
  onReschedule?: (booking: any) => void;
  onCancel?: (id: number) => void;
}

export default function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
  isAdmin = false,
  onConfirm,
  onReject,
  onReschedule,
  onCancel,
}: BookingDetailsModalProps) {
  if (!booking) return null;

  const statusInfo = computeBookingStatus(booking);
  const bookingDate = booking.booking_date ? new Date(booking.booking_date) : null;
  const formattedDate = bookingDate ? format(bookingDate, 'EEEE, dd MMMM yyyy') : '-';
  const requestDate = booking.created_at ? format(new Date(booking.created_at), 'dd MMM yyyy, hh:mm a') : '-';

  const customerName = booking.user?.name || booking.customer_name || 'Walk-in Customer';
  const customerPhone = booking.user?.phone || booking.customer_phone || '-';
  const customerEmail = booking.user?.email || '-';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
                Booking Details
              </span>
              <DialogTitle className="text-xl font-black text-[#0f172a] flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-yellow-500" /> #KC-{booking.id}
              </DialogTitle>
            </div>
            <span className={cn("text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs", statusInfo.badgeClass)}>
              {statusInfo.label}
            </span>
          </div>
          <DialogDescription className="text-slate-400 text-xs mt-1">
            Complete details for this court reservation request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          
          {/* Customer Information */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-slate-400" /> Customer Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Name</span>
                <span className="font-extrabold text-[#0f172a] text-body-sm">{customerName}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Mobile Phone</span>
                <span className="font-bold text-slate-700 text-body-sm flex items-center gap-1">
                  <PhoneIcon className="w-3.5 h-3.5 text-slate-400" /> {customerPhone}
                </span>
              </div>
              {customerEmail !== '-' && (
                <div className="sm:col-span-2">
                  <span className="text-[11px] font-bold text-slate-400 block">Email Address</span>
                  <span className="font-medium text-slate-600 text-body-sm flex items-center gap-1">
                    <MailIcon className="w-3.5 h-3.5 text-slate-400" /> {customerEmail}
                  </span>
                </div>
              )}
              {booking.booked_by && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-400 block">Created By</span>
                  <span className="font-bold text-slate-800 text-body-sm flex items-center gap-1">
                    <ShieldIcon className="w-3.5 h-3.5 text-yellow-500" /> {booking.booked_by.name || 'Admin'} ({booking.booked_by.role || 'Staff'})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Schedule & Slot Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" /> Reservation Schedule
            </h4>

            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500">Booking Date</span>
                <span className="font-extrabold text-[#0f172a] text-body-sm">{formattedDate}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500">Reserved Time Slot</span>
                <span className="font-black text-slate-900 bg-yellow-400/20 text-yellow-900 px-3 py-1 rounded-md border border-yellow-400/40 text-body-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-yellow-600" /> {booking.start_time} - {booking.end_time}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500">Court Location</span>
                <span className="font-bold text-slate-700 text-body-sm flex items-center gap-1">
                  <LocationIcon className="w-4 h-4 text-slate-400" /> Point Pedro (National Standard)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Request Submitted On</span>
                <span className="font-medium text-slate-500 text-xs">{requestDate}</span>
              </div>
            </div>
          </div>

          {/* Special Requests / Notes */}
          {booking.notes && (
            <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1.5">
                <NoteIcon className="w-4 h-4 text-amber-600" /> Notes / Special Requests
              </h4>
              <p className="text-amber-950 font-medium text-body-sm leading-relaxed">{booking.notes}</p>
            </div>
          )}

          {/* Action Buttons inside Modal */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end">
            {isAdmin && booking.status === 'Pending' && (
              <>
                <button
                  onClick={() => { onConfirm && onConfirm(booking.id); onClose(); }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Confirm Reservation
                </button>
                <button
                  onClick={() => { onReject && onReject(booking.id); onClose(); }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Reject Request
                </button>
              </>
            )}

            {isAdmin && statusInfo.status === 'Confirmed' && (
              <>
                <button
                  onClick={() => { onReschedule && onReschedule(booking); onClose(); }}
                  className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Reschedule Slot
                </button>
                <button
                  onClick={() => { onCancel && onCancel(booking.id); onClose(); }}
                  className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-xl border border-red-200 transition-all cursor-pointer"
                >
                  Cancel Booking
                </button>
              </>
            )}

            {!isAdmin && statusInfo.status === 'Confirmed' && (
              <button
                onClick={() => { onCancel && onCancel(booking.id); onClose(); }}
                className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-xl border border-red-200 transition-all cursor-pointer"
              >
                Cancel My Booking
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
