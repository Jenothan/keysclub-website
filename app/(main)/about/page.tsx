"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Trophy from '@mui/icons-material/EmojiEvents';
import Users from '@mui/icons-material/Group';
import Target from '@mui/icons-material/Adjust';
import Heart from '@mui/icons-material/Favorite';
import Calendar from '@mui/icons-material/CalendarMonth';
import Medal from '@mui/icons-material/WorkspacePremium';
import Dumbbell from '@mui/icons-material/FitnessCenter';
import CheckCircle2 from '@mui/icons-material/CheckCircleOutlined';
import Clock from '@mui/icons-material/AccessTime';
import ShieldCheck from '@mui/icons-material/GppGood';
import Timeline from '@mui/icons-material/Timeline';
import { Button } from "@/components/ui/button";
import api from '@/lib/axios';

export default function AboutPage() {
  const [websiteData, setWebsiteData] = useState({
    court_pricing: 'Rs. 400',
    full_day_pricing: 'Rs. 3,000',
    membership_pricing: 'Rs. 1,000',
    registration_fee: 'Rs. 2,000',
  });

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const response = await api.get('/website-data');
        if (response.data) {
          setWebsiteData({
            court_pricing: response.data.court_pricing || 'Rs. 400',
            full_day_pricing: response.data.full_day_pricing || 'Rs. 3,000',
            membership_pricing: response.data.membership_pricing || 'Rs. 1,000',
            registration_fee: response.data.registration_fee || 'Rs. 2,000',
          });
        }
      } catch (error) {
        console.error('Failed to fetch website data for About page', error);
      }
    };
    fetchWebsiteData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. ABOUT US PAGE HERO */}
      <section className="relative py-16 sm:py-24 lg:py-36 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/about.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[#0f172a]/50 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-block border border-yellow-400 rounded-full px-5 py-1.5 mb-8">
            <span className="text-yellow-400 text-sm font-semibold tracking-wide">
              About KEYS Club | Community Sports Hub
            </span>
          </div>

          <h1 className="text-display font-extrabold text-white mb-6">
            About Karanavai East <br className="hidden md:block" />
            <span className="text-white">Youth Sports Club</span>
          </h1>

          <p className="max-w-2xl text-subtitle text-slate-300 mb-10">
            Building a stronger, healthier and more active community through badminton, youth sports and recreation in Karanavai East.
          </p>

          <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md mx-auto">
            <Link href="/availability" className="flex-1 w-full">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xs sm:text-sm px-2 sm:px-8 h-11 sm:h-12 rounded-md transition duration-200 cursor-pointer text-center">
                Check Availability
              </Button>
            </Link>
            <Link href="/contact" className="flex-1 w-full cursor-pointer">
              <Button variant="outline" className="w-full bg-transparent border border-white text-white hover:bg-white/10 hover:text-white font-bold text-xs sm:text-sm px-2 sm:px-8 h-11 sm:h-12 rounded-md transition duration-200 cursor-pointer text-center">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-caption font-bold text-yellow-400 uppercase tracking-wider">Who We Are</span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] mt-3 mb-6">
            A Community-Focused Sports Hub
          </h2>
          <div className="space-y-6 text-slate-600 text-body leading-relaxed text-left md:text-center">
            <p>
              <strong>Karanavai East Youth Sports Club</strong> is a community-focused youth sports club dedicated to promoting badminton, sports participation and healthy recreation among young people and the wider community.
            </p>
            <p>
              The club provides a friendly and accessible environment where people can participate in badminton, stay active, develop sporting skills, connect with others and take part in sporting activities and competitions.
            </p>
            <p>
              The website makes it easier for members and players to check court availability, book court sessions and contact the club for tournaments, training sessions and extended court requirements.
            </p>
          </div>
        </div>
      </section>

      {/* 3. OUR VISION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-yellow-400/10 border border-yellow-400 rounded-3xl p-10 md:p-16 w-full max-w-4xl mx-auto shadow-sm">
            <span className="text-caption font-bold text-yellow-400 uppercase tracking-wider">Our Vision</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#0f172a] mt-6 leading-tight">
              To build an active, healthy and connected community through sports.
            </h2>
          </div>
        </div>
      </section>

      {/* 4. OUR MISSION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-caption font-bold text-yellow-400 uppercase tracking-wider">Our Mission</span>
            <h2 className="text-title font-extrabold text-[#0f172a] mt-4">
              Driving Positive Change
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-white p-4 sm:p-8 rounded-xl border border-gray-100 shadow-xs hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center text-center h-full">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mb-3 sm:mb-6 shrink-0">
                <Target className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-[#0f172a] text-xs sm:text-lg mb-1 sm:mb-3">Promote Badminton</h3>
              <p className="text-slate-500 text-[11px] sm:text-sm leading-snug sm:leading-relaxed grow">
                Encourage regular participation in badminton and make sports accessible to the community.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-8 rounded-xl border border-gray-100 shadow-xs hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center text-center h-full">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mb-3 sm:mb-6 shrink-0">
                <Users className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-[#0f172a] text-xs sm:text-lg mb-1 sm:mb-3">Support Youth</h3>
              <p className="text-slate-500 text-[11px] sm:text-sm leading-snug sm:leading-relaxed grow">
                Create positive opportunities for young people to participate, develop skills and stay active.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-8 rounded-xl border border-gray-100 shadow-xs hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center text-center h-full">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mb-3 sm:mb-6 shrink-0">
                <Trophy className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-[#0f172a] text-xs sm:text-lg mb-1 sm:mb-3">Encourage Competition</h3>
              <p className="text-slate-500 text-[11px] sm:text-sm leading-snug sm:leading-relaxed grow">
                Support badminton tournaments, sporting events and healthy competition.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-8 rounded-xl border border-gray-100 shadow-xs hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center text-center h-full">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mb-3 sm:mb-6 shrink-0">
                <Heart className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-[#0f172a] text-xs sm:text-lg mb-1 sm:mb-3">Build Community</h3>
              <p className="text-slate-500 text-[11px] sm:text-sm leading-snug sm:leading-relaxed grow">
                Bring young people and community members together through sports and recreation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT WE OFFER */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-caption font-bold text-yellow-400 uppercase tracking-wider">What We Offer</span>
            <h2 className="text-title font-extrabold text-[#0f172a] mt-4">
              Comprehensive Sporting Facilities
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-8">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg hover:border-yellow-400 bg-slate-50 hover:bg-white transition-all">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-center shrink-0 text-yellow-400">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-xs sm:text-lg mb-1 sm:mb-2">Regular Court Booking</h3>
                <p className="text-slate-600 text-[11px] sm:text-sm leading-snug sm:leading-relaxed">
                  Players can check court availability and book available badminton court sessions through the website.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg hover:border-yellow-400 bg-slate-50 hover:bg-white transition-all">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-center shrink-0 text-yellow-400">
                <Medal className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-xs sm:text-lg mb-1 sm:mb-2">Tournament & Events</h3>
                <p className="text-slate-600 text-[11px] sm:text-sm leading-snug sm:leading-relaxed">
                  The club can support badminton tournaments, sports events and organized activities.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg hover:border-yellow-400 bg-slate-50 hover:bg-white transition-all">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-center shrink-0 text-yellow-400">
                <Dumbbell className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-xs sm:text-lg mb-1 sm:mb-2">Training & Recreation</h3>
                <p className="text-slate-600 text-[11px] sm:text-sm leading-snug sm:leading-relaxed">
                  A suitable place for badminton practice, training sessions, fitness and healthy recreation.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg hover:border-yellow-400 bg-slate-50 hover:bg-white transition-all">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-center shrink-0 text-yellow-400">
                <Users className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-xs sm:text-lg mb-1 sm:mb-2">Community Sports</h3>
                <p className="text-slate-600 text-[11px] sm:text-sm leading-snug sm:leading-relaxed">
                  Encouraging youth and community members to participate in sports and develop an active lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 & 7. COURT BOOKING & MEMBERSHIP (DYNAMIC PRICING) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-title font-extrabold text-[#0f172a] mb-4">
              Court Booking & Membership
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-base">
              Please contact the club for complete membership rules, eligibility and payment terms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">

            {/* Hourly Booking */}
            <div className="bg-white rounded-2xl p-3 sm:p-8 flex flex-col h-full border border-slate-100 hover:border-yellow-400 transition-all shadow-xs hover:-translate-y-1">
              <div className="text-[9px] sm:text-caption font-bold text-yellow-500 uppercase tracking-wider mb-1.5 sm:mb-2 truncate">Hourly Court Rate</div>
              <div className="flex items-baseline gap-0.5 sm:gap-1 mb-3 sm:mb-6 flex-wrap">
                <span className="text-[13px] sm:text-3xl lg:text-4xl font-black text-[#0f172a] whitespace-nowrap">{websiteData.court_pricing}</span>
                <span className="text-slate-500 text-[10px] sm:text-base font-medium whitespace-nowrap">/ Hour</span>
              </div>
              <p className="text-slate-600 text-[10px] sm:text-sm leading-snug sm:leading-relaxed mb-4 sm:mb-8 grow">
                Players can book the badminton court for an individual hourly session.
              </p>
              <Link href="/availability" className="mt-auto">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold rounded-xl text-[10px] sm:text-sm px-1.5 h-9 sm:h-12 transition shadow-xs">
                  Check Availability
                </Button>
              </Link>
            </div>

            {/* Full Day Booking */}
            <div className="bg-white rounded-2xl p-3 sm:p-8 flex flex-col h-full border border-slate-100 hover:border-yellow-400 transition-all shadow-xs hover:-translate-y-1">
              <div className="text-[9px] sm:text-caption font-bold text-yellow-500 uppercase tracking-wider mb-1.5 sm:mb-2 truncate">Full Day Booking</div>
              <div className="flex items-baseline gap-0.5 sm:gap-1 mb-3 sm:mb-6 flex-wrap">
                <span className="text-[13px] sm:text-3xl lg:text-4xl font-black text-[#0f172a] whitespace-nowrap">{websiteData.full_day_pricing}</span>
                <span className="text-slate-500 text-[10px] sm:text-base font-medium whitespace-nowrap">/ Day</span>
              </div>
              <p className="text-slate-600 text-[10px] sm:text-sm leading-snug sm:leading-relaxed mb-4 sm:mb-8 grow">
                Book the full badminton court for tournaments, events, and functions.
              </p>
              <Link href="/contact" className="mt-auto">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-[10px] sm:text-sm px-1.5 h-9 sm:h-12 transition shadow-xs">
                  Contact For Booking
                </Button>
              </Link>
            </div>

            {/* Badminton Court Membership */}
            <div className="bg-[#0f172a] rounded-2xl p-4 sm:p-8 flex flex-col h-full border border-slate-800 transition-all shadow-xl hover:-translate-y-1 relative overflow-hidden col-span-2 md:col-span-1">
              <div className="absolute top-0 right-0 bg-yellow-400 text-[#0f172a] text-[9px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider shadow-xs">
                Most Popular
              </div>
              <div className="text-[10px] sm:text-caption font-bold text-yellow-400 uppercase tracking-wider mb-1.5 sm:mb-2">Court Membership</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-base sm:text-3xl lg:text-4xl font-black text-white whitespace-nowrap">{websiteData.membership_pricing}</span>
                <span className="text-slate-400 text-xs sm:text-base font-medium whitespace-nowrap">/ Month</span>
              </div>
              <div className="mb-4 sm:mb-6 inline-flex items-center gap-1 text-[10px] sm:text-xs text-yellow-400 font-extrabold bg-yellow-400/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-yellow-400/20 self-start">
                <span>+ {websiteData.registration_fee} / Year Fee</span>
              </div>
              <p className="text-slate-300 text-[11px] sm:text-sm leading-snug sm:leading-relaxed mb-6 sm:mb-8 grow">
                Members pay the {websiteData.membership_pricing} monthly court fee plus applicable {websiteData.registration_fee} annual membership fee for full court access.
              </p>
              <Link href="/contact" className="mt-auto">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold rounded-xl text-xs sm:text-sm h-10 sm:h-12 transition shadow-md">
                  Join Membership
                </Button>
              </Link>
            </div>

          </div>

          {/* 8. TERMS & CONDITIONS PLACEHOLDER */}
          <div className="mt-16 text-center border-t border-gray-200 pt-16">
            <h3 className="text-xl font-bold text-[#0f172a] mb-4">Terms & Conditions</h3>
            <p className="text-slate-500 mb-8 max-w-2xl mx-auto text-xs sm:text-sm">
              Membership, court booking, payment, cancellation and usage rules are subject to the club's Terms & Conditions.
            </p>
            <Button variant="outline" className="bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold px-8 h-11 rounded-md transition duration-200">
              View Terms & Conditions
            </Button>
          </div>
        </div>
      </section>

      {/* 9. OUR COMMUNITY (More Than Just a Court) */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <span className="text-caption font-bold text-yellow-400 uppercase tracking-wider">Our Community</span>
              <h2 className="text-title font-extrabold text-[#0f172a] mt-4 mb-6">
                More Than Just a Court
              </h2>
              <p className="text-body text-slate-500 leading-relaxed">
                Our club is more than a place to play badminton. It is a space where young people and community members can connect, stay active, improve their sporting abilities and enjoy healthy recreation together.
              </p>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden aspect-video shadow-xl border border-gray-100">
                <Image
                  src="/about-us.avif"
                  alt="Community Badminton"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CLUB VALUES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-title font-extrabold text-[#0f172a] mb-12">Our Values</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-xs hover:shadow-lg transition-all">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2 sm:mb-4" />
              <h4 className="font-bold text-[#0f172a] text-xs sm:text-subtitle mb-1 sm:mb-2">Sportsmanship</h4>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-snug sm:leading-relaxed">Respect, fairness and positive competition.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-xs hover:shadow-lg transition-all">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2 sm:mb-4" />
              <h4 className="font-bold text-[#0f172a] text-xs sm:text-subtitle mb-1 sm:mb-2">Teamwork</h4>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-snug sm:leading-relaxed">Working together and supporting one another.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-xs hover:shadow-lg transition-all">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2 sm:mb-4" />
              <h4 className="font-bold text-[#0f172a] text-xs sm:text-subtitle mb-1 sm:mb-2">Discipline</h4>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-snug sm:leading-relaxed">Encouraging commitment, practice and consistency.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-xs hover:shadow-lg transition-all">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2 sm:mb-4" />
              <h4 className="font-bold text-[#0f172a] text-xs sm:text-subtitle mb-1 sm:mb-2">Community</h4>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-snug sm:leading-relaxed">Creating an inclusive and supportive sporting environment.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-xs hover:shadow-lg transition-all col-span-2 sm:col-span-1">
              <Timeline className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2 sm:mb-4" />
              <h4 className="font-bold text-[#0f172a] text-xs sm:text-subtitle mb-1 sm:mb-2">Healthy Living</h4>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-snug sm:leading-relaxed">Promoting an active and healthy lifestyle through sports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. WHY CHOOSE OUR CLUB */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-14 shadow-lg border border-gray-100 text-[#0f172a] relative overflow-hidden">
            <div className="relative z-10 text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4">
                Why Choose Karanavai East Youth Sports Club?
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-3 sm:gap-x-12">
              <div className="flex items-start gap-2.5 sm:gap-4">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 shrink-0 mt-0.5" />
                <span className="font-medium text-xs sm:text-lg text-slate-700">Easy badminton court availability checking</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-4">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 shrink-0 mt-0.5" />
                <span className="font-medium text-xs sm:text-lg text-slate-700">Simple online booking process</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-4">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 shrink-0 mt-0.5" />
                <span className="font-medium text-xs sm:text-lg text-slate-700">Affordable court and membership options</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-4">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 shrink-0 mt-0.5" />
                <span className="font-medium text-xs sm:text-lg text-slate-700">Community-focused sports environment</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-4">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 shrink-0 mt-0.5" />
                <span className="font-medium text-xs sm:text-lg text-slate-700">Opportunities for tournaments and events</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-4">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 shrink-0 mt-0.5" />
                <span className="font-medium text-xs sm:text-lg text-slate-700">Suitable for youth, regular players and community members</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CALL TO ACTION */}
      <section className="py-20 bg-[#0f172a] text-center border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-title font-extrabold text-white mb-6">Ready to Play?</h2>
          <p className="text-body text-slate-400 mb-10 leading-relaxed">
            Check court availability, choose your preferred time and enjoy badminton at Karanavai East Youth Sports Club.
          </p>
          <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md mx-auto">
            <Link href="/availability" className="flex-1 w-full">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xs sm:text-sm px-2 sm:px-8 h-11 sm:h-12 rounded-md transition duration-200 cursor-pointer text-center">
                Check Availability
              </Button>
            </Link>
            <Link href="/contact" className="flex-1 w-full cursor-pointer">
              <Button variant="outline" className="w-full bg-transparent border border-white text-white hover:bg-white/10 hover:text-white font-bold text-xs sm:text-sm px-2 sm:px-8 h-11 sm:h-12 rounded-md transition duration-200 cursor-pointer text-center">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
