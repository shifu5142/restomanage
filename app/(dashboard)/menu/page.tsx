import { MenuGrid } from "@/components/menu/menu-grid";
import { mockData } from "@/data/mock";

export default function MenuPage() {
  return <MenuGrid items={mockData.menuItems} />;
}
