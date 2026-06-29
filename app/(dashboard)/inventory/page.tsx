import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { CategorySalesChart } from "@/components/charts/dashboard-charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockData } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";

export default function InventoryPage() {
  const { inventory } = mockData;

  const lowStock = inventory.filter((i) => i.quantity <= i.minStock);
  const totalValue = inventory.reduce((s, i) => s + i.quantity * i.costPerUnit, 0);

  const categoryChart = Array.from(
    inventory.reduce((map, item) => {
      map.set(item.category, (map.get(item.category) ?? 0) + item.quantity * item.costPerUnit);
      return map;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value: Math.round(value) }));

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Track stock levels, suppliers, and restocking needs." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Items" value={String(inventory.length)} icon={Package} />
        <StatCard title="Low Stock Alerts" value={String(lowStock.length)} change={-3.2} icon={AlertTriangle} />
        <StatCard title="Inventory Value" value={formatCurrency(totalValue)} icon={TrendingDown} />
      </div>

      {lowStock.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="size-5" />
              Low Stock Alerts ({lowStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStock.map((item) => (
                <Badge key={item.id} variant="outline" className="border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">
                  {item.name}: {item.quantity} {item.unit} (min: {item.minStock})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Last Restocked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const pct = Math.round((item.quantity / item.maxStock) * 100);
                    const isLow = item.quantity <= item.minStock;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity} {item.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${isLow ? "bg-red-500" : pct < 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            {isLow && <StatusBadge status="pending" className="text-[10px]" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.supplier}</TableCell>
                        <TableCell>{formatDate(item.lastRestocked)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <CategorySalesChart data={categoryChart} />
      </div>
    </div>
  );
}
