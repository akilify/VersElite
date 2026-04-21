import { ChatWindow } from "@/components/ChatWindow";

export default function ChatPage() {
  const conversationId = "YOUR_CONVERSATION_ID"; // replace later

  return (
    <div className="h-screen">
      <ChatWindow conversationId={conversationId} />
    </div>
  );
}
