"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CreditCard, DollarSign, Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, capitalize } from "@/lib/format";
import type { Payment } from "@/types";

const COLORS = ["#f97316", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6"];

interface PaymentsViewProps {
  payments: Payment[];
}

export function PaymentsView({ payments }: PaymentsViewProps) {
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const totalTips = payments.reduce((s, p) => s + p.tip, 0);

  const methodBreakdown = Object.entries(
    payments.reduce((map, p) => {
      map[p.method] = (map[p.method] ?? 0) + p.amount;
      return map;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: capitalize(name), value }));

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="View payment history and method breakdowns." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Collected" value={formatCurrency(totalRevenue)} change={6.3} icon={DollarSign} />
        <StatCard title="Total Tips" value={formatCurrency(totalTips)} icon={Receipt} />
        <StatCard title="Transactions" value={String(payments.length)} icon={CreditCard} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-card/60 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 20).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell>{p.orderId}</TableCell>
                    <TableCell>{p.customerName}</TableCell>
                    <TableCell>{capitalize(p.method)}</TableCell>
                    <TableCell>{formatCurrency(p.amount)}</TableCell>
                    <TableCell>{formatCurrency(p.tip)}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {methodBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {methodBreakdown.map((m, i) => (
                <div key={m.name} className="flex items-center gap-1.5 text-xs">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {m.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
