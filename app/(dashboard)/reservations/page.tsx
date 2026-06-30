import { RolePage } from "@/components/auth/role-page";
import { CustomerReservations } from "@/components/customer/customer-reservations";
import { ReservationsView } from "@/components/reservations/reservations-view";
import { mockData } from "@/data/mock";

function ReservationsPage() {
  return (
    <RolePage
      admin={<ReservationsView reservations={mockData.reservations} />}
      customer={<CustomerReservations />}
    />
  );
}
export default ReservationsPage;
