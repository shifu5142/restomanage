import { FloorPlan } from "@/components/tables/floor-plan";
import { mockData } from "@/data/mock";

export default function TablesPage() {
  return <FloorPlan initialTables={mockData.tables} />;
}
