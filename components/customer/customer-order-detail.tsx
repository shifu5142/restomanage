"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChefHat,
  Hash,
  Receipt,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";
import {
  flattenOrderItems,
  getOrderSubtotal,
  shortOrderId,
  type GroupedOrder,
} from "@/lib/orders/grouped";

type CustomerOrderDetailProps = {
  order: GroupedOrder;
};

export function CustomerOrderDetail({ order }: CustomerOrderDetailProps) {
  const lineItems = flattenOrderItems(order.items);
  const orderTotal = getOrderSubtotal(order);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground hover:text-foreground"
      >
        <Link href="/orders">
          <ArrowLeft className="mr-2 size-4" />
          Back to orders
        </Link>
      </Button>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card/90 via-card/70 to-orange-500/10 p-6 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-orange-500">
              <Receipt className="size-4" />
              Order details
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Order #{shortOrderId(order.order_id)}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {lineItems.length} item{lineItems.length === 1 ? "" : "s"} in this order
            </p>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-5 py-3 text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total paid
            </p>
            <p className="text-3xl font-bold text-orange-500">
              {formatCurrency(orderTotal)}
            </p>
          </div>
        </div>
      </div>

      <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="size-4 text-orange-500" />
            Items ordered
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lineItems.map((item) => (
            <div
              key={`${order.order_id}-${item.menuItemId}`}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-background/40 p-4"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
                <ChefHat className="size-5 text-orange-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.price)} each · Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 font-bold text-orange-500">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {lineItems.map((item) => (
              <div
                key={`summary-${item.menuItemId}`}
                className="flex justify-between gap-3"
              >
                <span className="truncate text-muted-foreground">
                  {item.quantity}× {item.name}
                </span>
                <span className="shrink-0 font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <Separator className="bg-white/10" />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-orange-500">{formatCurrency(orderTotal)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Hash className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Order ID
                </p>
                <p className="mt-0.5 break-all font-mono text-xs">{order.order_id}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Customer ID
                </p>
                <p className="mt-0.5 break-all font-mono text-xs">{order.user_id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
