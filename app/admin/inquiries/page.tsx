"use client";

import React, { useState, useEffect } from 'react';
import LayoutGrid from '@mui/icons-material/GridView';
import RefreshIcon from '@mui/icons-material/Refresh';
import MessageSquare from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FilterList from '@mui/icons-material/FilterList';
import Search from '@mui/icons-material/Search';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import InquiryDetailsModal from '@/components/InquiryDetailsModal';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (subjectFilter !== 'All Subjects') params.subject = subjectFilter;
      if (statusFilter !== 'All Statuses') params.status = statusFilter;

      const response = await api.get('/admin/inquiries', { params });
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
      toast.error('Failed to load inquiries');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInquiries();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, subjectFilter, statusFilter]);

  const handleResolve = async (id: number) => {
    try {
      await api.post(`/admin/inquiries/${id}/resolve`);
      toast.success('Inquiry marked as resolved');
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to resolve inquiry');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSubjectFilter('All Subjects');
    setStatusFilter('All Statuses');
  };

  const activeFilterCount = (subjectFilter !== 'All Subjects' ? 1 : 0) + (statusFilter !== 'All Statuses' ? 1 : 0);
  const hasActiveFilters = searchTerm || activeFilterCount > 0;

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-6 md:space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Customer Inquiries Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            View, filter, and resolve inquiries submitted by website visitors. Click any item for full details.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer self-start md:self-auto"
          >
            <RefreshIcon className="w-4 h-4" /> Reset Filters
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: SINGLE-ROW COMPACT SEARCH & FILTER BUTTON                 */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500 font-bold" />
            <Input 
              placeholder="Search Name, Phone, Subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 bg-white border-slate-200 focus:border-yellow-600 text-xs font-medium rounded-xl w-full"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className={cn(
              "h-11 px-3.5 rounded-xl border flex items-center gap-1.5 text-xs font-extrabold transition-all cursor-pointer shrink-0",
              activeFilterCount > 0 || isMobileFilterOpen
                ? "bg-yellow-400 text-slate-900 border-yellow-400 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            <FilterList className="w-4 h-4 text-yellow-500" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-black">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Mobile Filter Dropdowns */}
        {isMobileFilterOpen && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Filter Inquiries</span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[11px] font-extrabold text-red-600 hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="h-10 text-xs border-slate-200 bg-slate-50 rounded-xl">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Subjects">All Subjects</SelectItem>
                    <SelectItem value="Tournament">Tournament</SelectItem>
                    <SelectItem value="Full Day Court Booking">Full Day Court Booking</SelectItem>
                    <SelectItem value="Club Membership">Club Membership</SelectItem>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 text-xs border-slate-200 bg-slate-50 rounded-xl">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Statuses">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP VIEW: HORIZONTAL FILTERS BAR                                   */}
      {/* ========================================================================= */}
      <div className="hidden md:flex bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-3 items-center">
        
        {/* Expanded Search Bar */}
        <div className="relative flex-[2] w-full min-w-0">
          <LayoutGrid className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold" />
          <Input 
            placeholder="Search Name, Mobile Number, Subject, or Inquiry ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 focus:border-yellow-600 w-full font-medium"
          />
        </div>

        <div className="relative w-56 shrink-0">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="h-12 border-slate-200">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Subjects">All Subjects</SelectItem>
              <SelectItem value="Tournament">Tournament</SelectItem>
              <SelectItem value="Full Day Court Booking">Full Day Court Booking</SelectItem>
              <SelectItem value="Club Membership">Club Membership</SelectItem>
              <SelectItem value="General Inquiry">General Inquiry</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-48 shrink-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 border-slate-200">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: APPLE-WALLET STYLE CARD LIST                             */}
      {/* ========================================================================= */}
      <div className="block md:hidden">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-4 w-32 rounded-md" />
                      <Skeleton className="h-3 w-48 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          ) : inquiries.length > 0 ? (
            inquiries.map((inq) => {
              const isResolved = inq.status === 'Resolved';
              const nameInitial = inq.name ? inq.name.charAt(0).toUpperCase() : 'I';

              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-slate-900 font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                      {nameInitial}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{inq.name}</h4>
                      <p className="text-[11px] font-semibold text-slate-500 truncate">
                        INQ-{inq.id} • {inq.subject || 'General Inquiry'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">
                        {inq.created_at ? format(new Date(inq.created_at), 'dd MMM yyyy') : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isResolved 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {isResolved ? 'Resolved' : 'Pending'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-400">
              No customer inquiries match your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP VIEW: STANDARD TABLE                                           */}
      {/* ========================================================================= */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="overflow-x-auto p-4 md:p-6 pb-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs font-extrabold text-slate-600 bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 rounded-l-lg">Sender</th>
                    <th className="px-6 py-4">Inquiry ID</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.length > 0 ? (
                    inquiries.map((inq) => {
                      const isResolved = inq.status === 'Resolved';
                      return (
                      <tr 
                        key={inq.id} 
                        onClick={() => setSelectedInquiry(inq)}
                        className={`hover:bg-yellow-400/5 transition-colors group cursor-pointer ${!isResolved ? 'bg-yellow-400/5' : ''}`}
                      >
                        <td className="px-6 py-5 font-extrabold text-[#0f172a] group-hover:text-yellow-600 transition-colors">
                          {inq.name}
                        </td>
                        <td className="px-6 py-5 font-black text-[#0f172a]">INQ-{inq.id}</td>
                        <td className="px-6 py-5 font-bold text-slate-700">{inq.subject || 'General Inquiry'}</td>
                        <td className="px-6 py-5 text-slate-500 font-medium">
                          {inq.created_at ? format(new Date(inq.created_at), 'dd MMM yyyy') : '-'}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                            isResolved 
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {isResolved ? 'Resolved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          {!isResolved ? (
                            <button
                              onClick={() => handleResolve(inq.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                            >
                              Resolve
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    )})
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-bold">
                        No customer inquiries found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {!loading && (
            <div className="mt-4 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-slate-500 text-xs font-bold">
                Showing {inquiries.length} inquiry{inquiries.length !== 1 && 's'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Details Modal */}
      <InquiryDetailsModal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        inquiry={selectedInquiry}
        onResolve={handleResolve}
      />

    </div>
  );
}
