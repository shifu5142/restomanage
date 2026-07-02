"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RolePage } from "@/components/auth/role-page";
import { CustomerReservations } from "@/components/customer/customer-reservations";
import { ReservationsView } from "@/components/reservations/reservations-view";
import { PageLoading } from "@/components/ui/page-loading";
import { useUser } from "@/hooks/use-user";
import {
  EMPTY_RESERVATION_FORM,
  type ReservationFormData,
} from "@/lib/reservations/form";
import { calculateReservationPricing } from "@/lib/reservations/pricing";
import { supabase } from "@/lib/supabase/client";
import type { Reservation } from "@/types";

function ReservationsPage() {
  const { user, display, loading: userLoading } = useUser();
  const [formData, setFormData] = useState<ReservationFormData>(EMPTY_RESERVATION_FORM);
  const [bookedReservations, setBookedReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    const fetchBookedReservations = async () => {
      setLoading(true);
      
      try {
        const {
          data: {
            user: { id },
          },
        } = await supabase.auth.getUser();
        if (!id) {
          throw new Error("User not found");
        }
        const { data, error } = await supabase
          .from("reservations")
          .select("*")
          .eq("user_id", id);
        if (error) {
          toast.error(error.message);
          return;
        }
        setBookedReservations(data);
      } catch (error) {
        console.error(error);
        setBookedReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedReservations();
  }, [user, userLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: {
        user: { id },
      },
    } = await supabase.auth.getUser();
    if (!id) {
      toast.error("You must be logged in to book a table.");
      return;
    }

    const customerName = display?.name ?? id.email?.split("@")[0] ?? "Guest";
    const customerEmail = id?.email ?? "";

    const { error } = await supabase.from("reservations").insert({
      user_id: id,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: formData.phone,
      reservation_date: formData.date,
      reservation_time: formData.time,
      party_size: formData.partySize,
      table_number: Number(formData.tableId.match(/\d+/)?.[0]),
      special_requests: formData.notes,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setBookedReservations((prev) => [
      {
        id: `res-local-${Date.now()}`,
        customerName,
        customerEmail,
        customerPhone: formData.phone,
        partySize: formData.partySize,
        date: formData.date,
        time: formData.time,
        tableId: formData.tableId,
        status: "pending",
        notes: formData.notes || undefined,
        total: calculateReservationPricing(formData.partySize).total,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setFormData(EMPTY_RESERVATION_FORM);
    toast.success("Reservation booked!");
  };

  const handleDeleteReservation = async (id: string) => {
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setBookedReservations((prev) => prev.filter((reservation) => reservation.id !== id));
    toast.success("Reservation cancelled.");
  };

  if (userLoading || loading) {
    return <PageLoading message="Loading your reservations..." />;
  }

  return (
    <RolePage
      admin={<ReservationsView />}
      customer={
        <CustomerReservations
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          bookedReservations={bookedReservations}
          onDeleteReservation={handleDeleteReservation}
        />
      }
    />
  );
}
export default ReservationsPage;
