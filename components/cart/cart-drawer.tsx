"use client";

import Link from "next/link";
import { ChefHat, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";

export function CartDrawer() {
  const {
    items,
    menuItems,
    itemCount,
    menuTotal,
    grandTotal,
    isCartOpen,
    closeCart,
    removeItem,
  } = useCart();

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(open) => (open ? undefined : closeCart())}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col border-white/10 bg-gradient-to-b from-card/95 to-background/95 p-0 backdrop-blur-xl sm:max-w-md"
      >
        <SheetHeader className="border-b border-white/10 px-5 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="size-5 text-orange-500" />
            Your Cart
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? "No items yet"
              : `${itemCount} item${itemCount === 1 ? "" : "s"} selected`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-500/10">
                <ShoppingCart className="size-7 text-orange-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your cart is empty. Add dishes from the menu to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-background/40 p-3"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-14 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-orange-500/15">
                      <ChefHat className="size-6 text-orange-500" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-orange-500">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.cartId)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-white/10 px-5 py-4">
          {items.length > 0 && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatCurrency(menuTotal)}</span>
              </div>
              {grandTotal !== menuTotal && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold text-orange-500">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              )}
              <Separator className="bg-white/10" />
            </div>
          )}
          <Button
            asChild
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={closeCart}
          >
            <Link href="/cart">
              <ShoppingCart className="mr-2 size-4" />
              Go to Cart
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full cursor-pointer"
            onClick={closeCart}
          >
            Continue browsing
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
