import { SupportChat } from "@/components/support/support-chat";
import { mockData } from "@/data/mock";

function SupportPage() {
  return <SupportChat messages={mockData.chatMessages} />;
}
export default SupportPage;
