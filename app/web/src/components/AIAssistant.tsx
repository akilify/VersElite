import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Send, Copy, Check, Trash2, PenTool, Wand2, RefreshCw, Lightbulb, FileText, Loader2 } from 'lucide-react';
import { chatWithAIStream, type ChatMessage } from '@/features/ai/ai.api';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  draftId: string | null;
  onInsert: (text: string) => void;
  currentContent?: string;
  selectedText?: string;
}

const formatAIResponse = (text: string): string => {
  return text
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/\*\*?(.*?)\*\*?/g, '$1')
    .replace(/^\d+\.\s+/gm, '• ')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replace(/([.!?])\s*(\w)/g, '$1 $2')
    .trim();
};

/**
 * Removes common AI preamble and trailing commentary from generated text.
 * This is a best‑effort fallback; the primary solution is prompt engineering.
 */
const cleanAIResponse = (text: string): string => {
  let cleaned = text;

  // Remove common introductory phrases (case insensitive)
  const introPatterns = [
    /^(here is|here's|i've written|i have written|sure|certainly|of course|this is|below is).*?[:\n]/i,
    /^.*?(poem|stanza|verse).*?[:\n]/i,
  ];
  for (const pattern of introPatterns) {
    cleaned = cleaned.replace(pattern, '').trim();
  }

  // Remove trailing notes like "Let me know if you'd like changes."
  cleaned = cleaned.replace(/\n*(let me know|hope this helps|feel free to).*$/i, '').trim();

  return cleaned;
};

const QUICK_ACTIONS = [
  {
    label: 'Continue',
    icon: Wand2,
    prompt: 'Continue the poem from where it left off. Output ONLY the continuation text—no explanations, no commentary, just the next lines of the poem.',
  },
  {
    label: 'Improve',
    icon: Sparkles,
    prompt: 'Improve the following text while preserving its meaning and voice. Return ONLY the improved version—no introductory remarks, no closing comments.',
  },
  {
    label: 'Rhymes',
    icon: Lightbulb,
    prompt: 'Suggest rhyming words or phrases related to the current content. Output a simple list—no extra text.',
  },
  {
    label: 'Rewrite',
    icon: RefreshCw,
    prompt: 'Rewrite the following stanza in a different style (e.g., more lyrical, concise, or vivid). Provide ONLY the rewritten stanza—no additional commentary.',
  },
  {
    label: 'Write Poem',
    icon: FileText,
    prompt: 'Write a complete poem based on the current theme and style. Output ONLY the poem—no titles, no introductions, no closing remarks. Just the verse.',
  },
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm your poetry assistant. Use the quick actions below or ask me anything.",
  timestamp: new Date(),
};

export function AIAssistant({ draftId, onInsert, currentContent = '', selectedText = '' }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history when draftId changes
  useEffect(() => {
    if (!draftId) {
      setMessages([WELCOME_MESSAGE]);
      setHistoryLoaded(true);
      return;
    }

    const loadHistory = async () => {
      const { data } = await supabase
        .from('ai_chat_history')
        .select('messages')
        .eq('draft_id', draftId)
        .single();

      if (data?.messages) {
        const loadedMessages = data.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMessages([WELCOME_MESSAGE, ...loadedMessages]);
      } else {
        setMessages([WELCOME_MESSAGE]);
      }
      setHistoryLoaded(true);
    };

    loadHistory();
  }, [draftId]);

  // Save messages to Supabase whenever they change (debounced)
  useEffect(() => {
    if (!draftId || !historyLoaded || messages.length <= 1) return;

    const saveHistory = async () => {
      const messagesToSave = messages.filter(m => m.id !== 'welcome');
      await supabase
        .from('ai_chat_history')
        .upsert({
          draft_id: draftId,
          messages: messagesToSave,
          updated_at: new Date(),
        }, { onConflict: 'draft_id' });
    };

    const timeout = setTimeout(saveHistory, 1000);
    return () => clearTimeout(timeout);
  }, [messages, draftId, historyLoaded]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    const apiMessages: ChatMessage[] = [...messages, userMessage]
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role, content: m.content }));

    const context = selectedText || currentContent;
    let accumulated = '';

    abortControllerRef.current = new AbortController();

    chatWithAIStream(
      apiMessages,
      context,
      {
        onChunk: (chunk: string) => {
          accumulated += chunk;
          setStreamingContent(formatAIResponse(accumulated));
        },
        onComplete: () => {
          const cleaned = cleanAIResponse(formatAIResponse(accumulated));
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: cleaned,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setStreamingContent('');
          setIsLoading(false);
          setIsStreaming(false);
          abortControllerRef.current = null;
        },
        onError: (err: Error) => {
          setError(err.message);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
          setStreamingContent('');
          setIsLoading(false);
          setIsStreaming(false);
          abortControllerRef.current = null;
        },
        signal: abortControllerRef.current.signal,
      }
    );
  }, [messages, isLoading, selectedText, currentContent]);

  const handleSend = useCallback(() => {
    if (input.trim()) sendMessage(input);
  }, [input, sendMessage]);

  const handleQuickAction = useCallback((action: typeof QUICK_ACTIONS[0]) => {
    let prompt = action.prompt;
    if (action.label === 'Polish Draft') {
      prompt = `${prompt}\n\nMy full draft:\n${currentContent}`;
    } else if (selectedText) {
      prompt = `${prompt}\n\nSelected text: "${selectedText}"`;
    } else if (currentContent) {
      prompt = `${prompt}\n\nCurrent draft:\n${currentContent}`;
    }
    sendMessage(prompt);
  }, [selectedText, currentContent, sendMessage]);

  const handleCopy = useCallback(async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleInsert = useCallback((content: string) => {
    const formatted = formatAIResponse(content);
    const cleaned = cleanAIResponse(formatted);
    onInsert(cleaned);
  }, [onInsert]);

  const clearChat = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setStreamingContent('');
    setIsLoading(false);
    setIsStreaming(false);
    setError(null);
    if (draftId) {
      supabase.from('ai_chat_history').delete().eq('draft_id', draftId);
    }
  }, [draftId]);

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

      {/* Quick Actions */}
      <div className="px-4 py-3 border-b border-[#1f1f22] flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => handleQuickAction(action)}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs bg-[#1f1f22] hover:bg-[#2a2a2e] text-[#A1A1AA] hover:text-[#D4AF37] rounded-full flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <action.icon size={12} />
            {action.label}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/30 text-red-400 text-xs text-center">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#121214] border border-[#1f1f22] text-[#F5F5F5]'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'assistant' && msg.id !== 'welcome' && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-[#2a2a2e]">
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="text-xs text-[#A1A1AA] hover:text-[#D4AF37] transition flex items-center gap-1"
                  >
                    {copiedId === msg.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
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

        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-[#121214] border border-[#1f1f22] rounded-2xl px-4 py-3 max-w-[85%]">
              <p className="text-sm whitespace-pre-wrap">
                {streamingContent || <span className="inline-flex items-center gap-1"><Loader2 size={14} className="animate-spin text-[#D4AF37]" /> Thinking...</span>}
              </p>
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
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
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
          Press Enter to send • Try quick actions above
        </p>
      </div>
    </div>
  );
}
