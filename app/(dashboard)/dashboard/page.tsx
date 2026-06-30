import { RolePage } from "@/components/auth/role-page";
import { AdminDashboardView } from "@/components/dashboard/admin-dashboard-view";
import { CustomerDashboard } from "@/components/customer/customer-dashboard";

function DashboardPage() {
  return (
    <RolePage
      admin={<AdminDashboardView />}
      customer={<CustomerDashboard />}
    />
  );
}
export default DashboardPage;
