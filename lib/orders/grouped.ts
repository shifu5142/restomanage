export type GroupedOrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type GroupedOrder = {
  order_id: string;
  user_id: string;
  total_amount: number;
  items: GroupedOrderItem[][];
};

export function flattenOrderItems(items: GroupedOrderItem[][]): GroupedOrderItem[] {
  return items.flat();
}

export function getOrderSubtotal(order: GroupedOrder): number {
  return flattenOrderItems(order.items).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

export function groupOrderRows(data: Record<string, unknown>[]): GroupedOrder[] {
  const grouped = data.reduce((acc: Record<string, GroupedOrder>, row) => {
    const orderId = row.order_id as string;

    if (!acc[orderId]) {
      acc[orderId] = {
        order_id: orderId,
        user_id: row.user_id as string,
        total_amount: row.total_amount as number,
        items: [],
      };
    }

    acc[orderId].items.push(row.items as GroupedOrderItem[]);

    return acc;
  }, {});

  return Object.values(grouped);
}

export function shortOrderId(orderId: string): string {
  return orderId.slice(0, 8).toUpperCase();
}
