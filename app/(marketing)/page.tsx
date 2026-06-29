import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  CalendarDays,
  ChefHat,
  LayoutDashboard,
  Package,
  Quote,
  Star,
} from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { StatsBar } from "@/components/marketing/stats-bar";
import { FadeIn } from "@/components/marketing/fade-in";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { APP_NAME, AVATARS, FOOD_IMAGES } from "@/lib/constants";

const trustedLogos = [
  "Bella Vista",
  "Sakura House",
  "The Golden Fork",
  "Coastal Kitchen",
  "Urban Bites",
  "Harvest Table",
];

const testimonials = [
  {
    quote:
      "RestoFlow cut our reservation no-shows by 40%. The analytics dashboard alone paid for itself in the first month.",
    name: "Maria Santos",
    role: "Owner, Bella Vista",
    avatar: AVATARS[1],
    rating: 5,
  },
  {
    quote:
      "Kitchen coordination used to be chaos. Now orders flow seamlessly from front-of-house to the pass. Our staff loves it.",
    name: "James Chen",
    role: "Head Chef, Sakura House",
    avatar: AVATARS[2],
    rating: 5,
  },
  {
    quote:
      "Managing inventory across three locations was a nightmare. RestoFlow gave us real-time visibility and saved us thousands.",
    name: "Elena Rodriguez",
    role: "Operations Director, Coastal Kitchen",
    avatar: AVATARS[3],
    rating: 5,
  },
];

const previews = [
  {
    title: "Dashboard",
    description:
      "Your command center with real-time revenue, orders, and table status at a glance.",
    icon: LayoutDashboard,
    image: FOOD_IMAGES[0],
    highlights: ["Live KPIs", "Shift overview", "Quick actions"],
  },
  {
    title: "Analytics",
    description:
      "Deep insights into peak hours, menu performance, and customer trends.",
    icon: BarChart3,
    image: FOOD_IMAGES[4],
    highlights: ["Revenue trends", "Menu analytics", "Forecasting"],
  },
  {
    title: "Reservations",
    description:
      "Smart booking with waitlist management, table assignments, and SMS reminders.",
    icon: CalendarDays,
    image: FOOD_IMAGES[2],
    highlights: ["Online booking", "Waitlist", "Table map"],
  },
  {
    title: "Menu",
    description:
      "Dynamic menus with modifiers, seasonal items, and multi-language support.",
    icon: ChefHat,
    image: FOOD_IMAGES[1],
    highlights: ["Digital menus", "Modifiers", "QR ordering"],
  },
  {
    title: "Inventory",
    description:
      "Track stock levels, automate reorder alerts, and reduce food waste.",
    icon: Package,
    image: FOOD_IMAGES[6],
    highlights: ["Stock alerts", "Supplier orders", "Waste tracking"],
  },
];

const faqs = [
  {
    q: "How long does setup take?",
    a: "Most restaurants are fully operational within 24 hours. Our onboarding team helps import your menu, configure tables, and train your staff.",
  },
  {
    q: "Can I manage multiple locations?",
    a: "Yes. RestoFlow supports multi-location management with centralized reporting and location-specific settings on Pro and Enterprise plans.",
  },
  {
    q: "Does it integrate with POS systems?",
    a: "We integrate with major POS providers including Square, Toast, and Clover. Enterprise customers get custom integration support.",
  },
  {
    q: "Is there a free trial?",
    a: "Every plan includes a 14-day free trial with full access to features. No credit card required to start.",
  },
  {
    q: "What kind of support do you offer?",
    a: "All plans include email support. Pro plans get priority chat support, and Enterprise customers receive a dedicated account manager.",
  },
];

function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-amber-100/40 dark:from-amber-950/20 dark:via-background dark:to-orange-950/10">
      <Hero />
      <StatsBar />

      {/* Trusted By */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <FadeIn>
          <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by leading restaurants worldwide
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {trustedLogos.map((logo) => (
              <span
                key={logo}
                className="text-lg font-semibold text-muted-foreground/60 transition-colors hover:text-orange-500"
              >
                {logo}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Feature Previews */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <FadeIn className="mb-12 text-center">
          <Badge className="mb-4 border-orange-400/30 bg-orange-500/10 text-orange-600 dark:text-orange-400">
            Platform Preview
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need, beautifully unified
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From the front door to the back office — manage every aspect of your
            restaurant with tools designed for speed and elegance.
          </p>
        </FadeIn>

        <div className="space-y-16">
          {previews.map((preview, i) => (
            <FadeIn key={preview.title} delay={i * 0.05}>
              <div
                className={`flex flex-col items-center gap-8 lg:gap-12 ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                <div className="flex-1">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                    <preview.icon className="size-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{preview.title}</h3>
                  <p className="mt-3 text-muted-foreground">
                    {preview.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {preview.highlights.map((h) => (
                      <Badge
                        key={h}
                        variant="outline"
                        className="border-orange-400/20 bg-orange-500/5"
                      >
                        {h}
                      </Badge>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-orange-950/10 backdrop-blur-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.image}
                      alt={preview.title}
                      className="aspect-video w-full object-cover"
                    />
                    <div className="border-t border-white/10 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4">
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        {preview.title} — Live Preview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-orange-100/40 to-amber-50/60 py-20 dark:from-orange-950/20 dark:to-amber-950/10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by restaurant owners
            </h2>
            <p className="mt-4 text-muted-foreground">
              See why hundreds of restaurants switched to {APP_NAME}.
            </p>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <Card className="h-full border-white/10 bg-white/40 backdrop-blur-xl dark:bg-white/5">
                  <CardHeader>
                    <Quote className="size-8 text-orange-400/60" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="size-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="mt-6 flex items-center gap-3">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <FadeIn>
          <Card className="overflow-hidden border-orange-400/20 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-orange-600/10 backdrop-blur-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                Simple, transparent pricing
              </CardTitle>
              <CardDescription className="text-base">
                Plans starting at $49/month. 14-day free trial on all plans.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pb-8">
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span>✓ No setup fees</span>
                <span>✓ Cancel anytime</span>
                <span>✓ All features in trial</span>
              </div>
              <Button
                size="lg"
                className="bg-orange-500 px-8 hover:bg-orange-600"
                asChild
              >
                <Link href="/pricing">View Pricing Plans</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
        <FadeIn className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="rounded-xl border border-white/10 bg-white/30 px-4 backdrop-blur-sm dark:bg-white/5"
              >
                <AccordionTrigger className="text-base font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-orange-600/90 to-amber-600/90 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Stay ahead of the curve
            </h2>
            <p className="mt-3 text-orange-100">
              Get restaurant industry insights, product updates, and exclusive
              tips delivered to your inbox.
            </p>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
export default LandingPage;
