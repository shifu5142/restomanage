import type { Order } from "@/types";
import {
  flattenOrderItems,
  getOrderSubtotal,
  shortOrderId,
  type GroupedOrder,
} from "@/lib/orders/grouped";

export function groupedOrderToAdminOrder(order: GroupedOrder): Order {
  const items = flattenOrderItems(order.items).map((item) => ({
    menuItemId: item.menuItemId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));
  const total = getOrderSubtotal(order);
  const createdAt = new Date().toISOString();

  return {
    id: order.order_id,
    customerName: `Customer #${shortOrderId(order.user_id)}`,
    items,
    status: "pending",
    kitchenStatus: "waiting",
    paymentStatus: "pending",
    total,
    prepTime: Math.max(10, items.reduce((sum, item) => sum + item.quantity * 5, 0)),
    createdAt,
    timeline: [{ status: "Order Placed", time: createdAt }],
  };
}

export function groupedOrdersToAdminOrders(orders: GroupedOrder[]): Order[] {
  return orders.map(groupedOrderToAdminOrder);
}
