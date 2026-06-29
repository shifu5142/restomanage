import { ReservationsView } from "@/components/reservations/reservations-view";
import { mockData } from "@/data/mock";

export default function ReservationsPage() {
  return <ReservationsView reservations={mockData.reservations} />;
}
