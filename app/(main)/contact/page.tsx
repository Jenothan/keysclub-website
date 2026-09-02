"use client";

import React, { useState } from 'react';
import Phone from '@mui/icons-material/Phone';
import Mail from '@mui/icons-material/Email';
import MapPin from '@mui/icons-material/LocationOn';
import MessageCircle from '@mui/icons-material/Chat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/axios';
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

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [subject, setSubject] = useState("Tournament");

  React.useEffect(() => {
    api.get('/website-data').then(res => {
      setWebsiteData(res.data);
    }).catch(console.error);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name'),
      mobile: formData.get('mobile'),
      subject: formData.get('type'),
      message: formData.get('message'),
    };

    try {
      await api.post('/inquiries', data);
      toast.success('Inquiry submitted successfully! We will contact you soon.');
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

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
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Call Us</p>
                <h3 className="font-extrabold text-[#0f172a] text-lg mb-1">{websiteData?.primary_phone || '+94 77 123 4567'}</h3>
                <p className="text-slate-500 text-xs font-medium">Available Daily 6 AM - 10 PM</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Inquiry</p>
                <h3 className="font-extrabold text-[#0f172a] text-lg mb-1">{websiteData?.support_email || 'info@keysclub.lk'}</h3>
                <p className="text-slate-500 text-xs font-medium">General & sports inquiries</p>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Visit Club</p>
                <h3 className="font-extrabold text-[#0f172a] text-lg mb-1">{websiteData?.club_address || 'Karanavai East, Point Pedro'}</h3>
                <p className="text-slate-500 text-xs font-medium">Jaffna District, Sri Lanka</p>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-4">
              <h4 className="font-bold text-[#0f172a] mb-4 text-sm">Connect With Us</h4>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 transition-colors">
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
          <div id='enquiry_form' className="lg:col-span-8 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#0f172a] mb-8 tracking-tight">Send an Inquiry</h2>

            <form className="space-y-6" onSubmit={onSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Full Name</label>
                  <Input name="name" required placeholder="Ashan Perera" className="h-11 bg-slate-50/50 focus:border-yellow-400 focus:ring-yellow-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f172a]">Mobile Number</label>
                  <Input name="mobile" required placeholder="771234567" className="h-11 bg-slate-50/50 focus:border-yellow-400 focus:ring-yellow-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0f172a]">Email Address</label>
                <Input name="email" placeholder="ashan@example.com" type="email" className="h-11 bg-slate-50/50 focus:border-yellow-400 focus:ring-yellow-400" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0f172a]">Subject</label>
                <input type="hidden" name="type" value={subject} />
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="h-11 bg-slate-50/50">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tournament">Tournament</SelectItem>
                    <SelectItem value="Full Day Court Booking">Full Day Court Booking</SelectItem>
                    <SelectItem value="Badminton Court Membership">Badminton Court Membership</SelectItem>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0f172a]">Message/Additional Requirements</label>
                <textarea
                  name="message"
                  required
                  className="flex w-full rounded-md border border-input bg-slate-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 min-h-30"
                  placeholder="Outline any custom equipment, boards, umpire needs or schedule preferences..."
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-yellow-400 hover:bg-yellow-400/90 text-slate-900 font-bold text-sm transition-colors rounded-lg">
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}
