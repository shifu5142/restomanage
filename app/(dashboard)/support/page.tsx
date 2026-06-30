import { RolePage } from "@/components/auth/role-page";
import { CustomerSupport } from "@/components/customer/customer-support";
import { SupportChat } from "@/components/support/support-chat";
import { mockData } from "@/data/mock";

function SupportPage() {
  return (
    <RolePage
      admin={<SupportChat messages={mockData.chatMessages} />}
      customer={<CustomerSupport />}
    />
  );
}
export default SupportPage;
