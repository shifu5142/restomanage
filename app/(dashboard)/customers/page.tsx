"use client";
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { CalendarDays, Mail, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { useEffect, useState } from "react";

type AuthCustomer = {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  app_metadata?: { provider?: string; providers?: string[] };
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    email?: string;
  };
};

function getCustomerName(user: AuthCustomer) {
  return user.user_metadata?.full_name || user.email?.split("@")[0] || "Guest";
}

function CustomersPage() {
  const [customersData, setCustomersData] = useState([]);
  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch("/api/customers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomersData(data);
    };
    fetchCustomers();
  }, []);

  const users = customersData as AuthCustomer[];
  const confirmedCount = users.filter((user) => user.email_confirmed_at).length;
  const googleCount = users.filter((user) => user.app_metadata?.provider === "google").length;

  return (
    <AdminRouteGuard>
    <div className="space-y-6">
      <PageHeader title="Customers" description="View customer profiles, loyalty, and spending history." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Customers" value={String(users.length)} icon={Users} />
        <StatCard title="Confirmed Emails" value={String(confirmedCount)} icon={Mail} />
        <StatCard title="Google Sign-ins" value={String(googleCount)} change={8.5} icon={TrendingUp} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.length === 0 ? (
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl lg:col-span-3 xl:col-span-4">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No customers found.
            </CardContent>
          </Card>
        ) : (
          users.map((user) => {
            const name = getCustomerName(user);
            const provider = user.app_metadata?.provider ?? "email";

            return (
              <Card
                key={user.id}
                className="border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/30"
              >
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={name} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 border-white/10 text-[10px] capitalize">
                      {provider}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-background/40 p-2.5 text-center">
                      <p className="text-xs font-bold text-orange-500">
                        {user.created_at ? formatDate(user.created_at) : "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Joined</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-background/40 p-2.5 text-center">
                      <p className="text-xs font-bold">
                        {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Last Sign-in</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3" />
                      {user.email_confirmed_at ? "Email verified" : "Unverified"}
                    </span>
                    <span className="font-mono text-[10px]">{user.id.slice(0, 8)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
    </AdminRouteGuard>
  );
}
export default CustomersPage;
