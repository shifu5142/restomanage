import { MenuGrid } from "@/components/menu/menu-grid";
import { mockData } from "@/data/mock";

function MenuPage() {
  return <MenuGrid items={mockData.menuItems} />;
}
export default MenuPage;
