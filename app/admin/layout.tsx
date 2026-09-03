"use client"

import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import LogOut from '@mui/icons-material/Logout';
import Menu from '@mui/icons-material/Menu';
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter, usePathname } from "next/navigation";

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const role = user?.role;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const pathname = usePathname();
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.includes('/admin/bookings')) return 'Booking Management';
    if (pathname.includes('/admin/users')) return 'Users';
    if (pathname.includes('/admin/availability')) return 'Court Availability';
    if (pathname.includes('/admin/inquiries')) return 'Inquiries';
    if (pathname.includes('/admin/settings')) return 'Settings';
    if (pathname.includes('/admin/management')) return 'Admin Management';
    if (pathname.includes('/admin/website-data')) return 'Website Data Configuration';
    return 'Admin Panel';
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">



      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:static lg:block w-64 shrink-0 transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full relative flex flex-col h-screen overflow-hidden">

        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 md:px-10 shrink-0">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight hidden sm:block">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Admin Badge */}
            <span className="bg-yellow-400/20 text-slate-900 border border-yellow-400 font-extrabold text-xs px-3 py-1.5 rounded-lg hidden sm:block uppercase tracking-wider">
              {role === 'Super Admin' ? 'SUPERADMIN PANEL' : 'ADMIN PANEL'}
            </span>

            {/* Profile */}
            <div className="flex items-center gap-3 ml-2">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-bold text-sm shadow-sm">
                  {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : (role === 'Super Admin' ? 'SA' : 'AD')}
                </div>
                <div className="text-left hidden sm:flex flex-col justify-center">
                  <span className="font-extrabold text-[#0f172a] text-sm leading-tight">{user?.name || role}</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-2"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 text-red-600 hover:text-red-400 cursor-pointer transition-colors text-sm font-bold"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ProtectedRoute>
  );
}
