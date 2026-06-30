"use client";

import { useUser } from "@/hooks/use-user";
import { getUserRole, isAdminEmail, type UserRole } from "@/lib/auth/roles";

export function useRole() {
  const { user, display, loading } = useUser();
  const email = user?.email ?? null;
  const isAdmin = isAdminEmail(email);
  const role: UserRole = getUserRole(email);

  return {
    user,
    display,
    loading,
    email,
    isAdmin,
    isCustomer: !loading && !isAdmin,
    role,
  };
}
