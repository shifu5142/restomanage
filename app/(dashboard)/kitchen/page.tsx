import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { KitchenBoard } from "@/components/kitchen/kitchen-board";
import { mockData } from "@/data/mock";

function KitchenPage() {
  return (
    <AdminRouteGuard>
      <KitchenBoard orders={mockData.orders} />
    </AdminRouteGuard>
  );
}
export default KitchenPage;
