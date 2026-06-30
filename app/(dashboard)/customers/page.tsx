import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Heart, Star, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockData } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";

function CustomersPage() {
  const { customers } = mockData;
  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgLoyalty = customers.reduce((s, c) => s + c.loyaltyPoints, 0) / customers.length;

  return (
    <AdminRouteGuard>
    <div className="space-y-6">
      <PageHeader title="Customers" description="View customer profiles, loyalty, and spending history." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Customers" value={String(customers.length)} icon={Users} />
        <StatCard title="Total Revenue" value={formatCurrency(totalSpent)} change={8.5} icon={TrendingUp} />
        <StatCard title="Avg Loyalty Points" value={Math.round(avgLoyalty).toLocaleString()} icon={Heart} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {customers.slice(0, 24).map((customer) => (
          <Card
            key={customer.id}
            className="border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/30"
          >
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{customer.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                </div>
                {customer.rating && (
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="size-3 fill-current" />
                    <span className="text-xs font-medium">{customer.rating}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-background/40 p-2.5 text-center">
                  <p className="text-lg font-bold text-orange-500">{formatCurrency(customer.totalSpent)}</p>
                  <p className="text-[10px] text-muted-foreground">Total Spent</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-background/40 p-2.5 text-center">
                  <p className="text-lg font-bold">{customer.loyaltyPoints.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Loyalty Pts</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{customer.visitCount} visits</span>
                <span>Last: {formatDate(customer.lastVisit)}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {customer.favoriteDishes.slice(0, 2).map((dish) => (
                  <Badge key={dish} variant="outline" className="border-white/10 text-[10px]">
                    {dish}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </AdminRouteGuard>
  );
}
export default CustomersPage;
