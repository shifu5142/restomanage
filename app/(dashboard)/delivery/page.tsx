import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { DeliveryView } from "@/components/delivery/delivery-view";
import { mockData } from "@/data/mock";

function DeliveryPage() {
  return (
    <AdminRouteGuard>
      <DeliveryView deliveries={mockData.deliveryOrders} />
    </AdminRouteGuard>
  );
}
export default DeliveryPage;
