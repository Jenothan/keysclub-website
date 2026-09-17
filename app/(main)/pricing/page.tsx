"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'sonner';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutlined';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pricing, setPricing] = useState({
    court: 'LKR 400',
    membership: 'LKR 1,000',
    registrationFee: 'LKR 2,000',
    fullDay: 'LKR 3,000'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/website-data');
        if (response.data) {
          setPricing({
            court: response.data.court_pricing || 'LKR 400',
            membership: response.data.membership_pricing || 'LKR 1,000',
            registrationFee: response.data.registration_fee || 'LKR 2,000',
            fullDay: response.data.full_day_pricing || 'LKR 3,000'
          });
        }
      } catch (error) {
        console.error('Failed to load pricing', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-16 sm:py-24 lg:py-36 overflow-hidden w-full">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/about-us.avif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark Blue Overlay */}
        <div className="absolute inset-0 bg-[#0f172a]/50 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-block border border-yellow-400 rounded-full px-5 py-1.5 mb-8">
            <span className="text-yellow-400 text-sm font-semibold tracking-wide">
              Transparent & Affordable Pricing
            </span>
          </div>

          <h1 className="text-display font-extrabold text-white mb-6">
            Simple & Flexible <br className="hidden md:block" />
            <span className="text-white">Court Pricing</span>
          </h1>

          <p className="max-w-2xl text-subtitle text-slate-300 mb-10">
            Affordable rates for top-tier badminton court facilities. Choose hourly slots, club membership, or full-day bookings.
          </p>

          <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md mx-auto">
            <Link href="/availability" className="flex-1 w-full">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xs sm:text-sm px-2 sm:px-8 h-11 sm:h-12 rounded-md transition duration-200 cursor-pointer text-center">
                Book Court Now
              </Button>
            </Link>
            <Link href="/contact" className="flex-1 w-full cursor-pointer">
              <Button variant="outline" className="w-full bg-transparent border border-white text-white hover:bg-white/10 hover:text-white font-bold text-xs sm:text-sm px-2 sm:px-8 h-11 sm:h-12 rounded-md transition duration-200 cursor-pointer text-center">
                Enquire Membership
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section (Separate Section) */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="text-caption font-bold text-yellow-500 uppercase tracking-wider">
              PRICING PLANS & MEMBERSHIPS
            </span>
            <h2 className="text-title font-extrabold text-[#0f172a] mt-2 mb-3">
              Choose the Right Plan for Your Game
            </h2>
            <p className="text-body text-slate-500 max-w-xl mx-auto">
              Whether you need a quick hourly booking, a full monthly membership, or an exclusive full-day event package, we have options tailored for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">

            {/* Badminton Court Pricing */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-1 sm:mb-2">Court Booking</h3>
                <p className="text-slate-500 text-xs sm:text-sm">Perfect for casual games</p>
              </div>
              <div className="mb-6 sm:mb-8">
                {isLoading ? (
                  <Skeleton className="h-10 w-36" />
                ) : (
                  <>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a]">{pricing.court}</span>
                    <span className="text-slate-500 text-xs sm:text-base font-medium"> / hour</span>
                  </>
                )}
              </div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-xs sm:text-sm font-medium">Standard Badminton Court Access</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-xs sm:text-sm font-medium">Locker facility included</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-xs sm:text-sm font-medium">Water dispenser access</span>
                </li>
              </ul>
              <Link href="/availability" className="block text-center bg-yellow-400 hover:bg-yellow-400/90 text-[#0f172a] font-bold text-xs sm:text-sm py-3 sm:py-3.5 px-6 rounded-xl transition-all shadow-xs">
                Book Now
              </Link>
            </div>

            {/* Membership Pricing */}
            <div className="bg-[#0f172a] rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl md:-translate-y-2 z-10">
              <div className="absolute top-0 right-0 bg-yellow-400 text-[#0f172a] text-[10px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Court Membership</h3>
                <p className="text-slate-400 text-xs sm:text-sm">For dedicated players</p>
              </div>
              <div className="mb-6 sm:mb-8">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-36 bg-slate-700" />
                    <Skeleton className="h-4 w-48 bg-slate-700" />
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">{pricing.membership}</span>
                      <span className="text-slate-400 text-xs sm:text-base font-medium"> / month</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-yellow-400 font-semibold mt-2 sm:mt-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block shrink-0"></span>
                      + {pricing.registrationFee} one-time annual registration fee
                    </p>
                  </>
                )}
              </div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-xs sm:text-sm font-medium">Priority Court Booking</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-xs sm:text-sm font-medium">Discounted rates on coaching</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-xs sm:text-sm font-medium">Exclusive tournament entries</span>
                </li>
              </ul>
              <Link href="/contact?subject=Badminton%20Court%20Membership#enquiry_form" className="block text-center bg-yellow-400 hover:bg-yellow-400/90 text-[#0f172a] font-extrabold text-xs sm:text-sm py-3 sm:py-3.5 px-6 rounded-xl transition-all shadow-md">
                Join Now
              </Link>
            </div>

            {/* Full Day Booking */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-1 sm:mb-2">Full Day Booking</h3>
                <p className="text-slate-500 text-xs sm:text-sm">Ideal for events & tournaments</p>
              </div>
              <div className="mb-6 sm:mb-8">
                {isLoading ? (
                  <Skeleton className="h-10 w-36" />
                ) : (
                  <>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a]">{pricing.fullDay}</span>
                    <span className="text-slate-500 text-xs sm:text-base font-medium"> / day</span>
                  </>
                )}
              </div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-xs sm:text-sm font-medium">Exclusive use of the court</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-xs sm:text-sm font-medium">Event management support</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-xs sm:text-sm font-medium">Umpire/Referee seating</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-xs sm:text-sm font-medium">Spectator area access</span>
                </li>
              </ul>
              <Link href="/contact?subject=Full%20Day%20Court%20Booking#enquiry_form" className="block text-center text-[#0f172a] bg-yellow-400 hover:bg-yellow-400/90 font-bold text-xs sm:text-sm py-3 sm:py-3.5 px-6 rounded-xl transition-all">
                Inquire Now
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
