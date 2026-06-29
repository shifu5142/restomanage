import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-card/40 px-6 py-16 text-center backdrop-blur-sm">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
        <Icon className="size-7" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && (
        <Button className="mt-6 bg-orange-500 hover:bg-orange-600" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
