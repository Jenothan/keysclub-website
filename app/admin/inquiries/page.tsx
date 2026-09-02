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

import InquiryDetailsModal from '@/components/InquiryDetailsModal';

export default function AdminInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

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

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Customer Inquiries Management
          </h1>
          <p className="text-slate-500 text-sm">
            View, filter, and resolve inquiries submitted by website visitors. Click any row for full details.
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

        {/* Footer */}
        {!loading && (
          <div className="mt-4 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-xs font-bold">
              Showing {inquiries.length} inquiry{inquiries.length !== 1 && 's'}
            </div>
          </div>
        )}

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
