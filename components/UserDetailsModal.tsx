"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import UserIcon from '@mui/icons-material/PersonOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Email';
import Calendar from '@mui/icons-material/CalendarMonth';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import TagIcon from '@mui/icons-material/Tag';
import { cn } from '@/lib/utils';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
  onToggleStatus?: (user: any) => void;
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onToggleStatus,
}: UserDetailsModalProps) {
  if (!user) return null;

  const joinDate = user.created_at ? format(new Date(user.created_at), 'EEEE, dd MMMM yyyy') : '-';
  const isActive = user.is_active !== false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
                Member Profile Details
              </span>
              <DialogTitle className="text-xl font-black text-[#0f172a] flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-yellow-500" /> USR-{user.id}
              </DialogTitle>
            </div>
            <span className={cn(
              "text-xs px-3.5 py-1.5 rounded-full font-extrabold uppercase tracking-wider shadow-xs",
              isActive ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-700 border border-red-200"
            )}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <DialogDescription className="text-slate-400 text-xs mt-1">
            Registered customer account profile and contact information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-sm">
          
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
              <div className="w-12 h-12 rounded-full bg-yellow-400 font-black text-slate-900 flex items-center justify-center text-lg shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="font-extrabold text-[#0f172a] text-base">{user.name}</h3>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <ShieldIcon className="w-3.5 h-3.5 text-yellow-500" /> {user.role || 'Member'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Mobile Phone</span>
                <span className="font-extrabold text-slate-800 text-body-sm flex items-center gap-1.5 mt-0.5">
                  <PhoneIcon className="w-4 h-4 text-slate-400" /> {user.phone || '-'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Member Since</span>
                <span className="font-bold text-slate-700 text-body-sm flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-slate-400" /> {joinDate}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => { onToggleStatus && onToggleStatus(user); onClose(); }}
              className={cn(
                "px-4 py-2 rounded-xl font-extrabold text-xs transition-colors cursor-pointer",
                isActive ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
              )}
            >
              {isActive ? 'Deactivate Member' : 'Activate Member'}
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
