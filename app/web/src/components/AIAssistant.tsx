// Enhanced AIAssistant.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import { generatePlan } from "@/features/ai/ai.api";

interface AIAssistantProps {
  onInsert: (text: string) => void;
}

export function AIAssistant({ onInsert }: AIAssistantProps) {
  const [theme, setTheme] = useState("");
  const [tone, setTone] = useState("emotional");
  const [style, setStyle] = useState("free verse");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError("Please enter a theme");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const response = await generatePlan({ theme, tone, style });
      setGeneratedText(response.plan);
    } catch (err: any) {
      setError(err.message || "Failed to generate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (generatedText) {
      onInsert(generatedText);
      setGeneratedText("");
      setTheme("");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 border-t border-[#1f1f22] bg-[#0B0B0C]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-serif text-[#F5F5F5] mb-3"
      >
        <span className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#D4AF37]" />
          AI Assistant
        </span>
        {isExpanded ? (
          <ChevronUp size={16} className="text-[#A1A1AA]" />
        ) : (
          <ChevronDown size={16} className="text-[#A1A1AA]" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Theme (e.g., love, loss, nature)"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg px-3 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none transition"
              />

              <div className="flex gap-2">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="flex-1 bg-[#121214] border border-[#1f1f22] rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4AF37] outline-none"
                >
                  <option value="emotional">Emotional</option>
                  <option value="reflective">Reflective</option>
                  <option value="hopeful">Hopeful</option>
                  <option value="melancholic">Melancholic</option>
                  <option value="passionate">Passionate</option>
                </select>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="flex-1 bg-[#121214] border border-[#1f1f22] rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4AF37] outline-none"
                >
                  <option value="free verse">Free Verse</option>
                  <option value="sonnet">Sonnet</option>
                  <option value="haiku">Haiku</option>
                  <option value="narrative">Narrative</option>
                  <option value="lyric">Lyric</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-[#D4AF37] hover:bg-[#c4a02e] text-black font-medium py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Plan
                  </>
                )}
              </button>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <AnimatePresence>
                {generatedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 space-y-2"
                  >
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        value={generatedText}
                        readOnly
                        className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg p-3 text-sm text-[#F5F5F5] whitespace-pre-wrap resize-none h-32 focus:outline-none"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={handleCopy}
                          className="p-1.5 rounded bg-[#1f1f22] hover:bg-[#2a2a2e] text-[#A1A1AA] hover:text-[#D4AF37] transition"
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                        <button
                          onClick={handleGenerate}
                          className="p-1.5 rounded bg-[#1f1f22] hover:bg-[#2a2a2e] text-[#A1A1AA] hover:text-[#D4AF37] transition"
                          title="Regenerate"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleInsert}
                        className="flex-1 bg-[#D4AF37] hover:bg-[#c4a02e] text-black py-2 rounded-lg text-sm font-medium transition"
                      >
                        Insert into Editor
                      </button>
                      <button
                        onClick={() => setGeneratedText("")}
                        className="px-4 py-2 border border-[#2a2a2e] hover:border-[#D4AF37] text-[#A1A1AA] hover:text-[#F5F5F5] rounded-lg text-sm transition"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
