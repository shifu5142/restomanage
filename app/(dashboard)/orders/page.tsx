import { OrdersView } from "@/components/orders/orders-view";
import { mockData } from "@/data/mock";

export default function OrdersPage() {
  return <OrdersView orders={mockData.orders} />;
}
