import { useEffect, useState, useRef, useContext } from "react";
import { fetchMessages, sendMessage } from "@/features/chat/chat.api";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/features/auth/AuthProvider";

export function ChatWindow({ conversationId }: any) {
  const { session } = useContext(AuthContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  const loadMessages = async () => {
    const data = await fetchMessages(conversationId);
    setMessages(data);
  };

  // 🔴 REALTIME SUBSCRIPTION
  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input) return;

    await sendMessage({
      conversationId,
      senderId: session.user.id,
      content: input,
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0B0C]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === session.user.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                    px-3 py-2 rounded-2xl text-sm max-w-[80%]
                    ${isMe
                      ? "bg-[#D4AF37] text-black self-end"
                      : "bg-[#121214] border border-[#2a2a2e] text-white"
                    }
                  `}

              >
                {msg.content}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#1f1f22] flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-[#121214] border border-[#2a2a2e] p-3 rounded-lg text-white"
        />

        <button
          onClick={handleSend}
          className="bg-[#D4AF37] text-black px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
