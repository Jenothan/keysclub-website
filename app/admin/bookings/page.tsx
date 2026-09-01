"use client";

import React, { useState, useEffect } from 'react';
import Calendar from '@mui/icons-material/CalendarMonth';
import LayoutGrid from '@mui/icons-material/GridView';
import MoreVertical from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';
import RescheduleModal from '@/components/RescheduleModal';

export default function AdminBookingsPage() {
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      setAllBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id: number, action: 'confirm' | 'reject' | 'cancel') => {
    try {
      await api.post(`/admin/bookings/${id}/${action}`);
      toast.success(`Booking ${action}ed successfully`);
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} booking`);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const filteredBookings = allBookings.filter((b) => {
    const matchesSearch = !searchTerm.trim() || 
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.id?.toString().includes(searchTerm) ||
      b.user?.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'All Statuses' || b.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Booking Requests Management
          </h1>
          <p className="text-slate-500 text-sm">
            Review, confirm, reschedule or reject customer court reservations.
          </p>
        </div>

        {(searchTerm || statusFilter !== 'All Statuses') && (
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('All Statuses'); }}
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
            placeholder="Search Name, Phone, or Booking ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 focus:border-yellow-400 w-full font-medium"
          />
        </div>

        <div className="relative flex-1 w-full">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 border-slate-200">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1 w-full">
          <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Filter by Date" 
            className="pl-12 h-12 bg-white border-slate-200 focus:border-yellow-400 w-full font-medium"
          />
        </div>

        <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm h-12 px-8 rounded-md transition-colors w-full md:w-auto shrink-0 shadow-md">
          Apply Filters
        </button>
        
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div className="overflow-x-auto p-4 md:p-6 pb-0">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs font-extrabold text-slate-600 bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 rounded-l-lg">User & Mobile</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4">Selected Slot</th>
                <th className="px-6 py-4">Notes / Specific Request</th>
                <th className="px-2 py-4"></th>
                <th className="px-2 py-4 rounded-r-lg"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((req, i) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    {req.user ? (
                      <>
                        <p className="font-extrabold text-[#0f172a]">{req.user.name}</p>
                        <p className="text-slate-400 text-xs mt-0.5 font-medium">{req.user.phone}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-extrabold text-[#0f172a]">{req.customer_name || 'Walk-in Customer'}</p>
                        <p className="text-slate-400 text-xs mt-0.5 font-medium">{req.customer_phone || '-'}</p>
                      </>
                    )}
                    {req.booked_by && (
                      <span className="text-[10px] font-bold text-slate-900 bg-yellow-400/20 px-1.5 py-0.5 rounded mt-1 inline-block border border-yellow-400">
                        Booked by: {req.booked_by.name} ({req.booked_by.role})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 font-extrabold text-[#0f172a]">#KC-{req.id}</td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{req.created_at ? format(new Date(req.created_at), 'dd MMM yyyy') : '-'}</td>
                  <td className="px-6 py-5 text-slate-500 font-medium">
                    {req.booking_date ? format(new Date(req.booking_date), 'dd MMM') : ''} {req.start_time} - {req.end_time}
                  </td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{req.notes || '-'}</td>
                  <td className="px-2 py-5 text-right whitespace-nowrap">
                    {req.status === 'Pending' && (
                      <span className="text-slate-900 bg-yellow-400/20 font-extrabold text-[11px] px-3 py-1.5 rounded-md border border-yellow-400">Pending</span>
                    )}
                    {req.status === 'Confirmed' && (
                      <span className="text-[#10b981] bg-emerald-50 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Confirmed</span>
                    )}
                    {req.status === 'Rejected' && (
                      <span className="text-red-500 bg-red-50 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Rejected</span>
                    )}
                    {req.status === 'Cancelled' && (
                      <span className="text-slate-500 bg-slate-100 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Cancelled</span>
                    )}
                  </td>
                  <td className="px-4 py-5 w-24 relative">
                    {req.status === 'Pending' ? (
                      <div className="flex flex-col gap-1.5">
                        <button onClick={() => handleAction(req.id, 'confirm')} className="bg-[#10b981] hover:bg-[#059669] text-white text-[10px] font-extrabold px-3 py-1.5 rounded transition-colors text-center w-20 tracking-wide">
                          Confirm
                        </button>
                        <button onClick={() => handleAction(req.id, 'reject')} className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-[10px] font-extrabold px-3 py-1.5 rounded transition-colors text-center w-20 tracking-wide">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center relative">
                        <button 
                          onClick={(e) => handleDropdownClick(e, req.id)}
                          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openDropdownId === req.id && (req.status === 'Confirmed') && (
                          <div className="absolute right-0 top-10 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden">
                            <button 
                              onClick={() => { setRescheduleBooking(req); setOpenDropdownId(null); }}
                              className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-yellow-400 hover:text-slate-900 transition-colors"
                            >
                              Reschedule
                            </button>
                            <button 
                              onClick={() => { handleAction(req.id, 'cancel'); setOpenDropdownId(null); }}
                              className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center">
                    <Calendar className="w-8 h-8 text-slate-300 mb-3" />
                    <p className="font-bold">No bookings found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <LayoutGrid className="w-4 h-4 text-yellow-400" />
            Confirmed slots automatically become unavailable to other users
          </div>
        </div>
      </div>
      
      {/* RescheduleModal placeholder - we will create this component */}
      {rescheduleBooking && (
        <RescheduleModal 
          isOpen={!!rescheduleBooking} 
          onClose={() => setRescheduleBooking(null)} 
          booking={rescheduleBooking} 
          onSuccess={() => {
            setRescheduleBooking(null);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}
