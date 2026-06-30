import { RolePage } from "@/components/auth/role-page";
import { CustomerSettings } from "@/components/customer/customer-settings";
import { SettingsView } from "@/components/settings/settings-view";

function SettingsPage() {
  return (
    <RolePage
      admin={<SettingsView />}
      customer={<CustomerSettings />}
    />
  );
}
export default SettingsPage;
