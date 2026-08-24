"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LayoutDashboard from '@mui/icons-material/Dashboard';
import Ticket from '@mui/icons-material/ConfirmationNumber';
import Users from '@mui/icons-material/Group';
import CalendarDays from '@mui/icons-material/CalendarToday';
import MessageSquare from '@mui/icons-material/ChatBubbleOutlineOutlined';
import Settings from '@mui/icons-material/Settings';
import X from '@mui/icons-material/Close';
import Shield from '@mui/icons-material/Security';
import Globe from '@mui/icons-material/Language';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role;

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      name: 'Booking Management',
      href: '/admin/bookings',
      icon: Ticket
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users
    },
    {
      name: 'Court Availability',
      href: '/admin/availability',
      icon: CalendarDays
    },
    {
      name: 'Inquiries',
      href: '/admin/inquiries',
      icon: MessageSquare
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  if (role === 'Super Admin') {
    navItems.push(
      {
        name: 'Admin Management',
        href: '/admin/management',
        icon: Shield
      },
      {
        name: 'Website Data',
        href: '/admin/website-data',
        icon: Globe
      }
    );
  }

  return (
    <div className="relative w-64 text-white flex flex-col h-screen sticky top-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)] border-r border-blue-800 overflow-hidden">
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
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-600 shrink-0">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Image
            src="/logo.png"
            alt="KEYS Club Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-none tracking-tight text-white">KEYS CLUB</span>
            <span className="text-[10px] text-white uppercase tracking-widest mt-1">Karanavai East</span>
          </div>
        </Link>
        {/* Mobile Close Button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
        <div className="text-[11px] font-bold text-white uppercase tracking-widest mb-2 px-4">
          Navigation
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                isActive
                  ? "bg-yellow-400 text-black shadow-md"
                  : "text-white hover:bg-white/10"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-black" : "text-white")} />
              {item.name}
            </Link>
          );
        })}
      </div>
      </div>
    </div>
  );
}
