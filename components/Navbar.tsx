"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import LogOut from '@mui/icons-material/Logout';
import Menu from '@mui/icons-material/Menu';
import X from '@mui/icons-material/Close';
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isLoggedIn = !!user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    ...(isLoggedIn ? [{ name: "Dashboard", href: (user?.role === 'Admin' || user?.role === 'Super Admin') ? "/admin" : "/dashboard" }] : []),
    { name: "Availability", href: "/availability" },
    { name: "Pricing", href: "/pricing" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="KEYS Club Logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-subtitle leading-none tracking-tight text-slate-900">KARANAVAI EAST</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">YOUTH SPORTS CLUB</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${pathname === link.href ? "text-yellow-400 font-bold" : "text-gray-600 font-medium"} hover:text-yellow-400 transition`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth / Profile Area */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href={(user?.role === 'Admin' || user?.role === 'Super Admin') ? '/admin' : '/dashboard/profile'} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="text-right flex flex-col justify-center">
                    <span className="font-extrabold text-[#0f172a] text-body leading-tight mb-0.5">{user?.name}</span>
                    <span className="text-slate-500 text-body-sm font-medium leading-none">{user?.phone}</span>
                  </div>
                  <Image
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    alt="Profile"
                    width={44}
                    height={44}
                    className="rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                </Link>

                <div className="w-px h-8 bg-slate-200 mx-1"></div>

                {/* Logout */}
                <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold">
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/signup" className="text-gray-600 font-medium hover:text-gray-900 transition">
                  Sign Up
                </Link>
                <Link href="/login">
                  <Button className="bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-semibold px-6 py-2 h-10 rounded-md transition">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-lg py-4 px-4 flex flex-col gap-4 z-50">
          <div className="flex flex-col space-y-3 pb-4 border-b border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${pathname === link.href ? "text-yellow-400 font-bold bg-yellow-400/10" : "text-slate-700 font-medium"} block px-4 py-3 rounded-lg hover:bg-slate-50 transition`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col space-y-4 pt-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-4 px-4">
                  <Image
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    alt="Profile"
                    width={48}
                    height={48}
                    className="rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[#0f172a] text-body leading-tight">{user?.name}</span>
                    <span className="text-slate-500 text-body-sm font-medium">{user?.phone}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors font-bold w-full px-4 py-3 rounded-lg text-left">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 px-4">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold h-12 rounded-lg transition">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center text-slate-700 font-bold h-12 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
