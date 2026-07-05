"use client";

import dynamic from "next/dynamic";
import { MapPin, Navigation, Package, Truck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatRelative } from "@/lib/format";
import type { DeliveryOrder } from "@/types";

const DeliveryMap = dynamic(
  () => import("@/components/delivery/delivery-map").then((mod) => mod.DeliveryMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-2xl border border-white/10 bg-background/40 text-sm text-muted-foreground">
        Loading map...
      </div>
    ),
  }
);

interface DeliveryViewProps {
  deliveries: DeliveryOrder[];
}

export function DeliveryView({ deliveries }: DeliveryViewProps) {
  const stats = {
    pending: deliveries.filter((d) => d.status === "pending").length,
    inTransit: deliveries.filter((d) => d.status === "in_transit" || d.status === "picked_up").length,
    delivered: deliveries.filter((d) => d.status === "delivered").length,
  };

  const drivers = deliveries
    .filter((d) => d.driverName)
    .reduce((map, d) => {
      if (d.driverName && !map.has(d.driverName)) {
        map.set(d.driverName, d);
      }
      return map;
    }, new Map<string, DeliveryOrder>());

  return (
    <div className="space-y-6">
      <PageHeader title="Delivery" description="Track deliveries, drivers, and routes in real time." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Pending Pickups" value={String(stats.pending)} icon={Package} />
        <StatCard title="In Transit" value={String(stats.inTransit)} icon={Truck} />
        <StatCard title="Delivered Today" value={String(stats.delivered)} icon={Navigation} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-orange-500" />
              Delivery Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <DeliveryMap deliveries={deliveries} />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-green-500" />
                Restaurant
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-orange-500" />
                Pending
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-blue-500" />
                Picked up
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-violet-500" />
                In transit
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-emerald-500" />
                Delivered
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Active Drivers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from(drivers.values()).slice(0, 6).map((d) => (
              <div key={d.driverName} className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
                <Avatar>
                  <AvatarFallback>{d.driverName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{d.driverName}</p>
                  <p className="text-xs text-muted-foreground">{d.vehicle}</p>
                </div>
                <StatusBadge status={d.status === "in_transit" ? "preparing" : d.status === "delivered" ? "completed" : "pending"} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {deliveries.slice(0, 12).map((d) => (
              <div key={d.id} className="rounded-xl border border-white/10 bg-background/40 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{d.customerName}</p>
                    <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
                      <MapPin className="mt-0.5 size-3 shrink-0" />
                      {d.address}
                    </p>
                  </div>
                  <StatusBadge status={d.status === "picked_up" ? "preparing" : d.status === "in_transit" ? "ready" : d.status === "delivered" ? "completed" : "pending"} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{formatRelative(d.createdAt)}</span>
                  <span className="font-medium">{formatCurrency(d.total)}</span>
                </div>
                {d.estimatedTime && (
                  <p className="mt-1 text-xs text-orange-500">ETA: {d.estimatedTime} min</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
