"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import LayoutDashboard from '@mui/icons-material/Dashboard';
import CalendarDays from '@mui/icons-material/CalendarToday';
import Ticket from '@mui/icons-material/ConfirmationNumber';
import Settings from '@mui/icons-material/Settings';
import LogOut from '@mui/icons-material/Logout';
import X from '@mui/icons-material/Close';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    router.push('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Availability',
      href: '/dashboard/availability',
      icon: CalendarDays
    },
    {
      name: 'My Booking',
      href: '/dashboard/bookings',
      icon: Ticket
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings
    }
  ];

  return (
    <div className="w-64 text-white flex flex-col h-full shadow-xl overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/about-us.avif"
          alt="Sidebar Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#0f172a]/60" />
      </div>

      {/* Sidebar Content */}
      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Sidebar Header with Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10 shrink-0">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="KEYS Club Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-white">KEYS CLUB</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Karanavai East</span>
            </div>
          </Link>
          {/* Mobile Close Button */}
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-4">
            Main Menu
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-yellow-400 text-black shadow-md shadow-yellow-900/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-black" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-white/10 shrink-0 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span>Logout</span>
          </button>
          <div className="text-[10px] text-center text-slate-400 font-medium pt-1">
            Website by <a href="tel:+94763326098" className="text-yellow-400 font-bold hover:underline">Esan Jenothan: +94763326098</a>
          </div>
        </div>
      </div>
    </div>
  );
}
