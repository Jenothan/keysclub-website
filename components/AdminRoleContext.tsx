"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'Admin' | 'Super Admin';

interface AdminRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(undefined);

export function AdminRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Admin'); // Safe default

  useEffect(() => {
    const savedRole = localStorage.getItem('adminRole') as Role;
    if (savedRole === 'Super Admin' || savedRole === 'Admin') {
      setRole(savedRole);
    }
  }, []);

  return (
    <AdminRoleContext.Provider value={{ role, setRole }}>
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole() {
  const context = useContext(AdminRoleContext);
  if (context === undefined) {
    throw new Error('useAdminRole must be used within an AdminRoleProvider');
  }
  return context;
}
