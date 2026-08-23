import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Users,
  Target,
  Heart,
  Calendar,
  Medal,
  Dumbbell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us - KEYS Club",
  description: "Learn more about Karanavai East Youth Sports Club and our mission to promote badminton and active living.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. ABOUT US PAGE HERO */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
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
          <Image
            src="/logo.png"
            alt="KEYS Club Logo"
            width={100}
            height={100}
            className="object-contain mb-8"
          />
          <h1 className="text-display font-extrabold text-white mb-6">
            About Karanavai East Youth Sports Club
          </h1>
          <p className="max-w-3xl text-subtitle text-slate-300 mb-8 leading-relaxed">
            Building a stronger, healthier and more active community through badminton, youth sports and recreation.
          </p>
        </div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-caption font-bold text-blue-600 uppercase tracking-wider">Who We Are</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mt-4 mb-8">
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
          <div className="inline-block bg-blue-50 border border-blue-100 rounded-3xl p-10 md:p-16 w-full max-w-4xl mx-auto shadow-sm">
            <span className="text-caption font-bold text-blue-600 uppercase tracking-wider">Our Vision</span>
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
            <span className="text-caption font-bold text-blue-600 uppercase tracking-wider">Our Mission</span>
            <h2 className="text-title font-extrabold text-[#0f172a] mt-4">
              Driving Positive Change
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shrink-0">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[#0f172a] text-lg mb-3">Promote Badminton</h3>
              <p className="text-slate-500 text-sm leading-relaxed grow">
                Encourage regular participation in badminton and make sports accessible to the community.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[#0f172a] text-lg mb-3">Support Youth</h3>
              <p className="text-slate-500 text-sm leading-relaxed grow">
                Create positive opportunities for young people to participate, develop skills and stay active.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shrink-0">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[#0f172a] text-lg mb-3">Encourage Competition</h3>
              <p className="text-slate-500 text-sm leading-relaxed grow">
                Support badminton tournaments, sporting events and healthy competition.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shrink-0">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[#0f172a] text-lg mb-3">Build Community</h3>
              <p className="text-slate-500 text-sm leading-relaxed grow">
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
            <span className="text-caption font-bold text-blue-600 uppercase tracking-wider">What We Offer</span>
            <h2 className="text-title font-extrabold text-[#0f172a] mt-4">
              Comprehensive Sporting Facilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-5 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 bg-slate-50 hover:bg-white transition-all">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center shrink-0 text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-lg mb-2">Regular Court Booking</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Players can check court availability and book available badminton court sessions through the website.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 bg-slate-50 hover:bg-white transition-all">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center shrink-0 text-blue-600">
                <Medal className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-lg mb-2">Tournament & Events</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The club can support badminton tournaments, sports events and organized activities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 bg-slate-50 hover:bg-white transition-all">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center shrink-0 text-blue-600">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-lg mb-2">Training & Recreation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A suitable place for badminton practice, training sessions, fitness and healthy recreation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 bg-slate-50 hover:bg-white transition-all">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center shrink-0 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-lg mb-2">Community Sports</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Encouraging youth and community members to participate in sports and develop an active lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 & 7. COURT BOOKING & MEMBERSHIP (PRICING CLARITY) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-title font-extrabold text-[#0f172a] mb-4">
              Court Booking & Membership
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Please contact the club for complete membership rules, eligibility and payment terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Hourly Booking */}
            <div className="bg-white rounded-2xl p-8 flex flex-col h-full border border-transparent hover:border-yellow-400 transition-all shadow-lg">
              <div className="text-caption font-bold text-blue-600 uppercase tracking-wider mb-2">Hourly Court Rate</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-[#0f172a]">Rs. 400</span>
                <span className="text-slate-500 font-medium">/ Hour</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-8 grow">
                Players can book the badminton court for an individual hourly session.
              </p>
              <Link href="/availability">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-lg h-12 transition">
                  Check Availability
                </Button>
              </Link>
            </div>

            {/* Monthly Package */}
            <div className="bg-white rounded-2xl p-8 flex flex-col h-full border border-transparent hover:border-yellow-400 transition-all shadow-lg">
              <div className="text-caption font-bold text-blue-600 uppercase tracking-wider mb-2">Monthly Court Package</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-[#0f172a]">Rs. 2,000</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-8 grow">
                Monthly badminton court payment/package according to the club's current pricing structure.
              </p>
            </div>

            {/* Monthly Membership */}
            <div className="bg-white rounded-2xl p-8 flex flex-col h-full border border-transparent hover:border-yellow-400 transition-all shadow-lg">
              <div className="text-caption font-bold text-blue-600 uppercase tracking-wider mb-2">Monthly Membership Fee</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-[#0f172a]">Rs. 500</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-8 grow">
                Members can pay the applicable monthly membership amount and participate according to the club's membership and court-use arrangements.
              </p>
            </div>

            {/* Yearly Membership */}
            <div className="bg-white rounded-2xl p-8 flex flex-col h-full border border-transparent hover:border-yellow-400 transition-all shadow-lg">
              <div className="text-caption font-bold text-blue-600 uppercase tracking-wider mb-2">Yearly Membership Fee</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-[#0f172a]">Rs. 2,000</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-8 grow">
                Members can pay the applicable yearly membership amount and participate according to the club's membership and court-use arrangements.
              </p>
            </div>

          </div>

          {/* 8. TERMS & CONDITIONS PLACEHOLDER */}
          <div className="mt-16 text-center border-t border-gray-200 pt-16">
            <h3 className="text-xl font-bold text-[#0f172a] mb-4">Terms & Conditions</h3>
            <p className="text-slate-500 mb-8 max-w-2xl mx-auto">
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
              <span className="text-caption font-bold text-blue-600 uppercase tracking-wider">Our Community</span>
              <h2 className="text-title font-extrabold text-[#0f172a] mt-4 mb-6">
                More Than Just a Court
              </h2>
              <p className="text-body text-slate-500 leading-relaxed text-lg">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-sm hover:shadow-lg transition-all">
              <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-[#0f172a] mb-2">Sportsmanship</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Respect, fairness and positive competition.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-sm hover:shadow-lg transition-all">
              <Users className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-[#0f172a] mb-2">Teamwork</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Working together and supporting one another.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-sm hover:shadow-lg transition-all">
              <Clock className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-[#0f172a] mb-2">Discipline</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Encouraging commitment, practice and consistency.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-sm hover:shadow-lg transition-all">
              <Heart className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-[#0f172a] mb-2">Community</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Creating an inclusive and supportive sporting environment.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-yellow-400 flex flex-col items-center shadow-sm hover:shadow-lg transition-all">
              <Activity className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-[#0f172a] mb-2">Healthy Living</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Promoting an active and healthy lifestyle through sports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. WHY CHOOSE OUR CLUB */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-14 shadow-lg border border-gray-100 text-[#0f172a] relative overflow-hidden">
            <div className="relative z-10 text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                Why Choose Karanavai East Youth Sports Club?
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <span className="font-medium text-lg text-slate-700">Easy badminton court availability checking</span>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <span className="font-medium text-lg text-slate-700">Simple online booking process</span>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <span className="font-medium text-lg text-slate-700">Affordable court and membership options</span>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <span className="font-medium text-lg text-slate-700">Community-focused sports environment</span>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <span className="font-medium text-lg text-slate-700">Opportunities for tournaments and events</span>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <span className="font-medium text-lg text-slate-700">Suitable for youth, regular players and community members</span>
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
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/availability">
              <Button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 h-12 rounded-md transition duration-200">
                Check Availability
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent border border-white text-white hover:bg-white/10 font-bold px-8 h-12 rounded-md transition duration-200">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
