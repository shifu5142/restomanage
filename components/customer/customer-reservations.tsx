"use client";

import { useEffect, useMemo } from "react";
import { CalendarDays, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { TableSelect } from "@/components/ui/table-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/data/mock";
import { useUser } from "@/hooks/use-user";
import {
  calculateReservationPricing,
  RESERVATION_BASE_FEE,
  RESERVATION_PER_GUEST_FEE,
} from "@/lib/reservations/pricing";
import {
  collectReservationBookings,
  formatTableLabel,
  getBookableTables,
  getTableById,
} from "@/lib/reservations/tables";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import type { ReservationFormData } from "@/lib/reservations/form";
import type { Reservation, ReservationStatus } from "@/types";

type SupabaseReservationRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  special_requests?: string | null;
  status: ReservationStatus;
  table_number?: number | null;
  created_at?: string;
};

type BookedReservationInput = Reservation | SupabaseReservationRow;

function isSupabaseRow(row: BookedReservationInput): row is SupabaseReservationRow {
  return "reservation_date" in row;
}

function normalizeTime(time: string): string {
  return time.length > 5 ? time.slice(0, 5) : time;
}

function normalizeBookedReservation(row: BookedReservationInput): Reservation {
  if (isSupabaseRow(row)) {
    const tableId =
      row.table_number != null
        ? (mockData.tables.find((t) => t.number === row.table_number)?.id ??
          `table-${row.table_number}`)
        : undefined;

    return {
      id: row.id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      partySize: row.party_size,
      date: row.reservation_date,
      time: normalizeTime(row.reservation_time),
      status: row.status,
      tableId,
      specialRequests: row.special_requests ?? undefined,
      createdAt: row.created_at ?? new Date().toISOString(),
      total: calculateReservationPricing(row.party_size).total,
    };
  }

  return {
    ...row,
    time: normalizeTime(row.time),
  };
}

type CustomerReservationsProps = {
  formData: ReservationFormData;
  onFormDataChange: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  bookedReservations: BookedReservationInput[];
  onDeleteReservation: (id: string) => void | Promise<void>;
};

export function CustomerReservations({
  formData,
  onSubmit,
  onFormDataChange,
  bookedReservations,
  onDeleteReservation,
}: CustomerReservationsProps) {
  const { user, display } = useUser();
  const userEmail = user?.email ?? "";

  const partySize = formData.partySize;

  const normalizedBooked = useMemo(
    () => bookedReservations.map(normalizeBookedReservation),
    [bookedReservations]
  );

  function updateForm(patch: Partial<ReservationFormData>) {
    onFormDataChange((current) => ({ ...current, ...patch }));
  }

  const availableTables = useMemo(() => {
    const bookings = collectReservationBookings(
      mockData.reservations,
      [],
      normalizedBooked
    );

    return getBookableTables(
      mockData.tables,
      partySize,
      formData.date,
      formData.time,
      bookings
    );
  }, [partySize, formData.date, formData.time, normalizedBooked]);

  const tableSelectReady = Boolean(formData.date && formData.time && formData.partySize);

  useEffect(() => {
    if (
      formData.tableId &&
      !availableTables.some((table) => table.id === formData.tableId)
    ) {
      onFormDataChange((current) => ({ ...current, tableId: "" }));
    }
  }, [availableTables, formData.tableId, onFormDataChange]);

  const baseReservations = useMemo(
    () => mockData.reservations.filter((r) => r.customerEmail === userEmail),
    [userEmail]
  );

  const reservations = useMemo(
    () => [...normalizedBooked, ...baseReservations],
    [normalizedBooked, baseReservations]
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

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      toast.error("Please select a date and time.");
      return;
    }
    if (!formData.tableId) {
      toast.error("Please select a table.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    const table = getTableById(mockData.tables, formData.tableId);
    if (!table) {
      toast.error("Selected table is no longer available.");
      return;
    }

    await onSubmit(e);
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
                {reservation.tableId && (
                  <>
                    {" "}
                    ·{" "}
                    {(() => {
                      const table = getTableById(mockData.tables, reservation.tableId);
                      if (table) return formatTableLabel(table);
                      const num = reservation.tableId.match(/\d+/)?.[0];
                      return num ? `Table ${num}` : reservation.tableId;
                    })()}
                  </>
                )}
              </p>
              {reservation.customerPhone && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {reservation.customerPhone}
                </p>
              )}
              {reservation.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{reservation.notes}</p>
              )}
              {reservation.specialRequests && (
                <p className="mt-1 text-xs text-orange-500">{reservation.specialRequests}</p>
              )}
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
              {showCancel && reservation.status !== "cancelled" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:cursor-pointer"
                  onClick={() => onDeleteReservation(reservation.id)}
                >
                  <XCircle className="mr-1.5 size-3.5" />
                  Cancel Reservation
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
        description="Book a table and manage your upcoming visits."
      />

      <Card className="border-white/10 bg-gradient-to-br from-card/80 to-orange-500/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5 text-orange-500" />
            New Reservation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="res-date">Date</Label>
                <DatePicker
                  id="res-date"
                  min={today}
                  value={formData.date}
                  onChange={(date) =>
                    updateForm({
                      date,
                      time: date ? formData.time : "",
                      tableId: "",
                    })
                  }
                  placeholder="Choose a date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="res-time">Time</Label>
                <TimePicker
                  id="res-time"
                  value={formData.time}
                  onChange={(time) => updateForm({ time, tableId: "" })}
                  placeholder="Choose a time"
                  disabled={!formData.date}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="res-party">Party Size</Label>
                <Input
                  id="res-party"
                  type="number"
                  min={1}
                  max={20}
                  value={formData.partySize}
                  onChange={(e) =>
                    updateForm({
                      partySize: parseInt(e.target.value, 10) || 2,
                      tableId: "",
                    })
                  }
                  className="border-white/10 bg-background/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="res-table">Table</Label>
                <TableSelect
                  id="res-table"
                  tables={availableTables}
                  allTables={mockData.tables}
                  value={formData.tableId}
                  onChange={(tableId) => updateForm({ tableId })}
                  placeholder="Choose a table"
                  disabled={!tableSelectReady}
                />
              </div>
            </div>
            {formData.partySize && (
              <p className="text-xs text-muted-foreground">
                Estimated:{" "}
                <span className="font-medium text-orange-500">
                  {formatCurrency(calculateReservationPricing(formData.partySize).total)}
                </span>{" "}
                ({formatCurrency(RESERVATION_BASE_FEE)} deposit +{" "}
                {formatCurrency(RESERVATION_PER_GUEST_FEE)}/guest)
                {tableSelectReady && (
                  <>
                    {" "}
                    · {availableTables.length} table
                    {availableTables.length === 1 ? "" : "s"} available
                  </>
                )}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="res-phone">Phone Number</Label>
              <Input
                id="res-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => updateForm({ phone: e.target.value })}
                className="border-white/10 bg-background/40"
                autoComplete="tel"
              />
              {display && (
                <p className="text-xs text-muted-foreground">
                  Booking as {display.name} · {userEmail}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="res-notes">Special Requests</Label>
              <Textarea
                id="res-notes"
                placeholder="Window seat, allergies, celebration..."
                value={formData.notes}
                onChange={(e) => updateForm({ notes: e.target.value })}
                className="border-white/10 bg-background/40"
              />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 hover:cursor-pointer">
              <Users className="mr-2 size-4" />
              Book Table
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
              description="Use the form above to book your next table."
            />
          ) : (
            upcoming.map((r) => <ReservationCard key={r.id} reservation={r} showCancel />)
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
  );
}
