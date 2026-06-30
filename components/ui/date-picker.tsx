"use client";

import { useState } from "react";
import { format, parseISO, startOfToday } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  min?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
};

function parseDate(value: string | undefined) {
  if (!value) return undefined;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function DatePicker({
  value,
  onChange,
  min,
  placeholder = "Select a date",
  id,
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDate(value);
  const minDate = parseDate(min) ?? startOfToday();

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
            <CalendarIcon className="size-4 shrink-0 text-orange-500" />
            {selected ? format(selected, "MMM d, yyyy") : placeholder}
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
        className="w-auto overflow-hidden rounded-xl border-white/10 bg-card/95 p-0 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-500/15 backdrop-blur-xl"
        align="start"
        sideOffset={8}
      >
        <div className="border-b border-white/10 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-500">
            Reservation date
          </p>
          <p className="mt-0.5 text-base font-semibold tracking-tight">
            {selected ? format(selected, "EEEE, MMMM d") : "Pick your visit date"}
          </p>
        </div>

        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }
          }}
          disabled={{ before: minDate }}
          defaultMonth={selected ?? minDate}
          className="p-3 [--cell-size:2.5rem]"
          classNames={{
            month_caption: "mb-1",
            caption_label: "text-sm font-semibold",
            weekday: "text-xs font-medium text-muted-foreground",
            today: "bg-orange-500/15 font-semibold text-orange-600 dark:text-orange-400",
            button_previous:
              "rounded-lg hover:bg-orange-500/10 hover:text-orange-600",
            button_next: "rounded-lg hover:bg-orange-500/10 hover:text-orange-600",
          }}
        />

        <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-muted/20 px-3 py-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground hover:text-foreground"
            disabled={!selected}
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
