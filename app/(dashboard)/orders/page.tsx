import { OrdersView } from "@/components/orders/orders-view";
import { mockData } from "@/data/mock";

function OrdersPage() {
  return <OrdersView orders={mockData.orders} />;
}
export default OrdersPage;
