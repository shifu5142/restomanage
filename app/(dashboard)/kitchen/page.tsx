"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { KitchenBoard } from "@/components/kitchen/kitchen-board";
import { PageLoading } from "@/components/ui/page-loading";
import { groupedOrdersToAdminOrders } from "@/lib/orders/admin";
import { groupOrderRows, type GroupedOrder } from "@/lib/orders/grouped";
import { supabase } from "@/lib/supabase/client";

function KitchenPage() {
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const orders = useMemo(
    () => groupedOrdersToAdminOrders(groupedOrders),
    [groupedOrders]
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      const { data, error } = await supabase.from("orders").select("*");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setGroupedOrders(groupOrderRows(data));
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <PageLoading message="Loading kitchen orders..." />;
  }

  return (
    <AdminRouteGuard>
      <KitchenBoard orders={orders} />
    </AdminRouteGuard>
  );
}
export default KitchenPage;
