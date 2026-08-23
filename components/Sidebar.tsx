"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Ticket, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

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
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User
    }
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-white flex flex-col h-screen sticky top-0 shadow-xl">
      {/* Sidebar Header with Logo */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
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

      <div className="flex-1 py-8 px-4 flex flex-col gap-2">
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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </div>

    </div>
  );
}
