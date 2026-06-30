import { RolePage } from "@/components/auth/role-page";
import { CustomerCart } from "@/components/customer/customer-cart";

function CartPage() {
  return <RolePage customer={<CustomerCart />} admin={<CustomerCart />} />;
}
export default CartPage;
