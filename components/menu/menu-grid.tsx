"use client";

import { useMemo, useState } from "react";
import { Clock, Flame, Leaf, Search, Star, Wheat } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, capitalize } from "@/lib/format";
import { MENU_CATEGORIES } from "@/lib/constants";
import type { MenuItem } from "@/types";

interface MenuGridProps {
  items: MenuItem[];
}

export function MenuGrid({ items }: MenuGridProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  return (
    <div className="space-y-6">
      <PageHeader title="Menu" description="Manage your menu items, pricing, and availability.">
        <Badge className="bg-orange-500/15 text-orange-600 hover:bg-orange-500/20">{items.length} items</Badge>
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
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
              <SelectItem key={cat} value={cat}>{capitalize(cat)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                {item.popular && (
                  <Badge className="bg-orange-500 text-white"><Star className="mr-1 size-3" />Popular</Badge>
                )}
                {item.vegan && (
                  <Badge variant="secondary" className="bg-emerald-500/90 text-white"><Leaf className="mr-1 size-3" />Vegan</Badge>
                )}
                {item.vegetarian && !item.vegan && (
                  <Badge variant="secondary" className="bg-green-500/90 text-white"><Leaf className="mr-1 size-3" />Vegetarian</Badge>
                )}
                {item.spicy && (
                  <Badge variant="secondary" className="bg-red-500/90 text-white"><Flame className="mr-1 size-3" />Spicy</Badge>
                )}
                {item.glutenFree && (
                  <Badge variant="secondary" className="bg-amber-500/90 text-white"><Wheat className="mr-1 size-3" />GF</Badge>
                )}
              </div>
              {!item.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Badge variant="destructive">Unavailable</Badge>
                </div>
              )}
            </div>
            <CardContent className="space-y-2 pt-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight">{item.name}</h3>
                <span className="shrink-0 font-bold text-orange-500">{formatCurrency(item.price)}</span>
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="outline" className="border-white/10">{capitalize(item.category)}</Badge>
                <span className="flex items-center gap-1"><Clock className="size-3" />{item.prepTime} min</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
