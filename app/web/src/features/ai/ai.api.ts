import { apiFetch } from "@/lib/api";

export async function chatWithAI(
  messages: { role: "user" | "assistant"; content: string }[],
  currentContent?: string,
) {
  const response = await fetch("http://localhost:5000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, currentContent }),
  });
  if (!response.ok) throw new Error("Chat request failed");
  return response.json();
}
