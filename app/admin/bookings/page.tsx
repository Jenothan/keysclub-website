"use client";

import React, { useState, useEffect } from 'react';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import LayoutGrid from '@mui/icons-material/GridView';
import MoreVertical from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import XIcon from '@mui/icons-material/Close';
import EyeIcon from '@mui/icons-material/Visibility';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import RescheduleModal from '@/components/RescheduleModal';
import BookingDetailsModal from '@/components/BookingDetailsModal';
import { computeBookingStatus } from '@/lib/bookingUtils';
import { useAuthStore } from '@/store/authStore';

export default function AdminBookingsPage() {
  const { user } = useAuthStore();
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<any | null>(null);
  const [selectedDetailBooking, setSelectedDetailBooking] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [creatorFilter, setCreatorFilter] = useState('All Creators');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [adminStaffList, setAdminStaffList] = useState<any[]>([]);

  const fetchBookings = async () => {
    setLoading(true);
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
    
    // Only fetch /super-admin/managers if logged-in user is Super Admin
    if (user?.role === 'Super Admin') {
      api.get('/super-admin/managers')
        .then(res => {
          if (Array.isArray(res.data)) {
            setAdminStaffList(res.data);
          }
        })
        .catch(() => {});
    }
  }, [user]);

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

  // Dynamic unique admins from bookings combined with staff list
  const adminsFromBookings = allBookings
    .filter((b) => b.booked_by && b.booked_by.name)
    .map((b) => ({ id: b.booked_by.id, name: b.booked_by.name, role: b.booked_by.role }));

  const adminMap = new Map<number, any>();
  adminStaffList.forEach((a) => adminMap.set(a.id, a));
  adminsFromBookings.forEach((a) => adminMap.set(a.id, a));
  const combinedAdmins = Array.from(adminMap.values());

  const filteredBookings = allBookings.filter((b) => {
    const computed = computeBookingStatus(b);
    const matchesSearch = !searchTerm.trim() || 
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.id?.toString().includes(searchTerm) ||
      b.user?.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'All Statuses' || 
      b.status?.toLowerCase() === statusFilter.toLowerCase() ||
      computed.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = !selectedDate || (
      b.booking_date && format(new Date(b.booking_date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
    const matchesCreator = creatorFilter === 'All Creators' || (
      (creatorFilter === 'Users' || creatorFilter === 'User') ? (!b.booked_by || b.booked_by?.role === 'user') : (
        creatorFilter.startsWith('admin_') && b.booked_by?.id?.toString() === creatorFilter.replace('admin_', '')
      )
    );
    return matchesSearch && matchesStatus && matchesDate && matchesCreator;
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
            Review, confirm, reschedule or reject customer court reservations. Click any row for full details.
          </p>
        </div>

        {(searchTerm || statusFilter !== 'All Statuses' || creatorFilter !== 'All Creators' || selectedDate) && (
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('All Statuses'); setCreatorFilter('All Creators'); setSelectedDate(undefined); }}
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
              <SelectItem value="Ongoing">Ongoing Now</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1 w-full">
          <Select value={creatorFilter} onValueChange={setCreatorFilter}>
            <SelectTrigger className="h-12 border-slate-200">
              <SelectValue placeholder="All Booked By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Creators">All Booked By</SelectItem>
              <SelectItem value="Users">Users</SelectItem>
              {combinedAdmins.map((admin: any) => (
                <SelectItem key={admin.id} value={`admin_${admin.id}`}>
                  {admin.name} ({admin.role || 'Admin'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1 w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 w-full justify-start text-left font-medium border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-none text-slate-700",
                  !selectedDate && "text-slate-400"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5 text-slate-400" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Filter by Date</span>}
                {selectedDate && (
                  <span 
                    onClick={(e) => { e.stopPropagation(); setSelectedDate(undefined); }}
                    className="ml-auto p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-slate-200 z-50" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
            </PopoverContent>
          </Popover>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div className="overflow-x-auto p-4 md:p-6 pb-0">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs font-extrabold text-slate-600 bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 rounded-l-lg">User</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Booking Date & Slot</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex justify-center items-center">
                      <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((req) => {
                  const statusInfo = computeBookingStatus(req);
                  return (
                    <tr 
                      key={req.id} 
                      onClick={() => setSelectedDetailBooking(req)}
                      className="hover:bg-yellow-400/5 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        {req.user ? (
                          <p className="font-extrabold text-[#0f172a] group-hover:text-yellow-600 transition-colors">{req.user.name}</p>
                        ) : (
                          <p className="font-extrabold text-[#0f172a] group-hover:text-yellow-600 transition-colors">{req.customer_name || 'Walk-in Customer'}</p>
                        )}
                      </td>
                      <td className="px-6 py-5 font-black text-[#0f172a]">#KC-{req.id}</td>
                      <td className="px-6 py-5 text-slate-700 font-bold">
                        <div>
                          <span>{req.booking_date ? format(new Date(req.booking_date), 'dd MMM yyyy') : '-'}</span>
                          <span className="text-xs text-slate-400 font-semibold block mt-0.5">
                            {req.start_time} - {req.end_time}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={cn("text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-xs", statusInfo.badgeClass)}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedDetailBooking(req)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>

                          {req.status === 'Pending' ? (
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => handleAction(req.id, 'confirm')} 
                                className="bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => handleAction(req.id, 'reject')} 
                                className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="relative">
                              {statusInfo.status === 'Confirmed' && (
                                <>
                                  <button 
                                    onClick={(e) => handleDropdownClick(e, req.id)}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                  >
                                    <MoreVertical className="w-5 h-5" />
                                  </button>
                                  {openDropdownId === req.id && (
                                    <div className="absolute right-0 top-10 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden text-left">
                                      <button 
                                        onClick={() => { setRescheduleBooking(req); setOpenDropdownId(null); }}
                                        className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-yellow-400 hover:text-slate-900 transition-colors block cursor-pointer"
                                      >
                                        Reschedule Slot
                                      </button>
                                      <button 
                                        onClick={() => { handleAction(req.id, 'cancel'); setOpenDropdownId(null); }}
                                        className="w-full px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors block cursor-pointer"
                                      >
                                        Cancel Booking
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center">
                      <CalendarIcon className="w-8 h-8 text-slate-300 mb-3" />
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
            Click any row to open full customer booking details & actions.
          </div>
        </div>
      </div>
      
      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={!!selectedDetailBooking}
        onClose={() => setSelectedDetailBooking(null)}
        booking={selectedDetailBooking}
        isAdmin={true}
        onConfirm={(id) => handleAction(id, 'confirm')}
        onReject={(id) => handleAction(id, 'reject')}
        onReschedule={(b) => setRescheduleBooking(b)}
        onCancel={(id) => handleAction(id, 'cancel')}
      />

      {/* Reschedule Modal */}
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

