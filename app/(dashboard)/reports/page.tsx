"use client";

import { Download, FileSpreadsheet, FileText, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const REPORTS = [
  {
    id: "sales",
    title: "Sales Report",
    description: "Daily, weekly, and monthly sales breakdown with trends.",
    icon: BarChart3,
    formats: ["pdf", "excel", "csv"] as const,
  },
  {
    id: "inventory",
    title: "Inventory Report",
    description: "Stock levels, usage rates, and reorder recommendations.",
    icon: FileSpreadsheet,
    formats: ["pdf", "excel", "csv"] as const,
  },
  {
    id: "payroll",
    title: "Payroll Report",
    description: "Employee hours, wages, and tip distribution.",
    icon: FileText,
    formats: ["pdf", "excel"] as const,
  },
  {
    id: "reservations",
    title: "Reservations Report",
    description: "Booking patterns, no-shows, and capacity utilization.",
    icon: FileText,
    formats: ["pdf", "csv"] as const,
  },
  {
    id: "menu",
    title: "Menu Performance",
    description: "Top sellers, margins, and category analysis.",
    icon: BarChart3,
    formats: ["pdf", "excel", "csv"] as const,
  },
  {
    id: "financial",
    title: "Financial Summary",
    description: "P&L statement, expenses, and profit margins.",
    icon: FileSpreadsheet,
    formats: ["pdf", "excel"] as const,
  },
];

function handleExport(report: string, format: string) {
  toast.success(`Exporting ${report} as ${format.toUpperCase()}`, {
    description: "Your download will begin shortly.",
  });
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Generate and export business reports." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((report) => (
          <Card
            key={report.id}
            className="border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/30"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <report.icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <CardDescription className="mt-1">{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {report.formats.map((format) => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    className="border-white/10"
                    onClick={() => handleExport(report.title, format)}
                  >
                    <Download className="mr-1.5 size-3" />
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
