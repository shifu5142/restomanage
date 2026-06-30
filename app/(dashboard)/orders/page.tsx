import { RolePage } from "@/components/auth/role-page";
import { CustomerOrders } from "@/components/customer/customer-orders";
import { OrdersView } from "@/components/orders/orders-view";
import { mockData } from "@/data/mock";

function OrdersPage() {
  return (
    <RolePage
      admin={<OrdersView orders={mockData.orders} />}
      customer={<CustomerOrders />}
    />
  );
}
export default OrdersPage;
