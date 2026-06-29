import { cn } from "@/lib/utils";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, icon: Icon, className }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl transition-all hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive ? "text-emerald-500" : "text-red-500")}>
              {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {Math.abs(change)}% vs last period
            </div>
          )}
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
