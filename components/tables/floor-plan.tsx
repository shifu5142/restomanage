"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Users, GripVertical } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { capitalize } from "@/lib/format";
import type { RestaurantTable } from "@/types";

const STATUS_BORDER: Record<string, string> = {
  available: "border-emerald-500/50",
  occupied: "border-red-500/50",
  reserved: "border-amber-500/50",
  cleaning: "border-blue-500/50",
  vip: "border-amber-400/80",
};

function DraggableTable({ table }: { table: RestaurantTable }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: table.id,
    data: { table },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: table.x,
    top: table.y,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`absolute w-24 cursor-grab rounded-xl border-2 bg-card/80 p-3 shadow-lg backdrop-blur-xl transition-shadow active:cursor-grabbing ${STATUS_BORDER[table.status] ?? "border-white/20"} ${isDragging ? "shadow-orange-500/20" : ""}`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">T{table.number}</span>
        <GripVertical className="size-3 text-muted-foreground" />
      </div>
      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <Users className="size-3" />
        {table.capacity}
      </div>
      <StatusBadge status={table.status} className="mt-2 text-[10px]" />
      <p className="mt-1 truncate text-[10px] text-muted-foreground">{table.section}</p>
    </div>
  );
}

interface FloorPlanProps {
  initialTables: RestaurantTable[];
}

export function FloorPlan({ initialTables }: FloorPlanProps) {
  const [tables, setTables] = useState(initialTables);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const stats = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    vip: tables.filter((t) => t.status === "vip").length,
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const table = tables.find((t) => t.id === active.id);
    if (!table) return;

    setTables((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? { ...t, x: Math.max(0, t.x + delta.x), y: Math.max(0, t.y + delta.y) }
          : t
      )
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Table Management"
        description="Drag tables to arrange your floor plan. Click to view details."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Available" value={String(stats.available)} icon={Users} />
        <StatCard title="Occupied" value={String(stats.occupied)} icon={Users} />
        <StatCard title="Reserved" value={String(stats.reserved)} icon={Users} />
        <StatCard title="VIP Tables" value={String(stats.vip)} icon={Users} />
      </div>

      <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.keys(STATUS_BORDER).map((status) => (
              <div key={status} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className={`size-3 rounded border-2 ${STATUS_BORDER[status]}`} />
                {capitalize(status)}
              </div>
            ))}
          </div>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="relative h-[600px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-background/80 to-muted/30">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
              {tables.map((table) => (
                <DraggableTable key={table.id} table={table} />
              ))}
            </div>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
