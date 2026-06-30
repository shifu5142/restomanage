import { RolePage } from "@/components/auth/role-page";
import { CustomerMenu } from "@/components/customer/customer-menu";
import { MenuGrid } from "@/components/menu/menu-grid";
import { mockData } from "@/data/mock";

function MenuPage() {
  return (
    <RolePage
      admin={<MenuGrid items={mockData.menuItems} />}
      customer={<CustomerMenu />}
    />
  );
}
export default MenuPage;
