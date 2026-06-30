import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { FloorPlan } from "@/components/tables/floor-plan";
import { mockData } from "@/data/mock";

function TablesPage() {
  return (
    <AdminRouteGuard>
      <FloorPlan initialTables={mockData.tables} />
    </AdminRouteGuard>
  );
}
export default TablesPage;
