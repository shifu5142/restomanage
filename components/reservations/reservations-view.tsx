"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  LayoutGrid,
  Search,
  Table2,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { formatDate, formatTime } from "@/lib/format";
import { normalizeReservationRows } from "@/lib/reservations/normalize";
import { supabase } from "@/lib/supabase/client";
import type { Reservation, ReservationStatus } from "@/types";

const PAGE_SIZE = 10;
const STATUSES: ReservationStatus[] = ["pending", "confirmed", "seated", "completed", "cancelled"];

export function ReservationsView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [bookedReservations, setBookedReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const { data, error } = await supabase.from("reservations").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setBookedReservations(data ?? []);
    };

    fetchReservations();
  }, []);

  const reservations = useMemo(
    () => normalizeReservationRows(bookedReservations),
    [bookedReservations]
  );

  const stats = useMemo(() => ({
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    pending: reservations.filter((r) => r.status === "pending").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  }), [reservations]);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        r.customerName.toLowerCase().includes(search.toLowerCase()) ||
        r.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const calendarReservations = useMemo(() => {
    if (!calendarDate) return [];
    const dateStr = calendarDate.toISOString().split("T")[0];
    return reservations.filter((r) => r.date === dateStr);
  }, [reservations, calendarDate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservations"
        description="Manage bookings, seating, and guest preferences."
      >
        <Button className="bg-orange-500 hover:bg-orange-600">New Reservation</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Reservations" value={String(stats.total)} icon={CalendarDays} />
        <StatCard title="Confirmed" value={String(stats.confirmed)} change={4.2} icon={CheckCircle} />
        <StatCard title="Pending" value={String(stats.pending)} icon={Clock} />
        <StatCard title="Cancelled" value={String(stats.cancelled)} change={-1.5} icon={XCircle} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border-white/10 bg-card/60 pl-9 backdrop-blur-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full border-white/10 bg-card/60 backdrop-blur-xl sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList className="border border-white/10 bg-card/60 backdrop-blur-xl">
          <TabsTrigger value="table"><Table2 className="mr-2 size-4" />Table View</TabsTrigger>
          <TabsTrigger value="cards"><LayoutGrid className="mr-2 size-4" />Cards View</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarDays className="mr-2 size-4" />Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>
                        <div>
                          <p>{r.customerName}</p>
                          <p className="text-xs text-muted-foreground">{r.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(r.date)} · {formatTime(r.time)}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />{r.partySize}
                        </span>
                      </TableCell>
                      <TableCell>{r.tableId ?? "—"}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((r) => (
              <Card key={r.id} className="border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/30">
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{r.customerName}</p>
                      <p className="text-sm text-muted-foreground">{r.customerEmail}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatDate(r.date)}</span>
                    <span>{formatTime(r.time)}</span>
                    <span className="flex items-center gap-1"><Users className="size-3" />{r.partySize}</span>
                  </div>
                  {r.specialRequests && (
                    <p className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs text-orange-600 dark:text-orange-400">
                      {r.specialRequests}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden border-white/10 bg-card/60 backdrop-blur-xl">
              <div className="border-b border-white/10 bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-500">
                  Calendar
                </p>
                <p className="mt-0.5 font-semibold">
                  {calendarDate ? formatDate(calendarDate.toISOString()) : "Select a date"}
                </p>
              </div>
              <CardContent className="flex justify-center pt-4 pb-2">
                <Calendar
                  mode="single"
                  selected={calendarDate}
                  onSelect={setCalendarDate}
                  className="p-2 [--cell-size:2.5rem]"
                  classNames={{
                    caption_label: "text-sm font-semibold",
                    weekday: "text-xs font-medium text-muted-foreground",
                    today: "bg-orange-500/15 font-semibold text-orange-600 dark:text-orange-400",
                    button_previous:
                      "rounded-lg hover:bg-orange-500/10 hover:text-orange-600",
                    button_next: "rounded-lg hover:bg-orange-500/10 hover:text-orange-600",
                  }}
                />
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
              <CardContent className="space-y-3 pt-6">
                <h3 className="font-semibold">
                  {calendarDate ? formatDate(calendarDate.toISOString()) : "Select a date"}
                </h3>
                {calendarReservations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reservations on this date.</p>
                ) : (
                  calendarReservations.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                      <div>
                        <p className="font-medium">{r.customerName}</p>
                        <p className="text-sm text-muted-foreground">{formatTime(r.time)} · Party of {r.partySize}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
