import React from "react";
import Image from "next/image";
import Calendar from '@mui/icons-material/CalendarMonth';
import Clock from '@mui/icons-material/AccessTime';
import ShieldCheck from '@mui/icons-material/GppGood';
import XCircle from '@mui/icons-material/Cancel';
import MessageSquare from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark Blue Overlay */}
        <div className="absolute inset-0 bg-[#0f172a]/50 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 lg:px-0 text-center flex flex-col items-center">
          <div className="inline-block border border-yellow-400 rounded-full px-5 py-1.5 mb-8">
            <span className="text-yellow-400 text-sm font-semibold tracking-wide">
              Open Every Day | 6:00 AM - 10:00 PM
            </span>
          </div>

          <h1 className="text-display font-extrabold text-white mb-6">
            Book Your Badminton Court <br className="hidden md:block" />
            <span className="text-white">Easily</span>
          </h1>

          <p className="max-w-2xl text-subtitle text-slate-300 mb-10">
            Check availability, choose your preferred time and send your booking request in just a few simple steps. Professional courts in Karanavai East.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 h-12 rounded-md transition duration-200">
              Check Availability
            </Button>
            <Button variant="outline" className="bg-transparent border border-white text-white hover:bg-white/10 hover:text-white font-bold px-8 h-12 rounded-md transition duration-200">
              Book a Court
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Widget (Separate Section) */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end border border-gray-100">

            <div className="flex-1 w-full">
              <label className="block text-caption font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  readOnly
                  value="Tomorrow, 27 October 2026"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-caption font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  readOnly
                  value="06:00 PM - 07:00 PM"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="w-full md:w-auto">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 h-11.5 rounded-md transition duration-200">
                Check Availability
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-title font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-body text-slate-500">Reserve your court slot in 5 simple, automated steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-yellow-400 hover:shadow-lg transition-all">
              <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100 group-hover:text-blue-50 transition">01</div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 relative z-10 shadow-md">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 relative z-10 text-subtitle">Check Availability</h3>
              <p className="text-slate-500 text-body-sm relative z-10 leading-relaxed">
                View real-time calendar and slots
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-yellow-400 hover:shadow-lg transition-all">
              <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100 group-hover:text-blue-50 transition">02</div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 relative z-10 shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 relative z-10 text-subtitle">Choose Your Time</h3>
              <p className="text-slate-500 text-body-sm relative z-10 leading-relaxed">
                Select your preferred time slot
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-yellow-400 hover:shadow-lg transition-all">
              <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100 group-hover:text-blue-50 transition">03</div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 relative z-10 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 relative z-10 text-subtitle">Verify Your Mobile</h3>
              <p className="text-slate-500 text-body-sm relative z-10 leading-relaxed">
                Instantly secure via Sri Lankan mobile OTP
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-yellow-400 hover:shadow-lg transition-all">
              <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100 group-hover:text-blue-50 transition">04</div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 relative z-10 shadow-md">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 relative z-10 text-subtitle">Send Booking Request</h3>
              <p className="text-slate-500 text-body-sm relative z-10 leading-relaxed">
                Submit your basic details instantly
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-yellow-400 hover:shadow-lg transition-all">
              <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100 group-hover:text-blue-50 transition">05</div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 relative z-10 shadow-md">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 relative z-10 text-subtitle">Get Confirmation</h3>
              <p className="text-slate-500 text-body-sm relative z-10 leading-relaxed">
                Receive real-time SMS approval details
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Tournament / Full Day Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-title font-extrabold text-slate-900 mb-4">
              Planning a Tournament or Need the Court for a Full Day?
            </h2>
            <p className="text-body text-slate-500">We offer customizable hosting packages for local events and long-term bookings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all bg-white flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 text-subtitle">Regular Court Booking</h3>
                <span className="bg-blue-50 text-blue-600 text-caption font-semibold px-2.5 py-1 rounded-full">Hourly</span>
              </div>
              <p className="text-slate-500 text-body-sm mb-12 grow">
                Hourly standard bookings for recreation and regular training. Best for 2-4 players.
              </p>
              <a href="#" className="text-blue-600 font-semibold text-body-sm flex items-center hover:text-blue-700">
                Check Availability <span className="ml-1">→</span>
              </a>
            </div>

            {/* Card 2 */}
            <div className="border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all bg-white flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 text-subtitle">Tournament Booking</h3>
                <span className="bg-blue-50 text-blue-600 text-caption font-semibold px-2.5 py-1 rounded-full">Event</span>
              </div>
              <p className="text-slate-500 text-body-sm mb-12 grow">
                Hosting a local community tournament? Get custom arrangements, umpire chairs, and event boards.
              </p>
              <a href="#" className="text-blue-600 font-semibold text-body-sm flex items-center hover:text-blue-700">
                Make an Inquiry <span className="ml-1">→</span>
              </a>
            </div>

            {/* Card 3 */}
            <div className="border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all bg-white flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 text-subtitle">Full-Day Court</h3>
                <span className="bg-blue-50 text-blue-600 text-caption font-semibold px-2.5 py-1 rounded-full">Corporate</span>
              </div>
              <p className="text-slate-500 text-body-sm mb-12 grow">
                Reserve full-day exclusive access of courts for sports meets, club training camps, or school events.
              </p>
              <a href="#" className="text-blue-600 font-semibold text-body-sm flex items-center hover:text-blue-700">
                Request Full-Day Booking <span className="ml-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About The Club Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-5/12">
              <div className="bg-slate-50 rounded-3xl p-12 flex items-center justify-center w-full aspect-square border border-gray-100 shadow-[0_20px_50px_rgb(0,0,0,0.06)]">
                <Image src="/logo.png" alt="KEYS Club Logo Large" width={300} height={300} className="object-contain" />
              </div>
            </div>
            <div className="w-full md:w-7/12">
              <span className="text-caption font-bold text-blue-600 uppercase tracking-wider">ABOUT THE CLUB</span>
              <h2 className="text-title font-extrabold text-slate-900 mt-4 mb-6">
                Karanavai East Youth Sports Club
              </h2>
              <p className="text-body text-slate-500 leading-relaxed mb-8">
                KEYS Club is one of the premier badminton & indoor sports hubs in point Pedro, Sri Lanka. Established with a strong drive to foster young talent, promote fitness, and host top-tier regional matches. Our court facilities utilize high-grade mats and equipment matching national standards.
              </p>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-md transition duration-200">
                Join the Game / Book a Court
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Have a Question Section */}
      <section className="py-16 bg-[#0f172a] text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-title font-bold text-white mb-6">Have a Question?</h2>
          <p className="text-body text-slate-400 mb-10">
            For specific tournaments, monthly passes, custom slots or events booking, our admin panel is here to support you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-md transition duration-200">
              Contact Us
            </button>
            <button className="bg-transparent border border-white text-white hover:bg-white/10 font-bold px-8 py-3 rounded-md transition duration-200">
              Make an Inquiry
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
