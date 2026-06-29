import { KitchenBoard } from "@/components/kitchen/kitchen-board";
import { mockData } from "@/data/mock";

export default function KitchenPage() {
  return <KitchenBoard orders={mockData.orders} />;
}
