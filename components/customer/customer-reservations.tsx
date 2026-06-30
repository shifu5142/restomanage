"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, ShoppingCart, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/data/mock";
import { useCart } from "@/hooks/use-cart";
import { useRole } from "@/hooks/use-role";
import { useUser } from "@/hooks/use-user";
import {
  calculateReservationPricing,
  RESERVATION_BASE_FEE,
  RESERVATION_PER_GUEST_FEE,
} from "@/lib/reservations/pricing";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import type { Reservation } from "@/types";

const EMPTY_FORM = {
  date: "",
  time: "",
  partySize: "2",
  notes: "",
};

export function CustomerReservations() {
  const { user } = useUser();
  const userEmail = user?.email ?? "";
  const { addReservation, reservationItems, reservationTotal, confirmedReservations } =
    useCart();

  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState(EMPTY_FORM);

  const baseReservations = useMemo(
    () => mockData.reservations.filter((r) => r.customerEmail === userEmail),
    [userEmail]
  );

  const reservations = useMemo(
    () =>
      [...confirmedReservations, ...baseReservations].map((r) =>
        cancelledIds.has(r.id) ? { ...r, status: "cancelled" as const } : r
      ),
    [confirmedReservations, baseReservations, cancelledIds]
  );

  const today = new Date().toISOString().split("T")[0];

  const upcoming = useMemo(
    () =>
      reservations
        .filter(
          (r) =>
            r.date >= today &&
            r.status !== "cancelled" &&
            r.status !== "completed"
        )
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [reservations, today]
  );

  const history = useMemo(
    () =>
      reservations
        .filter(
          (r) =>
            r.date < today ||
            r.status === "cancelled" ||
            r.status === "completed"
        )
        .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)),
    [reservations, today]
  );

  function handleAddToCart(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.time) {
      toast.error("Please select a date and time.");
      return;
    }

    const partySize = parseInt(form.partySize, 10) || 2;
    const pricing = calculateReservationPricing(partySize);
    const { date, time } = form;

    addReservation({
      date,
      time,
      partySize,
      notes: form.notes || undefined,
      ...pricing,
    });

    setForm(EMPTY_FORM);
    toast.success("Reservation added to cart", {
      description: `${formatDate(date)} at ${formatTime(time)} · ${formatCurrency(pricing.total)}`,
    });
  }

  function handleCancel(id: string) {
    setCancelledIds((prev) => new Set(prev).add(id));
    toast.success("Reservation cancelled.");
  }

  function ReservationCard({
    reservation,
    showCancel,
  }: {
    reservation: Reservation;
    showCancel?: boolean;
  }) {
    const pricing =
      reservation.total ??
      calculateReservationPricing(reservation.partySize).total;

    return (
      <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
        <CardContent className="space-y-3 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{formatDate(reservation.date)}</p>
                <StatusBadge status={reservation.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatTime(reservation.time)} · Party of {reservation.partySize}
              </p>
              {reservation.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{reservation.notes}</p>
              )}
              {reservation.specialRequests && (
                <p className="mt-1 text-xs text-orange-500">{reservation.specialRequests}</p>
              )}
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
              <p className="text-lg font-bold text-orange-500">{formatCurrency(pricing)}</p>
              {showCancel && reservation.status !== "cancelled" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                  onClick={() => handleCancel(reservation.id)}
                >
                  <XCircle className="mr-1.5 size-3.5" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Reservations"
        description="Add reservations to your cart, then review and confirm on the cart page."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-white/10 bg-gradient-to-br from-card/80 to-orange-500/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5 text-orange-500" />
                New Reservation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddToCart} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="res-date">Date</Label>
                    <DatePicker
                      id="res-date"
                      min={today}
                      value={form.date}
                      onChange={(date) =>
                        setForm({ ...form, date, time: date ? form.time : "" })
                      }
                      placeholder="Choose a date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="res-time">Time</Label>
                    <TimePicker
                      id="res-time"
                      value={form.time}
                      onChange={(time) => setForm({ ...form, time })}
                      placeholder="Choose a time"
                      disabled={!form.date}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="res-party">Party Size</Label>
                  <Input
                    id="res-party"
                    type="number"
                    min={1}
                    max={20}
                    value={form.partySize}
                    onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                    className="border-white/10 bg-background/40"
                  />
                  {form.partySize && (
                    <p className="text-xs text-muted-foreground">
                      Estimated:{" "}
                      <span className="font-medium text-orange-500">
                        {formatCurrency(
                          calculateReservationPricing(parseInt(form.partySize, 10) || 2).total
                        )}
                      </span>{" "}
                      ({formatCurrency(RESERVATION_BASE_FEE)} deposit +{" "}
                      {formatCurrency(RESERVATION_PER_GUEST_FEE)}/guest)
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="res-notes">Special Requests</Label>
                  <Textarea
                    id="res-notes"
                    placeholder="Window seat, allergies, celebration..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="border-white/10 bg-background/40"
                  />
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  <ShoppingCart className="mr-2 size-4" />
                  Add to Cart
                </Button>
              </form>
            </CardContent>
          </Card>

          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList className="border border-white/10 bg-card/60 backdrop-blur-xl">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-3">
              {upcoming.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No upcoming reservations"
                  description="Add a reservation to your cart and confirm to book."
                />
              ) : (
                upcoming.map((r) => (
                  <ReservationCard key={r.id} reservation={r} showCancel />
                ))
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-3">
              {history.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No past reservations"
                  description="Your completed and cancelled reservations will appear here."
                />
              ) : (
                history.map((r) => <ReservationCard key={r.id} reservation={r} />)
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20 border-white/10 bg-gradient-to-br from-card/90 to-orange-500/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="size-5 text-orange-500" />
                Your Cart
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reservationItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-background/30 px-4 py-8 text-center">
                  <ShoppingCart className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                  <p className="text-sm font-medium">No items in cart</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add a reservation using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {reservationItems.length} reservation
                    {reservationItems.length === 1 ? "" : "s"} ·{" "}
                    <span className="font-semibold text-orange-500">
                      {formatCurrency(reservationTotal)}
                    </span>
                  </p>
                  {reservationItems.slice(0, 3).map((item) => (
                    <div
                      key={item.cartId}
                      className="rounded-lg border border-white/10 bg-background/40 px-3 py-2 text-sm"
                    >
                      <p className="font-medium">{formatDate(item.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(item.time)} · {item.partySize} guests ·{" "}
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  ))}
                  {reservationItems.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{reservationItems.length - 3} more in cart
                    </p>
                  )}
                </div>
              )}

              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                <Link href="/cart">
                  View Full Cart
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
