"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ChefHat,
  Clock,
  MapPin,
  Phone,
  ShoppingBag,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/data/mock";
import { useRole } from "@/hooks/use-role";
import { APP_NAME, FOOD_IMAGES, RESTAURANT_BG } from "@/lib/constants";
import { formatCurrency, capitalize } from "@/lib/format";

const ACTION_CARDS = [
  { href: "/menu", label: "Browse Menu", emoji: "🍽️", description: "Explore our full menu" },
  { href: "/orders", label: "Order Food", emoji: "🛒", description: "Place a new order" },
  { href: "/reservations", label: "Reserve Table", emoji: "📅", description: "Book your table" },
  { href: "/orders", label: "My Orders", emoji: "📦", description: "Track your orders" },
] as const;

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 },
};

export function CustomerDashboard() {
  const { display, loading } = useRole();
  const featured = mockData.menuItems.filter((item) => item.popular && item.available).slice(0, 4);
  const specials = mockData.menuItems
    .filter((item) => item.available && !featured.some((f) => f.id === item.id))
    .slice(0, 3);

  const guestName = loading ? "Guest" : display?.name ?? "Guest";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${RESTAURANT_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-orange-950/60 backdrop-blur-[1px]" />
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 border-orange-400/30 bg-orange-500/20 text-orange-100">
              Welcome to {APP_NAME}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Hello, {guestName}!{" "}
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Ready to dine?
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/80 sm:text-lg">
              Discover chef-crafted dishes, reserve your favorite table, and enjoy a premium dining experience.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTION_CARDS.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            variants={cardHover}
            whileHover="hover"
          >
            <Link href={action.href} className="block h-full">
              <Card className="group h-full border-white/10 bg-gradient-to-br from-card/80 to-orange-500/5 backdrop-blur-xl transition-colors hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <span className="text-4xl transition-transform group-hover:scale-110">{action.emoji}</span>
                  <div>
                    <p className="font-semibold">{action.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <PageHeader
              title="Featured Dishes"
              description="Our most loved creations, handpicked by the chef."
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {featured.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="group overflow-hidden border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/30">
                    <div className="flex gap-4 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-20 shrink-0 rounded-xl object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold leading-tight">{item.name}</h3>
                          <span className="shrink-0 font-bold text-orange-500">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className="border-white/10 text-[10px]">
                            <Star className="mr-1 size-3 fill-amber-400 text-amber-400" />
                            Popular
                          </Badge>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="size-3" />
                            {item.prepTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <PageHeader
              title="Today's Specials"
              description="Limited-time offerings available today only."
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {specials.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-white/10 bg-gradient-to-b from-orange-500/10 to-card/60 backdrop-blur-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.image} alt={item.name} className="size-full object-cover" />
                    <Badge className="absolute left-2 top-2 bg-orange-500 text-white">
                      <Sparkles className="mr-1 size-3" />
                      Special
                    </Badge>
                  </div>
                  <CardContent className="space-y-1 p-4">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm font-bold text-orange-500">{formatCurrency(item.price)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card className="h-fit border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="size-5 text-orange-500" />
              Restaurant Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-hidden rounded-xl">
              <img
                src={FOOD_IMAGES[0]}
                alt={APP_NAME}
                className="aspect-video w-full object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">{APP_NAME} Bistro</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Award-winning fine dining with locally sourced ingredients and an unforgettable atmosphere.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-orange-500" />
                <span>123 Gourmet Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4 shrink-0 text-orange-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4 shrink-0 text-orange-500" />
                <span>Mon–Thu 11am–10pm · Fri–Sun 11am–11pm</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UtensilsCrossed className="size-4 shrink-0 text-orange-500" />
                <span>{capitalize(mockData.menuItems[0]?.category ?? "fine dining")} & more</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="size-4 shrink-0 text-orange-500" />
                <span>Reservations recommended on weekends</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">
                  {mockData.dashboardStats.customerSatisfaction}/5 guest rating
                </span>
              </div>
            </div>
            <Link
              href="/reservations"
              className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              <ShoppingBag className="mr-2 size-4" />
              Reserve a Table
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
