"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface CurrentUser {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export function useCurrentUser() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) setUser(j.data);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return { user, loading: user === undefined, logout };
}
