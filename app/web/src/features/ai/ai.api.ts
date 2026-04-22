/**
 * AI API client for VersElite
 * Supports both streaming and non‑streaming chat with the AI assistant.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
}

export interface StreamOptions {
  onChunk: (chunk: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

/**
 * Send a conversation to the AI and get a complete response.
 */
export async function chatWithAI(
  messages: ChatMessage[],
  currentContent?: string,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, currentContent }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Stream a conversation with the AI, receiving chunks of the reply in real time.
 */
export async function chatWithAIStream(
  messages: ChatMessage[],
  currentContent: string | undefined,
  options: StreamOptions,
): Promise<void> {
  const { onChunk, onComplete, onError, signal } = options;

  try {
    const response = await fetch(`${BASE_URL}/api/ai/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, currentContent }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            onComplete();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch {
            // Ignore malformed JSON – sometimes chunks are split mid‑object
          }
        }
      }
    }

    onComplete();
  } catch (error: any) {
    if (error.name === "AbortError") {
      // Request was cancelled – treat as normal completion without error
      onComplete();
    } else {
      onError(error);
    }
  }
}
