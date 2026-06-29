import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { FadeIn } from "@/components/marketing/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@restoflow.com",
    href: "mailto:hello@restoflow.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "123 Culinary Ave, San Francisco, CA",
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-background dark:from-amber-950/20 dark:via-background dark:to-orange-950/10">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
          <FadeIn>
            <Badge className="mb-4 border-orange-400/30 bg-orange-500/10 text-orange-600 dark:text-orange-400">
              Contact
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s talk
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Have questions about {APP_NAME}? Our team is here to help you find
              the perfect solution for your restaurant.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            {contactInfo.map((info, i) => (
              <FadeIn key={info.label} delay={i * 0.08}>
                <Card className="border-white/10 bg-white/40 backdrop-blur-xl dark:bg-white/5">
                  <CardHeader className="flex-row items-center gap-4 space-y-0">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                      <info.icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {info.label}
                      </CardTitle>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm font-semibold hover:text-orange-500"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold">{info.value}</p>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2} className="lg:col-span-2">
            <Card className="border-white/10 bg-white/40 backdrop-blur-xl dark:bg-white/5">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
