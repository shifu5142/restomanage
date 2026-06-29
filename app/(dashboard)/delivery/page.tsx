import { DeliveryView } from "@/components/delivery/delivery-view";
import { mockData } from "@/data/mock";

export default function DeliveryPage() {
  return <DeliveryView deliveries={mockData.deliveryOrders} />;
}
