"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/components/providers/cart-provider";
import { UserProvider } from "@/components/providers/user-provider";

export function DashboardProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
  );
}
