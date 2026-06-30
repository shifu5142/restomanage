import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { PaymentsView } from "@/components/payments/payments-view";
import { mockData } from "@/data/mock";

function PaymentsPage() {
  return (
    <AdminRouteGuard>
      <PaymentsView payments={mockData.payments} />
    </AdminRouteGuard>
  );
}
export default PaymentsPage;
