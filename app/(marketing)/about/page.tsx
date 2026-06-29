import Image from "next/image";
import { Heart, Target, Users } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME, AVATARS } from "@/lib/constants";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower every restaurant — from neighborhood bistros to global chains — with technology that feels as refined as the dining experiences they create.",
  },
  {
    icon: Heart,
    title: "Our Passion",
    description:
      "We believe great food deserves great operations. Our team includes former chefs, restaurateurs, and hospitality veterans who understand the industry.",
  },
  {
    icon: Users,
    title: "Our Community",
    description:
      "Over 500 restaurants trust RestoFlow daily. We grow alongside our customers, shaping our product based on real-world feedback from the floor.",
  },
];

const team = [
  {
    name: "Alex Rivera",
    role: "CEO & Co-founder",
    bio: "Former restaurant owner with 15 years in hospitality tech.",
    avatar: AVATARS[0],
  },
  {
    name: "Sarah Kim",
    role: "CTO & Co-founder",
    bio: "Built scalable platforms at leading SaaS companies.",
    avatar: AVATARS[1],
  },
  {
    name: "David Okonkwo",
    role: "Head of Product",
    bio: "Michelin-trained chef turned product designer.",
    avatar: AVATARS[4],
  },
  {
    name: "Priya Sharma",
    role: "Head of Customer Success",
    bio: "Dedicated to making every onboarding seamless.",
    avatar: AVATARS[3],
  },
];

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-background dark:from-amber-950/20 dark:via-background dark:to-orange-950/10">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
          <FadeIn>
            <Badge className="mb-4 border-orange-400/30 bg-orange-500/10 text-orange-600 dark:text-orange-400">
              About Us
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Crafted by hospitality people, for hospitality people
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {APP_NAME} was born in a busy kitchen, not a boardroom. We set out
              to build the restaurant management platform we wished existed.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value, i) => (
            <FadeIn key={value.title} delay={i * 0.1}>
              <Card className="h-full border-white/10 bg-white/40 backdrop-blur-xl dark:bg-white/5">
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                    <value.icon className="size-5" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Meet the team</h2>
          <p className="mt-4 text-muted-foreground">
            The people behind {APP_NAME}.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <FadeIn key={member.name} delay={i * 0.08}>
              <Card className="border-white/10 bg-white/40 text-center backdrop-blur-xl dark:bg-white/5">
                <CardHeader className="items-center">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                  <CardTitle className="mt-2">{member.name}</CardTitle>
                  <CardDescription className="text-orange-600 dark:text-orange-400">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
