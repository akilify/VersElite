import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Send,
  Copy,
  Check,
  Trash2,
  PenTool,
} from "lucide-react";
import { chatWithAI } from "@/features/ai/ai.api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onInsert: (text: string) => void;
  currentContent?: string;
}

// Format AI responses for clean editor insertion
const formatAIResponse = (text: string): string => {
  return text
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/\*\*?(.*?)\*\*?/g, "$1")
    .replace(/^\d+\.\s+/gm, "• ")
    .replace(/^[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/([.!?])\s*(\w)/g, "$1 $2")
    .trim();
};

export function AIAssistant({
  onInsert,
  currentContent = "",
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your poetry assistant. You can ask me to:\n• Generate a poetry plan\n• Write a stanza or full poem\n• Refine or continue your draft\n\nWhat would you like help with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare messages for API (omit id and timestamp)
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await chatWithAI(apiMessages, currentContent);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: formatAIResponse(response.reply), // Assuming backend returns { reply: "..." }
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (content: string) => {
    onInsert(formatAIResponse(content));
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0B0C]">
      {/* Header */}
      <div className="p-4 border-b border-[#1f1f22] flex items-center justify-between">
        <h3 className="font-serif text-sm flex items-center gap-2">
          <Sparkles size={16} className="text-[#D4AF37]" />
          AI Assistant
        </h3>
        <button
          onClick={clearChat}
          className="p-1.5 rounded hover:bg-[#1f1f22] text-[#A1A1AA] hover:text-[#F5F5F5] transition"
          title="Clear conversation"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[#D4AF37] text-black"
                  : "bg-[#121214] border border-[#1f1f22] text-[#F5F5F5]"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.role === "assistant" && msg.id !== "welcome" && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-[#2a2a2e]">
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="text-xs text-[#A1A1AA] hover:text-[#D4AF37] transition flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <Check size={12} className="text-green-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                    Copy
                  </button>
                  <button
                    onClick={() => handleInsert(msg.content)}
                    className="text-xs text-[#A1A1AA] hover:text-[#D4AF37] transition flex items-center gap-1"
                  >
                    <PenTool size={12} />
                    Insert
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#121214] border border-[#1f1f22] rounded-2xl px-4 py-3">
              <Loader2 size={16} className="animate-spin text-[#D4AF37]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#1f1f22]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask me anything about your poetry..."
            className="flex-1 bg-[#121214] border border-[#1f1f22] rounded-full px-4 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none transition"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-full bg-[#D4AF37] text-black hover:bg-[#c4a02e] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-[#A1A1AA] mt-2 text-center">
          Press Enter to send • AI can write, plan, or refine
        </p>
      </div>
    </div>
  );
}
