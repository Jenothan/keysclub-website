"use client"

import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
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
            <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight">User Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Profile */}
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:flex flex-col justify-center">
                <span className="font-extrabold text-[#0f172a] text-sm leading-tight mb-0.5">Reginod Alestra</span>
                <span className="text-slate-500 text-xs font-medium leading-none">+94 77 123 4567</span>
              </div>
              <Image
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover border border-slate-200 shadow-sm"
              />
            </div>
            
            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1"></div>
            
            {/* Logout */}
            <button className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold">
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
