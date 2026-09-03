"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import UserIcon from '@mui/icons-material/PersonOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Email';
import Calendar from '@mui/icons-material/CalendarMonth';
import MessageIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import TagIcon from '@mui/icons-material/Tag';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import { cn } from '@/lib/utils';

interface InquiryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: any | null;
  onResolve?: (id: number) => void;
}

export default function InquiryDetailsModal({
  isOpen,
  onClose,
  inquiry,
  onResolve,
}: InquiryDetailsModalProps) {
  if (!inquiry) return null;

  const inquiryDate = inquiry.created_at ? format(new Date(inquiry.created_at), 'EEEE, dd MMMM yyyy, hh:mm a') : '-';
  const isResolved = inquiry.status === 'Resolved';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
                Customer Message Inquiry
              </span>
              <DialogTitle className="text-xl font-black text-[#0f172a] flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-yellow-500" /> INQ-{inquiry.id}
              </DialogTitle>
            </div>
            <span className={cn(
              "text-xs px-3.5 py-1.5 rounded-full font-extrabold uppercase tracking-wider shadow-xs",
              isResolved ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-900 border border-amber-300"
            )}>
              {isResolved ? 'Resolved' : 'Pending Review'}
            </span>
          </div>
          <DialogDescription className="text-slate-400 text-xs mt-1">
            Customer inquiry details and full message content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-sm">
          
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-slate-400" /> Sender Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Sender Name</span>
                <span className="font-extrabold text-[#0f172a] text-body-sm">{inquiry.name}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Mobile Phone</span>
                <span className="font-bold text-slate-700 text-body-sm flex items-center gap-1">
                  <PhoneIcon className="w-3.5 h-3.5 text-slate-400" /> {inquiry.mobile || inquiry.phone || '-'}
                </span>
              </div>
              {inquiry.email && (
                <div className="sm:col-span-2">
                  <span className="text-[11px] font-bold text-slate-400 block">Email Address</span>
                  <span className="font-medium text-slate-600 text-body-sm flex items-center gap-1">
                    <MailIcon className="w-3.5 h-3.5 text-slate-400" /> {inquiry.email}
                  </span>
                </div>
              )}
              <div className="sm:col-span-2">
                <span className="text-[11px] font-bold text-slate-400 block">Submitted On</span>
                <span className="font-medium text-slate-500 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {inquiryDate}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageIcon className="w-4 h-4 text-slate-400" /> Message Subject & Details
            </h4>
            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/50 space-y-2">
              <p className="font-extrabold text-[#0f172a] text-body">{inquiry.subject || 'General Inquiry'}</p>
              <p className="text-slate-700 font-medium text-body-sm leading-relaxed whitespace-pre-line">
                {inquiry.message}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end">
            {!isResolved && (
              <button
                onClick={() => { onResolve && onResolve(inquiry.id); onClose(); }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircleIcon className="w-4 h-4" /> Mark as Resolved
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
