import React from "react";
import Image from "next/image";
import Link from "next/link";
import MapPin from '@mui/icons-material/LocationOn';
import Phone from '@mui/icons-material/Phone';
import Mail from '@mui/icons-material/Email';

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4.01c-1 .49-1.98.68-3 .99-1.12-1.27-2.74-1.25-4-1.25-2.09 0-3.9 1.4-4.5 3.5-.06.22-.11.45-.16.68C7.14 8 4.67 6.4 3 4.5 2.15 6 2.37 8 3.5 9.5c-.75-.02-1.5-.24-2.12-.5v.1c0 1.95 1.34 3.75 3.32 4.19-.5.17-1.04.2-1.57.1.5 2.1 2.3 3.6 4.5 3.6-1.53 1.25-3.53 1.83-5.5 1.74 2.17 7.22 2.15 8.27-.08 12.92-6.94 12.92-12.92v-.5c.87-.6 1.6-1.35 2.2-2.22z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="KEYS Club Logo"
                width={56}
                height={56}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="font-bold text-subtitle leading-none tracking-tight text-white">KEYS CLUB</span>
                <span className="text-caption text-yellow-400 uppercase tracking-widest mt-1">KARANAVAI EAST YOUTH SPORTS CLUB</span>
              </div>
            </div>
            <p className="text-caption leading-relaxed max-w-xs">
              A premium youth-driven sports initiative fostering athletic talent, team spirit, and community development in Karanavai East, Sri Lanka.
            </p>
            <p className="text-white font-bold text-body-sm tracking-wide">
              Play • Grow • Win
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-yellow-400 font-bold text-caption uppercase tracking-wider mb-6">QUICK LINKS</h3>
            <ul className="space-y-3 text-body-sm">
              <li><Link href="/" className="hover:text-yellow-400 transition">Home</Link></li>
              <li><Link href="/availability" className="hover:text-yellow-400 transition">Court Availability</Link></li>
              <li><Link href="/pricing" className="hover:text-yellow-400 transition">Pricing Plans</Link></li>
              <li><Link href="/about" className="hover:text-yellow-400 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-yellow-400 font-bold text-caption uppercase tracking-wider mb-6">SERVICES</h3>
            <ul className="space-y-3 text-body-sm">
              <li><Link href="/availability" className="hover:text-yellow-400 transition">Court Booking</Link></li>
              <li><Link href="/dashboard/bookings" className="hover:text-yellow-400 transition">My Bookings</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-400 transition">Tournament Inquiry</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-400 transition">Full-Day Court Request</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-yellow-400 font-bold text-caption uppercase tracking-wider mb-6">CONTACT</h3>
            <ul className="space-y-4 text-body-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span>info@keysclub.lk</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span>Karanavai East, Point Pedro, Sri Lanka</span>
              </li>
            </ul>

            <div className="flex gap-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-caption text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Karanavai East Youth Sports Club. All Rights Reserved.</p>
          <p className="text-slate-400 font-medium">
            Website by <a href="tel:+94763326098" className="text-yellow-400 font-bold hover:underline transition-colors">Esan Jenothan: +94763326098</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
