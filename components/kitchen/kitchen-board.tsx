"use client";

import { useEffect, useState } from "react";
import { ChefHat, Clock, Flame } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { Order } from "@/types";

interface KitchenBoardProps {
  orders: Order[];
}

function OrderTimer({ prepTime, createdAt }: { prepTime: number; createdAt: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(createdAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000 / 60));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [createdAt]);

  const remaining = Math.max(0, prepTime - elapsed);
  const isOverdue = elapsed > prepTime;

  return (
    <div className={`flex items-center gap-2 text-lg font-mono font-bold ${isOverdue ? "text-red-500" : "text-orange-500"}`}>
      <Clock className="size-5" />
      {isOverdue ? `+${elapsed - prepTime}m` : `${remaining}m`}
    </div>
  );
}

export function KitchenBoard({ orders }: KitchenBoardProps) {
  const activeOrders = orders.filter(
    (o) => o.kitchenStatus !== "completed" && o.status !== "cancelled"
  );

  const stats = {
    waiting: activeOrders.filter((o) => o.kitchenStatus === "waiting").length,
    preparing: activeOrders.filter((o) => o.kitchenStatus === "preparing").length,
    ready: activeOrders.filter((o) => o.kitchenStatus === "ready").length,
  };

  const columns: { key: string; label: string; orders: Order[] }[] = [
    { key: "waiting", label: "Waiting", orders: activeOrders.filter((o) => o.kitchenStatus === "waiting") },
    { key: "preparing", label: "Preparing", orders: activeOrders.filter((o) => o.kitchenStatus === "preparing") },
    { key: "ready", label: "Ready", orders: activeOrders.filter((o) => o.kitchenStatus === "ready") },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Kitchen Display" description="Real-time order tracking for the kitchen team." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Waiting" value={String(stats.waiting)} icon={Clock} />
        <StatCard title="Preparing" value={String(stats.preparing)} icon={Flame} />
        <StatCard title="Ready" value={String(stats.ready)} icon={ChefHat} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => (
          <div key={col.key} className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <StatusBadge status={col.key === "waiting" ? "pending" : col.key} />
              {col.label}
              <span className="text-sm text-muted-foreground">({col.orders.length})</span>
            </h2>
            <div className="space-y-3">
              {col.orders.slice(0, 8).map((order) => (
                <Card
                  key={order.id}
                  className={`border-white/10 bg-card/60 backdrop-blur-xl ${
                    col.key === "ready" ? "border-emerald-500/30" : col.key === "preparing" ? "border-orange-500/30" : ""
                  }`}
                >
                  <CardContent className="space-y-3 pt-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xl font-bold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.tableId ? `Table ${order.tableId.replace("table-", "")}` : order.customerName}
                        </p>
                      </div>
                      <OrderTimer prepTime={order.prepTime} createdAt={order.createdAt} />
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                          <span className="text-muted-foreground">{formatCurrency(item.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-2">
                      <StatusBadge status={order.kitchenStatus} />
                      <span className="font-semibold">{formatCurrency(order.total)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
