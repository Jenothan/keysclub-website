"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";

export default function AuthInitializer() {
  const { token, logout, setUser, setHydrated } = useAuthStore();
  const checkedRef = useRef(false);

  useEffect(() => {
    setHydrated(true);

    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    if (activeToken && !checkedRef.current) {
      checkedRef.current = true;
      api.get('/user')
        .then((res) => {
          if (res.data) {
            setUser(res.data);
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            logout();
          }
        });
    }
  }, [token, logout, setUser, setHydrated]);

  return null;
}
