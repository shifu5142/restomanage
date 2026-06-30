"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChefHat,
  Minus,
  Plus,
  Receipt,
  ShoppingCart,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useRole } from "@/hooks/use-role";
import {
  RESERVATION_BASE_FEE,
  RESERVATION_PER_GUEST_FEE,
} from "@/lib/reservations/pricing";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import type { MenuCartItem, ReservationCartItem } from "@/lib/cart/types";

function ReservationCartRow({
  item,
  onRemove,
}: {
  item: ReservationCartItem;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-background/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
            <CalendarDays className="size-5 text-orange-500" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold">{formatDate(item.date)}</p>
            <p className="text-sm text-muted-foreground">
              {formatTime(item.time)} · Party of {item.partySize}
            </p>
            {item.notes && (
              <p className="mt-1 text-xs text-muted-foreground">{item.notes}</p>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="mt-3 space-y-1 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Table deposit</span>
          <span>{formatCurrency(item.baseFee)}</span>
        </div>
        <div className="flex justify-between">
          <span>Guest fee (×{item.partySize})</span>
          <span>{formatCurrency(item.guestFee)}</span>
        </div>
        <div className="flex justify-between font-semibold text-foreground">
          <span>Subtotal</span>
          <span className="text-orange-500">{formatCurrency(item.total)}</span>
        </div>
      </div>
    </div>
  );
}

function MenuCartRow({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: MenuCartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="rounded-xl border border-white/10 bg-background/40 p-4">
      <div className="flex items-start gap-3">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="size-16 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
            <ChefHat className="size-6 text-orange-500" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(item.price)} each
              </p>
            </div>
            <p className="shrink-0 font-bold text-orange-500">
              {formatCurrency(lineTotal)}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-background/60 p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => onUpdateQuantity(item.quantity - 1)}
              >
                <Minus className="size-3.5" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => onUpdateQuantity(item.quantity + 1)}
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="mr-1.5 size-3.5" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerCart() {
  const router = useRouter();
  const { display, email } = useRole();
  const {
    reservationItems,
    menuItems,
    itemCount,
    reservationTotal,
    menuTotal,
    grandTotal,
    removeItem,
    updateMenuQuantity,
    clearCart,
    confirmReservations,
    confirmMenuOrder,
  } = useCart();

  const isEmpty = itemCount === 0;

  function handleConfirmReservations() {
    if (reservationItems.length === 0) {
      toast.error("No reservations in your cart.");
      return;
    }

    const total = reservationTotal;
    const count = reservationItems.length;
    confirmReservations({
      name: display?.name ?? "Guest",
      email: email ?? "",
    });

    toast.success(
      count === 1 ? "Reservation confirmed!" : `${count} reservations confirmed!`,
      { description: `Total charged: ${formatCurrency(total)}` }
    );
    router.push("/reservations");
  }

  function handleConfirmMenuOrder() {
    if (menuItems.length === 0) {
      toast.error("No menu items in your cart.");
      return;
    }

    const total = menuTotal;
    confirmMenuOrder({
      name: display?.name ?? "Guest",
      email: email ?? "",
    });

    toast.success("Order placed!", {
      description: `Total: ${formatCurrency(total)}. Track it on your orders page.`,
    });
    router.push("/orders");
  }

  function handleClearCart() {
    clearCart();
    toast.message("Cart cleared");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Cart"
        description="Review all reservations and menu items before checkout."
      >
        {!isEmpty && (
          <Button variant="outline" size="sm" onClick={handleClearCart}>
            Clear Cart
          </Button>
        )}
      </PageHeader>

      {isEmpty ? (
        <div className="space-y-4">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add table reservations or menu dishes to get started."
          />
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/reservations">Book a Table</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {reservationItems.length > 0 && (
              <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-orange-500" />
                      Reservations ({reservationItems.length})
                    </span>
                    <span className="text-sm font-bold text-orange-500">
                      {formatCurrency(reservationTotal)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reservationItems.map((item) => (
                    <ReservationCartRow
                      key={item.cartId}
                      item={item}
                      onRemove={() => removeItem(item.cartId)}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {menuItems.length > 0 && (
              <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <ChefHat className="size-4 text-orange-500" />
                      Menu Items ({menuItems.reduce((n, i) => n + i.quantity, 0)})
                    </span>
                    <span className="text-sm font-bold text-orange-500">
                      {formatCurrency(menuTotal)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {menuItems.map((item) => (
                    <MenuCartRow
                      key={item.cartId}
                      item={item}
                      onRemove={() => removeItem(item.cartId)}
                      onUpdateQuantity={(qty) => updateMenuQuantity(item.cartId, qty)}
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20 border-white/10 bg-gradient-to-br from-card/90 to-orange-500/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Receipt className="size-5 text-orange-500" />
                  Cart Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reservationItems.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Reservations
                    </p>
                    {reservationItems.map((item) => (
                      <div key={item.cartId} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate pr-2">
                            {formatDate(item.date)} · {formatTime(item.time)}
                          </span>
                          <span className="shrink-0 font-medium">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                        <div className="space-y-0.5 text-[11px] text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Deposit</span>
                            <span>{formatCurrency(item.baseFee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Guests (×{item.partySize})</span>
                            <span>{formatCurrency(item.guestFee)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {reservationItems.length > 0 && menuItems.length > 0 && (
                  <Separator className="bg-white/10" />
                )}

                {menuItems.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Menu
                    </p>
                    {menuItems.map((item) => (
                      <div key={item.cartId} className="flex justify-between text-sm">
                        <span className="truncate pr-2">
                          {item.name} ×{item.quantity}
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                  {reservationItems.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reservations</span>
                      <span>{formatCurrency(reservationTotal)}</span>
                    </div>
                  )}
                  {menuItems.length > 0 && (
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">Menu</span>
                      <span>{formatCurrency(menuTotal)}</span>
                    </div>
                  )}
                  <Separator className="my-2 bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="text-xl font-bold text-orange-500">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-center text-[10px] text-muted-foreground">
                    {itemCount} item{itemCount === 1 ? "" : "s"} in cart
                  </p>
                </div>

                {reservationItems.length > 0 && (
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={handleConfirmReservations}
                  >
                    <Users className="mr-2 size-4" />
                    Confirm{" "}
                    {reservationItems.length === 1
                      ? "Reservation"
                      : `${reservationItems.length} Reservations`}
                  </Button>
                )}

                {menuItems.length > 0 && (
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    variant={reservationItems.length > 0 ? "outline" : "default"}
                    onClick={handleConfirmMenuOrder}
                  >
                    <ChefHat className="mr-2 size-4" />
                    Place Food Order
                  </Button>
                )}

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/reservations">Add Another Reservation</Link>
                </Button>

                <p className="text-center text-[10px] text-muted-foreground">
                  Reservations: {formatCurrency(RESERVATION_BASE_FEE)} deposit +{" "}
                  {formatCurrency(RESERVATION_PER_GUEST_FEE)}/guest
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
