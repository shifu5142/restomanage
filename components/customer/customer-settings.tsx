"use client";

import { useEffect, useState } from "react";
import { Bell, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useRole } from "@/hooks/use-role";

export function CustomerSettings() {
  const { display } = useRole();

  const [name, setName] = useState(display?.name ?? "");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (display?.name) setName(display.name);
  }, [display?.name]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [reservationReminders, setReservationReminders] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  function handleSave() {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Profile saved successfully!", {
      description: "Your preferences have been updated.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Settings"
        description="Manage your profile and notification preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-orange-500" />
              Profile
            </CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={display?.avatar} alt={display?.name} />
                <AvatarFallback className="bg-orange-500/15 text-orange-600">
                  {display?.initials ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{display?.name ?? "Guest"}</p>
                <p className="text-sm text-muted-foreground">{display?.email}</p>
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-white/10 bg-background/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                value={display?.email ?? ""}
                disabled
                className="border-white/10 bg-background/40 opacity-70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone</Label>
              <Input
                id="profile-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-white/10 bg-background/40"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-5 text-orange-500" />
              Password
            </CardTitle>
            <CardDescription>Change your account password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border-white/10 bg-background/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-white/10 bg-background/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-white/10 bg-background/40"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/60 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5 text-orange-500" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what updates you receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when your order status changes
                </p>
              </div>
              <Switch checked={orderUpdates} onCheckedChange={setOrderUpdates} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
              <div>
                <p className="font-medium">Reservation Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Reminders before your booked table time
                </p>
              </div>
              <Switch checked={reservationReminders} onCheckedChange={setReservationReminders} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
              <div>
                <p className="font-medium">Promotions & Offers</p>
                <p className="text-sm text-muted-foreground">
                  Special deals and seasonal menu highlights
                </p>
              </div>
              <Switch checked={promotions} onCheckedChange={setPromotions} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-muted-foreground">
                  Monthly digest from our kitchen
                </p>
              </div>
              <Switch checked={newsletter} onCheckedChange={setNewsletter} />
            </div>

            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
