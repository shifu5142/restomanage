import {
  DollarSign,
  ShoppingBag,
  CalendarDays,
  Package,
  Star,
  Users,
  TrendingUp,
  Receipt,
  PiggyBank,
  Wallet,
  ChefHat,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  RevenueChart,
  OrdersChart,
  ProfitChart,
} from "@/components/charts/dashboard-charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import type { Order, Reservation } from "@/types";
import { mockData } from "@/data/mock";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import { shortOrderId } from "@/lib/orders/grouped";

type AdminDashboardViewProps = {
  orders: Order[];
  reservations: Reservation[];
};

export function AdminDashboardView({ orders, reservations }: AdminDashboardViewProps) {
  const { dashboardStats, weeklyChartData } = mockData;

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );
  const activeReservations = useMemo(
    () =>
      reservations.filter((r) => r.status === "confirmed" || r.status === "pending").length,
    [reservations]
  );
  const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const upcomingReservations = [...reservations]
    .filter((r) => r.status === "confirmed" || r.status === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening at your restaurant today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(totalRevenue)}
          change={dashboardStats.growth}
          icon={DollarSign}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(dashboardStats.monthlyRevenue)}
          change={8.2}
          icon={TrendingUp}
        />
        <StatCard
          title="Today's Orders"
          value={String(orders.length)}
          change={5.4}
          icon={ShoppingBag}
        />
        <StatCard
          title="Active Reservations"
          value={String(activeReservations)}
          change={3.1}
          icon={CalendarDays}
        />
        <StatCard
          title="Inventory Alerts"
          value={String(dashboardStats.inventoryAlerts)}
          change={-2.0}
          icon={Package}
        />
        <StatCard
          title="Top Selling Dish"
          value={dashboardStats.topSellingDish}
          icon={ChefHat}
        />
        <StatCard
          title="Active Employees"
          value={String(dashboardStats.activeEmployees)}
          change={1.5}
          icon={Users}
        />
        <StatCard
          title="Customer Satisfaction"
          value={`${dashboardStats.customerSatisfaction}/5`}
          change={0.8}
          icon={Star}
        />
        <StatCard
          title="Avg Order Value"
          value={formatCurrency(averageOrderValue)}
          change={4.2}
          icon={Receipt}
        />
        <StatCard
          title="Monthly Profit"
          value={formatCurrency(dashboardStats.profit)}
          change={dashboardStats.growth}
          icon={PiggyBank}
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(dashboardStats.expenses)}
          change={-1.2}
          icon={Wallet}
        />
        <StatCard
          title="Growth Rate"
          value={`${dashboardStats.growth}%`}
          change={dashboardStats.growth}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart data={weeklyChartData} />
        <OrdersChart data={weeklyChartData} />
        <ProfitChart data={weeklyChartData} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{shortOrderId(order.id)}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Upcoming Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReservations.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-background/40 p-3"
                >
                  <div>
                    <p className="font-medium">{res.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(res.date)} · {formatTime(res.time)} · Party of {res.partySize}
                    </p>
                  </div>
                  <StatusBadge status={res.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
