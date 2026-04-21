import { useEffect, useState, useContext } from "react";
import { CollabEditor } from "@/components/CollabEditor";
import { ChatWindow } from "@/components/ChatWindow";
import { AIAssistant } from "@/components/AIAssistant";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/features/auth/AuthProvider";

export default function CollaborationPage() {
  const collaborationId = "demo-id";
  const { session } = useContext(AuthContext);
  const [aiText, setAiText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  // Presence
  useEffect(() => {
    if (!session?.user?.id) return;
    const presenceChannel = supabase.channel(`presence-${collaborationId}`, {
      config: { presence: { key: session.user.id } },
    });
    presenceChannel.on("presence", { event: "sync" }, () => {
      const state = presenceChannel.presenceState();
      const users = Object.values(state).flat() as any[];
      setOnlineUsers(users);
    });
    presenceChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await presenceChannel.track({ user_id: session.user.id });
      }
    });
    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [collaborationId, session?.user?.id]);

  return (
    <div className="h-screen flex flex-col bg-[#0B0B0C] text-white">
      {/* Header with presence */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1f1f22]">
        <h1 className="font-serif text-lg">Midnight Draft</h1>
        <div className="flex items-center gap-2">
          {onlineUsers.slice(0, 3).map((u) => (
            <div
              key={u.user_id}
              className="w-7 h-7 rounded-full bg-[#1f1f22] border border-[#2a2a2e] flex items-center justify-center text-xs"
            >
              {u.user_id.slice(0, 2).toUpperCase()}
            </div>
          ))}
          {onlineUsers.length > 3 && (
            <span className="text-xs text-[#A1A1AA]">
              +{onlineUsers.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 p-6">
          <CollabEditor
            collaborationId={collaborationId}
            externalInsert={aiText}
          />
        </div>

        {/* Side Panel */}
        <div className="w-[360px] border-l border-[#1f1f22] flex flex-col">
          <ChatWindow conversationId={collaborationId} />
          <AIAssistant onInsert={setAiText} />
        </div>
      </div>
    </div>
  );
}
