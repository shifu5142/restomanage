"use client";

import {
  Bell,
  Clock,
  CreditCard,
  Lock,
  Palette,
  User,
  Users,
  Crown,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const TEAM_MEMBERS = [
  { name: "James Anderson", role: "Owner", email: "james@restoflow.com" },
  { name: "Maria Garcia", role: "Manager", email: "maria@restoflow.com" },
  { name: "David Thompson", role: "Chef", email: "david@restoflow.com" },
];

export function SettingsView() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your restaurant profile and preferences." />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap border border-white/10 bg-card/60 backdrop-blur-xl">
          <TabsTrigger value="profile"><User className="mr-1.5 size-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="hours"><Clock className="mr-1.5 size-3.5" />Hours</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="mr-1.5 size-3.5" />Payments</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 size-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="theme"><Palette className="mr-1.5 size-3.5" />Theme</TabsTrigger>
          <TabsTrigger value="security"><Lock className="mr-1.5 size-3.5" />Security</TabsTrigger>
          <TabsTrigger value="team"><Users className="mr-1.5 size-3.5" />Team</TabsTrigger>
          <TabsTrigger value="subscription"><Crown className="mr-1.5 size-3.5" />Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Restaurant Profile</CardTitle>
              <CardDescription>Update your restaurant information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Restaurant Name</Label>
                  <Input defaultValue="RestoFlow Bistro" className="border-white/10 bg-background/40" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+1 (555) 123-4567" className="border-white/10 bg-background/40" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Address</Label>
                  <Input defaultValue="123 Gourmet Street, New York, NY 10001" className="border-white/10 bg-background/40" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea defaultValue="Award-winning fine dining with locally sourced ingredients." className="border-white/10 bg-background/40" />
                </div>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-28 text-sm font-medium">{day}</span>
                  <Input defaultValue="11:00" className="w-24 border-white/10 bg-background/40" />
                  <span className="text-muted-foreground">to</span>
                  <Input defaultValue={day === "Saturday" || day === "Sunday" ? "23:00" : "22:00"} className="w-24 border-white/10 bg-background/40" />
                  <Switch defaultChecked={day !== "Monday"} />
                </div>
              ))}
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Save Hours</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure accepted payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Credit Card", "Cash", "Apple Pay", "Google Pay", "Gift Cards"].map((method) => (
                <div key={method} className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                  <span className="font-medium">{method}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "New Reservations", desc: "Get notified when a new reservation is made" },
                { label: "Low Inventory", desc: "Alert when stock falls below minimum" },
                { label: "New Reviews", desc: "Notify when customers leave reviews" },
                { label: "Kitchen Alerts", desc: "Order ready and delay notifications" },
                { label: "Payment Confirmations", desc: "Transaction completed alerts" },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{n.label}</p>
                    <p className="text-sm text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger className="border-white/10 bg-background/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  {["#f97316", "#ef4444", "#22c55e", "#3b82f6", "#8b5cf6"].map((color) => (
                    <button
                      key={color}
                      className="size-8 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all hover:scale-110"
                      style={{ backgroundColor: color, outlineColor: color }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" className="border-white/10 bg-background/40" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" className="border-white/10 bg-background/40" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage who has access to your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.email} className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-white/10">{member.role}</Badge>
                </div>
              ))}
              <Button variant="outline" className="mt-2 border-white/10">Invite Member</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="size-5 text-amber-500" />
                Pro Plan
              </CardTitle>
              <CardDescription>$79/month · Billed annually</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="font-medium">Your plan includes:</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Unlimited orders & reservations</li>
                  <li>• AI tools & analytics</li>
                  <li>• Kitchen display system</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button className="bg-orange-500 hover:bg-orange-600">Upgrade Plan</Button>
                <Button variant="outline" className="border-white/10">Manage Billing</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
