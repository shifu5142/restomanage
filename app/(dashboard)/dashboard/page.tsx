"use client";

import { useEffect, useMemo, useState } from "react";
import { RolePage } from "@/components/auth/role-page";
import { AdminDashboardView } from "@/components/dashboard/admin-dashboard-view";
import { CustomerDashboard } from "@/components/customer/customer-dashboard";
import { PageLoading } from "@/components/ui/page-loading";
import { groupedOrdersToAdminOrders } from "@/lib/orders/admin";
import { groupOrderRows, type GroupedOrder } from "@/lib/orders/grouped";
import { normalizeReservationRows } from "@/lib/reservations/normalize";
import { supabase } from "@/lib/supabase/client";
import type { Reservation } from "@/types";

function DashboardPage() {
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const adminOrders = useMemo(
    () => groupedOrdersToAdminOrders(groupedOrders),
    [groupedOrders]
  );
  const adminReservations = useMemo(
    () => normalizeReservationRows(reservations),
    [reservations]
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const [ordersResult, reservationsResult] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("reservations").select("*"),
      ]);

      if (ordersResult.error) {
        console.error(ordersResult.error);
      } else {
        setGroupedOrders(groupOrderRows(ordersResult.data ?? []));
      }

      if (reservationsResult.error) {
        console.error(reservationsResult.error);
      } else {
        setReservations(reservationsResult.data ?? []);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <PageLoading message="Loading dashboard..." />;
  }

  return (
    <RolePage
      admin={<AdminDashboardView orders={adminOrders} reservations={adminReservations} />}
      customer={<CustomerDashboard />}
    />
  );
}
export default DashboardPage;
