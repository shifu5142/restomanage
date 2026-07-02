"use client";

import { useMemo, useState } from "react";
import { Clock, Flame, Leaf, Search, ShoppingCart, Star, Wheat } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { mockData } from "@/data/mock";
import { useCart } from "@/hooks/use-cart";
import { MENU_CATEGORIES } from "@/lib/constants";
import { formatCurrency, capitalize } from "@/lib/format";

export function CustomerMenu() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const { addMenuItem, openCart } = useCart();

  const filtered = useMemo(() => {
    return mockData.menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || item.category === category;
      return matchesSearch && matchesCategory && item.available;
    });
  }, [search, category]);

  function handleAddToCart(item: (typeof mockData.menuItems)[number]) {
    addMenuItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success(`Added ${item.name} to your cart`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Our Menu"
        description="Browse our chef-crafted dishes and add your favorites to cart."
      >
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-500/15 text-orange-600 hover:bg-orange-500/20">
            {filtered.length} dishes
          </Badge>
          <Button variant="outline" size="sm" onClick={openCart}>
            View Cart
          </Button>
        </div>
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-white/10 bg-card/60 pl-9 backdrop-blur-xl"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full border-white/10 bg-card/60 backdrop-blur-xl sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {MENU_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {capitalize(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No dishes match your search. Try a different filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="group flex flex-col overflow-hidden border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                  {item.popular && (
                    <Badge className="bg-orange-500 text-white">
                      <Star className="mr-1 size-3" />
                      Popular
                    </Badge>
                  )}
                  {item.vegan && (
                    <Badge variant="secondary" className="bg-emerald-500/90 text-white">
                      <Leaf className="mr-1 size-3" />
                      Vegan
                    </Badge>
                  )}
                  {item.vegetarian && !item.vegan && (
                    <Badge variant="secondary" className="bg-green-500/90 text-white">
                      <Leaf className="mr-1 size-3" />
                      Vegetarian
                    </Badge>
                  )}
                  {item.spicy && (
                    <Badge variant="secondary" className="bg-red-500/90 text-white">
                      <Flame className="mr-1 size-3" />
                      Spicy
                    </Badge>
                  )}
                  {item.glutenFree && (
                    <Badge variant="secondary" className="bg-amber-500/90 text-white">
                      <Wheat className="mr-1 size-3" />
                      GF
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="flex flex-1 flex-col space-y-3 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{item.name}</h3>
                  <span className="shrink-0 font-bold text-orange-500">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <p className="line-clamp-2 flex-1 text-xs text-muted-foreground">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className="border-white/10">
                    {capitalize(item.category)}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {item.prepTime} min
                  </span>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="mr-2 size-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
