import {
  BarChart3,
  Bot,
  CalendarDays,
  ChefHat,
  ClipboardList,
  CreditCard,
  HeadphonesIcon,
  Package,
  Shield,
  Smartphone,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const features = [
  {
    icon: CalendarDays,
    title: "Smart Reservations",
    description:
      "Online booking, waitlist management, and automated reminders to maximize covers.",
  },
  {
    icon: ClipboardList,
    title: "Order Management",
    description:
      "Streamline dine-in, takeout, and delivery orders from a unified interface.",
  },
  {
    icon: ChefHat,
    title: "Kitchen Display",
    description:
      "Real-time kitchen tickets with prep times, modifiers, and course sequencing.",
  },
  {
    icon: Package,
    title: "Inventory Control",
    description:
      "Track stock levels, set reorder points, and reduce waste with smart alerts.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Revenue trends, menu performance, labor costs, and predictive forecasting.",
  },
  {
    icon: Users,
    title: "Staff Management",
    description:
      "Scheduling, role-based permissions, and performance tracking for your team.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description:
      "Accept all payment methods with integrated tipping and split-bill support.",
  },
  {
    icon: Truck,
    title: "Delivery Hub",
    description:
      "Manage in-house and third-party delivery with live driver tracking.",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description:
      "Full functionality on tablets and phones for floor staff on the go.",
  },
  {
    icon: Bot,
    title: "AI Tools",
    description:
      "Menu optimization, demand forecasting, and intelligent staffing suggestions.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with role-based access, audit logs, and data encryption.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description:
      "Dedicated support team that understands the restaurant business inside out.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built for the pace of a busy service — sub-second response times guaranteed.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-background dark:from-amber-950/20 dark:via-background dark:to-orange-950/10">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
          <FadeIn>
            <Badge className="mb-4 border-orange-400/30 bg-orange-500/10 text-orange-600 dark:text-orange-400">
              Features
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Built for every corner of your restaurant
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {APP_NAME} brings together every tool you need to run a world-class
              dining operation — from reservations to revenue.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.03}>
              <Card className="h-full border-white/10 bg-white/40 backdrop-blur-xl transition-all hover:border-orange-400/30 hover:shadow-lg hover:shadow-orange-500/10 dark:bg-white/5">
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-500">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
