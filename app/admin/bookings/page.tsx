"use client";

import React, { useState, useEffect } from 'react';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import LayoutGrid from '@mui/icons-material/GridView';
import MoreVertical from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import XIcon from '@mui/icons-material/Close';
import EyeIcon from '@mui/icons-material/Visibility';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FilterList from '@mui/icons-material/FilterList';
import Search from '@mui/icons-material/Search';
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setCreatorFilter('All Creators');
    setSelectedDate(undefined);
  };

  const activeFilterCount = (statusFilter !== 'All Statuses' ? 1 : 0) + 
    (creatorFilter !== 'All Creators' ? 1 : 0) + 
    (selectedDate ? 1 : 0);

  const hasActiveFilters = searchTerm || activeFilterCount > 0;

  const adminsFromBookings = allBookings
    .filter((b) => b.booked_by && b.booked_by.name)
    .map((b) => ({ id: b.booked_by.id, name: b.booked_by.name, role: b.booked_by.role }));

  const adminMap = new Map<number, any>();
  adminStaffList.forEach((a) => adminMap.set(a.id, a));
  adminsFromBookings.forEach((a) => adminMap.set(a.id, a));
  const combinedAdmins = Array.from(adminMap.values());

  const filteredBookings = allBookings.filter((b) => {
    const computed = computeBookingStatus(b);
    const query = searchTerm.trim().toLowerCase();
    
    const bookingIdStr = b.id ? b.id.toString() : '';
    const formattedId = `#kc-${bookingIdStr}`;
    const customerName = (b.customer_name || b.user?.name || '').toLowerCase();
    const customerPhone = (b.customer_phone || b.user?.phone || '').toLowerCase();
    const referenceStr = (b.booking_reference || '').toLowerCase();

    const matchesSearch = !query || 
      customerName.includes(query) ||
      customerPhone.includes(query) ||
      bookingIdStr.includes(query) ||
      formattedId.includes(query) ||
      referenceStr.includes(query);

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
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-6 md:space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Booking Requests Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Review, confirm, reschedule or reject customer court reservations. Click any item for full details.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
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
              placeholder="Search Name, Phone, or Booking ID..." 
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
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Filter Bookings</span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-extrabold text-red-600 hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 text-xs border-slate-200 bg-slate-50 rounded-xl">
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

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Booked By</label>
                <Select value={creatorFilter} onValueChange={setCreatorFilter}>
                  <SelectTrigger className="h-10 text-xs border-slate-200 bg-slate-50 rounded-xl">
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

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Booking Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-10 w-full justify-start text-left text-xs font-medium border-slate-200 bg-slate-50 shadow-none rounded-xl text-slate-700",
                        !selectedDate && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Select Date</span>}
                      {selectedDate && (
                        <span 
                          onClick={(e) => { e.stopPropagation(); setSelectedDate(undefined); }}
                          className="ml-auto p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <XIcon className="w-3.5 h-3.5" />
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
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP VIEW: HORIZONTAL FILTERS BAR                                   */}
      {/* ========================================================================= */}
      <div className="hidden md:flex bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-3 items-center">
        
        {/* Expanded Search Input */}
        <div className="relative flex-[2] w-full min-w-0">
          <LayoutGrid className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold" />
          <Input 
            placeholder="Search Name, Phone, or Booking ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 focus:border-yellow-600 w-full font-medium"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-48 shrink-0">
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

        {/* Booked By Dropdown */}
        <div className="relative w-48 shrink-0">
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

        {/* Small Icon Date Filter */}
        <div className="shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-none rounded-xl cursor-pointer flex items-center gap-1.5",
                  selectedDate ? "px-3.5 border-yellow-400 bg-yellow-400/10 text-slate-900 font-extrabold" : "w-12 px-0 justify-center text-slate-500"
                )}
                title={selectedDate ? format(selectedDate, "PPP") : "Filter by Date"}
              >
                <CalendarIcon className="h-5 w-5 text-yellow-500 shrink-0" />
                {selectedDate && (
                  <span className="text-xs font-extrabold text-slate-900 whitespace-nowrap">
                    {format(selectedDate, "dd MMM")}
                  </span>
                )}
                {selectedDate && (
                  <span 
                    onClick={(e) => { e.stopPropagation(); setSelectedDate(undefined); }}
                    className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-slate-200 z-50" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
            </PopoverContent>
          </Popover>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: APPLE-WALLET STYLE CARD TRANSACTION LIST                 */}
      {/* ========================================================================= */}
      <div className="block md:hidden">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((req) => {
              const statusInfo = computeBookingStatus(req);
              const displayName = req.customer_name || (req.user ? req.user.name : 'Walk-in Customer');
              const displayPhone = req.customer_phone || req.user?.phone || '';
              const userInitial = displayName.charAt(0).toUpperCase();

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedDetailBooking(req)}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-slate-900 font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{displayName}</h4>
                      <p className="text-[11px] font-semibold text-slate-500 truncate">
                        #KC-{req.id} {displayPhone ? `• ${displayPhone}` : ''} • {req.booking_date}
                      </p>
                      <p className="text-[10px] font-bold text-slate-700 truncate">
                        {req.start_time} - {req.end_time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs", statusInfo.badgeClass)}>
                      {statusInfo.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-400">
              No booking requests match your filters.
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
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs font-extrabold text-slate-600 bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 rounded-l-lg">Customer / User</th>
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
                    const displayName = req.customer_name || (req.user ? req.user.name : 'Walk-in Customer');
                    const displayPhone = req.customer_phone || req.user?.phone || '';

                    return (
                      <tr 
                        key={req.id} 
                        onClick={() => setSelectedDetailBooking(req)}
                        className="hover:bg-yellow-400/5 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-5">
                          <p className="font-extrabold text-[#0f172a] group-hover:text-yellow-600 transition-colors">
                            {displayName}
                          </p>
                          {displayPhone && (
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">
                              {displayPhone}
                            </p>
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

          <div className="mt-4 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <LayoutGrid className="w-4 h-4 text-yellow-400" />
              Click any row to open full customer booking details & actions.
            </div>
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
