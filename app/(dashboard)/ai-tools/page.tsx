import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { AiToolsView } from "@/components/ai-tools/ai-tools-view";

function AiToolsPage() {
  return (
    <AdminRouteGuard>
      <AiToolsView />
    </AdminRouteGuard>
  );
}
export default AiToolsPage;
