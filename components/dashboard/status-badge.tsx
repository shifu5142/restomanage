import { cn } from "@/lib/utils";
import { capitalize } from "@/lib/format";
import { STATUS_COLORS } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_COLORS[status] ?? "bg-muted text-muted-foreground",
        className
      )}
    >
      {capitalize(status)}
    </span>
  );
}
