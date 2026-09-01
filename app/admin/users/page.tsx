"use client";

import React, { useState, useEffect } from 'react';
import LayoutGrid from '@mui/icons-material/GridView';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (statusFilter !== 'All Statuses') params.status = statusFilter;

      const response = await api.get('/admin/users', { params });
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to load registered users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Real-time live search & filter
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const handleToggleStatus = async (user: any) => {
    try {
      const res = await api.post(`/admin/users/${user.id}/toggle-status`);
      toast.success(res.data.message || 'Status updated');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All Statuses');
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full space-y-8 pb-20 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight mb-1">
            Registered Users Management
          </h1>
          <p className="text-slate-500 text-sm">
            View, search, and manage all registered members of KEYS Club.
          </p>
        </div>

        {(searchTerm || statusFilter !== 'All Statuses') && (
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
            placeholder="Search by Name, Mobile Number, or Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 focus:border-yellow-400 w-full font-medium"
          />
        </div>

        <div className="relative w-full md:w-64">
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div className="overflow-x-auto p-4 md:p-6 pb-0">
          {loading ? (
            <div className="py-16 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-bold">
              {searchTerm || statusFilter !== 'All Statuses' ? 'No users match your search criteria.' : 'No registered users found.'}
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs font-extrabold text-slate-600 bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 rounded-l-lg">User ID</th>
                  <th className="px-6 py-4">Name & Email</th>
                  <th className="px-6 py-4">Mobile Number</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const isActive = user.is_active !== false;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5 font-extrabold text-[#0f172a]">USR-{user.id}</td>
                      <td className="px-6 py-5">
                        <p className="font-extrabold text-[#0f172a]">{user.name}</p>
                        <p className="text-slate-400 text-xs mt-0.5 font-medium">{user.email || 'No email'}</p>
                      </td>
                      <td className="px-6 py-5 text-slate-500 font-medium">{user.phone || '-'}</td>
                      <td className="px-6 py-5 text-slate-500 font-medium">{user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy') : '-'}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`font-extrabold text-[11px] px-3 py-1.5 rounded-md ${
                          isActive ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-red-700 bg-red-50 border border-red-200'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-colors cursor-pointer border ${
                            isActive 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' 
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200'
                          }`}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="mt-4 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-xs font-bold">
              Showing {users.length} registered user{users.length !== 1 && 's'}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
