import { SupportChat } from "@/components/support/support-chat";
import { mockData } from "@/data/mock";

export default function SupportPage() {
  return <SupportChat messages={mockData.chatMessages} />;
}
