import { Mail, Phone, Star, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mockData } from "@/data/mock";
import { capitalize, formatCurrency } from "@/lib/format";

export default function EmployeesPage() {
  const { employees } = mockData;
  const active = employees.filter((e) => e.status === "active").length;
  const avgPerformance = employees.reduce((s, e) => s + e.performance, 0) / employees.length;

  return (
    <div className="space-y-6">
      <PageHeader title="Employees" description="Manage your team, shifts, and performance." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Staff" value={String(employees.length)} icon={UserCheck} />
        <StatCard title="Active Now" value={String(active)} icon={UserCheck} />
        <StatCard title="Avg Performance" value={`${avgPerformance.toFixed(1)}%`} change={2.1} icon={Star} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {employees.map((emp) => (
          <Card
            key={emp.id}
            className="border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-orange-500/30"
          >
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={emp.avatar} alt={emp.name} />
                  <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{emp.name}</p>
                  <p className="text-sm text-muted-foreground">{capitalize(emp.role)}</p>
                </div>
                <StatusBadge status={emp.status} />
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Mail className="size-3" />{emp.email}</p>
                <p className="flex items-center gap-2"><Phone className="size-3" />{emp.phone}</p>
                <p>{emp.shift}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Performance</span>
                    <span className="font-medium text-foreground">{emp.performance}%</span>
                  </div>
                  <Progress value={emp.performance} className="h-1.5" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Attendance</span>
                    <span className="font-medium text-foreground">{emp.attendance}%</span>
                  </div>
                  <Progress value={emp.attendance} className="h-1.5" />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-muted-foreground">
                <span>Salary: {formatCurrency(emp.salary)}/yr</span>
                <span>Since {emp.hireDate.slice(0, 4)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
