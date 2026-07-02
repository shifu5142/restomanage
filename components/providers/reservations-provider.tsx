"use client";

import {
  createContext,
  useContext,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Reservation } from "@/types";

type ReservationsContextValue = {
  bookedReservations: Reservation[];
  setBookedReservations: Dispatch<SetStateAction<Reservation[]>>;
};

const ReservationsContext = createContext<ReservationsContextValue | null>(null);

type ReservationsProviderProps = {
  bookedReservations: Reservation[];
  setBookedReservations: Dispatch<SetStateAction<Reservation[]>>;
  children: ReactNode;
};

export function ReservationsProvider({
  bookedReservations,
  setBookedReservations,
  children,
}: ReservationsProviderProps) {
  const value = useMemo(
    () => ({ bookedReservations, setBookedReservations }),
    [bookedReservations, setBookedReservations]
  );

  return (
    <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationsContext);
  if (!context) {
    throw new Error("useReservations must be used within a ReservationsProvider");
  }
  return context;
}
