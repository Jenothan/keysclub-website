"use client";

import React, { useState, useEffect } from 'react';
import LayoutGrid from '@mui/icons-material/GridView';
import RefreshIcon from '@mui/icons-material/Refresh';
import EyeIcon from '@mui/icons-material/Visibility';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FilterList from '@mui/icons-material/FilterList';
import Search from '@mui/icons-material/Search';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import UserDetailsModal from '@/components/UserDetailsModal';
import PaymentProofViewerModal from '@/components/PaymentProofViewerModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('users');

  // Registered Users State
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Membership Requests State
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestStatusFilter, setRequestStatusFilter] = useState('All');
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [selectedProofRequest, setSelectedProofRequest] = useState<any | null>(null);
  const [isMobileRequestFilterOpen, setIsMobileRequestFilterOpen] = useState(false);

  // Confirmation & Action Modals State
  const [confirmMemberUser, setConfirmMemberUser] = useState<any | null>(null);
  const [approveRequestObj, setApproveRequestObj] = useState<any | null>(null);
  const [rejectRequestObj, setRejectRequestObj] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isActionProcessing, setIsActionProcessing] = useState(false);

  // ----------------------------------------------------
  // Fetch Functions
  // ----------------------------------------------------
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (statusFilter !== 'All Statuses') params.status = statusFilter;
      if (typeFilter !== 'All Types') params.type = typeFilter;

      const response = await api.get('/admin/users', { params });
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to load registered users');
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMembershipRequests = async () => {
    setLoadingRequests(true);
    try {
      const params: any = {};
      if (requestStatusFilter !== 'All') params.status = requestStatusFilter;
      if (requestSearchTerm.trim()) params.search = requestSearchTerm.trim();

      const response = await api.get('/admin/membership-requests', { params });
      setRequests(response.data || []);
    } catch (error) {
      console.error('Failed to fetch membership requests', error);
      toast.error('Failed to load membership requests');
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      const timer = setTimeout(() => {
        fetchUsers();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        fetchMembershipRequests();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, searchTerm, statusFilter, typeFilter, requestStatusFilter, requestSearchTerm]);

  // Load pending count on mount
  useEffect(() => {
    fetchMembershipRequests();
  }, []);

  // ----------------------------------------------------
  // User Actions
  // ----------------------------------------------------
  const handleToggleStatus = async (userObj: any) => {
    try {
      const res = await api.post(`/admin/users/${userObj.id}/toggle-status`);
      toast.success(res.data.message || 'Status updated');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleToggleMember = async (userObj: any) => {
    setConfirmMemberUser(userObj);
  };

  const executeToggleMember = async () => {
    if (!confirmMemberUser) return;
    setIsActionProcessing(true);
    try {
      const res = await api.post(`/admin/users/${confirmMemberUser.id}/toggle-member`);
      toast.success(res.data.message || 'Court member status updated');
      setConfirmMemberUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update court member status');
    } finally {
      setIsActionProcessing(false);
    }
  };

  // ----------------------------------------------------
  // Membership Request Actions (Approve / Reject)
  // ----------------------------------------------------
  const executeApproveRequest = async () => {
    if (!approveRequestObj) return;
    setIsActionProcessing(true);
    try {
      const res = await api.post(`/admin/membership-requests/${approveRequestObj.id}/approve`);
      toast.success(res.data.message || 'Membership approved successfully!');
      setApproveRequestObj(null);
      fetchMembershipRequests();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve membership');
    } finally {
      setIsActionProcessing(false);
    }
  };

  const executeRejectRequest = async () => {
    if (!rejectRequestObj) return;
    setIsActionProcessing(true);
    try {
      const res = await api.post(`/admin/membership-requests/${rejectRequestObj.id}/reject`, {
        rejection_reason: rejectionReason,
      });
      toast.success(res.data.message || 'Membership request rejected.');
      setRejectRequestObj(null);
      setRejectionReason('');
      fetchMembershipRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject membership request');
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setTypeFilter('All Types');
  };

  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;
  const activeFilterCount = (statusFilter !== 'All Statuses' ? 1 : 0) + (typeFilter !== 'All Types' ? 1 : 0);
  const hasActiveFilters = searchTerm || activeFilterCount > 0;

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-6 md:space-y-8 pb-20 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Court Members & Registered Users
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Manage court membership status, process membership applications, and view registered player accounts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2",
              activeTab === 'users'
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <LayoutGrid className="w-4 h-4 text-yellow-500" /> All Registered Users
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 relative",
              activeTab === 'requests'
                ? "bg-yellow-400 text-slate-900 shadow-sm border border-yellow-500"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <ShieldIcon className="w-4 h-4 text-slate-900" /> Membership Applications
            {pendingRequestsCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🟢 TAB 1: ALL REGISTERED USERS MANAGEMENT                                */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <>
          {/* Mobile Search & Filter */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500 font-bold" />
                <Input
                  placeholder="Search Name, Phone..."
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

            {/* Expandable Mobile Filter Dropdown */}
            {isMobileFilterOpen && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Filter Users</span>
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

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">User Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-10 text-xs border-slate-200 bg-slate-50 rounded-xl">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Types">All Types</SelectItem>
                        <SelectItem value="Members">Court Members Only</SelectItem>
                        <SelectItem value="Non-Members">Regular Non-Members</SelectItem>
                        <SelectItem value="Registered Users">Registered Users</SelectItem>
                        <SelectItem value="Guest Users">Guest Users</SelectItem>
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
                        <SelectItem value="Active">Active Users</SelectItem>
                        <SelectItem value="Inactive">Inactive Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Filters Bar */}
          <div className="hidden md:flex bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-3 items-center">
            <div className="relative flex-[2] w-full min-w-0">
              <LayoutGrid className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold" />
              <Input
                placeholder="Search by Name, Mobile Number, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white border-slate-200 focus:border-yellow-600 w-full font-medium"
              />
            </div>

            <div className="relative w-52 shrink-0">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-12 border-slate-200">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Account Types</SelectItem>
                  <SelectItem value="Members">⚡ Court Members Only</SelectItem>
                  <SelectItem value="Non-Members">Regular Non-Members</SelectItem>
                  <SelectItem value="Registered Users">Registered Users</SelectItem>
                  <SelectItem value="Guest Users">Guest Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-44 shrink-0">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 border-slate-200">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Statuses">All Statuses</SelectItem>
                  <SelectItem value="Active">Active Users</SelectItem>
                  <SelectItem value="Inactive">Inactive Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users List - Mobile View */}
          <div className="block md:hidden">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {loadingUsers ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-xl w-full" />
                  ))}
                </div>
              ) : users.length > 0 ? (
                users.map((u) => {
                  const isActive = u.is_active !== false;
                  const isMember = u.is_member === true;

                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-slate-900 font-black flex items-center justify-center shrink-0 text-xs">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{u.name}</h4>
                            <span className={cn(
                              "text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider",
                              isMember
                                ? "bg-yellow-400 text-slate-900 border border-yellow-500 shadow-2xs"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            )}>
                              {isMember ? '⚡ Member' : 'Regular'}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 truncate">
                            USR-{u.id} • {u.phone || 'No phone'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs font-bold text-slate-400">
                  No registered users match your search criteria.
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              <div className="overflow-x-auto p-4 md:p-6 pb-0">
                {loadingUsers ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3, 4].map((n) => (
                      <Skeleton key={n} className="h-12 w-full rounded-xl" />
                    ))}
                  </div>
                ) : users.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 font-bold">
                    No users found matching filter criteria.
                  </div>
                ) : (
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-xs font-extrabold text-slate-600 bg-slate-50/80">
                      <tr>
                        <th className="px-6 py-4 rounded-l-lg">User Details</th>
                        <th className="px-6 py-4">User ID</th>
                        <th className="px-6 py-4">Court Membership</th>
                        <th className="px-6 py-4">Join Date</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right rounded-r-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => {
                        const isActive = u.is_active !== false;
                        const isMember = u.is_member === true;

                        return (
                          <tr
                            key={u.id}
                            onClick={() => setSelectedUser(u)}
                            className="hover:bg-yellow-400/5 transition-colors group cursor-pointer"
                          >
                            <td className="px-6 py-5">
                              <div>
                                <span className="font-extrabold text-[#0f172a] group-hover:text-yellow-600 transition-colors block">
                                  {u.name}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium block">
                                  {u.phone || u.email || 'No phone'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 font-extrabold text-slate-600">USR-{u.id}</td>
                            <td className="px-6 py-5">
                              <span className={cn(
                                "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs",
                                isMember
                                  ? "bg-yellow-400 text-slate-900 border border-yellow-500"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              )}>
                                <ShieldIcon className="w-3.5 h-3.5 text-slate-900" />
                                {isMember ? 'Court Member' : 'Regular User'}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-slate-500 font-medium">
                              {u.created_at ? format(new Date(u.created_at), 'dd MMM yyyy') : '-'}
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${isActive
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                {isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleMember(u)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border shadow-2xs",
                                    isMember
                                      ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border-yellow-300 font-extrabold"
                                      : "bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-yellow-500"
                                  )}
                                  title="Toggle Court Member status"
                                >
                                  {isMember ? 'Remove Member' : 'Make Member'}
                                </button>

                                <button
                                  onClick={() => setSelectedUser(u)}
                                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                                  title="View Full Details"
                                >
                                  <EyeIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 🟡 TAB 2: MEMBERSHIP APPLICATIONS / REQUESTS MANAGEMENT                   */}
      {/* ========================================================================= */}
      {activeTab === 'requests' && (
        <div className="space-y-6">

          {/* Requests Filter Bar */}

          {/* Mobile Search & Filter Button Row */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500 font-bold" />
                <Input
                  placeholder="Search Applicant Name, Phone..."
                  value={requestSearchTerm}
                  onChange={(e) => setRequestSearchTerm(e.target.value)}
                  className="pl-9 h-11 bg-white border-slate-200 focus:border-yellow-600 text-xs font-medium rounded-xl w-full"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsMobileRequestFilterOpen(!isMobileRequestFilterOpen)}
                className={cn(
                  "h-11 px-3.5 rounded-xl border flex items-center gap-1.5 text-xs font-extrabold transition-all cursor-pointer shrink-0",
                  requestStatusFilter !== 'All' || isMobileRequestFilterOpen
                    ? "bg-yellow-400 text-slate-900 border-yellow-400 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                )}
              >
                <FilterList className="w-4 h-4 text-yellow-500" />
                <span>Filter</span>
                {requestStatusFilter !== 'All' && (
                  <span className="w-4.5 h-4.5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-black">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Expandable Mobile Filter Dropdown */}
            {isMobileRequestFilterOpen && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Filter Requests</span>
                  {requestStatusFilter !== 'All' && (
                    <button
                      type="button"
                      onClick={() => {
                        setRequestStatusFilter('All');
                        setIsMobileRequestFilterOpen(false);
                      }}
                      className="text-[11px] font-extrabold text-red-600 hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Request Status</label>
                  <Select
                    value={requestStatusFilter}
                    onValueChange={(val) => {
                      setRequestStatusFilter(val);
                      setIsMobileRequestFilterOpen(false);
                    }}
                  >
                    <SelectTrigger className="h-10 text-xs border-slate-200 bg-slate-50 rounded-xl font-bold">
                      <SelectValue placeholder="All Requests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Requests</SelectItem>
                      <SelectItem value="Pending">Pending Requests</SelectItem>
                      <SelectItem value="Approved">Approved Requests</SelectItem>
                      <SelectItem value="Rejected">Rejected Requests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Desktop Request Search & Filter Pills */}
            <div className="hidden md:flex items-center justify-between gap-3 w-full">
              <div className="relative w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500 font-bold" />
                <Input
                  placeholder="Search Applicant Name, Phone..."
                  value={requestSearchTerm}
                  onChange={(e) => setRequestSearchTerm(e.target.value)}
                  className="pl-9 h-11 bg-white border-slate-200 focus:border-yellow-500 text-xs font-medium rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setRequestStatusFilter(status)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border",
                      requestStatusFilter === status
                        ? "bg-yellow-400 text-slate-900 border-yellow-500 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    {status} Requests
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Requests Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {loadingRequests ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-bold text-xs sm:text-sm">
                No membership requests found for this filter.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {requests.map((req) => {
                  const applicant = req.user;
                  const isPending = req.status === 'Pending';
                  const isApproved = req.status === 'Approved';
                  const isRejected = req.status === 'Rejected';

                  return (
                    <div key={req.id} className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">

                      {/* Left: Applicant Details */}
                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-yellow-400/20 text-slate-900 border border-yellow-400/30 font-black flex items-center justify-center shrink-0 text-xs shadow-2xs">
                              {applicant?.name ? applicant.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-black text-slate-900 text-sm sm:text-base truncate">
                                {applicant?.name || 'Applicant'}
                              </h3>
                              <p className="text-[11px] font-bold text-slate-500 truncate">
                                Phone: <strong className="text-slate-800">{applicant?.phone || '-'}</strong>
                              </p>
                            </div>
                          </div>

                          <span className={cn(
                            "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border shadow-2xs shrink-0",
                            isPending && "bg-yellow-400 text-slate-900 border-yellow-500 animate-pulse",
                            isApproved && "bg-emerald-100 text-emerald-800 border-emerald-300",
                            isRejected && "bg-rose-100 text-rose-800 border-rose-300"
                          )}>
                            {req.status}
                          </span>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span>Submitted: <strong className="text-slate-800">{req.created_at ? format(new Date(req.created_at), 'dd MMM yyyy, hh:mm a') : '-'}</strong></span>
                          {applicant?.email && (
                            <>
                              <span>•</span>
                              <span>Email: <strong className="text-slate-800">{applicant.email}</strong></span>
                            </>
                          )}
                        </div>

                        {/* Request Notes if any */}
                        {req.notes && (
                          <div className="p-3 bg-yellow-50/70 border border-yellow-200 rounded-xl text-xs text-slate-900 font-medium max-w-xl">
                            <strong>Note:</strong> {req.notes}
                          </div>
                        )}

                        {/* Rejection Reason if any */}
                        {isRejected && req.rejection_reason && (
                          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-medium max-w-xl">
                            <strong>Rejection Reason:</strong> {req.rejection_reason}
                          </div>
                        )}
                      </div>

                      {/* Right/Bottom: Payment Proof Link & Admin Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0 w-full md:w-auto justify-end">

                        {/* Payment Proof Button */}
                        {req.payment_proof_path ? (
                          <button
                            type="button"
                            onClick={() => setSelectedProofRequest(req)}
                            className="flex-1 md:flex-initial px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 border border-yellow-500 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <AttachFileIcon className="w-4 h-4 text-slate-900" /> View Proof
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-center flex-1 md:flex-initial">
                            No Proof Attached
                          </span>
                        )}

                        {/* Action Buttons for Pending Requests */}
                        {isPending && (
                          <div className="flex items-center gap-2 flex-1 md:flex-initial">
                            <button
                              type="button"
                              onClick={() => setApproveRequestObj(req)}
                              className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <CheckCircleIcon className="w-4 h-4" /> Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRejectRequestObj(req);
                                setRejectionReason('');
                              }}
                              className="flex-1 md:flex-initial px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <CancelIcon className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Details Drawer Modal */}
      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        onToggleStatus={handleToggleStatus}
        onToggleMember={handleToggleMember}
      />

      {/* Payment Proof Previewer Modal */}
      <PaymentProofViewerModal
        isOpen={!!selectedProofRequest}
        onClose={() => setSelectedProofRequest(null)}
        requestId={selectedProofRequest?.id || null}
        proofPath={selectedProofRequest?.payment_proof_path}
        userName={selectedProofRequest?.user?.name}
      />

      {/* Confirmation Dialog: Toggle Court Member Status */}
      <Dialog open={!!confirmMemberUser} onOpenChange={() => setConfirmMemberUser(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-black text-[#0f172a]">
              {confirmMemberUser?.is_member ? 'Remove Court Membership?' : 'Confirm Court Membership?'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1 font-medium">
              {confirmMemberUser?.is_member
                ? `Are you sure you want to remove Court Member privileges for ${confirmMemberUser?.name}? They will no longer be able to book Peak Hour slots.`
                : `Are you sure you want to promote ${confirmMemberUser?.name} to a Badminton Court Member? They will be granted full access to Peak Hour slots.`}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setConfirmMemberUser(null)}
              disabled={isActionProcessing}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={executeToggleMember}
              disabled={isActionProcessing}
              className={cn(
                "px-5 py-2 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border",
                confirmMemberUser?.is_member
                  ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-700"
                  : "bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-yellow-500"
              )}
            >
              {isActionProcessing ? 'Processing...' : (confirmMemberUser?.is_member ? 'Yes, Remove Member' : 'Yes, Make Member')}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog: Approve Membership Request */}
      <Dialog open={!!approveRequestObj} onOpenChange={() => setApproveRequestObj(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-black text-[#0f172a]">
              Approve Membership Request?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1 font-medium">
              Approving this request will immediately activate Court Membership status for <strong>{approveRequestObj?.user?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setApproveRequestObj(null)}
              disabled={isActionProcessing}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={executeApproveRequest}
              disabled={isActionProcessing}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isActionProcessing ? 'Approving...' : 'Confirm & Approve'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal: Reject Membership Request with Reason */}
      <Dialog open={!!rejectRequestObj} onOpenChange={() => setRejectRequestObj(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-black text-rose-950">
              Reject Membership Request
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1 font-medium">
              Please enter an optional reason for rejecting <strong>{rejectRequestObj?.user?.name}</strong>'s request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
              Rejection Reason
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Payment receipt invalid or unverified amount..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 focus:border-rose-400 rounded-2xl text-slate-800 font-medium focus:outline-none resize-none"
            />
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setRejectRequestObj(null)}
              disabled={isActionProcessing}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={executeRejectRequest}
              disabled={isActionProcessing}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isActionProcessing ? 'Rejecting...' : 'Reject Request'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
