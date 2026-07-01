export type ReservationCartItem = {
  type: "reservation";
  cartId: string;
  date: string;
  time: string;
  partySize: number;
  tableId: string;
  tableNumber: number;
  tableSection: string;
  phone: string;
  notes?: string;
  baseFee: number;
  guestFee: number;
  total: number;
};

export type MenuCartItem = {
  type: "menu";
  cartId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CartItem = ReservationCartItem | MenuCartItem;

export type AddReservationInput = Omit<ReservationCartItem, "type" | "cartId">;

export type AddMenuItemInput = {
  menuItemId: string;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
};
