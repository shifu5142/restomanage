"use client";

import { useMemo, useState, useEffect } from "react";
import { RolePage } from "@/components/auth/role-page";
import { CustomerOrders } from "@/components/customer/customer-orders";
import OrdersView from "@/components/orders/orders-view";
import { PageLoading } from "@/components/ui/page-loading";
import { supabase } from "@/lib/supabase/client";
import type { GroupedOrder } from "@/lib/orders/grouped";
import { groupOrderRows } from "@/lib/orders/grouped";
import { groupedOrdersToAdminOrders } from "@/lib/orders/admin";

function OrdersPage() {
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const adminOrders = useMemo(
    () => groupedOrdersToAdminOrders(groupedOrders),
    [groupedOrders]
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const grouped = groupOrderRows(data);
      setGroupedOrders(grouped);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <PageLoading message="Loading your orders..." />;
  }

  return (
    <RolePage
      admin={<OrdersView orders={adminOrders} />}
      customer={<CustomerOrders groupedOrders={groupedOrders} />}
    />
  );
}
export default OrdersPage;
