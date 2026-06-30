import type { Reservation, RestaurantTable } from "@/types";

const BLOCKED_TABLE_STATUSES = new Set(["occupied", "cleaning"]);
const ACTIVE_RESERVATION_STATUSES = new Set([
  "pending",
  "confirmed",
  "seated",
]);

export type TableBooking = {
  tableId?: string;
  date: string;
  time: string;
  status?: string;
};

export function formatTableLabel(table: RestaurantTable): string {
  return `Table ${table.number} · ${table.section}`;
}

export function formatTableShort(table: RestaurantTable): string {
  return `T${table.number}`;
}

export function getTableById(
  tables: RestaurantTable[],
  tableId: string
): RestaurantTable | undefined {
  return tables.find((table) => table.id === tableId);
}

export function isTableBookedAtSlot(
  tableId: string,
  date: string,
  time: string,
  bookings: TableBooking[]
): boolean {
  return bookings.some(
    (booking) =>
      booking.tableId === tableId &&
      booking.date === date &&
      booking.time === time &&
      booking.status !== "cancelled" &&
      booking.status !== "completed"
  );
}

export function getBookableTables(
  tables: RestaurantTable[],
  partySize: number,
  date: string,
  time: string,
  bookings: TableBooking[]
): RestaurantTable[] {
  if (!date || !time) return [];

  const guests = Math.max(1, partySize);

  return tables
    .filter((table) => table.capacity >= guests)
    .filter((table) => !BLOCKED_TABLE_STATUSES.has(table.status))
    .filter((table) => !isTableBookedAtSlot(table.id, date, time, bookings))
    .sort((a, b) => a.section.localeCompare(b.section) || a.number - b.number);
}

export function groupTablesBySection(
  tables: RestaurantTable[]
): Record<string, RestaurantTable[]> {
  return tables.reduce<Record<string, RestaurantTable[]>>((groups, table) => {
    const list = groups[table.section] ?? [];
    list.push(table);
    groups[table.section] = list;
    return groups;
  }, {});
}

export function collectReservationBookings(
  reservations: Reservation[],
  cartReservations: TableBooking[],
  confirmedReservations: Reservation[]
): TableBooking[] {
  const fromMock = reservations
    .filter((r) => ACTIVE_RESERVATION_STATUSES.has(r.status))
    .map((r) => ({
      tableId: r.tableId,
      date: r.date,
      time: r.time,
      status: r.status,
    }));

  const fromConfirmed = confirmedReservations.map((r) => ({
    tableId: r.tableId,
    date: r.date,
    time: r.time,
    status: r.status,
  }));

  return [...fromMock, ...fromConfirmed, ...cartReservations];
}
