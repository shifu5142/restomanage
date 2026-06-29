import { PaymentsView } from "@/components/payments/payments-view";
import { mockData } from "@/data/mock";

function PaymentsPage() {
  return <PaymentsView payments={mockData.payments} />;
}
export default PaymentsPage;
