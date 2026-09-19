"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, Role, TWENTY_FOUR_HOURS_MS } from '@/store/authStore';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Role[];
}) {
  const router = useRouter();
  const { user, token, loggedInAt, isHydrated, logout } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user || token) {
      useAuthStore.setState({ isHydrated: true });
    }
  }, [user, token]);

  const allowedRolesKey = allowedRoles.join(',');

  useEffect(() => {
    if (!mounted) return;

    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    // 1. Check if user/token exists
    if (!activeToken || !user) {
      if (isHydrated) {
        setIsAuthorized(false);
        router.replace('/login');
      }
      return;
    }

    // 2. Check 24-hour expiration
    if (loggedInAt && (Date.now() - loggedInAt > TWENTY_FOUR_HOURS_MS)) {
      logout();
      setIsAuthorized(false);
      router.replace('/login');
      return;
    }

    // 3. Block guest users (is_guest === true) from accessing user dashboard
    if (user.is_guest) {
      logout();
      setIsAuthorized(false);
      router.replace('/availability');
      return;
    }

    // 4. Case-insensitive role check
    const userRoleLower = user.role ? String(user.role).toLowerCase() : 'user';
    const hasAccess = allowedRoles.length === 0 || allowedRoles.some(
      r => r && String(r).toLowerCase() === userRoleLower
    );

    if (!hasAccess) {
      setIsAuthorized(false);
      const isAdmin = userRoleLower === 'admin' || userRoleLower === 'super admin';
      if (isAdmin) {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    } else {
      setIsAuthorized(true);
    }
  }, [user, token, loggedInAt, isHydrated, mounted, router, allowedRolesKey]);

  if (!mounted || !isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
