"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, Role } from '@/store/authStore';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Role[];
}) {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.push('/login');
    } else if (!allowedRoles.includes(user.role)) {
      if (user.role === 'Super Admin' || user.role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setIsAuthorized(true);
    }
  }, [user, isHydrated, router, allowedRoles]);

  if (!isHydrated || !isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
