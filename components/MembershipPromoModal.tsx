"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import StarIcon from '@mui/icons-material/StarRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOpenIcon from '@mui/icons-material/LockOpenRounded';
import LocalActivityIcon from '@mui/icons-material/LocalActivityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import MembershipRequestModal from '@/components/MembershipRequestModal';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface MembershipPromoModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function MembershipPromoModal({ forceOpen, onClose }: MembershipPromoModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (forceOpen !== undefined) {
      setIsOpen(forceOpen);
      return;
    }

    // Auto-open modal for non-members if not already dismissed in this session
    const isClosedInSession = sessionStorage.getItem('membership_promo_closed') === 'true';
    const isMember = !!user && Boolean(user.is_member);

    if (!isMember && !isClosedInSession) {
      // Small delay for smooth entry animation
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [mounted, user, forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('membership_promo_closed', 'true');
    if (onClose) onClose();
  };

  const handleCTAClick = () => {
    handleClose();
    if (!user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('open_membership_modal', 'true');
      }
      router.push('/signup?redirect=membership');
    } else {
      setIsRequestModalOpen(true);
    }
  };

  const handleLoginRedirect = () => {
    handleClose();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('open_membership_modal', 'true');
    }
    router.push('/login?redirect=membership');
  };

  const isMember = !!user && Boolean(user.is_member);

  if (!mounted || (!isOpen && !isRequestModalOpen)) return null;

  return (
    <>
      {/* Promotion Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-yellow-400/40 overflow-hidden max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none animate-in zoom-in-95 duration-200">

            {/* Glowing Accent Background */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button at Top Right */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-full border border-slate-700 transition-all cursor-pointer z-20"
              title="Close modal"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <div className="relative z-10 space-y-6">

              {/* Header Badge */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[11px] font-black tracking-wider uppercase">
                  <StarIcon className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  <span>Exclusive Membership Offer</span>
                </div>
              </div>

              {/* Title Requested by User */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug">
                Get Membership in Badminton Court at{" "}
                <span className="text-yellow-400 underline decoration-yellow-400/40 underline-offset-4">
                  Karanavai East Youth Sports Club
                </span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Unlock priority access to high-demand Peak Hour slots (3:00 PM – 8:00 PM), discounted member rates, official player status, and automated SMS updates.
              </p>

              {/* Key Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <div className="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold shrink-0">
                    <LockOpenIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Peak Hour Access</span>
                    <span className="text-[10px] text-slate-400">Book 3:00 PM - 8:00 PM slots</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <div className="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold shrink-0">
                    <LocalActivityIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Member Rate Discount</span>
                    <span className="text-[10px] text-slate-400">Special monthly pricing</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <div className="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold shrink-0">
                    <ShieldIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Verified Player Badge</span>
                    <span className="text-[10px] text-slate-400">Official club player status</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <div className="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Instant SMS Confirmations</span>
                    <span className="text-[10px] text-slate-400">Real-time status updates</span>
                  </div>
                </div>
              </div>

              {/* Action Box Area */}
              <div className="pt-3 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-slate-400 hover:text-white font-bold text-xs rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer text-center"
                >
                  Maybe Later
                </button>

                {isMember ? (
                  <div className="w-full sm:w-auto py-2.5 px-5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    <span>Active Court Member</span>
                  </div>
                ) : (
                  <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-2">
                    <button
                      onClick={handleCTAClick}
                      className="w-full sm:w-auto py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-yellow-400/20 transition-all cursor-pointer flex items-center justify-center gap-2 border border-yellow-500 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>{user ? "Request Court Membership" : "Sign Up & Request Membership"}</span>
                      <ArrowForwardIcon className="w-4 h-4" />
                    </button>

                    {!user && (
                      <p className="text-[11px] text-slate-400 text-center sm:text-right">
                        Already have an account?{" "}
                        <button
                          onClick={handleLoginRedirect}
                          className="text-yellow-400 font-bold hover:underline cursor-pointer"
                        >
                          Login & Request
                        </button>
                      </p>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Interactive Membership Request Submission Modal */}
      <MembershipRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={() => {
          toast.success("Membership request submitted! We will review and notify you via SMS.");
        }}
      />
    </>
  );
}
