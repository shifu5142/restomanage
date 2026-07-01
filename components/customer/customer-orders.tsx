"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Package, Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { PageLoading } from "@/components/ui/page-loading";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/use-user";
import { formatCurrency } from "@/lib/format";
import {
  flattenOrderItems,
  getOrderSubtotal,
  shortOrderId,
  type GroupedOrder,
} from "@/lib/orders/grouped";

type CustomerOrdersProps = {
  groupedOrders: GroupedOrder[];
};

export function CustomerOrders({ groupedOrders }: CustomerOrdersProps) {
  const router = useRouter();
  const { user, loading } = useUser();

  const myOrders = useMemo(() => {
    if (!user?.id) return [];
    return groupedOrders.filter((order) => order.user_id === user.id);
  }, [groupedOrders, user?.id]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        description="Track your order history and delivery progress."
      />

      {loading ? (
        <PageLoading message="Loading your orders..." fullHeight={false} />
      ) : myOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders yet. Browse our menu and order your first dish!"
          actionLabel="Browse Menu"
          onAction={() => router.push("/menu")}
        />
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => {
            const lineItems = flattenOrderItems(order.items);
            const orderTotal = getOrderSubtotal(order);

            return (
              <Link
                key={order.order_id}
                href={`/orders/${order.order_id}`}
                className="block"
              >
                <Card className="border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/30 hover:bg-card/80 hover:shadow-lg hover:shadow-orange-500/5">
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Receipt className="size-4 text-orange-500" />
                          <h3 className="font-semibold">
                            Order #{shortOrderId(order.order_id)}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {lineItems.length} item{lineItems.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-500">
                            {formatCurrency(orderTotal)}
                          </p>
                        </div>
                        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {lineItems.slice(0, 3).map((item) => (
                        <div
                          key={`${order.order_id}-${item.menuItemId}`}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.quantity}× {item.name}
                          </span>
                          <span className="text-muted-foreground">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      {lineItems.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{lineItems.length - 3} more item
                          {lineItems.length - 3 === 1 ? "" : "s"}
                        </p>
                      )}
                    </div>

                    <Separator className="bg-white/10" />

                    <p className="text-xs text-orange-500">View order details</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
