"use client"

import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

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

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      
      {/* Super Admin Screen Size Restriction */}
      {role === 'Super Admin' && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center lg:hidden px-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <LogOut className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Access Restricted</h1>
          <p className="text-slate-500 font-medium max-w-sm mb-6">
            Super admin can't open in mobile or tablets. Please use a laptop or desktop screen to access the admin dashboard.
          </p>
          <button 
            onClick={() => {}}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl shadow-sm cursor-not-allowed opacity-50"
            disabled
          >
            Switch to Admin Role
          </button>
        </div>
      )}

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
            {/* Mobile Title (hidden on desktop) */}
            <h2 className="lg:hidden text-lg font-extrabold text-[#0f172a] tracking-tight">Admin</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Admin Badge */}
            <span className="bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-lg hidden sm:block">
              ADMIN PANEL
            </span>

            {/* Profile */}
            <div className="flex items-center gap-3 ml-2">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {role === 'Super Admin' ? 'SA' : 'AD'}
                </div>
                <div className="text-left hidden sm:flex flex-col justify-center">
                  <span className="font-extrabold text-[#0f172a] text-sm leading-tight">{role}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-2"></div>
            
            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold"
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
