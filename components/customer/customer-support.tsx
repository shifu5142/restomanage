"use client";

import { useState } from "react";
import {
  AlertTriangle,
  HelpCircle,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const FAQ = [
  {
    q: "How do I place an order?",
    a: "Browse our menu, add items to your cart, and proceed to checkout. You'll receive real-time updates on your order status.",
  },
  {
    q: "Can I modify or cancel my reservation?",
    a: "Yes! Go to Reservations, find your upcoming booking, and click Cancel. For changes, cancel and create a new reservation.",
  },
  {
    q: "What are your operating hours?",
    a: "We're open Mon–Thu 11am–10pm and Fri–Sun 11am–11pm. Holiday hours may vary.",
  },
  {
    q: "Do you accommodate dietary restrictions?",
    a: "Absolutely. Look for vegan, vegetarian, gluten-free, and spicy badges on menu items. Mention allergies in special requests.",
  },
  {
    q: "How do loyalty rewards work?",
    a: "Earn points with every order. Points can be redeemed for discounts on future visits — check your dashboard for balance.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept credit cards, Apple Pay, Google Pay, and cash for in-restaurant dining.",
  },
];

export function CustomerSupport() {
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const [chatInput, setChatInput] = useState("");

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success("Message sent!", {
      description: "Our team will respond within 24 hours.",
    });
    setContactForm({ subject: "", message: "" });
  }

  function handleChatSend(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    toast.info("Live chat coming soon", {
      description: "A support agent will be available shortly.",
    });
    setChatInput("");
  }

  function handleReportIssue() {
    toast.success("Issue reported", {
      description: "We've logged your report and will investigate promptly.",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description={`Get help with your ${APP_NAME} dining experience.`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="size-5 text-orange-500" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-5 text-orange-500" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input
                  id="contact-subject"
                  placeholder="How can we help?"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  className="border-white/10 bg-background/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  placeholder="Describe your question or concern..."
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="min-h-[120px] border-white/10 bg-background/40"
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                <Send className="mr-2 size-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-card/80 to-orange-500/5 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="size-5 text-orange-500" />
              Live Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-background/30 p-8 text-center">
              <MessageCircle className="mb-3 size-10 text-orange-500/50" />
              <p className="font-medium">Chat with our team</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Live support is available during restaurant hours. Type a message below to get started.
              </p>
            </div>
            <form onSubmit={handleChatSend} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="border-white/10 bg-background/40"
              />
              <Button type="submit" className="shrink-0 bg-orange-500 hover:bg-orange-600">
                <Send className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/60 backdrop-blur-xl lg:col-span-2">
          <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <p className="font-semibold">Report an Issue</p>
                <p className="text-sm text-muted-foreground">
                  Experienced a problem with your order or visit? Let us know.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-red-500/30 text-red-500 hover:bg-red-500/10"
              onClick={handleReportIssue}
            >
              <AlertTriangle className="mr-2 size-4" />
              Report Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
