"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Package } from "lucide-react";
import { CustomerOrderDetail } from "@/components/customer/customer-order-detail";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/page-loading";
import { useUser } from "@/hooks/use-user";
import { groupOrderRows, type GroupedOrder } from "@/lib/orders/grouped";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { user, loading: userLoading } = useUser();
  const [order, setOrder] = useState<GroupedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", orderId);

      if (error) {
        console.error(error);
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!data?.length) {
        setNotFound(true);
        setOrder(null);
      } else {
        const grouped = groupOrderRows(data);
        setOrder(grouped[0] ?? null);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (userLoading || loading) {
    return (
      <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
        <CardContent className="py-16 text-center text-muted-foreground">
          Loading order details...
        </CardContent>
      </Card>
    );
  }

  if (notFound || !order) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={Package}
          title="Order not found"
          description="This order doesn't exist or you don't have access to it."
        />
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (user?.id && order.user_id !== user.id) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={Package}
          title="Order not found"
          description="This order doesn't exist or you don't have access to it."
        />
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <CustomerOrderDetail order={order} />;
}

export default OrderDetailPage;
