import { ReservationsView } from "@/components/reservations/reservations-view";
import { mockData } from "@/data/mock";

function ReservationsPage() {
  return <ReservationsView reservations={mockData.reservations} />;
}
export default ReservationsPage;
