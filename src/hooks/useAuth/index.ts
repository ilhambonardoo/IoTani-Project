"use client";

import { useSession } from "next-auth/react";
import type { ExtendedSessionUser } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();
  const user = session?.user as ExtendedSessionUser | undefined;
  
  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    email: user?.email,
    fullName: user?.fullName,
    role: user?.role,
    session,
  };
}

