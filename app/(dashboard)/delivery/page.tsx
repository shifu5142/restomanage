import { DeliveryView } from "@/components/delivery/delivery-view";
import { mockData } from "@/data/mock";

function DeliveryPage() {
  return <DeliveryView deliveries={mockData.deliveryOrders} />;
}
export default DeliveryPage;
