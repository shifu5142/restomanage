"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { APP_NAME } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";

const SUPPORT_SUBJECTS = [
  "General inquiry",
  "Reservation help",
  "Order issue",
  "Menu & dietary questions",
  "Feedback & compliments",
  "Billing & payments",
  "Other",
] as const;

const MAX_CHAT_PROMPTS = 8;

const CONTACT_INFO = {
  phone: "+1 (555) 847-2930",
  email: "support@restoflow.com",
  hours: "Mon–Thu 11:00 AM – 10:00 PM · Fri–Sun 11:00 AM – 11:00 PM",
  address: "124 Culinary Avenue, Downtown",
  responseTime: "We typically respond within 24 hours on business days.",
};

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

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function CustomerSupport() {
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [promptCount, setPromptCount] = useState(0);
  const [showEmailHelp, setShowEmailHelp] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const helpEmail = useMemo(() => {
    const id = Math.floor(1000 + Math.random() * 9000);
    return `help${id}@restoflow.com`;
  }, []);

  const shouldScrollChat = promptCount >= 3;
  const chatBlocked = promptCount >= MAX_CHAT_PROMPTS;

  useEffect(() => {
    if (chatScrollRef.current && (shouldScrollChat || chatLoading)) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, shouldScrollChat, chatLoading]);

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    const{data:{user:{id}},error:getUserError} = await supabase.auth.getUser();
    if (getUserError) {
      toast.error(getUserError.message);
      return;
    }
    const {error} = await supabase.from("support").insert({
      user_id: id,
      subject: contactForm.subject,
      message: contactForm.message,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setContactForm({ subject: "", message: "" });
    setShowConfirmation(true);
  }

  async function handleChatSend(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    if (chatBlocked) {
      setShowEmailHelp(true);
      return;
    }

    const userMessage = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      const reply =
        typeof data === "string"
          ? data
          : typeof data?.text === "string"
            ? data.text
            : "Sorry, something went wrong. Please try again.";

      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      const nextCount = promptCount + 1;
      setPromptCount(nextCount);
      if (nextCount >= MAX_CHAT_PROMPTS) {
        setShowEmailHelp(true);
      }
    } finally {
      setChatLoading(false);
    }
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardContent className="flex items-start gap-3 pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
              <Phone className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Phone
              </p>
              <p className="mt-1 font-semibold">{CONTACT_INFO.phone}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardContent className="flex items-start gap-3 pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
              <Mail className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <p className="mt-1 font-semibold">{CONTACT_INFO.email}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardContent className="flex items-start gap-3 pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
              <Clock className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Hours
              </p>
              <p className="mt-1 text-sm font-medium leading-snug">{CONTACT_INFO.hours}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardContent className="flex items-start gap-3 pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
              <MapPin className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Location
              </p>
              <p className="mt-1 text-sm font-medium leading-snug">{CONTACT_INFO.address}</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <p className="mb-4 text-sm text-muted-foreground">{CONTACT_INFO.responseTime}</p>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <Select
                  value={contactForm.subject}
                  onValueChange={(subject) => setContactForm({ ...contactForm, subject })}
                >
                  <SelectTrigger
                    id="contact-subject"
                    className="border-white/10 bg-background/40"
                  >
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORT_SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer" onClick={handleContactSubmit}>
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
            <div
              ref={chatScrollRef}
              className={`flex min-h-[200px] flex-col gap-3 rounded-2xl border border-white/10 bg-background/30 p-4 ${
                shouldScrollChat ? "max-h-[320px] overflow-y-auto" : ""
              }`}
            >
              {chatMessages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <MessageCircle className="mb-3 size-10 text-orange-500/50" />
                  <p className="font-medium">Chat with our team</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Live support is available during restaurant hours. Type a message below to get
                    started.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${
                      msg.role === "user" ? "flex-row-reverse justify-start" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                        msg.role === "user"
                          ? "bg-orange-500/20 text-orange-500"
                          : "bg-white/10 text-muted-foreground"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="size-4" />
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-orange-500 text-white"
                          : "border border-white/10 bg-card/80 text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-muted-foreground">
                    <Bot className="size-4" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-card/80 px-4 py-3">
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleChatSend} className="flex gap-2">
              <Input
                placeholder={
                  chatBlocked
                    ? "Chat limit reached — contact us by email"
                    : "Type your message..."
                }
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading || chatBlocked}
                className="border-white/10 bg-background/40"
              />
              <Button
                type="submit"
                disabled={chatLoading || chatBlocked}
                className="shrink-0 bg-orange-500 hover:bg-orange-600 cursor-pointer disabled:opacity-50"
              >
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
              className="border-red-500/30 text-red-500 hover:bg-red-500/10 cursor-pointer"
              onClick={handleReportIssue}
            >
              <AlertTriangle className="mr-2 size-4" />
              Report Issue
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="border-white/10 bg-card/95 backdrop-blur-xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="size-5 text-orange-500" />
              Message Received
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>Hello,</p>
            <p>
              Thank you for contacting our support team. We have received your message and are
              currently reviewing your request.
            </p>
            <p>
              We will get back to you as soon as possible with an update. If you have any
              additional information that may help us, feel free to reply to this message.
            </p>
            <p>
              Best regards,
              <br />
              <span className="font-medium text-foreground">Support Team</span>
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="cursor-pointer bg-orange-500 hover:bg-orange-600"
              onClick={() => setShowConfirmation(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmailHelp} onOpenChange={setShowEmailHelp}>
        <DialogContent className="border-white/10 bg-card/95 backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="size-5 text-orange-500" />
              Need more help?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Please contact our email for help:{" "}
            <span className="font-semibold text-foreground">{helpEmail}</span>
          </p>
          <DialogFooter>
            <Button
              type="button"
              className="cursor-pointer bg-orange-500 hover:bg-orange-600"
              onClick={() => setShowEmailHelp(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
