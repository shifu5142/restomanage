import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import ProtectedLayout from "@/components/layout/protectetLayout";
import { RouteRoleGuard } from "@/components/auth/route-role-guard";
import { DashboardProviders } from "@/components/providers/dashboard-providers";

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <DashboardProviders>
        <SidebarProvider>
          <RouteRoleGuard />
          <DashboardSidebar />
          <SidebarInset className="bg-background">
            <DashboardHeader />
            <div className="flex-1 p-4 lg:p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </DashboardProviders>
    </ProtectedLayout>
  );
}
export default DashboardLayout;
