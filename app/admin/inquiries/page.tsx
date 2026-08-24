"use client";

import React, { useState, useEffect } from 'react';
import LayoutGrid from '@mui/icons-material/GridView';
import MoreVertical from '@mui/icons-material/MoreVert';
import MessageSquare from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Input } from '@/components/ui/input';
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminInquiriesPage() {
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [allInquiries, setAllInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/admin/inquiries');
      setAllInquiries(response.data);
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleResolve = async (id: number) => {
    try {
      await api.post(`/admin/inquiries/${id}/resolve`);
      toast.success('Inquiry marked as resolved');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to resolve inquiry');
    }
  };

  const filteredInquiries = subjectFilter === 'All Subjects' 
    ? allInquiries 
    : allInquiries.filter(i => i.subject === subjectFilter);

  return (
    <div className="p-6 md:p-10 w-full space-y-8 pb-20 min-h-screen">
      


      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        
        <div className="relative flex-1 w-full">
          <LayoutGrid className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search Name or ID..." 
            className="pl-12 h-12 bg-white border-slate-200 focus:border-blue-500 w-full font-medium"
          />
        </div>

        <div className="relative flex-1 w-full">
          <select 
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="h-12 w-full appearance-none bg-white border border-slate-200 rounded-md pl-4 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All Subjects">All Subjects</option>
            <option value="Tournament">Tournament</option>
            <option value="Full Day Court Booking">Full Day Court Booking</option>
            <option value="Others">Others</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </div>
        </div>

        <div className="relative flex-1 w-full">
          <select className="h-12 w-full appearance-none bg-white border border-slate-200 rounded-md pl-4 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option>All Statuses</option>
            <option>Unread</option>
            <option>Responded</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </div>
        </div>

        <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm h-12 px-8 rounded-md transition-colors w-full md:w-auto shrink-0 shadow-md">
          Apply Filters
        </button>
        
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div className="overflow-x-auto p-4 md:p-6 pb-0">
          <table className="w-full text-sm text-left">
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
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inq, i) => (
                  <tr key={inq.id} className={`hover:bg-slate-50/50 transition-colors group ${inq.status === 'Pending' ? 'bg-blue-50/30' : ''}`}>
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
                    <td className="px-6 py-5 text-slate-500 font-medium max-w-[200px] truncate">
                      {inq.message}
                    </td>
                    <td className="px-6 py-5 text-slate-500 font-medium">{inq.created_at ? format(new Date(inq.created_at), 'dd MMM yyyy') : '-'}</td>
                    <td className="px-6 py-5 text-center">
                      {inq.status === 'Pending' ? (
                        <span className="text-blue-600 bg-blue-50 border border-blue-100 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Pending</span>
                      ) : (
                        <span className="text-[#10b981] bg-emerald-50 border border-emerald-100 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Resolved</span>
                      )}
                    </td>
                    <td className="px-4 py-5 w-24">
                      {inq.status === 'Pending' ? (
                        <button onClick={() => handleResolve(inq.id)} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded transition-colors text-center w-full tracking-wide">
                          Resolve
                        </button>
                      ) : (
                        <div className="flex justify-center">
                          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-slate-300 mb-3" />
                      <p>No inquiries found for the selected subject.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-xs font-bold">
            Showing {filteredInquiries.length} inquiries
          </div>
          
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-md shadow-sm">
              1
            </button>
            <button className="px-3 py-1.5 border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
