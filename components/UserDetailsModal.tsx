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
  onToggleMember?: (user: any) => void;
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onToggleStatus,
  onToggleMember,
}: UserDetailsModalProps) {
  if (!user) return null;

  const joinDate = user.created_at ? format(new Date(user.created_at), 'EEEE, dd MMMM yyyy') : '-';
  const isActive = user.is_active !== false;
  const isMember = user.is_member === true || user.role === 'Admin' || user.role === 'Super Admin';

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
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className={cn(
                "text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wider shadow-xs",
                isMember ? "bg-yellow-400 text-slate-900 border border-yellow-500 font-black" : "bg-slate-100 text-slate-600 border border-slate-200"
              )}>
                {isMember ? '⚡ Court Member' : 'Regular User'}
              </span>
              <span className={cn(
                "text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wider shadow-xs",
                isActive ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-700 border border-red-200"
              )}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <DialogDescription className="text-slate-400 text-xs mt-1">
            Registered customer account profile and contact information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-sm">
          
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
              <div className="w-12 h-12 rounded-full bg-yellow-400 font-black text-slate-900 flex items-center justify-center text-lg shadow-sm border border-yellow-500">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="font-extrabold text-[#0f172a] text-base">{user.name}</h3>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <ShieldIcon className="w-3.5 h-3.5 text-yellow-500" /> {user.role || 'Member'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Account Type</span>
                <span className={cn(
                  "text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mt-1",
                  user.is_guest 
                    ? "bg-amber-100 text-amber-800 border border-amber-200" 
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                )}>
                  {user.is_guest ? 'Guest User' : 'Registered User'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Mobile Phone</span>
                <span className="font-extrabold text-slate-800 text-body-sm flex items-center gap-1.5 mt-1">
                  <PhoneIcon className="w-4 h-4 text-slate-400" /> {user.phone || '-'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[11px] font-bold text-slate-400 block">Member Since</span>
                <span className="font-bold text-slate-700 text-body-sm flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-slate-400" /> {joinDate}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onToggleMember && onToggleMember(user); onClose(); }}
                className={cn(
                  "px-3.5 py-2 rounded-xl font-black text-xs transition-colors cursor-pointer border shadow-2xs",
                  user.is_member ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border-yellow-300 font-extrabold" : "bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-yellow-500"
                )}
              >
                {user.is_member ? 'Remove Membership' : 'Make Court Member'}
              </button>

              <button
                onClick={() => { onToggleStatus && onToggleStatus(user); onClose(); }}
                className={cn(
                  "px-3.5 py-2 rounded-xl font-extrabold text-xs transition-colors cursor-pointer border",
                  isActive ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                )}
              >
                {isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
