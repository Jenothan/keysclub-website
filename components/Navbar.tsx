"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import LogOut from '@mui/icons-material/Logout';
import Menu from '@mui/icons-material/Menu';
import X from '@mui/icons-material/Close';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isRegisteredUser = !!user && !user.is_guest;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const dashboardHref = (user?.role === 'Admin' || user?.role === 'Super Admin') ? "/admin" : "/dashboard";

  // Desktop links when logged in vs logged out
  const desktopMainLinks = isRegisteredUser ? [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: dashboardHref },
    { name: "Availability", href: "/availability" },
  ] : [
    { name: "Home", href: "/" },
    { name: "Availability", href: "/availability" },
    { name: "Pricing", href: "/pricing" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Mobile drawer links
  const mobileNavLinks = [
    { name: "Home", href: "/" },
    ...(isRegisteredUser ? [{ name: "Dashboard", href: dashboardHref }] : []),
    { name: "Availability", href: "/availability" },
    { name: "Pricing", href: "/pricing" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const activeLink = mobileNavLinks.find(link => link.href === pathname);
  const activePageName = activeLink?.name || "Home";
  const isMoreActive = pathname === '/pricing' || pathname === '/about' || pathname === '/contact';

  return (
    <>
      <nav className="bg-white border-b border-slate-200/60 shadow-xs relative z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="KEYS Club Logo"
                width={46}
                height={46}
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="hidden md:flex flex-col">
                <span className="font-black text-subtitle leading-none tracking-tight text-slate-900 group-hover:text-yellow-500 transition-colors">KARANAVAI EAST</span>
                <span className="text-[9.5px] font-extrabold text-yellow-500 uppercase tracking-[0.18em] mt-0.5">YOUTH SPORTS CLUB</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {desktopMainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative py-1.5 text-sm transition-all duration-200 ${isActive
                        ? "text-slate-900 font-black"
                        : "text-slate-600 font-semibold hover:text-yellow-500"
                      }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-yellow-400 rounded-full shadow-xs animate-in fade-in zoom-in-50 duration-200" />
                    )}
                  </Link>
                );
              })}

              {/* More Dropdown (for Logged In Users: Pricing, About Us & Contact) */}
              {isRegisteredUser && (
                <div 
                  className="relative"
                  onMouseEnter={() => setIsMoreDropdownOpen(true)}
                  onMouseLeave={() => setIsMoreDropdownOpen(false)}
                >
                  <button
                    onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                    className={`relative py-1.5 text-sm transition-all duration-200 flex items-center gap-0.5 cursor-pointer ${isMoreActive
                        ? "text-slate-900 font-black"
                        : "text-slate-600 font-semibold hover:text-yellow-500"
                      }`}
                  >
                    <span>More</span>
                    <KeyboardArrowDown className={`w-4 h-4 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180 text-yellow-500' : ''}`} />
                    {isMoreActive && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-yellow-400 rounded-full shadow-xs animate-in fade-in zoom-in-50 duration-200" />
                    )}
                  </button>

                  {/* Dropdown Menu Box */}
                  {isMoreDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <Link
                        href="/pricing"
                        onClick={() => setIsMoreDropdownOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs transition-colors ${
                          pathname === '/pricing'
                            ? 'bg-yellow-400/15 text-slate-950 font-black border-l-3 border-yellow-400'
                            : 'text-slate-700 font-bold hover:bg-slate-50 hover:text-yellow-600'
                        }`}
                      >
                        Pricing
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setIsMoreDropdownOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs transition-colors ${
                          pathname === '/about'
                            ? 'bg-yellow-400/15 text-slate-950 font-black border-l-3 border-yellow-400'
                            : 'text-slate-700 font-bold hover:bg-slate-50 hover:text-yellow-600'
                        }`}
                      >
                        About Us
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setIsMoreDropdownOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs transition-colors ${
                          pathname === '/contact'
                            ? 'bg-yellow-400/15 text-slate-950 font-black border-l-3 border-yellow-400'
                            : 'text-slate-700 font-bold hover:bg-slate-50 hover:text-yellow-600'
                        }`}
                      >
                        Contact
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Auth / Profile Area */}
            <div className="hidden md:flex items-center space-x-4">
              {isRegisteredUser ? (
                <div className="flex items-center gap-4">
                  <Link href={(user?.role === 'Admin' || user?.role === 'Super Admin') ? '/admin' : '/dashboard/profile'} className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100/70 transition-all group">
                    <div className="text-right flex flex-col justify-center">
                      <span className="font-extrabold text-[#0f172a] text-body leading-tight group-hover:text-yellow-600 transition-colors">{user?.name}</span>
                      <span className="text-slate-500 text-body-sm font-medium leading-none">{user?.phone}</span>
                    </div>
                    <Image
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      alt="Profile"
                      width={42}
                      height={42}
                      className="rounded-full object-cover border-2 border-yellow-400/40 shadow-xs group-hover:border-yellow-400 transition-colors"
                    />
                  </Link>

                  <div className="w-px h-7 bg-slate-200 mx-1"></div>

                  {/* Logout */}
                  <button onClick={handleLogout} className="flex items-center cursor-pointer gap-2 p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-extrabold">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/signup" className="text-slate-600 font-bold hover:text-slate-900 text-sm px-3 py-2 rounded-lg hover:bg-slate-100/60 transition">
                    Sign Up
                  </Link>
                  <Link href="/login">
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-extrabold px-6 py-2.5 h-10 rounded-xl transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-yellow-300">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Header Right: Active Page Name + Vertical Divider Line + Menu Toggle inside a styled badge */}
            <div className="flex items-center md:hidden">
              <div className="bg-slate-100/90 border border-slate-200/80 rounded-full px-3.5 py-1.5 flex items-center gap-2.5 shadow-2xs">
                <span className="text-xs font-black text-slate-900 tracking-tight">
                  {activePageName}
                </span>
                <div className="w-px h-3.5 bg-slate-300/80"></div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-slate-700 hover:text-slate-900 focus:outline-none p-0.5 rounded-full hover:bg-slate-200/60 transition cursor-pointer flex items-center justify-center"
                  aria-label="Toggle Menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown (Fixed Viewport Relative) */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-0 left-0 w-full max-h-screen overflow-y-auto bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl pt-20 pb-8 px-5 flex flex-col gap-4 z-[998] animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2 pb-4 border-b border-slate-100">
              {mobileNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${isActive
                        ? "text-slate-950 font-black bg-yellow-400/15 border-l-4 border-yellow-400 pl-3.5"
                        : "text-slate-700 font-bold hover:bg-slate-50 pl-4"
                      } block py-3 pr-4 rounded-r-xl transition-all`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col space-y-4 pt-2">
              {isRegisteredUser ? (
                <>
                  <div className="flex items-center gap-4 px-2">
                    <Image
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      alt="Profile"
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-yellow-400 shadow-sm"
                    />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[#0f172a] text-body leading-tight">{user?.name}</span>
                      <span className="text-slate-500 text-body-sm font-medium">{user?.phone}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="flex items-center cursor-pointer gap-2 text-red-600 hover:bg-red-50 transition-colors font-bold w-full px-4 py-3 rounded-xl text-left">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-extrabold text-sm h-12 rounded-xl transition cursor-pointer shadow-xs border border-yellow-300">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-sm h-12 rounded-xl transition cursor-pointer">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Fixed Floating Circular Yellow Mobile Menu Button (on scroll OR when menu is open) */}
      {(isScrolled || isMobileMenuOpen) && (
        <div className="fixed top-4 right-4 z-[999] md:hidden animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-12 h-12 rounded-full bg-yellow-400 text-slate-950 shadow-2xl ring-4 ring-yellow-400/25 border-2 border-white flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-all active:scale-95"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-950" />
            ) : (
              <Menu className="w-6 h-6 text-slate-950" />
            )}
          </button>
        </div>
      )}
    </>
  );
}
