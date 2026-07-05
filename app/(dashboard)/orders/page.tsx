"use client";

import { useState, useEffect } from "react";
import { RolePage } from "@/components/auth/role-page";
import { CustomerOrders } from "@/components/customer/customer-orders";
import OrdersView from "@/components/orders/orders-view";
import { PageLoading } from "@/components/ui/page-loading";
import { supabase } from "@/lib/supabase/client";
import type { GroupedOrder } from "@/lib/orders/grouped";
import { groupOrderRows } from "@/lib/orders/grouped";

function OrdersPage() {
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.log(data);
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
      admin={<OrdersView />}
      customer={<CustomerOrders groupedOrders={groupedOrders} />}
    />
  );
}
export default OrdersPage;
