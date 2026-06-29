import { PaymentsView } from "@/components/payments/payments-view";
import { mockData } from "@/data/mock";

export default function PaymentsPage() {
  return <PaymentsView payments={mockData.payments} />;
}
