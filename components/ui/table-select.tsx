"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Users, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatTableLabel,
  formatTableShort,
  getTableById,
  groupTablesBySection,
} from "@/lib/reservations/tables";
import type { RestaurantTable } from "@/types";

type TableSelectProps = {
  tables: RestaurantTable[];
  allTables?: RestaurantTable[];
  value?: string;
  onChange: (tableId: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  emptyMessage?: string;
};

export function TableSelect({
  tables,
  allTables,
  value,
  onChange,
  placeholder = "Select a table",
  id,
  className,
  disabled,
  emptyMessage = "No tables available for this slot",
}: TableSelectProps) {
  const [open, setOpen] = useState(false);
  const catalog = allTables ?? tables;
  const selected = value ? getTableById(catalog, value) : undefined;
  const grouped = useMemo(() => groupTablesBySection(tables), [tables]);

  const triggerLabel = selected ? formatTableLabel(selected) : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          id={id}
          variant="outline"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            "h-9 w-full justify-between border-white/10 bg-background/40 px-3 font-normal shadow-xs hover:border-orange-500/30 hover:bg-background/60",
            open && "border-orange-500/40 ring-2 ring-orange-500/20",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <UtensilsCrossed className="size-4 shrink-0 text-orange-500" />
            {triggerLabel}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border-white/10 bg-card/95 p-0 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-500/15 backdrop-blur-xl"
        align="start"
        sideOffset={8}
      >
        <div className="border-b border-white/10 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-500">
            Table selection
          </p>
          <p className="mt-0.5 text-base font-semibold tracking-tight">
            {selected ? formatTableLabel(selected) : "Choose your table"}
          </p>
          {selected && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatTableShort(selected)} · {selected.section} · {selected.capacity}{" "}
              seats
              {selected.status === "vip" ? " · VIP" : ""}
            </p>
          )}
        </div>

        {tables.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {emptyMessage}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different time or reduce your party size.
            </p>
          </div>
        ) : (
          <div className="max-h-64 space-y-4 overflow-y-auto p-3">
            {Object.entries(grouped).map(([section, sectionTables]) => (
              <div key={section} className="space-y-2">
                <div className="flex items-baseline justify-between gap-2 px-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                    {section}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {sectionTables.length} table
                    {sectionTables.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {sectionTables.map((table) => {
                    const isSelected = value === table.id;
                    return (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => {
                          onChange(table.id);
                          setOpen(false);
                        }}
                        className={cn(
                          "rounded-lg border px-2 py-2 text-left transition-all",
                          isSelected
                            ? "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/25"
                            : "border-white/10 bg-background/50 text-foreground hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold">
                            {formatTableShort(table)}
                          </span>
                          <UtensilsCrossed
                            className={cn(
                              "size-3 shrink-0",
                              isSelected ? "text-white/80" : "text-orange-500"
                            )}
                          />
                        </div>
                        <div
                          className={cn(
                            "mt-1 flex items-center gap-1 text-[10px]",
                            isSelected ? "text-white/80" : "text-muted-foreground"
                          )}
                        >
                          <Users className="size-3" />
                          {table.capacity} seats
                        </div>
                        {table.status === "vip" && (
                          <span
                            className={cn(
                              "mt-1 inline-block rounded px-1 py-0.5 text-[9px] font-semibold uppercase",
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-amber-500/15 text-amber-600"
                            )}
                          >
                            VIP
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-muted/20 px-3 py-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground hover:text-foreground"
            disabled={!value}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            Clear
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 bg-orange-500 px-4 hover:bg-orange-600"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
