"use client";

import { useMemo, useState } from "react";
import { HelpCircle, MessageSquare, Send } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CHAT_CHANNELS } from "@/lib/constants";
import { formatRelative } from "@/lib/format";
import type { ChatMessage } from "@/types";

const FAQ = [
  { q: "How do I add a new menu item?", a: "Navigate to Menu, click 'Add Item', fill in the details including name, price, category, and upload an image. Save to publish." },
  { q: "How do reservations work?", a: "Customers can book through your website or you can add reservations manually. The system auto-assigns tables based on party size." },
  { q: "Can I export sales reports?", a: "Yes! Go to Reports and choose from PDF, Excel, or CSV formats for any report type." },
  { q: "How do I manage employee shifts?", a: "In Employees, click on any staff member to view and edit their shift schedule and role." },
  { q: "What payment methods are supported?", a: "We support credit cards, cash, Apple Pay, Google Pay, and gift cards. Configure in Settings > Payments." },
  { q: "How does the kitchen display work?", a: "Orders appear in real-time on the Kitchen page, organized by status with timers for each order." },
];

interface SupportChatProps {
  messages: ChatMessage[];
}

export function SupportChat({ messages }: SupportChatProps) {
  const [channel, setChannel] = useState<string>("support");
  const [chatInput, setChatInput] = useState("");

  const channelMessages = useMemo(
    () => messages.filter((m) => m.channel === channel).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [messages, channel]
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Support" description="Get help, browse FAQs, or chat with your team." />

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
                  <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-5 text-orange-500" />
              Team Chat
            </CardTitle>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {CHAT_CHANNELS.map((ch) => (
                <Badge
                  key={ch.id}
                  variant={channel === ch.id ? "default" : "outline"}
                  className={`cursor-pointer ${channel === ch.id ? "bg-orange-500 hover:bg-orange-600" : "border-white/10"}`}
                  onClick={() => setChannel(ch.id)}
                >
                  <ch.icon className="mr-1 size-3" />
                  {ch.label}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex h-[400px] flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto">
              {channelMessages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={msg.avatar} alt={msg.sender} />
                    <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.sender}</span>
                      <span className="text-[10px] text-muted-foreground">{formatRelative(msg.timestamp)}</span>
                    </div>
                    <p className="mt-0.5 rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-sm">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder={`Message #${channel}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="border-white/10 bg-background/40"
              />
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setChatInput("")}>
                <Send className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
