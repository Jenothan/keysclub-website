"use client";

import React, { useState, useEffect } from 'react';
import LayoutGrid from '@mui/icons-material/GridView';
import MoreVertical from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import MessageSquare from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Real-time live search & filter
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

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Customer Inquiries Management
          </h1>
          <p className="text-slate-500 text-sm">
            View, filter, and resolve inquiries submitted by website visitors.
          </p>
        </div>

        {(searchTerm || subjectFilter !== 'All Subjects' || statusFilter !== 'All Statuses') && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer self-start md:self-auto"
          >
            <RefreshIcon className="w-4 h-4" /> Reset Filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        
        <div className="relative flex-1 w-full">
          <LayoutGrid className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search Name, Mobile Number, Subject, or Inquiry ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 focus:border-yellow-400 w-full font-medium"
          />
        </div>

        <div className="relative flex-1 w-full">
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

        <div className="relative flex-1 w-full">
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div className="overflow-x-auto p-4 md:p-6 pb-0">
          {loading ? (
            <div className="py-16 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs font-extrabold text-slate-600 bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 rounded-l-lg">Sender Details</th>
                  <th className="px-6 py-4">Inquiry ID</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Message Preview</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-4 py-4 rounded-r-lg"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.length > 0 ? (
                  inquiries.map((inq) => (
                    <tr key={inq.id} className={`hover:bg-slate-50/50 transition-colors group ${inq.status === 'Pending' ? 'bg-yellow-400/10' : ''}`}>
                      <td className="px-6 py-5">
                        <p className="font-extrabold text-[#0f172a]">{inq.name}</p>
                        <p className="text-slate-400 text-xs mt-0.5 font-medium">{inq.mobile}</p>
                      </td>
                      <td className="px-6 py-5 font-extrabold text-[#0f172a]">#INQ-{inq.id}</td>
                      <td className="px-6 py-5">
                        <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2.5 py-1 rounded-md border border-slate-200">
                          {inq.subject || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-500 font-medium max-w-50 truncate">
                        {inq.message}
                      </td>
                      <td className="px-6 py-5 text-slate-500 font-medium">{inq.created_at ? format(new Date(inq.created_at), 'dd MMM yyyy') : '-'}</td>
                      <td className="px-6 py-5 text-center">
                        {inq.status === 'Pending' ? (
                          <span className="text-yellow-800 bg-yellow-400/20 border border-yellow-400 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Pending</span>
                        ) : (
                          <span className="text-[#10b981] bg-emerald-50 border border-emerald-100 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Resolved</span>
                        )}
                      </td>
                      <td className="px-4 py-5 w-24">
                        {inq.status === 'Pending' ? (
                          <button onClick={() => handleResolve(inq.id)} className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-[10px] font-extrabold px-3 py-1.5 rounded transition-colors text-center w-full tracking-wide shadow-sm cursor-pointer">
                            Resolve
                          </button>
                        ) : (
                          <div className="flex justify-center">
                            <span className="text-xs text-slate-400 font-bold">Done</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                      <div className="flex flex-col items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-slate-300 mb-3" />
                        <p className="font-bold">No inquiries found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="mt-4 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-xs font-bold">
              Showing {inquiries.length} inquiry{inquiries.length !== 1 && 's'}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
