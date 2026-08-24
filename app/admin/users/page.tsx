"use client";

import React, { useState, useEffect } from 'react';
import LayoutGrid from '@mui/icons-material/GridView';
import MoreVertical from '@mui/icons-material/MoreVert';
import { Input } from '@/components/ui/input';
import api from '@/lib/axios';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 md:p-10 w-full space-y-8 pb-20 min-h-screen">
      


      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        
        <div className="relative flex-1 w-full">
          <LayoutGrid className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search Name, Mobile or Email..." 
            className="pl-12 h-12 bg-white border-slate-200 focus:border-blue-500 w-full font-medium"
          />
        </div>

        <div className="relative w-full md:w-64">
          <select className="h-12 w-full appearance-none bg-white border border-slate-200 rounded-md pl-4 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </div>
        </div>

        <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm h-12 px-8 rounded-md transition-colors w-full md:w-auto shrink-0 shadow-md">
          Search Users
        </button>
        
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div className="overflow-x-auto p-4 md:p-6 pb-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-extrabold text-slate-600 bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 rounded-l-lg">User ID</th>
                <th className="px-6 py-4">Name & Email</th>
                <th className="px-6 py-4">Mobile Number</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-4 py-4 rounded-r-lg"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, i) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 font-extrabold text-[#0f172a]">USR-{user.id}</td>
                  <td className="px-6 py-5">
                    <p className="font-extrabold text-[#0f172a]">{user.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5 font-medium">{user.email}</p>
                  </td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{user.phone || '-'}</td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy') : '-'}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[#10b981] bg-emerald-50 font-extrabold text-[11px] px-3 py-1.5 rounded-md">Active</span>
                  </td>
                  <td className="px-4 py-5 w-16">
                    <div className="flex justify-center">
                      <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-xs font-bold">
            Showing {users.length} registered users
          </div>
          
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-md shadow-sm">
              1
            </button>
            <button className="px-3 py-1.5 border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors">
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
