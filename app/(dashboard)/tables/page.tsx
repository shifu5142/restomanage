import { FloorPlan } from "@/components/tables/floor-plan";
import { mockData } from "@/data/mock";

function TablesPage() {
  return <FloorPlan initialTables={mockData.tables} />;
}
export default TablesPage;
