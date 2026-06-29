import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  RevenueChart,
  OrdersChart,
  ProfitChart,
  BusyHoursChart,
  CategorySalesChart,
  ReservationsChart,
} from "@/components/charts/dashboard-charts";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { mockData } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

export default function AnalyticsPage() {
  const { dashboardStats, weeklyChartData, hourlyData, categorySales } = mockData;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Deep insights into your restaurant performance." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Monthly Revenue" value={formatCurrency(dashboardStats.monthlyRevenue)} change={dashboardStats.growth} icon={TrendingUp} />
        <StatCard title="Avg Order Value" value={formatCurrency(dashboardStats.averageOrderValue)} change={4.2} icon={BarChart3} />
        <StatCard title="Customer Satisfaction" value={`${dashboardStats.customerSatisfaction}/5`} icon={Users} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart data={weeklyChartData} />
        <OrdersChart data={weeklyChartData} />
        <ProfitChart data={weeklyChartData} />
        <ReservationsChart data={weeklyChartData} />
        <BusyHoursChart data={hourlyData} />
        <CategorySalesChart data={categorySales} />
      </div>
    </div>
  );
}
