"use client";

import { useState } from "react";
import {
  Bot,
  Lightbulb,
  LineChart,
  Send,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const INSIGHTS = [
  { title: "Peak Hours", description: "Friday 7-9 PM sees 40% more orders. Consider adding 2 waitstaff.", type: "operations" },
  { title: "Menu Opportunity", description: "Truffle Mushroom Pizza has highest margin. Feature it prominently.", type: "menu" },
  { title: "Inventory Alert", description: "Salmon orders up 25% this week. Increase stock by 15%.", type: "inventory" },
  { title: "Customer Trend", description: "Loyalty sign-ups increased 18% after the rewards program launch.", type: "customers" },
];

const FORECASTS = [
  { period: "This Week", revenue: "$12,400", orders: 340, confidence: 92 },
  { period: "Next Week", revenue: "$13,100", orders: 365, confidence: 87 },
  { period: "This Month", revenue: "$52,800", orders: 1480, confidence: 78 },
];

const MENU_SUGGESTIONS = [
  { item: "Truffle Mushroom Pizza", action: "Promote as Chef's Special", impact: "+12% revenue" },
  { item: "Caesar Salad", action: "Bundle with pasta mains", impact: "+8% AOV" },
  { item: "Espresso Martini", action: "Add happy hour pricing", impact: "+15% drink sales" },
  { item: "Kids Menu", action: "Create family combo deal", impact: "+6% weekend traffic" },
];

type ChatRole = "user" | "assistant";

export function AiToolsView() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: ChatRole; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your RestoFlow AI assistant. Ask me about sales, menu optimization, staffing, or anything restaurant-related." },
  ]);

  function sendMessage() {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: chatInput },
      { role: "assistant", content: "Based on your recent data, I'd recommend focusing on your top-performing items during peak hours. Would you like a detailed breakdown?" },
    ]);
    setChatInput("");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="AI Tools" description="AI-powered insights, forecasts, and menu optimization.">
        <Badge className="bg-orange-500/15 text-orange-600"><Sparkles className="mr-1 size-3" />AI Powered</Badge>
      </PageHeader>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="border border-white/10 bg-card/60 backdrop-blur-xl">
          <TabsTrigger value="chat"><Bot className="mr-2 size-4" />AI Chat</TabsTrigger>
          <TabsTrigger value="menu"><UtensilsCrossed className="mr-2 size-4" />Menu Optimization</TabsTrigger>
          <TabsTrigger value="forecasts"><LineChart className="mr-2 size-4" />Forecasts</TabsTrigger>
          <TabsTrigger value="insights"><Lightbulb className="mr-2 size-4" />Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardContent className="flex h-[500px] flex-col pt-6">
              <div className="flex-1 space-y-4 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-orange-500 text-white"
                          : "border border-white/10 bg-background/60"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Ask anything about your restaurant..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="border-white/10 bg-background/40"
                />
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={sendMessage}>
                  <Send className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <div className="grid gap-4 sm:grid-cols-2">
            {MENU_SUGGESTIONS.map((s) => (
              <Card key={s.item} className="border-white/10 bg-card/60 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base">{s.item}</CardTitle>
                  <CardDescription>{s.action}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-emerald-500/15 text-emerald-600">{s.impact}</Badge>
                  <Button variant="outline" size="sm" className="mt-3 border-white/10">Apply Suggestion</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasts">
          <div className="grid gap-4 sm:grid-cols-3">
            {FORECASTS.map((f) => (
              <Card key={f.period} className="border-white/10 bg-card/60 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base">{f.period}</CardTitle>
                  <CardDescription>{f.confidence}% confidence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-bold text-orange-500">{f.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orders</span>
                    <span className="font-semibold">{f.orders}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${f.confidence}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid gap-4 sm:grid-cols-2">
            {INSIGHTS.map((insight) => (
              <Card key={insight.title} className="border-white/10 bg-card/60 backdrop-blur-xl">
                <CardContent className="flex gap-3 pt-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Lightbulb className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{insight.title}</p>
                      <Badge variant="outline" className="border-white/10 text-[10px]">{insight.type}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
