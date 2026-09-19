"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Phone from '@mui/icons-material/Phone';
import Mail from '@mui/icons-material/Email';
import MapPin from '@mui/icons-material/LocationOn';
import WhatsApp from '@mui/icons-material/WhatsApp';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/axios';
import { formatPhoneWithCountryCode } from '@/lib/phoneUtils';
import PhoneInput from '@/components/PhoneInput';
import { toast } from 'sonner';

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

function ContactFormContent() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [mobile, setMobile] = useState("");

  const getSubjectFromUrl = () => {
    let paramSubject = searchParams?.get('subject');
    if (!paramSubject && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      paramSubject = urlParams.get('subject');
    }
    if (paramSubject) {
      const cleanSubject = decodeURIComponent(paramSubject).split('#')[0].trim();
      if (cleanSubject) {
        return cleanSubject;
      }
    }
    return null;
  };

  const urlSubject = getSubjectFromUrl();
  const [subject, setSubject] = useState(urlSubject || "");

  React.useEffect(() => {
    const currentSubject = getSubjectFromUrl();
    if (currentSubject) {
      setSubject(currentSubject);
    }
    if (typeof window !== 'undefined' && (window.location.hash === '#enquiry_form' || window.location.href.includes('#enquiry_form'))) {
      const el = document.getElementById('enquiry_form');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [searchParams]);

  React.useEffect(() => {
    api.get('/website-data').then(res => {
      setWebsiteData(res.data);
    }).catch(console.error);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inquirySubject = (formData.get('type') as string) || subject;

    if (!inquirySubject) {
      toast.error('Please select a subject');
      return;
    }

    setIsSubmitting(true);

    const data = {
      name: formData.get('name'),
      mobile: formatPhoneWithCountryCode(mobile),
      subject: inquirySubject,
      message: formData.get('message'),
    };

    try {
      await api.post('/inquiries', data);
      toast.success('Inquiry submitted successfully! We will contact you soon.');
      (event.target as HTMLFormElement).reset();
      setSubject("");
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">

        {/* Page Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Contact Karanavai East Youth Sports Club
          </h1>
          <p className="text-slate-500 text-body">
            Need special support, hosting packages, or full-day bookings? Reach out to us.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

          {/* Left Column - Contact Info */}
          <div className="lg:col-span-4 space-y-2.5 sm:space-y-3">

            {/* Mobile 2-Column Grid / Laptop Compact Vertical Stack */}
            <div className="grid grid-cols-2 lg:flex lg:flex-col gap-2.5 sm:gap-3">

              {/* Column 1 on Mobile / Direct Flex Items on Laptop */}
              <div className="flex flex-col gap-2.5 sm:gap-3 justify-between lg:contents">
                {/* Call Us Card */}
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 shadow-2xs hover:shadow-xs transition-all flex-1 lg:flex-none">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <div className="min-w-0 text-left flex-1">
                    <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">Call Us</p>
                    <h3 className="font-black text-[#0f172a] text-[11px] sm:text-xs md:text-sm truncate mb-0.5">{websiteData?.primary_phone || '+94 77 123 4567'}</h3>
                    <p className="text-slate-500 text-[9.5px] sm:text-xs font-medium leading-none">Daily 6 AM - 10 PM</p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 shadow-2xs hover:shadow-xs transition-all flex-1 lg:flex-none">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <div className="min-w-0 text-left flex-1">
                    <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">Email Inquiry</p>
                    <h3 className="font-black text-[#0f172a] text-[10.5px] sm:text-xs md:text-sm break-all mb-0.5 leading-tight">{websiteData?.support_email || 'info@keysclub.lk'}</h3>
                    <p className="text-slate-500 text-[9.5px] sm:text-xs font-medium leading-none">General inquiries</p>
                  </div>
                </div>
              </div>

              {/* Column 2 on Mobile / Direct Flex Item on Laptop */}
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 shadow-2xs hover:shadow-xs transition-all h-full lg:h-auto">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="min-w-0 text-left flex-1">
                  <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">Visit Club</p>
                  <h3 className="font-black text-[#0f172a] text-[11px] sm:text-xs md:text-sm mb-0.5 leading-snug break-words">{websiteData?.club_address || 'Karanavai East, Karaveddy, Jaffna'}</h3>
                  <p className="text-slate-500 text-[9.5px] sm:text-xs font-medium leading-none">Jaffna District, Sri Lanka</p>
                </div>
              </div>

            </div>

            {/* Social Links Card - Equal Space Sharing Circular Icons */}
            <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-xs transition-all">
              <h4 className="font-extrabold text-[#0f172a] mb-3 text-xs sm:text-sm">Connect With Us</h4>
              <div className="flex items-center justify-around w-full px-2">
                <a
                  href={websiteData?.facebook_url || "#"}
                  target={websiteData?.facebook_url ? "_blank" : undefined}
                  rel={websiteData?.facebook_url ? "noopener noreferrer" : undefined}
                  className="w-9.5 h-9.5 sm:w-10.5 sm:h-10.5 rounded-full flex items-center justify-center text-yellow-500 hover:text-blue-600 bg-yellow-400/10 border border-yellow-400/20 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer hover:scale-105"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </a>
                <a
                  href={websiteData?.instagram_url || "#"}
                  target={websiteData?.instagram_url ? "_blank" : undefined}
                  rel={websiteData?.instagram_url ? "noopener noreferrer" : undefined}
                  className="w-9.5 h-9.5 sm:w-10.5 sm:h-10.5 rounded-full flex items-center justify-center text-yellow-500 hover:text-pink-600 bg-yellow-400/10 border border-yellow-400/20 hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer hover:scale-105"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </a>
                <a
                  href={websiteData?.primary_phone ? `https://wa.me/${websiteData.primary_phone.replace(/[^0-9]/g, '')}` : "#"}
                  target={websiteData?.primary_phone ? "_blank" : undefined}
                  rel={websiteData?.primary_phone ? "noopener noreferrer" : undefined}
                  className="w-9.5 h-9.5 sm:w-10.5 sm:h-10.5 rounded-full flex items-center justify-center text-yellow-500 hover:text-emerald-600 bg-yellow-400/10 border border-yellow-400/20 hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer hover:scale-105"
                  aria-label="WhatsApp"
                >
                  <WhatsApp className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column - Form */}
          <div id='enquiry_form' className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-8 border border-slate-100 shadow-xs">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-6 sm:mb-8 tracking-tight">Send an Inquiry</h2>

            <form className="space-y-4 sm:space-y-6" onSubmit={onSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] sm:text-xs font-bold text-[#0f172a]">Full Name</label>
                  <Input name="name" required placeholder="your name" className="h-10 sm:h-11 bg-slate-50/50 focus:border-yellow-400 focus:ring-yellow-400 text-xs sm:text-xs placeholder:text-xs sm:placeholder:text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] sm:text-xs font-bold text-[#0f172a]">Mobile Number</label>
                  <PhoneInput
                    required
                    value={mobile}
                    onChange={(val) => setMobile(val)}
                    placeholder="7xxxxxxxx"
                    className="h-10 sm:h-11 bg-slate-50/50 text-xs sm:text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs font-bold text-[#0f172a]">Email Address</label>
                <Input name="email" placeholder="your email" type="email" className="h-10 sm:h-11 bg-slate-50/50 focus:border-yellow-400 focus:ring-yellow-400 text-xs sm:text-xs placeholder:text-xs sm:placeholder:text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs font-bold text-[#0f172a]">Subject</label>
                <input type="hidden" name="type" value={subject} />
                <Select key={subject} value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="h-10 sm:h-11 bg-slate-50/50 text-xs sm:text-xs font-normal text-slate-700">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent className="text-xs sm:text-xs">
                    <SelectItem value="Tournament" className="text-xs sm:text-xs">Tournament</SelectItem>
                    <SelectItem value="Full Day Court Booking" className="text-xs sm:text-xs">Full Day Court Booking</SelectItem>
                    <SelectItem value="Badminton Court Membership" className="text-xs sm:text-xs">Badminton Court Membership</SelectItem>
                    <SelectItem value="General Inquiry" className="text-xs sm:text-xs">General Inquiry</SelectItem>
                    <SelectItem value="Others" className="text-xs sm:text-xs">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs font-bold text-[#0f172a]">Message/Additional Requirements</label>
                <textarea
                  name="message"
                  required
                  className="flex w-full rounded-md border border-input bg-slate-50/50 px-3 py-2 text-xs sm:text-xs ring-offset-background placeholder:text-muted-foreground placeholder:text-xs sm:placeholder:text-xs focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 min-h-24 sm:min-h-30"
                  placeholder="Outline any custom equipment, boards, umpire needs or schedule preferences..."
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-11 sm:h-12 bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold text-xs sm:text-sm transition-colors rounded-lg cursor-pointer">
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ContactFormContent />
    </Suspense>
  );
}
