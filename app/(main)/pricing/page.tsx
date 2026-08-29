"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutlined';

export default function PricingPage() {
  const [pricing, setPricing] = useState({
    court: 'Loading...',
    membership: 'Loading...',
    fullDay: 'Loading...'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/website-data');
        if (response.data) {
          setPricing({
            court: response.data.court_pricing || 'Contact us',
            membership: response.data.membership_pricing || 'Contact us',
            fullDay: response.data.full_day_pricing || 'Contact us'
          });
        }
      } catch (error) {
        console.error('Failed to load pricing', error);
        setPricing({
          court: 'Contact us',
          membership: 'Contact us',
          fullDay: 'Contact us'
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/pricing.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            transform: "scale(1.15) translateY(-2%)",
          }}
        />
        <div className="absolute inset-0 bg-[#0f172a]/50 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Our Pricing Plans
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
            Affordable rates for top-tier facilities. Choose the best option for your sporting journey.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-15">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Badminton Court Pricing */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">Court Booking</h3>
              <p className="text-slate-500 text-sm">Perfect for casual games</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-[#0f172a]">{pricing.court}</span>
              <span className="text-slate-500 font-medium"> / hour</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">Standard Badminton Court Access</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">Locker facility included</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">Water dispenser access</span>
              </li>
            </ul>
            <a href="/book" className="block text-center bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-bold py-3 px-6 rounded-xl transition-all">
              Book Now
            </a>
          </div>

          {/* Membership Pricing */}
          <div className="bg-[#0f172a] rounded-2xl p-8 shadow-xl border border-slate-800 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl md:scale-105 z-10">
            <div className="absolute top-0 right-0 bg-yellow-500 text-[#0f172a] text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Club Membership</h3>
              <p className="text-slate-400 text-sm">For dedicated players</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">{pricing.membership}</span>
              <span className="text-slate-400 font-medium"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Priority Court Booking</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Discounted rates on coaching</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Exclusive tournament entries</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Free equipment rentals</span>
              </li>
            </ul>
            <a href="/contact" className="block text-center bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-3 px-6 rounded-xl transition-all">
              Join Now
            </a>
          </div>

          {/* Full Day Booking */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">Full Day Booking</h3>
              <p className="text-slate-500 text-sm">Ideal for events & tournaments</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-[#0f172a]">{pricing.fullDay}</span>
              <span className="text-slate-500 font-medium"> / day</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">Exclusive use of the court</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">Event management support</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">Umpire/Referee seating</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutline className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">Spectator area access</span>
              </li>
            </ul>
            <a href="/full-day" className="block text-center border-2 border-[#0f172a] text-[#0f172a] hover:bg-slate-50 font-bold py-3 px-6 rounded-xl transition-all">
              Inquire Now
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
