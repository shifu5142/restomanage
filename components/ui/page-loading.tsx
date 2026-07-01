"use client";

import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

type PageLoadingProps = {
  message?: string;
  className?: string;
  fullHeight?: boolean;
};

export function PageLoading({
  message = "Loading...",
  className,
  fullHeight = true,
}: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5",
        fullHeight && "min-h-[50vh] py-16",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-orange-500/20 border-t-orange-500" />
        <span
          className="absolute inset-2 animate-spin rounded-full border-2 border-orange-500/15 border-b-orange-400"
          style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
        />
        <span className="absolute inset-4 animate-ping rounded-full bg-orange-500/10" />
        <Utensils className="relative size-7 text-orange-500" />
      </div>
      <p className="text-sm font-medium tracking-wide text-muted-foreground">{message}</p>
    </div>
  );
}

export function renderPageLoading(message?: string) {
  return <PageLoading message={message} />;
}
