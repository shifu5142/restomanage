"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
};

type SlotGroup = {
  label: string;
  description: string;
  slots: string[];
};

function generateSlots(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  intervalMinutes = 30
): string[] {
  const slots: string[] = [];
  let total = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  while (total <= end) {
    const hour = Math.floor(total / 60);
    const minute = total % 60;
    slots.push(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    );
    total += intervalMinutes;
  }

  return slots;
}

const SLOT_GROUPS: SlotGroup[] = [
  {
    label: "Lunch",
    description: "11:00 AM – 2:30 PM",
    slots: generateSlots(11, 0, 14, 30),
  },
  {
    label: "Afternoon",
    description: "3:00 PM – 4:30 PM",
    slots: generateSlots(15, 0, 16, 30),
  },
  {
    label: "Dinner",
    description: "5:00 PM – 10:30 PM",
    slots: generateSlots(17, 0, 22, 30),
  },
];

function getPeriodLabel(time: string): string {
  const [h] = time.split(":").map(Number);
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select a time",
  id,
  className,
  disabled,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const selectedGroup = useMemo(() => {
    if (!value) return null;
    return SLOT_GROUPS.find((group) => group.slots.includes(value)) ?? null;
  }, [value]);

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
            <Clock className="size-4 shrink-0 text-orange-500" />
            {value ? formatTime(value) : placeholder}
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
        className="w-[min(100vw-2rem,20rem)] overflow-hidden rounded-xl border-white/10 bg-card/95 p-0 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-500/15 backdrop-blur-xl"
        align="start"
        sideOffset={8}
      >
        <div className="border-b border-white/10 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-500">
            Reservation time
          </p>
          <p className="mt-0.5 text-base font-semibold tracking-tight">
            {value ? (
              <>
                {formatTime(value)}
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                  · {getPeriodLabel(value)}
                </span>
              </>
            ) : (
              "Choose your arrival time"
            )}
          </p>
          {selectedGroup && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {selectedGroup.label} seating · {selectedGroup.description}
            </p>
          )}
        </div>

        <div className="max-h-64 space-y-4 overflow-y-auto p-3">
          {SLOT_GROUPS.map((group) => (
            <div key={group.label} className="space-y-2">
              <div className="flex items-baseline justify-between gap-2 px-0.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                  {group.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{group.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {group.slots.map((slot) => {
                  const isSelected = value === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        onChange(slot);
                        setOpen(false);
                      }}
                      className={cn(
                        "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                        isSelected
                          ? "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/25"
                          : "border-white/10 bg-background/50 text-foreground hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400"
                      )}
                    >
                      {formatTime(slot)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

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
