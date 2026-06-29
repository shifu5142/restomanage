import Link from "next/link";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for single-location restaurants getting started.",
    features: [
      "Up to 20 tables",
      "Online reservations",
      "Basic menu management",
      "Order tracking",
      "Email support",
      "Mobile app access",
    ],
    cta: "Start Free Trial",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For growing restaurants that need advanced tools.",
    features: [
      "Unlimited tables",
      "Advanced analytics",
      "Inventory management",
      "Kitchen display system",
      "Staff scheduling",
      "Priority chat support",
      "Multi-language menus",
      "API access",
    ],
    cta: "Start Free Trial",
    href: "/auth/register",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For restaurant groups and franchises at scale.",
    features: [
      "Everything in Pro",
      "Multi-location management",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "On-site training",
      "White-label options",
      "Advanced security & compliance",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-background dark:from-amber-950/20 dark:via-background dark:to-orange-950/10">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
          <FadeIn>
            <Badge className="mb-4 border-orange-400/30 bg-orange-500/10 text-orange-600 dark:text-orange-400">
              Pricing
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Plans that grow with you
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Every {APP_NAME} plan includes a 14-day free trial. No credit card
              required.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <Card
                className={`relative flex h-full flex-col border-white/10 bg-white/40 backdrop-blur-xl dark:bg-white/5 ${
                  plan.popular
                    ? "border-orange-400/40 shadow-xl shadow-orange-500/15 ring-1 ring-orange-400/20"
                    : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-orange-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-orange-500 hover:bg-orange-600"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
