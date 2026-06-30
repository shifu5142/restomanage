"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AddMenuItemInput,
  AddReservationInput,
  CartItem,
  MenuCartItem,
  ReservationCartItem,
} from "@/lib/cart/types";
import type { Reservation } from "@/types";

type ConfirmCustomer = {
  name: string;
  email: string;
};

type CartContextValue = {
  items: CartItem[];
  reservationItems: ReservationCartItem[];
  menuItems: MenuCartItem[];
  itemCount: number;
  reservationTotal: number;
  menuTotal: number;
  grandTotal: number;
  confirmedReservations: Reservation[];
  addReservation: (item: AddReservationInput) => void;
  addMenuItem: (item: AddMenuItemInput) => void;
  removeItem: (cartId: string) => void;
  updateMenuQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  confirmReservations: (customer: ConfirmCustomer) => Reservation[];
  confirmMenuOrder: (customer: ConfirmCustomer) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [confirmedReservations, setConfirmedReservations] = useState<Reservation[]>(
    []
  );

  const reservationItems = useMemo(
    () => items.filter((item): item is ReservationCartItem => item.type === "reservation"),
    [items]
  );

  const menuItems = useMemo(
    () => items.filter((item): item is MenuCartItem => item.type === "menu"),
    [items]
  );

  const reservationTotal = useMemo(
    () => reservationItems.reduce((sum, item) => sum + item.total, 0),
    [reservationItems]
  );

  const menuTotal = useMemo(
    () => menuItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [menuItems]
  );

  const grandTotal = reservationTotal + menuTotal;
  const itemCount = items.reduce(
    (count, item) => count + (item.type === "menu" ? item.quantity : 1),
    0
  );

  const addReservation = useCallback((item: AddReservationInput) => {
    setItems((prev) => [
      ...prev,
      {
        type: "reservation",
        cartId: `cart-res-${Date.now()}-${prev.length}`,
        ...item,
      },
    ]);
  }, []);

  const addMenuItem = useCallback((item: AddMenuItemInput) => {
    setItems((prev) => {
      const existing = prev.find(
        (entry): entry is MenuCartItem =>
          entry.type === "menu" && entry.menuItemId === item.menuItemId
      );

      if (existing) {
        return prev.map((entry) =>
          entry.cartId === existing.cartId && entry.type === "menu"
            ? { ...entry, quantity: entry.quantity + (item.quantity ?? 1) }
            : entry
        );
      }

      return [
        ...prev,
        {
          type: "menu",
          cartId: `cart-menu-${Date.now()}-${prev.length}`,
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity ?? 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((item) => item.cartId !== cartId));
  }, []);

  const updateMenuQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((item) => item.cartId !== cartId));
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId && item.type === "menu"
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const confirmReservations = useCallback(
    (customer: ConfirmCustomer) => {
      if (reservationItems.length === 0) return [];

      const newReservations: Reservation[] = reservationItems.map((item, index) => ({
        id: `res-custom-${Date.now()}-${index}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: "",
        partySize: item.partySize,
        date: item.date,
        time: item.time,
        tableId: item.tableId,
        status: "pending",
        notes: item.notes,
        total: item.total,
        createdAt: new Date().toISOString(),
      }));

      setConfirmedReservations((prev) => [...newReservations, ...prev]);
      setItems((prev) => prev.filter((item) => item.type !== "reservation"));
      return newReservations;
    },
    [reservationItems]
  );

  const confirmMenuOrder = useCallback(
    (_customer: ConfirmCustomer) => {
      setItems((prev) => prev.filter((item) => item.type !== "menu"));
    },
    []
  );

  const value = useMemo(
    () => ({
      items,
      reservationItems,
      menuItems,
      itemCount,
      reservationTotal,
      menuTotal,
      grandTotal,
      confirmedReservations,
      addReservation,
      addMenuItem,
      removeItem,
      updateMenuQuantity,
      clearCart,
      confirmReservations,
      confirmMenuOrder,
    }),
    [
      items,
      reservationItems,
      menuItems,
      itemCount,
      reservationTotal,
      menuTotal,
      grandTotal,
      confirmedReservations,
      addReservation,
      addMenuItem,
      removeItem,
      updateMenuQuantity,
      clearCart,
      confirmReservations,
      confirmMenuOrder,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
