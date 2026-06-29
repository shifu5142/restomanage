import { KitchenBoard } from "@/components/kitchen/kitchen-board";
import { mockData } from "@/data/mock";

function KitchenPage() {
  return <KitchenBoard orders={mockData.orders} />;
}
export default KitchenPage;
