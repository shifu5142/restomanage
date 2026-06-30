"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ClipboardList, Package } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { mockData } from "@/data/mock";
import { useRole } from "@/hooks/use-role";
import { formatCurrency, formatDate, formatRelative } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";

const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
];

function getStepIndex(status: OrderStatus): number {
  if (status === "cancelled") return -1;
  const idx = ORDER_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

function getProgressValue(status: OrderStatus): number {
  if (status === "cancelled") return 0;
  const idx = getStepIndex(status);
  return ((idx + 1) / ORDER_STEPS.length) * 100;
}

function getEstimatedDelivery(order: Order): string {
  const minutes = order.prepTime + (order.tableId ? 5 : 25);
  return `~${minutes} min`;
}

function matchesCustomer(order: Order, displayName: string, emailPrefix: string): boolean {
  const name = order.customerName.toLowerCase();
  return (
    name === displayName.toLowerCase() ||
    (emailPrefix.length > 0 && name.toLowerCase().includes(emailPrefix.toLowerCase()))
  );
}

export function CustomerOrders() {
  const router = useRouter();
  const { display, email, loading } = useRole();

  const displayName = display?.name ?? "";
  const emailPrefix = email?.split("@")[0] ?? "";

  const myOrders = useMemo(() => {
    if (loading) return [];
    return mockData.orders
      .filter((o) => matchesCustomer(o, displayName, emailPrefix))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [displayName, emailPrefix, loading]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        description="Track your order history and delivery progress."
      />

      {loading ? (
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardContent className="py-12 text-center text-muted-foreground">Loading your orders...</CardContent>
        </Card>
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
            const currentStep = getStepIndex(order.status);
            const isCancelled = order.status === "cancelled";

            return (
              <Card
                key={order.id}
                className="border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/20"
              >
                <CardContent className="space-y-4 pt-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{order.id}</h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(order.createdAt.split("T")[0])} · {formatRelative(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-500">{formatCurrency(order.total)}</p>
                      {!isCancelled && (
                        <p className="text-xs text-muted-foreground">
                          Est. delivery: {getEstimatedDelivery(order)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}× {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/10" />

                  {!isCancelled && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ClipboardList className="size-3.5" />
                          Order progress
                        </span>
                        <span>{Math.round(getProgressValue(order.status))}%</span>
                      </div>
                      <Progress value={getProgressValue(order.status)} className="h-2 bg-white/10" />
                      <div className="flex flex-wrap gap-2">
                        {ORDER_STEPS.map((step, i) => {
                          const done = i <= currentStep;
                          return (
                            <div
                              key={step.key}
                              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                                done
                                  ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                                  : "bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              {done && <Check className="size-3" />}
                              {step.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
