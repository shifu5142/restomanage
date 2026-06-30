"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/hooks/use-role";
import { isAdminOnlyRoute } from "@/lib/auth/roles";

export function RouteRoleGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, loading } = useRole();
  const lastRedirect = useRef<string | null>(null);

  useEffect(() => {
    if (loading || isAdmin || !isAdminOnlyRoute(pathname) || pathname === "/dashboard") {
      return;
    }

    if (lastRedirect.current === pathname) {
      return;
    }

    lastRedirect.current = pathname;
    router.replace("/dashboard");
  }, [pathname, isAdmin, loading, router]);

  return null;
}
