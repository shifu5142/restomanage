import { mockData } from "@/data/mock";
import { calculateReservationPricing } from "@/lib/reservations/pricing";
import type { Reservation, ReservationStatus } from "@/types";

export type SupabaseReservationRow = {
  id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  party_size?: number;
  reservation_date?: string;
  reservation_time?: string;
  special_requests?: string | null;
  status?: ReservationStatus;
  table_number?: number | null;
  created_at?: string;
  user_id?: string;
};

export type BookedReservationInput = Reservation | SupabaseReservationRow;

function normalizeTime(time: string): string {
  return time.length > 5 ? time.slice(0, 5) : time;
}

export function isSupabaseReservationRow(
  row: BookedReservationInput
): row is SupabaseReservationRow {
  return "reservation_date" in row && Boolean(row.reservation_date);
}

export function normalizeReservationRow(row: BookedReservationInput): Reservation {
  if (isSupabaseReservationRow(row)) {
    const partySize = row.party_size ?? 2;
    const tableId =
      row.table_number != null
        ? (mockData.tables.find((t) => t.number === row.table_number)?.id ??
          `table-${row.table_number}`)
        : undefined;

    return {
      id: row.id,
      customerName: row.customer_name ?? "Guest",
      customerEmail: row.customer_email ?? "",
      customerPhone: row.customer_phone ?? "",
      partySize,
      date: row.reservation_date!,
      time: normalizeTime(row.reservation_time ?? ""),
      status: row.status ?? "pending",
      tableId,
      specialRequests: row.special_requests ?? undefined,
      createdAt: row.created_at ?? new Date().toISOString(),
      total: calculateReservationPricing(partySize).total,
    };
  }

  return {
    ...row,
    time: normalizeTime(row.time),
  };
}

export function normalizeReservationRows(rows: BookedReservationInput[]): Reservation[] {
  return rows.map(normalizeReservationRow);
}
