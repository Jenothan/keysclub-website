"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Phone from '@mui/icons-material/Phone';
import Gavel from '@mui/icons-material/Gavel';
import EventAvailable from '@mui/icons-material/EventAvailable';
import HistoryToggleOff from '@mui/icons-material/HistoryToggleOff';
import SportsCricket from '@mui/icons-material/SportsCricket';
import ShieldMoon from '@mui/icons-material/ShieldMoon';
import ReportProblem from '@mui/icons-material/ReportProblem';
import CheckCircle from '@mui/icons-material/CheckCircle';
import api from '@/lib/axios';

export default function TermsPage() {
  const [websiteData, setWebsiteData] = useState<{
    primary_phone?: string;
    support_email?: string;
    club_address?: string;
  } | null>(null);

  useEffect(() => {
    api.get('/website-data')
      .then((res) => {
        if (res.data) setWebsiteData(res.data);
      })
      .catch((err) => console.error("Failed to load website data", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">

      {/* Hero Banner Header - Universal max-w-7xl Layout */}
      <section className="relative bg-[#0f172a] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/5 opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-400 text-slate-900 mx-auto shadow-lg shadow-yellow-400/20">
            <Gavel className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Please read the rules and guidelines governing court bookings, payments, and member conduct at KEYS Club (Karanavai East Youth Sports Club).
          </p>
          <p className="text-xs text-slate-500 font-medium pt-1">
            Last Updated: September 2026
          </p>
        </div>
      </section>

      {/* Main Content Area - Universal max-w-7xl Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-yellow-400/15 text-yellow-600 border border-yellow-400/20 flex items-center justify-center shrink-0">
              <EventAvailable className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a] text-sm sm:text-base">Physical Payment</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Slot booking online only; payment is collected in person upon arrival at the court.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#0f172a]/10 text-[#0f172a] border border-[#0f172a]/15 flex items-center justify-center shrink-0">
              <HistoryToggleOff className="w-6 h-6 text-[#0f172a]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a] text-sm sm:text-base">2-Hour Notice</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Reschedule or cancel requests must be made by calling Admin at least 2 hours prior.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-yellow-400/15 text-yellow-600 border border-yellow-400/20 flex items-center justify-center shrink-0">
              <SportsCricket className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a] text-sm sm:text-base">Badminton Shoes Only</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Strictly non-marking badminton shoes or playing barefoot inside the court area.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-2xs space-y-10 divide-y divide-slate-100">

          {/* Section 1: Booking & Payment */}
          <section className="space-y-4 pt-2 first:pt-0">
            <div className="flex items-center gap-3">
              <span className="w-8.5 h-8.5 rounded-xl bg-yellow-400 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-xs">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                Slot Booking & Payment Guidelines
              </h2>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 sm:pl-11 list-none">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Online Slot Booking:</strong> The website is strictly designed for selecting and reserving your court time slots in advance.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>In-Person Physical Payment:</strong> Court usage fees must be paid physically in person when arriving at the club venue prior to entering the court.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Daily Slot Limits:</strong> A single user account can book a maximum of <strong>3 slots per day</strong> for general play.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Peak Hour Booking (Members Only):</strong> Booking slots during designated Peak Hours is strictly reserved for <strong>Badminton Court Members</strong>. Members can book a maximum of <strong>2 Peak Hour slots per day</strong>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Weekly Full-Day Booking Days:</strong> On 2 designated days each week, the full-day court schedule is opened for all players to book any available slot across the day.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2: Reschedule & Cancellation */}
          <section className="space-y-4 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8.5 h-8.5 rounded-xl bg-yellow-400 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-xs">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                Reschedule & Cancellation Policy
              </h2>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 sm:pl-11 list-none">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Admin Contact Required:</strong> To cancel or reschedule a confirmed court slot, players must directly call the Club Administrator.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>2-Hour Advance Notice Window:</strong> All reschedule and cancellation requests must be submitted at least <strong>2 hours prior</strong> to the scheduled slot start time. Requests made under 2 hours will not be processed.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3: Court Footwear & Code of Conduct */}
          <section className="space-y-4 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8.5 h-8.5 rounded-xl bg-yellow-400 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-xs">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                Court Footwear & Rules of Conduct
              </h2>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 sm:pl-11 list-none">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Mandatory Footwear:</strong> Only non-marking <strong>Badminton Shoes</strong> or playing <strong>Barefoot</strong> are permitted on the court surface. Outdoor shoes, running shoes, or boots are strictly prohibited.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Punctuality:</strong> Players are advised to arrive 10 minutes before their booked time to ensure prompt court transition and play.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Court Cleanliness:</strong> Food, sticky beverages, smoking, and alcohol are strictly forbidden inside the playing enclosure.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 4: Liability Disclaimer */}
          <section className="space-y-4 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8.5 h-8.5 rounded-xl bg-yellow-400 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-xs">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                Liability & Safety Disclaimer
              </h2>
            </div>
            <div className="sm:pl-11 space-y-3">
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed flex items-start gap-3.5">
                <ShieldMoon className="w-5 h-5 text-[#0f172a] shrink-0 mt-0.5" />
                <p>
                  <strong>No Club Liability:</strong> KEYS Club (Karanavai East Youth Sports Club) and its management accept no liability or responsibility for any personal injuries, accidents, health emergencies, or loss/damage of personal valuables incurred on club premises. Players use the facilities entirely at their own risk.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Equipment Damages & Account Deactivation */}
          <section className="space-y-4 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8.5 h-8.5 rounded-xl bg-yellow-400 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-xs">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                Damages & Account Suspension
              </h2>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 sm:pl-11 list-none">
              <li className="flex items-start gap-3">
                <ReportProblem className="w-4.5 h-4.5 text-[#0f172a] mt-0.5 shrink-0" />
                <span>
                  <strong>Equipment Damage Fine:</strong> Any intentional or negligent damage caused to court mats, nets, poles, racquets, or club property must be compensated by paying a fine determined by management.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ReportProblem className="w-4.5 h-4.5 text-[#0f172a] mt-0.5 shrink-0" />
                <span>
                  <strong>Account Deactivation & Ban:</strong> Users or members who violate club regulations, engage in misconduct, or fail to adhere to court guidelines will be <strong>deactivated</strong> by the Administrator. Deactivated accounts will be blocked from logging in and booking slots.
                </span>
              </li>
            </ul>
          </section>

        </div>

        {/* Need Help / Contact Card */}
        <div className="bg-[#0f172a] text-white rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800 shadow-lg">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">Have questions about our Terms?</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Reach out to KEYS Club Admin for assistance regarding slot bookings, membership requests, or court guidelines.
            </p>
          </div>
          {websiteData?.primary_phone ? (
            <a
              href={`tel:${websiteData.primary_phone}`}
              className="inline-flex items-center gap-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md shrink-0"
            >
              <Phone className="w-4 h-4" />
              Call Admin: {websiteData.primary_phone}
            </a>
          ) : (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md shrink-0"
            >
              Contact Admin
            </Link>
          )}
        </div>

      </main>

    </div>
  );
}
