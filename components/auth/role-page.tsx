"use client";

import { useRole } from "@/hooks/use-role";
import { PageSkeleton } from "@/components/ui/page-skeleton";

interface RolePageProps {
  admin: React.ReactNode;
  customer: React.ReactNode;
}

export function RolePage({ admin, customer }: RolePageProps) {
  const { isAdmin, loading } = useRole();

  if (loading) {
    return <PageSkeleton />;
  }

  return <>{isAdmin ? admin : customer}</>;
}
