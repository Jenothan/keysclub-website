"use client";

import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-0 space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Contact Karanavai East Youth Sports Club
          </h1>
          <p className="text-slate-500 text-body">
            Need special support, hosting packages, or full-day bookings? Reach out to us.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Call Us Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Call Us</p>
                <h3 className="font-extrabold text-[#0f172a] text-lg mb-1">+94 77 123 4567</h3>
                <p className="text-slate-500 text-xs font-medium">Available Daily 6 AM - 10 PM</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Inquiry</p>
                <h3 className="font-extrabold text-[#0f172a] text-lg mb-1">info@keysclub.lk</h3>
                <p className="text-slate-500 text-xs font-medium">General & sports inquiries</p>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Visit Club</p>
                <h3 className="font-extrabold text-[#0f172a] text-lg mb-1">Karanavai East, Point Pedro</h3>
                <p className="text-slate-500 text-xs font-medium">Jaffna District, Sri Lanka</p>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-4">
              <h4 className="font-bold text-[#0f172a] mb-4 text-sm">Connect With Us</h4>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                  <Instagram className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#0f172a] mb-8 tracking-tight">Send an Inquiry</h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Full Name</label>
                  <Input placeholder="E.g., Ashan Perera" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Mobile Number</label>
                  <Input placeholder="E.g., 771234567" className="h-11 bg-slate-50/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0f172a]">Email Address</label>
                <Input placeholder="E.g., ashan@example.com" type="email" className="h-11 bg-slate-50/50" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0f172a]">Inquiry Type</label>
                <select className="flex h-11 w-full rounded-md border border-input bg-slate-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                  <option>General Inquiry</option>
                  <option>Hosting Packages</option>
                  <option>Full-day Bookings</option>
                  <option>Sponsorships</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Preferred Date</label>
                  <Input placeholder="DD / MM / YYYY" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Preferred Start Time</label>
                  <Input placeholder="E.g., 08:00 AM" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Preferred End Time</label>
                  <Input placeholder="E.g., 05:00 PM" className="h-11 bg-slate-50/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Number of Participants</label>
                  <Input placeholder="E.g., 40" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Organization/Club Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <Input placeholder="E.g., Point Pedro Sports Club" className="h-11 bg-slate-50/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0f172a]">Message/Additional Requirements</label>
                <textarea 
                  className="flex w-full rounded-md border border-input bg-slate-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]" 
                  placeholder="Outline any custom equipment, boards, umpire needs or schedule preferences..."
                />
              </div>

              <Button className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-sm transition-colors rounded-lg">
                Submit Inquiry
              </Button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}
