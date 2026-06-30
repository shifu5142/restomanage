"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/hooks/use-role";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin, loading } = useRole();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || isAdmin || pathname === "/dashboard" || redirected.current) {
      return;
    }

    redirected.current = true;
    router.replace("/dashboard");
  }, [loading, isAdmin, pathname, router]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
